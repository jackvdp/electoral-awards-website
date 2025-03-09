import Booking from "backend/models/booking";

export async function deleteBooking({bookingId}: {bookingId: string}): Promise<{success: boolean, message: string}> {
    try {
        // Find the booking first to check if it exists
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);

        return {
            success: true,
            message: 'Booking deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting booking:', error);
        return {
            success: false,
            message: 'Failed to delete booking'
        };
    }
}