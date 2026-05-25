// backend/models/booking.ts
import mongoose, { Document } from 'mongoose';

export interface IBooking extends Document {
    userId: string;
    eventId: string;
    status: 'invited' | 'accepted' | 'rejected';
    invitedAt: Date;
    respondedAt?: Date;
}

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true,
        ref: 'Event'
    },
    status: {
        type: String,
        enum: ['invited', 'accepted', 'rejected'],
        required: true
    },
    invitedAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: {
        type: Date
    }
}, { timestamps: true });

// Create indexes for faster lookups
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ eventId: 1, status: 1 });
bookingSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Create the model
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;