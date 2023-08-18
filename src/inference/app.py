try:
    import os
    import json
    import boto3
    import numpy as np
    from PIL import Image

    from utils.get_list_of_classes import handler as get_list_of_classes
    from utils.model_config import handler as model_config

    print("All imports ok ...")
except Exception as e:
    print("Error Imports : {} ".format(e))

# parameters
weight_file_name = os.getenv('WEIGHT_FILE_NAME')
data_bucket = os.getenv('DATA_BUCKET')
prefix = os.getenv('PREFIX') or ''

s3_scan_bucket = 'clothes-detection-scan-bucket'
s3_assets_bucket = 'clothes-detection-assets-bucket'

s3 = boto3.client("s3")

try:
    # Init model
    model_weights_path = f'weights/{weight_file_name}.h5'
    s3.download_file(s3_assets_bucket, model_weights_path, '/tmp/model_weights.h5')
    classes = get_list_of_classes(s3, data_bucket, prefix)
    model = model_config(classes)
    model.load_weights('/tmp/model_weights.h5')
    print('Model initialized')
except Exception as e:
    print("Error init model: {}".format(e))



def handler(event, context):
    try:
        print('Event payload: ', event)
        data_id = event['dataId']
        s3.download_file(s3_scan_bucket, data_id, '/tmp/image.jpg')

        # Preprocess the photo
        image = Image.open('/tmp/image.jpg')
        image = image.convert('RGB')
        image = image.resize((224, 224))  # Resize the image to match the model's input size
        image = np.array(image) / 255.0  # Normalize pixel values to [0, 1]
        image = np.expand_dims(image, axis=0)  # Add a batch dimension

        # Perform inference
        predictions = model.predict(image)

        # Interpret the predictions
        predicted_class = np.argmax(predictions)  # Get the index of the highest predicted probability
        confidence = predictions[0, predicted_class]  # Get the confidence score for the predicted class

        print(f"Predicted class: {classes[predicted_class]}")
        print(f"Confidence: {confidence}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'classes': classes,
                'predictions': (predictions.astype(float)).tolist(),
                'predicted_class': classes[predicted_class],
                'confidence': confidence.astype(float)
            }),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    except Exception as e:
        print(e)