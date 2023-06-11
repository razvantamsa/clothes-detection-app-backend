from utils.s3 import handler as s3Client
s3 = s3Client()

def handler(bucket_name):

    response = s3.list_objects_v2(Bucket=bucket_name, Delimiter="/")

    # Extract root folders from the response
    root_folders = [prefix["Prefix"] for prefix in response.get("CommonPrefixes", [])]

    classes = []

    # Filter the classes
    for folder in root_folders:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder)
        num_entries = response['KeyCount']
        if(num_entries > 200):
            classes.append(folder.replace("/", ""))

    return classes