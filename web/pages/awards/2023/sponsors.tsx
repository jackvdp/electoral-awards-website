import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import Sponsors from 'components/blocks/sponsors/Sponsors';
import PageProgress from 'components/common/PageProgress';

const JudgesPage: NextPage = () => {
    return (
        <Fragment>
            <PageProgress/>

            <Navbar />

            <SimpleBanner title={"Sponsors"} />

            <main className="content-wrapper">

                <Sponsors />

            </main>

            <Footer />
        </Fragment>
    );
};

export default JudgesPage;