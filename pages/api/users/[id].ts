// pages/api/user/[id].ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {createClient} from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query; // Get the user id from the URL parameter
    if (req.method !== 'DELETE') {
        return res.status(405).json({error: 'Method not allowed'});
    }
    if (!id || typeof id !== 'string') {
        return res.status(400).json({error: 'Missing or invalid user id'});
    }

    // First delete user profile from your "users" table if needed
    const {error: profileError} = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

    if (profileError) {
        return res.status(500).json({error: profileError.message});
    }

    // Now delete the auth user
    const {error: authError} = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) {
        return res.status(500).json({error: authError.message});
    }

    return res.status(200).json({message: 'User deleted successfully'});
}