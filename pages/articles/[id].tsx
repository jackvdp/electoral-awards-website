import { GetServerSideProps, NextPage } from 'next';
import { Fragment, useEffect } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import BlogDetailsTemplate from 'components/blocks/article/ArticleDetails';
import Article, { IArticle } from 'backend/models/article';
import formatDate from 'helpers/formatArticleDate';
import dbConnect from 'backend/mongo/mongo';

export interface ArticleProps {
    category: string;
    image: string;
    title: string;
    description: string;
    date: string;
    content: string;
}

interface Params extends ParsedUrlQuery {
    id: string;
}

const ArticlePage: NextPage<ArticleProps> = (props) => {

    // const router = useRouter()
    // const { isLoggedIn, isLoadingLogInInfo } = useAuth()

    // useEffect(() => {
    //     if (!isLoggedIn && !isLoadingLogInInfo) {
    //         router.push('/join-to-access');
    //     }
    // }, [isLoggedIn, isLoadingLogInInfo]);

    return (
        <Fragment>
            <PageProgress />

            {/* ========== header section ========== */}
            <Navbar />

            <main className="content-wrapper ">
                {/* ========== title section ========== */}
                <section className="wrapper bg-soft-primary">
                    <div className="container pt-10 pb-19 pt-md-14 pb-md-20 text-center">
                        <div className="row">
                            <div className="col-md-10 col-xl-8 mx-auto">
                                <div className="post-header">
                                    {/* <div className="post-category text-line">
                                        <NextLink href="#" className="hover" title={props.category} />
                                    </div> */}

                                    <h1 className="display-1 mb-4">{props.title}</h1>

                                    <ul className="post-meta mb-5">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt" />
                                            <span>{formatDate(props.date)}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== details section ========== */}
                <section className="wrapper bg-light">
                    <div className="container pb-14 pb-md-16">
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <div className="blog single mt-n17">
                                    <BlogDetailsTemplate
                                        category={props.category}
                                        image={props.image}
                                        title={props.title}
                                        description={props.description}
                                        date={props.date}
                                        content={props.content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps<ArticleProps, Params> = async ({ params }) => {
    dbConnect();
    const articleId = params?.id;

    if (articleId) {
        let article = await Article.findById(articleId).lean() as IArticle;
        article = JSON.parse(JSON.stringify(article));

        if (article) {
            return {
                props: {
                    ...article
                },
            };
        }
    }

    return {
        props: {},
        notFound: true,
    };
};

export default ArticlePage;