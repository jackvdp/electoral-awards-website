import { NextApiRequest, NextApiResponse } from 'next';
import imageUpload from 'backend/use_cases/images/uploadImage';
import getImages from 'backend/use_cases/images/getImages';
import deleteImages from 'backend/use_cases/images/deleteImages';

export const config = {
    api: {
        bodyParser: false, // Disables the default body parser to allow for files greater than 1MB
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            imageUpload(req, res);
            break;
        case 'GET':
            getImages(req, res);
            break;
        case 'DELETE':
            deleteImages(req, res);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed!' + req.method });
            break;
    }
}