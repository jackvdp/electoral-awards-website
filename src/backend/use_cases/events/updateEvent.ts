import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function updateEventById(req: NextApiRequest, res: NextApiResponse, eventId: string) {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
        if (updatedEvent) {
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update event', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default updateEventById;