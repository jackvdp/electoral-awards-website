import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo/mongo';
import getArticlePreviews from 'backend/use_cases/articles/getPreviews';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            await getArticlePreviews(res);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
            break;
    }
}