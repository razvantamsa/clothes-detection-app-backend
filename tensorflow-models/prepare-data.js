const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function prepareData(bucket) {
    // Define the source directory containing the dataset
    const sourceDirectory = __dirname + '/data/' + bucket;

    // Define the destination directories for training and validation data
    const trainingDirectory = __dirname + '/data/' + bucket + '-training';
    const validationDirectory = __dirname + '/data/' + bucket + '-validation';

    const trainingSplit = 0.8; // 80% for training, 20% for validation
    
    const categories = await readdir(sourceDirectory);

    for (const category of categories) {
        const categoryDirectory = path.join(sourceDirectory, category);
        
        const subcategories = await readdir(categoryDirectory);

        for (const subcategory of subcategories) {
            const subcategoryDirectory = path.join(categoryDirectory, subcategory);
            
            
            // Read the image files within the subcategory directory
            const images = await readdir(subcategoryDirectory);

            // Determine the number of images for training and validation
            const numImages = images.length;
            const numTraining = Math.floor(numImages * trainingSplit);

            for (let i = 0; i < images.length; i++) {
                const imageFile = images[i];
                const sourceFilePath = path.join(subcategoryDirectory, imageFile);
          
                let destinationDirectory;
                if (i < numTraining) {
                  destinationDirectory = path.join(trainingDirectory, category, subcategory);
                } else {
                  destinationDirectory = path.join(validationDirectory, category, subcategory);
                }

                // Create the destination directory if it doesn't exist
                if (!fs.existsSync(destinationDirectory)) {
                    fs.mkdirSync(destinationDirectory, { recursive: true });
                }

                const destinationFilePath = path.join(destinationDirectory, imageFile);
                
                // Skip file if already downloaded
                if (fs.existsSync(destinationFilePath)) {
                    const pathSegments = destinationFilePath.split('/');
                    const folderName = pathSegments.slice(-2).join('/');
                    console.log(`${folderName} already exists, skipping copy`);
                    continue;
                }

                // Copy the image file to the appropriate destination
                await copyFile(sourceFilePath, destinationFilePath);
                console.log('File copied: ', destinationFilePath);
            }
        }
    }

}

(async () => {
    const bucket = process.argv[2];
    const bucketList = ['shirts', 'trousers', 'shoes'];
    if(!bucketList.includes(bucket)) {
        console.error(`Bucket must be one of ${bucketList}`);
        return;
    }

    await prepareData(bucket);
})()