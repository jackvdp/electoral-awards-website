import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';
import createNotification from 'backend/use_cases/notifications/createNotification';

async function toggleLike(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const { id } = req.query;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
        } else {
            await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

            // Notify post author on like (not on unlike)
            createNotification({
                recipientId: post.authorId,
                type: 'like_post',
                actorId: userId,
                postId: id as string,
            }).catch(() => {});
        }

        const updatedPost = await Post.findById(id).lean() as any;

        res.status(200).json({ liked: !alreadyLiked, likeCount: updatedPost?.likes?.length || 0 });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to toggle like', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default toggleLike;
