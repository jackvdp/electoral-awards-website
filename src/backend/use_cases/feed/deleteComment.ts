import { NextApiRequest, NextApiResponse } from 'next';
import Comment from 'backend/models/comment';
import Post from 'backend/models/post';

async function deleteComment(req: NextApiRequest, res: NextApiResponse, userId: string, isAdmin: boolean) {
    try {
        const { commentId } = req.query;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.authorId !== userId && !isAdmin) {
            return res.status(403).json({ message: 'You do not have permission to delete this comment' });
        }

        const postId = comment.postId;
        await Comment.findByIdAndDelete(commentId);

        // Decrement commentCount on the post
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete comment', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default deleteComment;
