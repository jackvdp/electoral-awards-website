import { NextApiRequest, NextApiResponse } from 'next';
import createClient from 'backend/supabase/api';
import searchUsers from 'backend/use_cases/feed/searchUsers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { q } = req.query;

    if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'q query parameter required' });
    }

    const users = await searchUsers(q);
    res.status(200).json(users);
}
