import { s3, updateConfig } from '../../aws/aws';
import AWS from 'aws-sdk';

updateConfig();

const deleteFilesInFolder = async (bucketName: string, folder: string): Promise<void> => {
    const listParams: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        Prefix: `${folder}/`
    };

    try {
        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

        const deleteParams: AWS.S3.DeleteObjectsRequest = {
            Bucket: bucketName,
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            if (Key) {
                deleteParams.Delete.Objects.push({ Key });
            }
        });

        await s3.deleteObjects(deleteParams).promise();

        if (listedObjects.IsTruncated) {
            // If there are more files to delete, continue deleting
            await deleteFilesInFolder(bucketName, folder);
        }
    } catch (err) {
        console.error(`Error deleting files in folder ${folder}`, err);
        throw err;
    }
};

export default deleteFilesInFolder;