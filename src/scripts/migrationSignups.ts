// TO RUN: npx ts-node src/scripts/migrationSignups.ts
// And change tsconfig.json to: "module": "commonjs",

import mongoose from "mongoose";
// Adjust these import paths to match your project structure
import Event from "../backend/models/event";
import Booking from "../backend/models/booking";
// Use your actual connection string or environment variable here.
const mongoUri = "mongodb+srv://jackvanderpump:Mark2859@electoral.jkriemo.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    });

async function migrateSignups() {
    try {
        // Find events with non-empty signups array
        const eventsWithSignups = await Event.find({
            signups: { $exists: true, $not: { $size: 0 } }
        });
        console.log(`Found ${eventsWithSignups.length} events with signups.`);

        for (const event of eventsWithSignups) {
            const eventId = event._id;
            const signups: string[] = event.signups || [];

            // Iterate over each userId in the signups array
            for (const userId of signups) {
                // Check if a booking already exists for this event and user (optional safeguard)
                const existingBooking = await Booking.findOne({ eventId, userId });
                if (existingBooking) {
                    console.log(`Booking already exists for event ${eventId} and user ${userId}. Skipping.`);
                    continue;
                }

                // Create a new booking document.
                // Add any additional booking fields as required.
                const booking = new Booking({
                    eventId,
                    userId,
                    status: "accepted",
                });
                await booking.save();
                console.log(`Created booking for event ${eventId} and user ${userId}.`);
            }
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error migrating signups to bookings:", error);
        process.exit(1);
    }
}

migrateSignups();
