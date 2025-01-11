// pages/api/eventImages.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {getFileAndFolderNames} from 'backend/helpers/aws/getFilesFolders';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const imageKeys = await getFileAndFolderNames();
        res.status(200).json(imageKeys);
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({error: 'Failed to fetch images: ' + error});
    }
}
