import Image from 'next/image';
import {NextPage} from 'next';
import {Fragment} from 'react';
// -------- custom component -------- //
import {Footer} from 'components/blocks/footer';
import {Navbar} from 'components/blocks/navbar';
import {BlogCard2, BlogCard3} from 'components/reuseable/blog-cards';
import PageProgress from 'components/common/PageProgress';
// -------- data -------- //
import {GetServerSideProps} from 'next';
import Article, {IArticle} from 'backend/models/article';
import dbConnect from 'backend/mongo';

export interface ArticlesProps {
    articles: IArticle[];
}

const ArticlesPage: NextPage<ArticlesProps> = ({articles}) => {
    const sortedArticles = articles.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

    return (
        <Fragment>
            <PageProgress/>

            {/* ========== header section ========== */}
            <Navbar/>

            <main className="content-wrapper">
                {/* ========== title section ========== */}
                <section className="wrapper bg-soft-primary">
                    <div className="container pt-10 pb-19 pt-md-14 pb-md-20 text-center">
                        <div className="row">
                            <div className="col-md-7 col-lg-6 col-xl-5 mx-auto">
                                <h1 className="display-1 mb-3">Articles</h1>
                                <p className="lead px-lg-5 px-xxl-8">
                                    Discover Expert Perspectives: In-Depth Articles Exploring the World of Elections
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="wrapper bg-light">
                    <div className="container pb-14 pb-md-16">
                        <div className="row">
                            <div className="col-lg-10 mx-auto">

                                {/* Latest item is big */}
                                {
                                    sortedArticles.length > 0 && (
                                        <div className="blog classic-view mt-n17">
                                            <BlogCard2
                                                link={"/articles/" + articles[0]._id.toString()}
                                                category={articles[0].category}
                                                title={articles[0].title}
                                                description={articles[0].description}
                                                date={articles[0].date}
                                                cardTop={
                                                    <figure className="card-img-top overlay overlay-1 hover-scale">
                                                        {/* <a className="link-dark" href={articles[0].link}>
                              {
                                articles[0].image && <Image width={960} height={600} src={articles[0].image} alt="blog" layout="responsive" />
                              }
                              <span className="bg" />
                            </a> */}

                                                        <figcaption>
                                                            <h5 className="from-top mb-0">Read More</h5>
                                                        </figcaption>
                                                    </figure>
                                                }
                                            />
                                        </div>
                                    )
                                }

                                {/* Other items are smaller */}
                                {
                                    sortedArticles.length > 1 && (
                                        <div className="blog grid grid-view">
                                            <div className="row isotope gx-md-8 gy-8 mb-8">
                                                {articles.slice(1).map((item, index) => (
                                                    <BlogCard3 {...item} link={'/articles/' + item._id.toString()}
                                                               key={index}/>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

export default ArticlesPage;

export const getServerSideProps: GetServerSideProps<ArticlesProps> = async () => {
    await dbConnect();
    let articles = await Article.find().lean() as IArticle[];

    articles = articles.map(article => ({
        ...article,
        _id: article._id.toString()
    })) as IArticle[];

    if (articles.length) {
        return {
            props: {articles},
        };
    } else {
        return {
            notFound: true,
        };
    }
};