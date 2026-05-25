import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function getArticleById(res: NextApiResponse, articleID: string) {
    try {
        const article = await Article.findById(articleID);
        if (article) {
            res.status(200).json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get article', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getArticleById;


