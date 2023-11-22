import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import Judges from 'components/blocks/judges/Judges';
import PageProgress from 'components/common/PageProgress';

const JudgesPage: NextPage = () => {
    return (
        <Fragment>
            <PageProgress/>

            <Navbar />

            <SimpleBanner title={"Judges"} />

            <main className="content-wrapper">

                <Judges />

            </main>

            <Footer />
        </Fragment>
    );
};

export default JudgesPage;