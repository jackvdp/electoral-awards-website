import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function updateArticleById(req: NextApiRequest, res: NextApiResponse, articleID: string) {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(articleID, req.body, { new: true });
        if (updatedArticle) {
            res.status(200).json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update article', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default updateArticleById;