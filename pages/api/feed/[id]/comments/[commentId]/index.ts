import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo';
import createClient from 'backend/supabase/api';
import deleteComment from 'backend/use_cases/feed/deleteComment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    await dbConnect();

    const isAdmin = user.user_metadata?.role === 'admin';

    switch (req.method) {
        case 'DELETE':
            await deleteComment(req, res, user.id, isAdmin);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}
