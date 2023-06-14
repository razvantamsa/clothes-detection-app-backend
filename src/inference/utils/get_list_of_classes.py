def filter_brand_classes(s3, bucket_name, folders):
    classes = []

    for folder in folders:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder)
        num_entries = response['KeyCount']
        if(num_entries > 200):
            classes.append(folder.replace("/", ""))

    return classes

def filter_model_classes(s3, bucket_name, folders, brand):
    classes = []

    for folder in folders:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder)
        num_entries = response['KeyCount']
        if(num_entries >= 3):
            classes.append(folder.replace(brand, "").replace("/", ""))

    return classes

def handler(s3, bucket_name, prefix):

    response = s3.list_objects_v2(Bucket=bucket_name, Delimiter="/", Prefix=prefix)

    # Extract root folders from the response
    root_folders = [prefix["Prefix"] for prefix in response.get("CommonPrefixes", [])]

    if(prefix):
        return filter_model_classes(s3, bucket_name, root_folders, prefix)

    return filter_brand_classes(s3, bucket_name, root_folders)