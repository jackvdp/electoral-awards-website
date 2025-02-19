// pages/api/events/cancelSignup.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from "../../../src/backend/mongo";
import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
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