import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "backend/mongo";
import Booking, {IBooking} from "backend/models/booking";
import Event, {IEvent} from 'backend/models/event';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Connect to the database
        await dbConnect();

        // Extract user ID from query parameters
        const { userId } = req.query;

        // Get current date to filter for upcoming events
        const currentDate = new Date();

        // Find all bookings for the user
        const bookings: IBooking[] = await Booking.find({ userId })

        if (bookings.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Get all event IDs from the bookings
        const eventIds = bookings.map(booking => {
            // Convert string IDs to ObjectId if needed
            try {
                return new mongoose.Types.ObjectId(booking.eventId);
            } catch (e) {
                return booking.eventId; // Keep as is if conversion fails
            }
        });

        // Find all events that match the bookings and are upcoming
        const events: IEvent[] = await Event.find({
            _id: { $in: eventIds },
            endDate: { $gte: currentDate }
        })

        const upcomingBookings: { event: IEvent, booking: IBooking }[] = events.map(event => {
            // @ts-ignore
            const booking = bookings.find(booking => booking.eventId === event._id.toString())!
            return { event, booking };
        })

        return res.status(200).json({
            success: true,
            data: upcomingBookings
        });
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}