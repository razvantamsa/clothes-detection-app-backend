const { logToCloudWatch } = require("../../utils/aws/cloudwatch");

const {
    DEPLOYMENT_NAME,
    ENVIRONMENT
} = process.env;

exports.handler = async (event) => {
    const body = JSON.parse(event.Records[0].body);

    await logToCloudWatch(
        `/aws/lambda/${DEPLOYMENT_NAME}-${ENVIRONMENT}-uploadProductData`,
        'index',
        JSON.stringify(body)
    );

    return { statusCode: 200 };
}