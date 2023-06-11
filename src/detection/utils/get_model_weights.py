from utils.s3 import handler as s3Client
s3 = s3Client()

def handler(bucket_name, object_key):
    print(bucket_name, object_key)
    s3.download_file(bucket_name, object_key, 'model_weights.h5')
    print('File downloaded successfully.')
