import { NextApiRequest, NextApiResponse } from 'next';
import Article from 'backend/models/article'
import { Error as MongooseError } from 'mongoose';

async function addArticle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();

        res.status(201).json({ message: 'Article added successfully' });
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
        } else if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to add article', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default addArticle;