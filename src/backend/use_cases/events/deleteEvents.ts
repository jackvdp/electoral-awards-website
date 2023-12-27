import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function deleteAllEvents(req: NextApiRequest, res: NextApiResponse) {
    const passcode = req.query.passcode as string;

    if (passcode !== 'delete-all-events') {
        res.status(401).json({ message: 'Invalid passcode' });
        return;
    }

    try {
        await Event.deleteMany();
        res.status(200).json({ message: 'All events deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete events', error: error.message });
        }
    }
}

export default deleteAllEvents;
