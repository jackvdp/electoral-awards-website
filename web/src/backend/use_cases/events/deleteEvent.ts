import { NextApiResponse } from 'next';
import { Error } from 'mongoose';
import Event from 'backend/models/event';

async function deleteEventById(res: NextApiResponse, eventId: string) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (deletedEvent) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete event', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default deleteEventById;