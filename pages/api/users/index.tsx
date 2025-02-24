// pages/api/users.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {createClient} from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {userIds} = req.query;
    if (!userIds || typeof userIds !== 'string') {
        return res.status(400).json({error: 'Missing or invalid userIds parameter'});
    }

    // Split the comma-separated list into an array.
    const ids = userIds.split(',');

    try {
        // For each id, fetch the user data.
        const results = await Promise.all(
            ids.map(async (id) => {
                const {data, error} = await supabaseAdmin.auth.admin.getUserById(id);
                return error ? null : (data?.user || data);
            })
        );
        return res.status(200).json(results);
    } catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}