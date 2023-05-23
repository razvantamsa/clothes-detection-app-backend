const { invokeAsyncFunction } = require("../../../utils/aws/lambda");

exports.handler = async (event, context) => {
    console.log('Event payload:', event);  
    
    const array = [1,2,3,4,5,6,7,8,9,10];
    for(item of array) {
        await invokeAsyncFunction(
            `sneaker-api-dev-scrapeIndividual`, 
            { item }
        );
    }
    return;
};