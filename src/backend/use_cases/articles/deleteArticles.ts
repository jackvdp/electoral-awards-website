import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function deleteAllArticles(req: NextApiRequest, res: NextApiResponse) {
    const passcode = req.query.passcode as string;

    if (passcode !== 'delete-all-articles') {
        res.status(401).json({ message: 'Invalid passcode' });
        return;
    }

    try {
        await Article.deleteMany();
        res.status(200).json({ message: 'All articles deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete articles', error: error.message });
        }
    }
}

export default deleteAllArticles;
