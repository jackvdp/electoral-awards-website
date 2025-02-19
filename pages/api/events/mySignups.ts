// pages/api/events/mySignups.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from "../../../src/backend/mongo";
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {userId} = req.query;
    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({error: 'Invalid or missing userId'});
    }

    try {
        await dbConnect();
        const db = mongoose.connection.db;

        if (db === null || db === undefined) {
            return res.status(500).json({error: 'Failed to connect to database'});
        }

        const events = await db
            .collection('events')
            .find({signups: userId})
            .toArray();
        return res.status(200).json(events);
    } catch (error: any) {
        console.error('Error fetching signed-up events:', error);
        return res.status(500).json({error: error.message});
    }
}