import Booking, { IBooking } from "backend/models/booking";

export async function updateBooking({
                                        bookingId,
                                        status
                                    }: {
    bookingId: string,
    status: "invited" | "accepted" | "rejected"
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