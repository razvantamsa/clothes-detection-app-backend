try:
    import os
    import json
    from dotenv import load_dotenv
    import boto3
    import numpy as np
    from PIL import Image

    from utils.get_list_of_classes import handler as get_list_of_classes
    from utils.model_config import handler as model_config

    print("All imports ok ...")
except Exception as e:
    print("Error Imports : {} ".format(e))

load_dotenv("credentials.env")

# credentials
aws_access_key_id = os.getenv('ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION_NAME')

# parameters
weight_file_name = os.getenv('WEIGHT_FILE_NAME')
data_bucket = os.getenv('DATA_BUCKET')

s3_scan_bucket = 'clothes-detection-scan-bucket'
s3_assets_bucket = 'clothes-detection-assets-bucket'

s3 = boto3.client("s3",
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name)

# Init model
model_weights_path = f'weights/{weight_file_name}.h5'
s3.download_file(s3_assets_bucket, model_weights_path, 'model_weights.h5')

classes = get_list_of_classes(s3, data_bucket)
model = model_config(classes)
model.load_weights('model_weights.h5')
print('Model initialized')

def handler(event, context):
    print('Event payload: ', event)
    data_id = event['dataId']
    s3.download_file(s3_scan_bucket, data_id, 'image.jpg')

    # Preprocess the photo
    image = Image.open('image.jpg')
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
