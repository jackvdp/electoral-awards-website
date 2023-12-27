import AWS from 'aws-sdk';
import { s3, getS3FileUrl, updateConfig } from '../../aws/aws';

updateConfig();

export type FolderStructure = {
    folderName: string;
    files: string[];
}

export const getFileAndFolderNames = async (bucketName: string, folderName?: string): Promise<FolderStructure[]> => {

    const listFilesInFolder = async (folder: string) => {
        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: bucketName,
            Prefix: folder,
            Delimiter: '/'
        };

        try {
            const data = await s3.listObjectsV2(params).promise();
            return (data.Contents?.map(file => file.Key).filter(key => key !== folder) || [])
                   .map(fileKey => getS3FileUrl(bucketName, fileKey));
        } catch (err) {
            console.error(`Error fetching from S3 for folder ${folder}`, err);
            throw err;
        }
    };

    try {
        const rootParams: AWS.S3.ListObjectsV2Request = {
            Bucket: bucketName,
            Prefix: folderName ? `${folderName}/` : '',
            Delimiter: '/'
        };

        const rootData = await s3.listObjectsV2(rootParams).promise();
        const folders = rootData.CommonPrefixes?.map(prefix => prefix.Prefix) || [];

        const folderPromises = folders.map(async (folder) => {
            if (folder) {
                const simpleFolderName = folder.split('/').slice(-2, -1)[0];
                const files = await listFilesInFolder(folder);
                return {
                    folderName: simpleFolderName,
                    files: files.filter((file): file is string => file !== undefined)
                };
            }
            return null;
        });
        
        return (await Promise.all(folderPromises)).filter((f): f is FolderStructure => f !== null);
    } catch (err) {
        console.error('Error fetching root level folders', err);
        throw err;
    }
};