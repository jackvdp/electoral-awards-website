import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import CTA from 'components/blocks/call-to-action/CTA';
import HomeHeader from 'components/blocks/home/HomeHeader';
import HomeEventsSidebar from 'components/blocks/home/HomeEventsSidebar';

const Home: NextPage = () => {

    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <HomeHeader />

                <div className="container py-5 py-md-10">

                    <div className="row">
                        <div className="col-md-8">
                            One of two columns
                        </div>
                        <div className="col-md-4">
                            <HomeEventsSidebar />
                        </div>
                    </div>

                </div>

                <CTA />

            </main>

            <Footer />
        </Fragment>
    );
};

export default Home;