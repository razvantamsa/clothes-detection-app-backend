const fs = require('fs');
const path = require('path');

const { listItemsFromPath, getItem } = require("../src/utils/aws/s3");

async function downloadBucket(bucketName, bucket) {
    try {
        const localFolderPath = __dirname + '/data/' + bucket; 
        const listObjectsResponse = await listItemsFromPath(bucketName, '');
        const objects = listObjectsResponse.Contents;
    
        for (const object of objects) {
            const objectKey = object.Key;
            const localFilePath = path.join(localFolderPath, objectKey + '.jpg');

            // Skip file if already downloaded
            if (fs.existsSync(localFilePath)) {
                const pathSegments = localFilePath.split('/');
                const folderName = pathSegments.slice(-2).join('/');
                console.log(`${folderName} already exists, skipping download`);
                continue;
            }
    
            // Create the local directory if it doesn't exist
            const localDirectory = path.dirname(localFilePath);
            if (!fs.existsSync(localDirectory)) {
                fs.mkdirSync(localDirectory, { recursive: true });
            }
    
            // Download the object
            const downloadResult = await getItem(bucketName, objectKey);
            fs.writeFileSync(localFilePath, downloadResult.Body);
    
            console.log(`Downloaded: ${objectKey}`);
        }
    
        console.log('Download complete!');
        } catch (error) {
        console.error('Error downloading bucket:', error);
        }
}

(async () => {
    const bucket = process.argv[2];
    const bucketList = ['shirts', 'trousers', 'shoes'];
    if(!bucketList.includes(bucket)) {
        console.error(`Bucket must be one of ${bucketList}`);
        return;
    }
    const bucketName = `clothes-detection-${bucket}-bucket`;
    console.log(bucketName);

    await downloadBucket(bucketName, bucket);
})()