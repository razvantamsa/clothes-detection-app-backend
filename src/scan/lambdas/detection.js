const { updateItem: updateDynamoDB } = require("../../utils/aws/dynamodb");
const { invokeSyncFunction } = require("../../utils/aws/lambda");
const { parseResponseBody, capitalize } = require("../../utils/scanning/parse");

const { APP_DYNAMODB_SCAN_TABLE } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);
    try {
        const { parentDataId, dataId, type } = event;
    
        const types = ['shirts', 'trousers', 'shoes'];
        if(!types.includes(type)) {
            console.log(`Type ${type} is not valid`)
            return;
        }
    
        // detect brand of clothing 
        let brandInferenceFunction = `clothes-detection-inference-dev-inference${capitalize(type)}Brand`;
        const responseBrand = await invokeSyncFunction(brandInferenceFunction, { dataId });
        const inferenceBrand = parseResponseBody(responseBrand);
    
        // detect model of clothing based on brand
        let modelInferenceFunction = `clothes-detection-inference-dev-inference${capitalize(type)}${capitalize(inferenceBrand.predicted_class)}`;
        const responseModel = await invokeSyncFunction(modelInferenceFunction, { dataId });
        const inferenceModel = parseResponseBody(responseModel);
        
        // update scan entry in dynamodb
        await updateDynamoDB(APP_DYNAMODB_SCAN_TABLE,
            { dataId: dataId, userName: parentDataId },
            { status: 'processed', brand: inferenceBrand.predicted_class, model: inferenceModel.predicted_class },
        );
    } catch (err) {
        console.error(err);
    }
};
