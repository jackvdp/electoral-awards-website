import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'Europe (London) eu-west-2' 
  });

// Define the type for the return value
type S3Object = {
    Key: string;
};

export const getFileNames = async (bucketName: string, folderName?: string): Promise<string[]> => {
    const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        Prefix: folderName ? `${folderName}/` : '',
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        if (data.Contents) {
            return data.Contents
            .filter((file): file is S3Object & { Key: string } => file.Key !== undefined)
            .map((file) => file.Key);
        } else {
            return []
        }
    } catch (err) {
        console.error('Error fetching from S3', err);
        throw err;
    }
};

