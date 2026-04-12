import { GetServerSideProps, NextPage } from 'next';
import { Fragment } from 'react';
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import CustomHead from 'components/common/CustomHead';
import Feed, { FeedPost } from 'components/blocks/feed/Feed';
import { PostAuthor } from 'components/blocks/feed/PostCard';
import { createClient } from 'backend/supabase/server-props';
import supabaseAdmin from 'backend/supabase/admin';
import dbConnect from 'backend/mongo';
import Post from 'backend/models/post';

interface FeedPageProps {
    posts: FeedPost[];
    authors: Record<string, PostAuthor>;
    hasMore: boolean;
    currentUserId: string;
    currentUserFirstname: string;
    isAdmin: boolean;
}

const FeedPage: NextPage<FeedPageProps> = ({
    posts,
    authors,
    hasMore,
    currentUserId,
    currentUserFirstname,
    isAdmin,
}) => {
    return (
        <Fragment>
            <CustomHead
                title="Feed"
                description="Join the conversation with fellow electoral professionals. Share insights, discuss best practices, and connect with the Electoral Members' Network community."
            />
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <section className="wrapper bg-soft-primary">
                    <div className="container pt-10 pb-19 pt-md-14 pb-md-20 text-center">
                        <div className="row">
                            <div className="col-md-7 col-lg-6 col-xl-5 mx-auto">
                                <h1 className="display-1 mb-3">Feed</h1>
                                <p className="lead px-lg-5 px-xxl-8">
                                    Connect and share with the electoral community
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="wrapper bg-light">
                    <div className="container pb-14 pb-md-16">
                        <div className="row">
                            <div className="col-lg-8 col-xl-7 mx-auto mt-n17">
                                <Feed
                                    initialPosts={posts}
                                    initialAuthors={authors}
                                    initialHasMore={hasMore}
                                    currentUserId={currentUserId}
                                    currentUserFirstname={currentUserFirstname}
                                    isAdmin={isAdmin}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </Fragment>
    );
};

export default FeedPage;

export const getServerSideProps: GetServerSideProps<FeedPageProps> = async (ctx) => {
    const supabase = createClient(ctx);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    await dbConnect();

    const posts = await Post.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    const serialisedPosts = posts.map((post: any) => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    })) as FeedPost[];

    // Batch-fetch authors
    const authorIds = Array.from(new Set(serialisedPosts.map(p => p.authorId)));
    const authors: Record<string, PostAuthor> = {};

    if (authorIds.length > 0) {
        const { data: users } = await supabaseAdmin
            .from('users')
            .select('id, firstname, lastname, organisation, profile_image')
            .in('id', authorIds);

        for (const u of users || []) {
            authors[u.id] = u;
        }
    }

    const hasMore = serialisedPosts.length === 20;
    const user = session.user;
    const isAdmin = user.user_metadata?.role === 'admin';

    // Ensure current user is always in authors map
    if (!authors[user.id]) {
        authors[user.id] = {
            id: user.id,
            firstname: user.user_metadata?.firstname || '',
            lastname: user.user_metadata?.lastname || '',
            organisation: user.user_metadata?.organisation || '',
            profile_image: user.user_metadata?.profileImage || '',
        };
    }

    return {
        props: {
            posts: serialisedPosts,
            authors,
            hasMore,
            currentUserId: user.id,
            currentUserFirstname: user.user_metadata?.firstname || '',
            isAdmin,
        },
    };
};
