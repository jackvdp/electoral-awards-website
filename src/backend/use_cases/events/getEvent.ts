import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function getEventById(req: NextApiRequest, res: NextApiResponse, eventId: string) {
    try {
        const event = await Event.findById(eventId);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get event', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getEventById;


