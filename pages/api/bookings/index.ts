// /api/bookings
import type { NextApiRequest, NextApiResponse } from 'next';
import {createBookingAndSendConfirmation} from "backend/use_cases/bookings/createBooking+SendConfirmation";
import dbConnect from "backend/mongo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    switch (req.method) {
        case 'POST':
            return POST(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect()
    try {
        const bookingData = req.body;

        if (!bookingData || !bookingData.user || !bookingData.event) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const result = await createBookingAndSendConfirmation(bookingData);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in createBooking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}