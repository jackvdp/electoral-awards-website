import {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from 'backend/mongo';
import getArticleById from 'backend/use_cases/articles/getArticle';
import updateArticleById from 'backend/use_cases/articles/updateArticle';
import deleteArticleById from 'backend/use_cases/articles/deleteArticle';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const {method, query: {id}} = req;

    if (typeof id !== 'string') {
        res.status(400).json({message: 'Invalid id parameter'});
        return;
    }

    await dbConnect();

    switch (method) {
        case 'GET':
            await getArticleById(res, id);
            break;
        case 'PUT':
            await updateArticleById(req, res, id);
            break;
        case 'DELETE':
            await deleteArticleById(res, id);
            break;
        default:
            res.status(405).json({message: 'Method not allowed'});
    }
}