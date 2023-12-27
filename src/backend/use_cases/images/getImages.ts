import type { NextApiRequest, NextApiResponse } from 'next';
import { getFiles } from 'backend/helpers/aws/getFiles';

export default async function getImages(req: NextApiRequest, res: NextApiResponse) {
    const bucketName = 'electoralwebsite';
    const folderName = 'images';

    try {
        const imageKeys = await getFiles(bucketName, folderName);
        res.status(200).json(imageKeys);
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({ error: 'Failed to fetch images: ' + error });
    }
}
