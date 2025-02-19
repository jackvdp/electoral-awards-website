// pages/api/deleteUser.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {createClient} from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'DELETE':
            return await deleteUser(req, res);
        default:
            return res.status(405).json({error: 'Method not allowed'});
    }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
    const {userId} = req.body;
    if (!userId) {
        return res.status(400).json({error: 'Missing userId'});
    }

    // Delete user profile from your Postgres (if needed) then delete auth user:
    // First delete user from your "users" table if you have one...
    const {error: profileError} = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);

    if (profileError) {
        return res.status(500).json({error: profileError.message});
    }

    // Now delete the auth user
    const {error: authError} = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
        return res.status(500).json({error: authError.message});
    }

    return res.status(200).json({message: 'User deleted successfully'});
}
