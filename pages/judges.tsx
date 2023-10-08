import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import Judges from 'components/blocks/judges/Judges';

const JudgesPage: NextPage = () => {
    return (
        <Fragment>
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