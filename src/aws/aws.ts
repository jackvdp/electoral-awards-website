import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'Europe (London) eu-west-2'
});

type S3Object = {
    Key: string;
};

type FolderStructure = {
    [folder: string]: string[];
}

export const getFileNames = async (bucketName: string, folderName?: string): Promise<FolderStructure> => {
    const folderStructure: FolderStructure = {};

    const listFilesInFolder = async (folder: string) => {
        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: bucketName,
            Prefix: folder,
            Delimiter: '/'
        };

        try {
            const data = await s3.listObjectsV2(params).promise();
            return data.Contents?.map(file => file.Key).filter(key => key !== folder) || [];
        } catch (err) {
            console.error(`Error fetching from S3 for folder ${folder}`, err);
            throw err;
        }
    };

    // Get the list of folders (CommonPrefixes)
    try {
        const rootParams: AWS.S3.ListObjectsV2Request = {
            Bucket: bucketName,
            Prefix: folderName ? `${folderName}/` : '',
            Delimiter: '/'
        };

        const rootData = await s3.listObjectsV2(rootParams).promise();
        const folders = rootData.CommonPrefixes?.map(prefix => prefix.Prefix) || [];

        for (const folder of folders) {
            if (folder) {
                const files = await listFilesInFolder(folder)
                folderStructure[folder] = files.filter((file): file is string => file !== undefined);
            }
        }

        return folderStructure;
    } catch (err) {
        console.error('Error fetching root level folders', err);
        throw err;
    }
};
