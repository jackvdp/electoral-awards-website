import { FC, useState, FormEvent } from 'react';

interface PostComposerProps {
    onPostCreated: (post: any) => void;
    userFirstname?: string;
}

const PostComposer: FC<PostComposerProps> = ({ onPostCreated, userFirstname }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const charCount = content.length;
    const maxChars = 1000;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create post');
            }

            const newPost = await res.json();
            setContent('');
            onPostCreated(newPost);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card shadow-lg rounded-4 p-4 mb-5">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="form-control border-0 bg-light rounded-3 mb-3"
                    rows={3}
                    placeholder={userFirstname ? `What's on your mind, ${userFirstname}?` : "What's on your mind?"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={maxChars}
                    disabled={submitting}
                    style={{ resize: 'none' }}
                />

                <div className="d-flex justify-content-between align-items-center">
                    <small className={`text-${charCount > maxChars * 0.9 ? 'danger' : 'muted'}`}>
                        {charCount}/{maxChars}
                    </small>

                    <button
                        type="submit"
                        className="btn btn-sm btn-primary rounded-pill px-4"
                        disabled={!content.trim() || submitting || charCount > maxChars}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                                Posting...
                            </>
                        ) : (
                            'Post'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default PostComposer;
