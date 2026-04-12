import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';
import { Error as MongooseError } from 'mongoose';

async function createPost(req: NextApiRequest, res: NextApiResponse, authorId: string) {
    try {
        const { content, type, linkPreview, sharedArticleId, sharedEventId, mentions } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        if (content.length > 1000) {
            return res.status(400).json({ message: 'Post content must be 1000 characters or fewer' });
        }

        // Rate limiting: max 10 posts per hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentPostCount = await Post.countDocuments({
            authorId,
            createdAt: { $gte: oneHourAgo },
        });

        if (recentPostCount >= 10) {
            return res.status(429).json({ message: 'You can only create 10 posts per hour' });
        }

        const newPost = new Post({
            authorId,
            content: content.trim(),
            type: type || 'text',
            linkPreview,
            sharedArticleId,
            sharedEventId,
            mentions: mentions || [],
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
        } else if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to create post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default createPost;
