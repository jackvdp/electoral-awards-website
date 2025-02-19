// pages/api/events/signup.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from "../../../src/backend/mongo";
import {ObjectId} from 'mongodb';
import mongoose from 'mongoose';

interface SignupRequestBody {
    eventId: string;
    userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {eventId, userId} = req.body as SignupRequestBody;
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

        return res.status(200).json({message: 'Successfully signed up for the event'});
    } catch (error: any) {
        console.error('Error signing up for event:', error);
        return res.status(500).json({error: error.message});
    }
}