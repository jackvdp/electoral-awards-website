import { FC, useState } from 'react';
import { PostAuthor } from './PostCard';

interface CommentCardProps {
    comment: {
        _id: string;
        postId: string;
        authorId: string;
        content: string;
        likes: string[];
        createdAt: string;
    };
    author?: PostAuthor;
    currentUserId: string;
    isAdmin: boolean;
    onDelete: (commentId: string) => void;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const CommentCard: FC<CommentCardProps> = ({ comment, author, currentUserId, isAdmin, onDelete }) => {
    const [liked, setLiked] = useState(comment.likes.includes(currentUserId));
    const [likeCount, setLikeCount] = useState(comment.likes.length);
    const [liking, setLiking] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = comment.authorId === currentUserId;
    const canDelete = isOwner || isAdmin;
    const authorName = author ? `${author.firstname} ${author.lastname}` : 'Unknown';
    const initials = author ? `${author.firstname?.[0] || ''}${author.lastname?.[0] || ''}` : '?';

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);

        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);

        try {
            const res = await fetch(`/api/feed/${comment.postId}/comments/${comment._id}/like`, { method: 'POST' });
            if (!res.ok) {
                setLiked(liked);
                setLikeCount(likeCount);
            }
        } catch {
            setLiked(liked);
            setLikeCount(likeCount);
        } finally {
            setLiking(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this comment?')) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/feed/${comment.postId}/comments/${comment._id}`, { method: 'DELETE' });
            if (res.ok) {
                onDelete(comment._id);
            }
        } catch {
            // Silently fail
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="d-flex gap-2 py-2">
            {author?.profile_image ? (
                <img
                    src={author.profile_image}
                    alt={authorName}
                    className="rounded-circle flex-shrink-0"
                    width={32}
                    height={32}
                    style={{ objectFit: 'cover' }}
                />
            ) : (
                <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: 32, height: 32, fontSize: '0.7rem' }}
                >
                    {initials}
                </div>
            )}

            <div className="flex-grow-1">
                <div className="bg-light rounded-3 px-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <strong className="fs-14">{authorName}</strong>
                        <small className="text-muted fs-12">{timeAgo(comment.createdAt)}</small>
                    </div>
                    <p className="mb-0 fs-14" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {comment.content}
                    </p>
                </div>

                <div className="d-flex gap-3 mt-1 ms-2">
                    <button
                        className={`btn btn-link btn-sm p-0 fs-12 text-decoration-none ${liked ? 'text-primary' : 'text-muted'}`}
                        onClick={handleLike}
                        disabled={liking}
                    >
                        Like{likeCount > 0 ? ` (${likeCount})` : ''}
                    </button>

                    {canDelete && (
                        <button
                            className="btn btn-link btn-sm p-0 fs-12 text-decoration-none text-muted"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
