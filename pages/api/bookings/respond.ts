// pages/api/bookings/respond.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'backend/mongo';
import { updateBooking } from 'backend/use_cases/bookings/updateBooking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { bookingId, response, redirectUrl } = req.query;

    if (!bookingId || !response || !['accepted', 'rejected'].includes(response as string)) {
        return res.status(400).json({
            success: false,
            message: 'Missing or invalid parameters'
        });
    }

    try {
        await dbConnect();

        // Update the booking status
        const result = await updateBooking({
            bookingId: bookingId as string,
            status: response as 'accepted' | 'rejected'
        });

        if (!result.success) {
            // If there's no redirect URL, return JSON response
            if (!redirectUrl) {
                return res.status(400).json(result);
            }

            // Otherwise redirect with error flag
            return res.redirect(
                `${redirectUrl}?responseStatus=error&message=${encodeURIComponent(result.message)}`
            );
        }

        // If no redirect URL is provided, return success JSON
        if (!redirectUrl) {
            return res.status(200).json(result);
        }

        // Redirect to the provided URL with success parameters
        return res.redirect(
            `${redirectUrl}?responseStatus=success&response=${response}`
        );
    } catch (error: any) {
        console.error('Error updating booking:', error);

        // If no redirect URL is provided, return error JSON
        if (!redirectUrl) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to update booking'
            });
        }

        // Redirect with error flag
        return res.redirect(
            `${redirectUrl}?responseStatus=error&message=${encodeURIComponent(
                error.message || 'An unexpected error occurred'
            )}`
        );
    }
}