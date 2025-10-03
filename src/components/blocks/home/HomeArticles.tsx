import React, { useEffect, useState } from 'react';
import { BlogCard3 } from 'components/reuseable/blog-cards';
import NextLink from 'components/reuseable/links/NextLink';

interface Article {
    _id: string;
    title: string;
    image: string;
    category: string;
    description: string;
    date: string;
}

const HomeArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/articles');
                if (response.ok) {
                    const data = await response.json();
                    // Get the latest 4 articles, sorted by date
                    const sortedArticles = data
                        .sort((a: Article, b: Article) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 4);
                    setArticles(sortedArticles);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <section className="wrapper bg-light">
                <div className="container py-14 py-md-16">
                    <div className="row text-center">
                        <div className="col-12">
                            <p>Loading articles...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) {
        return null; // Don't render anything if no articles
    }

    return (
        <section className="wrapper bg-light">
            <div className="container py-14 py-md-16">
                <div className="row text-center">
                    <div className="col-md-10 col-xl-8 mx-auto">
                        <h2 className="display-4 mb-3">Latest Insights</h2>
                        <p className="lead fs-lg mb-10">
                            Stay informed with our latest articles on professional development, 
                            public service excellence, and industry best practices.
                        </p>
                    </div>
                </div>

                <div className="row gx-md-8 gy-8 mb-8">
                    {articles.map((article) => (
                        <BlogCard3
                            key={article._id}
                            {...article}
                            link={`/articles/${article._id}`}
                        />
                    ))}
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <NextLink
                            href="/articles"
                            title="View All Articles"
                            className="btn btn-primary btn-lg rounded-pill"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeArticles;
