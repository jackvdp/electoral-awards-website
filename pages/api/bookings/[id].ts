// /api/bookings/[id]
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteBookingAndSendCancellation } from 'backend/use_cases/bookings/deleteBooking+SendConfirmation';
import { IEvent } from 'backend/models/event';
import { MutableUserData } from 'backend/models/user';
import dbConnect from "backend/mongo";
import {updateBookingAndSendConfirmation} from "backend/use_cases/bookings/updateBooking+SendConfirmation";
import {updateBooking} from "backend/use_cases/bookings/updateBooking";
import {deleteBooking} from "backend/use_cases/bookings/deleteBooking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'DELETE':
            return DELETE(req, res);
        case 'PATCH':
            return PATCH(req, res);
        default:
            return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect()
    const { id } = req.query;
    const { user, event } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters'
        });
    }

    if (!user || !event) {
        const result = await deleteBooking({bookingId: id as string})
        return res.status(result.success ? 200 : 400).json(result);

    } else {

        const result = await deleteBookingAndSendCancellation({
            bookingId: id as string,
            user: user as MutableUserData,
            event: event as IEvent
        });

        return res.status(result.success ? 200 : 400).json(result);

    }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    const { id } = req.query;
    const { status, user, event } = req.body;

    if (!id || !status) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters'
        });
    }

    // If user and event are provided, use updateBookingAndSendConfirmation
    if (user && event) {
        const result = await updateBookingAndSendConfirmation({
            bookingId: id as string,
            status,
            user: user as MutableUserData,
            event: event as IEvent
        });

        return res.status(result.success ? 200 : 400).json(result);
    }
    // Otherwise use the basic updateBooking
    else {
        const result = await updateBooking({
            bookingId: id as string,
            status
        });

        return res.status(result.success ? 200 : 400).json(result);
    }
}