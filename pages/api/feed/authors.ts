import { NextApiRequest, NextApiResponse } from 'next';
import createClient from 'backend/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { ids } = req.query;

    if (!ids || typeof ids !== 'string') {
        return res.status(400).json({ message: 'ids query parameter required' });
    }

    const userIds = ids.split(',').filter(Boolean).slice(0, 50);

    const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id, firstname, lastname, organisation, profile_image')
        .in('id', userIds);

    if (fetchError) {
        return res.status(500).json({ message: 'Failed to fetch users' });
    }

    const authorsMap: Record<string, any> = {};
    for (const u of users || []) {
        authorsMap[u.id] = u;
    }

    res.status(200).json(authorsMap);
}
