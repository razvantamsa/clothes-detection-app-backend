const { calculateImageHash } = require("../../utils/authorizer/hashCode");
const { postItem: postDynamoDB, updateItem: updateDynamoDB } = require("../../utils/aws/dynamodb");
const { detectImageLabels } = require("../../utils/aws/rekognition");
const { getItem: getS3, postItem: postS3 } = require("../../utils/aws/s3");
const { cropImage } = require("../../utils/scanning/cropImage");
const { nonOverlapingLabels } = require("../../utils/scanning/nonOverlapingLabels");

const { DYNAMODB_SCAN_TABLE, S3_SCAN_BUCKET } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);
    const { dataId, userName } = event;

    const labels = await detectImageLabels(S3_SCAN_BUCKET, dataId);
    console.log(labels);
    const filteredLabels =  [
        ...nonOverlapingLabels(labels, 'shirts'),
        ...nonOverlapingLabels(labels, 'trousers'),
        ...nonOverlapingLabels(labels, 'shoes')
    ];
    console.log(filteredLabels);

    const image = await getS3(S3_SCAN_BUCKET, dataId);
    const croppedImages = await Promise.all(filteredLabels.map(async (label) => {
        const croppedImage = await cropImage(image.Body, label);
        return {...label, data: croppedImage};
    }));

    const dataIds = [];

    // upload to s3 & dynamodb
    await Promise.all(croppedImages.map(async (croppedImage) => {
        const croppedDataId = calculateImageHash(croppedImage.data);

        dataIds.push(croppedDataId);
        await postS3(
            S3_SCAN_BUCKET,
            croppedDataId,
            croppedImage.data,
            croppedImage.data.length,
            "image/jpeg"
        );

        await postDynamoDB(DYNAMODB_SCAN_TABLE, {
            dataId: croppedDataId,
            userName: dataId, 
            status: 'processing',
            type: croppedImage.type
        });
    }));

    // update main dataId entry in dynamodb
    await updateDynamoDB(DYNAMODB_SCAN_TABLE,
        { dataId, userName },
        { status: 'processing' },
    );

    // invoke scanning lambda
};