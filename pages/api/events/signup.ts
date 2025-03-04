// pages/api/events/signup.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from "backend/mongo";
import {ObjectId} from 'mongodb';
import mongoose from 'mongoose';
import {EventRegistrationData, sendEventConfirmationEmail} from "backend/use_cases/events/confirmation-email";

interface SignupRequestBody {
    eventId: string;
    userId: string;
    eventRegistrationData: EventRegistrationData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            await signup(req, res);
            break;
        case 'DELETE':
            await cancelSignup(req, res);
            break;
        default:
            res.status(405).json({error: 'Method not allowed'});
            break;
    }
}

async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {eventId, userId, eventRegistrationData} = req.body as SignupRequestBody;
    if (!eventId || !userId) {
        return res.status(400).json({error: 'Missing eventId or userId'});
    }

    try {
        // Ensure you're connected
        await dbConnect();
        // Get the native MongoDB database object from Mongoose
        const db = mongoose.connection.db;

        if (db === null || db === undefined) {
            return res.status(500).json({error: 'Failed to connect to database'});
        }

        // Update the event document: add the userId to the signups array (if not already added)
        const result = await db.collection('events').updateOne(
            {_id: new ObjectId(eventId)},
            {$addToSet: {signups: userId}}
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({message: 'Already signed up or event not found'});
        }

        await sendEventConfirmationEmail(eventRegistrationData)

        return res.status(200).json({message: 'Successfully signed up for the event'});
    } catch (error: any) {
        console.error('Error signing up for event:', error);
        return res.status(500).json({error: error.message});
    }
}

async function cancelSignup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {eventId, userId} = req.body;
    if (!eventId || !userId) {
        return res.status(400).json({error: 'Missing eventId or userId'});
    }

    try {
        await dbConnect();
        const db = mongoose.connection.db;

        if (db === null || db === undefined) {
            return res.status(500).json({error: 'Failed to connect to database'});
        }

        // Remove the user from the signups array using $pull
        const result = await db.collection('events').updateOne(
            {_id: new ObjectId(eventId)},
            {$pull: {signups: userId}}
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({message: 'Not signed up or event not found'});
        }
        return res.status(200).json({message: 'Successfully canceled sign up'});
    } catch (error: any) {
        console.error('Error canceling sign up:', error);
        return res.status(500).json({error: error.message});
    }
}