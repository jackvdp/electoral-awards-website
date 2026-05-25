// pages/api/bookings/events/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getEventBookings } from 'backend/use_cases/bookings/getEventBookings';
import dbConnect from "backend/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        default:
            return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect()
    const { id } = req.query;
    // Extract status from query parameters
    const { status } = req.query;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Missing event ID'
        });
    }

    try {
        const result = await getEventBookings({
            eventId: id as string,
            status: status as string | undefined
        });

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get event bookings'
        });
    }
}