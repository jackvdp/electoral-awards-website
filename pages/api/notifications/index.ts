import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo';
import createClient from 'backend/supabase/api';
import getNotifications from 'backend/use_cases/notifications/getNotifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const unreadOnly = req.query.unread === 'true';
    const notifications = await getNotifications(user.id, 30, unreadOnly);

    // Serialise dates
    const serialised = notifications.map((n: any) => ({
        ...n,
        _id: n._id.toString(),
        createdAt: n.createdAt.toISOString(),
    }));

    res.status(200).json(serialised);
}
