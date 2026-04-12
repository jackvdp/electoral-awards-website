import { FC, useState, useEffect, useCallback } from 'react';
import CommentCard from './CommentCard';
import CommentComposer from './CommentComposer';
import { PostAuthor } from './PostCard';

interface FeedComment {
    _id: string;
    postId: string;
    authorId: string;
    content: string;
    likes: string[];
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
    currentUserId: string;
    isAdmin: boolean;
    authors: Record<string, PostAuthor>;
    onAuthorsLoaded: (newAuthors: Record<string, PostAuthor>) => void;
    onCommentCountChange: (delta: number) => void;
}

const CommentSection: FC<CommentSectionProps> = ({
    postId,
    currentUserId,
    isAdmin,
    authors,
    onAuthorsLoaded,
    onCommentCountChange,
}) => {
    const [comments, setComments] = useState<FeedComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/feed/${postId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments);
                setHasMore(data.hasMore);

                // Fetch missing authors
                const commentAuthorIds = Array.from(new Set(data.comments.map((c: FeedComment) => c.authorId))) as string[];
                const missingIds = commentAuthorIds.filter(id => !authors[id]);

                if (missingIds.length > 0) {
                    const authorRes = await fetch(`/api/feed/authors?ids=${missingIds.join(',')}`);
                    if (authorRes.ok) {
                        const authorData = await authorRes.json();
                        onAuthorsLoaded(authorData);
                    }
                }
            }
        } catch {
            // Silently fail
        } finally {
            setLoading(false);
        }
    }, [postId, authors, onAuthorsLoaded]);

    useEffect(() => {
        fetchComments();
    }, []);

    const loadMore = async () => {
        if (!hasMore || comments.length === 0) return;

        const lastComment = comments[comments.length - 1];
        try {
            const res = await fetch(`/api/feed/${postId}/comments?before=${lastComment.createdAt}`);
            if (res.ok) {
                const data = await res.json();
                setComments(prev => [...prev, ...data.comments]);
                setHasMore(data.hasMore);
            }
        } catch {
            // Silently fail
        }
    };

    const handleCommentCreated = (newComment: FeedComment) => {
        setComments(prev => [...prev, newComment]);
        onCommentCountChange(1);
    };

    const handleCommentDeleted = (commentId: string) => {
        setComments(prev => prev.filter(c => c._id !== commentId));
        onCommentCountChange(-1);
    };

    if (loading) {
        return (
            <div className="pt-3 border-top mt-3">
                <div className="text-center py-2">
                    <span className="spinner-border spinner-border-sm text-muted" role="status" />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-3 border-top mt-3">
            {comments.length > 0 && (
                <div className="d-flex flex-column">
                    {comments.map(comment => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            author={authors[comment.authorId]}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                            onDelete={handleCommentDeleted}
                        />
                    ))}

                    {hasMore && (
                        <button
                            className="btn btn-link btn-sm text-muted p-0 mt-1"
                            onClick={loadMore}
                        >
                            Load more comments
                        </button>
                    )}
                </div>
            )}

            <CommentComposer postId={postId} onCommentCreated={handleCommentCreated} />
        </div>
    );
};

export default CommentSection;
