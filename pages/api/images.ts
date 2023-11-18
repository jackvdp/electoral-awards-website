// pages/api/images.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFileNames } from 'aws/aws';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bucketName = 'electoralwebsite';
    const folderName = 'awards_2023_photos';

    try {
        const imageKeys = await getFileNames(bucketName, folderName);
        const imageUrls = imageKeys.map(key => `https://${bucketName}.s3.eu-west-2.amazonaws.com/${key}`);
        res.status(200).json({ images: imageUrls });
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({ error: 'Failed to fetch images: ' + error });
    }
}
