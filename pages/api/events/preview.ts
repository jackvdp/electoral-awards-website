import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo/mongo';
import getEventPreviews from 'backend/use_cases/events/getPreviews';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            await getEventPreviews(res);
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}