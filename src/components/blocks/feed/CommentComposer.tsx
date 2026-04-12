import { FC, useState, FormEvent } from 'react';

interface CommentComposerProps {
    postId: string;
    onCommentCreated: (comment: any) => void;
}

const CommentComposer: FC<CommentComposerProps> = ({ postId, onCommentCreated }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const maxChars = 500;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/feed/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to post comment');
            }

            const newComment = await res.json();
            setContent('');
            onCommentCreated(newComment);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3">
            <input
                type="text"
                className="form-control form-control-sm bg-light border-0 rounded-pill"
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={maxChars}
                disabled={submitting}
            />
            <button
                type="submit"
                className="btn btn-sm btn-primary rounded-pill px-3"
                disabled={!content.trim() || submitting}
            >
                {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                    <i className="uil uil-message" />
                )}
            </button>
            {error && (
                <small className="text-danger">{error}</small>
            )}
        </form>
    );
};

export default CommentComposer;
