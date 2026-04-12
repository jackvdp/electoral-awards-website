import { NextApiRequest, NextApiResponse } from 'next';
import Comment from 'backend/models/comment';
import Post from 'backend/models/post';
import { Error as MongooseError } from 'mongoose';

async function createComment(req: NextApiRequest, res: NextApiResponse, authorId: string) {
    try {
        const { id: postId } = req.query;
        const { content, mentions } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        if (content.length > 500) {
            return res.status(400).json({ message: 'Comment must be 500 characters or fewer' });
        }

        // Check the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Rate limiting: max 30 comments per hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentCommentCount = await Comment.countDocuments({
            authorId,
            createdAt: { $gte: oneHourAgo },
        });

        if (recentCommentCount >= 30) {
            return res.status(429).json({ message: 'You can only post 30 comments per hour' });
        }

        const newComment = new Comment({
            postId,
            authorId,
            content: content.trim(),
            mentions: mentions || [],
        });

        await newComment.save();

        // Increment commentCount on the post
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        res.status(201).json(newComment);
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
        } else if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to create comment', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default createComment;
