import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function getAllArticles(res: NextApiResponse) {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to add articles', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getAllArticles;