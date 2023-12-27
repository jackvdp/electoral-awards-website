import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo/mongo';
import getEventById from 'backend/use_cases/events/getEvent';
import updateEventById from 'backend/use_cases/events/updateEvent';
import deleteEventById from 'backend/use_cases/events/deleteEvent';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { method, query: { id } } = req;

    if (typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid id parameter' });
        return;
    }

    await dbConnect();

    switch (method) {
        case 'GET':
            await getEventById(res, id);
            break;
        case 'PUT':
            await updateEventById(req, res, id);
            break;
        case 'DELETE':
            await deleteEventById(res, id);
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}