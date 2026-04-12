import { FC, useState } from 'react';

interface PostActionsProps {
    postId: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    onCommentToggle: () => void;
}

const PostActions: FC<PostActionsProps> = ({ postId, likeCount, commentCount, isLiked, onCommentToggle }) => {
    const [liked, setLiked] = useState(isLiked);
    const [count, setCount] = useState(likeCount);
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (liking) return;

        setLiking(true);

        // Optimistic update
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);

        try {
            const res = await fetch(`/api/feed/${postId}/like`, { method: 'POST' });

            if (!res.ok) {
                // Revert on failure
                setLiked(liked);
                setCount(count);
            }
        } catch {
            // Revert on failure
            setLiked(liked);
            setCount(count);
        } finally {
            setLiking(false);
        }
    };

    return (
        <div className="d-flex gap-3 pt-3 border-top">
            <button
                className={`btn btn-sm ${liked ? 'text-primary' : 'text-muted'} d-flex align-items-center gap-1 p-0`}
                onClick={handleLike}
                disabled={liking}
            >
                <i className={`uil uil-thumbs-up fs-18`} />
                <span>{count > 0 ? count : ''} {count === 1 ? 'Like' : count > 1 ? 'Likes' : 'Like'}</span>
            </button>

            <button
                className="btn btn-sm text-muted d-flex align-items-center gap-1 p-0"
                onClick={onCommentToggle}
            >
                <i className="uil uil-comment fs-18" />
                <span>{commentCount > 0 ? commentCount : ''} {commentCount === 1 ? 'Comment' : commentCount > 1 ? 'Comments' : 'Comment'}</span>
            </button>
        </div>
    );
};

export default PostActions;
