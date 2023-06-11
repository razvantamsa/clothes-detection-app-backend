import os
from dotenv import load_dotenv
import boto3

load_dotenv()

# Get AWS credentials from environment variables
aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
region_name = os.environ.get('REGION_NAME')

def handler():
    s3 = boto3.client("s3",
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
                region_name=region_name)
    
    return s3

