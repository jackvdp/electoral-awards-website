import { FC, useState, useRef, FormEvent } from 'react';
import MentionInput, { tokenise, Mention } from './MentionInput';
import { parseMentions } from 'backend/use_cases/feed/parseMentions';

interface PostComposerProps {
    onPostCreated: (post: any) => void;
    userFirstname?: string;
}

const PostComposer: FC<PostComposerProps> = ({ onPostCreated, userFirstname }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mentionsRef = useRef<Mention[]>([]);

    const charCount = content.length;
    const maxChars = 1000;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            // Convert display text to tokenised format for storage
            const tokenised = tokenise(content.trim(), mentionsRef.current);
            const { mentionIds } = parseMentions(tokenised);

            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: tokenised,
                    mentions: mentionIds,
                }),
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
                <div className="mb-3">
                    <MentionInput
                        value={content}
                        onChange={setContent}
                        onMentionsChange={(m) => { mentionsRef.current = m; }}
                        placeholder={userFirstname ? `What's on your mind, ${userFirstname}?` : "What's on your mind?"}
                        maxLength={maxChars}
                        disabled={submitting}
                    />
                </div>

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
