import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import WebinarMain from 'components/blocks/events/EventsIntro';
import HomeEventsSidebar from 'components/blocks/events/EventsSidebar';
import { useAuth } from 'auth/AuthProvider';
import CTA from 'components/blocks/call-to-action/CTA';

const BlogTwo: NextPage = () => {

    const { isLoggedIn } = useAuth()

    return (
        <Fragment>
            <PageProgress />

            {/* ========== header section ========== */}
            <Navbar />

            <main className="content-wrapper">
                {/* ========== title section ========== */}
                <section className="overflow-hidden">
                    <div className="wrapper bg-soft-primary">
                        <div className="container py-12 py-md-16 text-center">
                            <div className="row">
                                <div className="col-md-7 col-lg-6 col-xl-5 mx-auto">
                                    <h1 className="display-1 mb-3">Events</h1>
                                    <p className="lead px-lg-5 px-xxl-8 mb-1">
                                        Bringing Experts and Leaders Together in a Curated Calendar of Premier Electoral Events and Insightful Webinars.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="wrapper bg-light">
                    <div className="container py-14 py-md-16">
                        <div className="row gx-8 gy-6 gx-xl-12">
                            <WebinarMain />
                            <HomeEventsSidebar ignoreLimit={true} />
                        </div>
                    </div>
                </section>

                {!isLoggedIn && <CTA />}
            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export default BlogTwo;

export interface WebinarProp {
    id: number;
    time: string;
    date: string;
    image: string;
    title: string;
    subtitle: string
    description: string
    learning: string
    youtubeVideo: string
}