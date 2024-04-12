import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Article from 'backend/models/article';

async function deleteArticleById(res: NextApiResponse, articleID: string) {
    try {
        const deletedArticle = await Article.findByIdAndDelete(articleID);
        if (deletedArticle) {
            res.status(200).json({ message: 'Article deleted successfully' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete article', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default deleteArticleById;