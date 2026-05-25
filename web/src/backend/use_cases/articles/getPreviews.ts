import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function getEventPreviews(res: NextApiResponse) {
    try {
        const articles = await Article.find({}, { title: 1, date: 1, description: 1 });
        res.status(200).json(articles);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get article snapshots', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getEventPreviews;