import { NextApiRequest, NextApiResponse } from 'next';
import Event from 'backend/models/event';
import { Error as MongooseError } from 'mongoose';

async function addEvent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();

        res.status(201).json({ message: 'Event added successfully' });
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
        } else if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to add event', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default addEvent;