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

    switch (req.method) {
        case 'POST':
            await addArticle(req, res);
            break;
        case 'GET':
            await getAllArticles(res);
            break;
        case 'DELETE':
            await deleteAllArticles(req, res);
            break;
        default:
            res.status(405).json({message: 'Method not allowed'});
    }
}

