import type { NextApiRequest, NextApiResponse } from 'next';
import createSupabaseClient from 'backend/supabase/api';
import { getUserNominations } from 'backend/use_cases/nominations/getUserNominations';
import { NOMINATIONS_PERIOD, isNominationsOpen } from 'data/awards-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    try {
        const supabase = createSupabaseClient(req, res);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const nominations = await getUserNominations({
            userId: session.user.id,
            from: new Date(NOMINATIONS_PERIOD.opens),
            to: new Date(NOMINATIONS_PERIOD.closes),
        });

        return res.status(200).json({
            success: true,
            data: nominations,
            isOpen: isNominationsOpen(),
        });
    } catch (error) {
        console.error('Error fetching user nominations:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
