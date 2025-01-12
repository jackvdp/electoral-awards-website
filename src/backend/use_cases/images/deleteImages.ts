import type {NextApiRequest, NextApiResponse} from 'next';
import deleteFilesInFolder from 'backend/aws/helpers/deleteFiles';

export default async function deleteImages(req: NextApiRequest, res: NextApiResponse) {

    const passcode = req.query.passcode as string;

    if (passcode !== 'delete-files') {
        res.status(401).json({message: 'Invalid passcode'});
        return;
    }

    const bucketName = 'electoralwebsite';
    const folderName = 'images';

    try {
        const imageKeys = await deleteFilesInFolder(bucketName, folderName);
        res.status(200).json(imageKeys);
    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({error: 'Failed to fetch images: ' + error});
    }
}