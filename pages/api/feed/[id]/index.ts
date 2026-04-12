import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo';
import createClient from 'backend/supabase/api';
import getPost from 'backend/use_cases/feed/getPost';
import updatePost from 'backend/use_cases/feed/updatePost';
import deletePost from 'backend/use_cases/feed/deletePost';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    await dbConnect();

    const isAdmin = user.user_metadata?.role === 'admin';

    switch (req.method) {
        case 'GET':
            await getPost(req, res);
            break;
        case 'PUT':
            await updatePost(req, res, user.id);
            break;
        case 'DELETE':
            await deletePost(req, res, user.id, isAdmin);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}
