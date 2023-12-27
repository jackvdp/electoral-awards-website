import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo/mongo';
import addEvent from 'backend/use_cases/events/addEvent';
import getAllEvents from 'backend/use_cases/events/getEvents';
import deleteAllEvents from 'backend/use_cases/events/deleteEvents';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    if (req.method === 'POST') {
        await addEvent(req, res);
    } else if (req.method === 'GET') {
        await getAllEvents(req, res);
    } else if (req.method === 'DELETE') {
        await deleteAllEvents(req, res);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

