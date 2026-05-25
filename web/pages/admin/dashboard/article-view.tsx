// pages/admin/dashboard/article-view.tsx
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { createClient } from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import { IArticle } from 'backend/models/article';
import ArticlePreview from 'components/blocks/admin/ArticlePreview';
import Head from 'next/head';

interface ArticleViewPageProps {
    article: IArticle;
}

const ArticleViewPage: NextPage<ArticleViewPageProps> = ({ article }) => {
    return (
        <AdminPage title={`Article: ${article.title}`}>
            <Head>
                <title>Admin Dashboard | Article: {article.title}</title>
            </Head>
            <ArticlePreview article={article} />
        </AdminPage>
    );
};

export default ArticleViewPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { articleId } = ctx.query;
    if (!articleId || typeof articleId !== 'string') {
        return { notFound: true };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
    }

    // Fetch article from API
    const articleRes = await fetch(`${baseUrl}/api/articles/${articleId}`);
    if (!articleRes.ok) {
        return { notFound: true };
    }

    const article = await articleRes.json();

    return {
        props: {
            article,
        },
    };
};