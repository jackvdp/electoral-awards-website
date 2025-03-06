'use server';

import Booking, { IBooking } from "../../models/booking";

export async function updateBooking({
                                        bookingId,
                                        status
                                    }: {
    bookingId: string,
    status: string
}): Promise<{success: boolean, message: string, booking?: IBooking}> {
    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }

        booking.status = status;

        await booking.save();

        return {
            success: true,
            message: 'Booking updated successfully',
            booking
        };
    } catch (error) {
        console.error('Error updating booking:', error);
        return {
            success: false,
            message: 'Failed to update booking'
        };
    }
}