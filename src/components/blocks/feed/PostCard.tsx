import { FC, useState } from 'react';
import PostActions from './PostActions';

interface PostAuthor {
    id: string;
    firstname: string;
    lastname: string;
    organisation?: string;
    profile_image?: string;
}

interface PostCardProps {
    post: {
        _id: string;
        authorId: string;
        content: string;
        likes: string[];
        commentCount: number;
        createdAt: string;
        updatedAt: string;
    };
    author?: PostAuthor;
    currentUserId: string;
    isAdmin: boolean;
    onDelete: (postId: string) => void;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PostCard: FC<PostCardProps> = ({ post, author, currentUserId, isAdmin, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = post.authorId === currentUserId;
    const canDelete = isOwner || isAdmin;
    const isEdited = post.updatedAt !== post.createdAt;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/feed/${post._id}`, { method: 'DELETE' });
            if (res.ok) {
                onDelete(post._id);
            }
        } catch {
            // Silently fail
        } finally {
            setDeleting(false);
            setShowMenu(false);
        }
    };

    const authorName = author ? `${author.firstname} ${author.lastname}` : 'Unknown member';
    const initials = author ? `${author.firstname?.[0] || ''}${author.lastname?.[0] || ''}` : '?';

    return (
        <div className="card shadow-lg rounded-4 p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                    {author?.profile_image ? (
                        <img
                            src={author.profile_image}
                            alt={authorName}
                            className="rounded-circle"
                            width={44}
                            height={44}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 44, height: 44, fontSize: '0.9rem' }}
                        >
                            {initials}
                        </div>
                    )}

                    <div className="ms-3">
                        <h6 className="mb-0 fs-15">{authorName}</h6>
                        <small className="text-muted">
                            {author?.organisation && <>{author.organisation} &middot; </>}
                            {timeAgo(post.createdAt)}
                            {isEdited && <> &middot; edited</>}
                        </small>
                    </div>
                </div>

                {canDelete && (
                    <div className="position-relative">
                        <button
                            className="btn btn-sm text-muted p-0"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <i className="uil uil-ellipsis-h fs-20" />
                        </button>

                        {showMenu && (
                            <div
                                className="dropdown-menu show position-absolute end-0 shadow-lg"
                                style={{ minWidth: 120 }}
                            >
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Delete post'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mb-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {post.content}
            </div>

            {/* Actions */}
            <PostActions
                postId={post._id}
                likeCount={post.likes.length}
                commentCount={post.commentCount}
                isLiked={post.likes.includes(currentUserId)}
                onCommentToggle={() => {}}
            />
        </div>
    );
};

export type { PostAuthor };
export default PostCard;
