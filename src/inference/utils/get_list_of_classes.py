def handler(s3, bucket_name, prefix = ""):

    response = s3.list_objects_v2(Bucket=bucket_name, Delimiter="/", Prefix=prefix)

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