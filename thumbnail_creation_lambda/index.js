const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log("Starting thumbnail creation")
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    // Check if the image is in the 'photos' or 'images' directory
    if (!key.startsWith('photos/') || !key.startsWith('images/')) {
        console.log(`The image is not in the 'photos' directory: ${key}`);
        return;
    }

    const folderKey = key.startsWith('photos/') ? "photos/" : "images/";
    const thumbnailSize = key.startsWith('photos/') ? 500 : 200;

    try {
        const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();

        const resizedImage = await sharp(image.Body)
            .resize(thumbnailSize, thumbnailSize, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toBuffer();

        const newKey = key.replace(folderKey, 'thumbnails/');
        await s3.putObject({
            Bucket: bucket,
            Key: newKey,
            Body: resizedImage,
            ContentType: 'image/jpeg'
        }).promise();

        console.log(`Thumbnail created at ${newKey}`);
    } catch (error) {
        console.error(`Error processing file ${key}`, error);
        throw error;
    }
};
