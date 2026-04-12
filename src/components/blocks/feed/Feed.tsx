import { FC, useState, useCallback, useEffect, useRef } from 'react';
import PostComposer from './PostComposer';
import PostCard, { PostAuthor } from './PostCard';
import FeedSkeleton from './FeedSkeleton';

interface FeedPost {
    _id: string;
    authorId: string;
    content: string;
    type: string;
    likes: string[];
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

interface FeedProps {
    initialPosts: FeedPost[];
    initialAuthors: Record<string, PostAuthor>;
    initialHasMore: boolean;
    currentUserId: string;
    currentUserFirstname: string;
    isAdmin: boolean;
}

const Feed: FC<FeedProps> = ({
    initialPosts,
    initialAuthors,
    initialHasMore,
    currentUserId,
    currentUserFirstname,
    isAdmin,
}) => {
    const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
    const [authors, setAuthors] = useState<Record<string, PostAuthor>>(initialAuthors);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loadingMore, setLoadingMore] = useState(false);
    const [newPostsBanner, setNewPostsBanner] = useState(false);
    const latestPostRef = useRef<string | null>(initialPosts[0]?.createdAt || null);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || posts.length === 0) return;

        setLoadingMore(true);
        try {
            const lastPost = posts[posts.length - 1];
            const res = await fetch(`/api/feed?before=${lastPost.createdAt}`);
            if (res.ok) {
                const data = await res.json();
                if (data.posts.length > 0) {
                    // Fetch authors for new posts
                    const newAuthorIds = Array.from(new Set(data.posts.map((p: FeedPost) => p.authorId))) as string[];
                    const missingAuthorIds = newAuthorIds.filter(id => !authors[id]);

                    if (missingAuthorIds.length > 0) {
                        const authorRes = await fetch(`/api/feed/authors?ids=${missingAuthorIds.join(',')}`);
                        if (authorRes.ok) {
                            const authorData = await authorRes.json();
                            setAuthors(prev => ({ ...prev, ...authorData }));
                        }
                    }

                    setPosts(prev => [...prev, ...data.posts]);
                }
                setHasMore(data.hasMore);
            }
        } catch {
            // Silently fail
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, posts, authors]);

    // Poll for new posts every 30 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!latestPostRef.current) return;

            try {
                const res = await fetch(`/api/feed?after=${encodeURIComponent(latestPostRef.current)}&limit=10`);
                if (res.ok) {
                    const data = await res.json();
                    // Only show banner if there are genuinely new posts we haven't seen
                    const currentIds = new Set(posts.map(p => p._id));
                    const unseenPosts = data.posts.filter((p: FeedPost) => !currentIds.has(p._id));
                    if (unseenPosts.length > 0) {
                        setNewPostsBanner(true);
                    }
                }
            } catch {
                // Silently fail
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [posts]);

    const loadNewPosts = async () => {
        try {
            const res = await fetch('/api/feed?limit=20');
            if (res.ok) {
                const data = await res.json();

                // Fetch authors
                const newAuthorIds = Array.from(new Set(data.posts.map((p: FeedPost) => p.authorId))) as string[];
                const missingAuthorIds = newAuthorIds.filter(id => !authors[id]);

                if (missingAuthorIds.length > 0) {
                    const authorRes = await fetch(`/api/feed/authors?ids=${missingAuthorIds.join(',')}`);
                    if (authorRes.ok) {
                        const authorData = await authorRes.json();
                        setAuthors(prev => ({ ...prev, ...authorData }));
                    }
                }

                setPosts(data.posts);
                setHasMore(data.hasMore);
                if (data.posts.length > 0) {
                    latestPostRef.current = data.posts[0].createdAt;
                }
            }
        } catch {
            // Silently fail
        }
        setNewPostsBanner(false);
    };

    const handlePostCreated = (newPost: FeedPost) => {
        setPosts(prev => [newPost, ...prev]);
        latestPostRef.current = newPost.createdAt;

        // Add current user as author if not already present
        if (!authors[newPost.authorId]) {
            setAuthors(prev => ({
                ...prev,
                [newPost.authorId]: {
                    id: newPost.authorId,
                    firstname: currentUserFirstname,
                    lastname: '',
                    organisation: '',
                },
            }));
        }
    };

    const handlePostDeleted = (postId: string) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
    };

    const handleAuthorsLoaded = useCallback((newAuthors: Record<string, PostAuthor>) => {
        setAuthors(prev => ({ ...prev, ...newAuthors }));
    }, []);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 500
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    return (
        <div>
            <PostComposer onPostCreated={handlePostCreated} userFirstname={currentUserFirstname} />

            {newPostsBanner && (
                <button
                    className="btn btn-primary btn-sm rounded-pill w-100 mb-4"
                    onClick={loadNewPosts}
                >
                    New posts available — click to load
                </button>
            )}

            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <i className="uil uil-comments fs-48 text-muted mb-3 d-block" />
                    <h4 className="text-muted">No posts yet</h4>
                    <p className="text-muted">Be the first to share something with the community!</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            author={authors[post.authorId]}
                            authors={authors}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                            onDelete={handlePostDeleted}
                            onAuthorsLoaded={handleAuthorsLoaded}
                        />
                    ))}
                </div>
            )}

            {loadingMore && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-muted py-4">You&apos;ve reached the end</p>
            )}
        </div>
    );
};

export type { FeedPost };
export default Feed;
