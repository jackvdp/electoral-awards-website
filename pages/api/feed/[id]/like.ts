import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo';
import createClient from 'backend/supabase/api';
import toggleLike from 'backend/use_cases/feed/toggleLike';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    await dbConnect();

    switch (req.method) {
        case 'POST':
            await toggleLike(req, res, user.id);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}
