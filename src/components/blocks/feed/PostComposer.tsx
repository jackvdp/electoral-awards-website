import { FC, useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import MentionInput, { tokenise, Mention } from './MentionInput';
import LinkPreview from './LinkPreview';
import { parseMentions } from 'backend/use_cases/feed/parseMentions';

const URL_REGEX = /https?:\/\/[^\s<]+/g;

interface LinkPreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
}

interface PostComposerProps {
    onPostCreated: (post: any) => void;
    userFirstname?: string;
}

const PostComposer: FC<PostComposerProps> = ({ onPostCreated, userFirstname }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
    const [fetchingPreview, setFetchingPreview] = useState(false);
    const mentionsRef = useRef<Mention[]>([]);
    const previewUrlRef = useRef<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchPreview = useCallback(async (url: string) => {
        if (url === previewUrlRef.current) return;
        previewUrlRef.current = url;
        setFetchingPreview(true);

        try {
            const res = await fetch('/api/feed/link-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                const data = await res.json();
                setLinkPreview(data);
            } else {
                setLinkPreview(null);
            }
        } catch {
            setLinkPreview(null);
        } finally {
            setFetchingPreview(false);
        }
    }, []);

    // Detect URLs in content and fetch preview
    useEffect(() => {
        const urls = content.match(URL_REGEX);
        const firstUrl = urls?.[0];

        if (!firstUrl) {
            setLinkPreview(null);
            previewUrlRef.current = null;
            return;
        }

        if (firstUrl === previewUrlRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPreview(firstUrl), 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [content, fetchPreview]);

    const charCount = content.length;
    const maxChars = 1000;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            const tokenised = tokenise(content.trim(), mentionsRef.current);
            const { mentionIds } = parseMentions(tokenised);

            const body: Record<string, any> = {
                content: tokenised,
                mentions: mentionIds,
            };

            // Attach link preview if present
            if (linkPreview) {
                body.type = 'link';
                body.linkPreview = linkPreview;
            }

            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create post');
            }

            const newPost = await res.json();
            setContent('');
            setLinkPreview(null);
            previewUrlRef.current = null;
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

                {/* Link preview */}
                {fetchingPreview && (
                    <div className="text-center py-2 mb-2">
                        <span className="spinner-border spinner-border-sm text-muted" role="status" />
                        <small className="text-muted ms-2">Fetching preview...</small>
                    </div>
                )}

                {linkPreview && !fetchingPreview && (
                    <div className="mb-3 position-relative">
                        <LinkPreview {...linkPreview} />
                        <button
                            type="button"
                            className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: 0 }}
                            onClick={() => { setLinkPreview(null); previewUrlRef.current = 'dismissed'; }}
                            aria-label="Remove preview"
                        >
                            <i className="uil uil-times fs-16" />
                        </button>
                    </div>
                )}

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
