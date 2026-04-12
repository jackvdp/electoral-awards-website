import { NextApiRequest, NextApiResponse } from 'next';
import createClient from 'backend/supabase/api';
import fetchLinkPreview from 'backend/use_cases/feed/fetchLinkPreview';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: 'url is required' });
    }

    const preview = await fetchLinkPreview(url);

    if (!preview) {
        return res.status(404).json({ message: 'Could not fetch preview' });
    }

    res.status(200).json(preview);
}
