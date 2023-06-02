const { detectImageLabels } = require("../../utils/aws/rekognition");

const { S3_SCAN_BUCKET } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);
    const { dataId } = event;

    const labels = await detectImageLabels(S3_SCAN_BUCKET, dataId);
    console.log(labels);

    return 0;
};