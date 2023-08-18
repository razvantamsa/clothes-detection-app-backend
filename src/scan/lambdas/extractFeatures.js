const { calculateImageHash } = require("../../utils/authorizer/hashCode");
const { postItem: postDynamoDB, updateItem: updateDynamoDB } = require("../../utils/aws/dynamodb");
const { invokeAsyncFunction } = require("../../utils/aws/lambda");
const { detectImageLabels } = require("../../utils/aws/rekognition");
const { getItem: getS3, postItem: postS3 } = require("../../utils/aws/s3");
const { cropImage } = require("../../utils/scanning/cropImage");
const { nonOverlapingLabels } = require("../../utils/scanning/nonOverlapingLabels");

const { APP_DYNAMODB_SCAN_TABLE, APP_S3_SCAN_BUCKET } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);
    try{
        const { dataId, userName } = event;
    
        const labels = await detectImageLabels(APP_S3_SCAN_BUCKET, dataId);
        console.log(labels);
        const filteredLabels =  [
            ...nonOverlapingLabels(labels, 'shirts'),
            ...nonOverlapingLabels(labels, 'trousers'),
            ...nonOverlapingLabels(labels, 'shoes')
        ];
        console.log(filteredLabels);
    
        const image = await getS3(APP_S3_SCAN_BUCKET, dataId);
        const croppedImages = await Promise.all(filteredLabels.map(async (label) => {
            const croppedImage = await cropImage(image.Body, label);
            return {...label, data: croppedImage};
        }));
    
        // upload to s3 & dynamodb
        await Promise.all(croppedImages.map(async (croppedImage) => {
            const croppedDataId = calculateImageHash(croppedImage.data);
    
            await postS3(
                APP_S3_SCAN_BUCKET,
                croppedDataId,
                croppedImage.data,
                croppedImage.data.length,
                "image/jpeg"
            );
    
            await postDynamoDB(APP_DYNAMODB_SCAN_TABLE, {
                dataId: croppedDataId,
                userName: dataId, 
                status: 'processing',
                type: croppedImage.type
            });
    
            // invoke scanning lambda for image
            await invokeAsyncFunction(
                'clothes-detection-scan-dev-detection',
                {   
                    parentDataId: dataId, 
                    dataId: croppedDataId,
                    type: croppedImage.type
                }
            );
        }));
    
        // update main dataId entry in dynamodb
        await updateDynamoDB(APP_DYNAMODB_SCAN_TABLE,
            { dataId, userName },
            { status: 'processed' },
        );
    } catch (err) {
        console.error(err);
    }
};