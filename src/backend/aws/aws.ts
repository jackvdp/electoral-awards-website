import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3();

function updateConfig() {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'eu-west-2'
    });
}

const getS3FileUrl = (bucketName: string, fileKey: string | undefined): string => {
    return `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
};

export { s3, getS3FileUrl, updateConfig }