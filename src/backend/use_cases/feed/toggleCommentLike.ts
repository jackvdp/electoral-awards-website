import { NextApiRequest, NextApiResponse } from 'next';
import Comment from 'backend/models/comment';
import createNotification from 'backend/use_cases/notifications/createNotification';

async function toggleCommentLike(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const { commentId } = req.query;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const alreadyLiked = comment.likes.includes(userId);

        if (alreadyLiked) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
        } else {
            await Comment.findByIdAndUpdate(commentId, { $addToSet: { likes: userId } });

            createNotification({
                recipientId: comment.authorId,
                type: 'like_comment',
                actorId: userId,
                postId: comment.postId,
                commentId: commentId as string,
            }).catch(() => {});
        }

        const updatedComment = await Comment.findById(commentId).lean() as any;

        res.status(200).json({ liked: !alreadyLiked, likeCount: updatedComment?.likes?.length || 0 });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to toggle like', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default toggleCommentLike;
