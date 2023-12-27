import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function getEventPreviews(res: NextApiResponse) {
    try {
        const events = await Event.find({}, { title: 1, startDate: 1, imageURL: 1 });
        res.status(200).json(events);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get event snapshots', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getEventPreviews;