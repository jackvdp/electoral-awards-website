import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "backend/mongo";
import Booking from "backend/models/booking";
import Event from 'backend/models/event';

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
        const bookings = await Booking.find({ userId })
            .lean();

        // Get all event IDs from the bookings
        const eventIds = bookings.map(booking => booking.eventId);

        // Find all events that match the bookings and are upcoming
        const events = await Event.find({
            _id: { $in: eventIds },
            endDate: { $gte: currentDate }
        }).lean();

        // Create a map of events for easier lookup
        const eventMap = new Map();
        events.forEach(event => {
            eventMap.set(event._id as string, event);
        });

        // Combine booking and event data
        const upcomingBookings = bookings
            .filter(booking => {
                // Only include bookings for events that are upcoming
                const event = eventMap.get(booking.eventId.toString());
                return event !== undefined;
            })
            .map(booking => {
                // Combine booking with its associated event
                const event = eventMap.get(booking.eventId.toString());
                return {
                    booking,
                    event
                };
            });

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