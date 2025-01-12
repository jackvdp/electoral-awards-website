import {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from 'backend/mongo';
import addArticle from 'backend/use_cases/articles/addArticle';
import getAllArticles from 'backend/use_cases/articles/getArticles';
import deleteAllArticles from 'backend/use_cases/articles/deleteArticles';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    if (req.method === 'POST') {
        await addArticle(req, res);
    } else if (req.method === 'GET') {
        await getAllArticles(res);
    } else if (req.method === 'DELETE') {
        await deleteAllArticles(req, res);
    } else {
        res.status(405).json({message: 'Method not allowed'});
    }
}

