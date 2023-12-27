import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function getAllEvents(req: NextApiRequest, res: NextApiResponse) {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to add event', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getAllEvents;