def handler(s3, bucket_name, object_key):
    print(bucket_name, object_key)
    s3.download_file(bucket_name, object_key, 'model_weights.h5')
    print('File downloaded successfully.')
