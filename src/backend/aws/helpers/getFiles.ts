import {s3, getS3FileUrl, updateConfig} from '../index';

updateConfig();

export const getFiles = async (bucketName: string, folder: string): Promise<string[]> => {
    const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        Prefix: `${folder}/`
    };

    try {
        const data = await s3.listObjectsV2(params).promise();

        return (data.Contents || [])
            .filter(file => file.Key && file.Key !== `${folder}/`) // Exclude the folder itself
            .map(file => getS3FileUrl(bucketName, file.Key!)); // Get URL for each file
    } catch (err) {
        console.error(`Error fetching from S3 for folder ${folder}`, err);
        throw err;
    }
};