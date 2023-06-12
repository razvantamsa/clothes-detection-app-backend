try:
    import os
    from dotenv import load_dotenv
    import boto3
    from utils.get_list_of_classes import handler as get_list_of_classes
    from utils.get_model_no_weights import handler as get_model_no_weights
    from utils.get_model_weights import handler as get_model_weights
    print("All imports ok ...")
except Exception as e:
    print("Error Imports : {} ".format(e))

load_dotenv("credentials.env")

aws_access_key_id = os.getenv('ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION_NAME')

s3 = boto3.client("s3",
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name)

def handler(event, context):
    classes = get_list_of_classes(s3, 'clothes-detection-shoes-bucket')

    s3_assets_bucket = 'clothes-detection-assets-bucket'
    model_weights_path = 'weights/shoe_brand_model_weights.h5'

    model = get_model_no_weights(classes)
    get_model_weights(s3, s3_assets_bucket, model_weights_path)

    model.load_weights('model_weights.h5')
    print('Model weights loaded')

    return {
        'statusCode': 200,
        'body': classes
    }
