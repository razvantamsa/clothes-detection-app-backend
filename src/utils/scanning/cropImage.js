const sharp = require('sharp');

async function cropImage(sourceBuffer, label) {
    // Create a Sharp instance from the source image buffer
    const image = sharp(sourceBuffer);
  
    // Get the image metadata (width and height)
    const metadata = await image.metadata();
  
    // Calculate the crop dimensions based on the bounding box
    const cropLeft = Math.round(label.BoundingBox.Left * metadata.width);
    const cropTop = Math.round(label.BoundingBox.Top * metadata.height);
    const cropWidth = Math.round(label.BoundingBox.Width * metadata.width);
    const cropHeight = Math.round(label.BoundingBox.Height * metadata.height);
  
    // Crop the image
    const croppedImage = await image.extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight
    }).toBuffer();
  
    return croppedImage;
}

module.exports = { cropImage }