import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import PageProgress from 'components/common/PageProgress';

const SubmitNomination: NextPage = () => {
    return (
        <Fragment>
            <PageProgress/>

            <Navbar />

            <SimpleBanner title={"Submit a Nomination"} />

            <main className="content-wrapper">

                <p className='p-md-20 p-10 text-center'>
                    <b>The window for submitting a nomination has now closed.</b><br/> The winners of each award will be announced at the International Electoral Awards Ceremony, Wednesday 15th November 2023.                
                </p>

            </main>

            <Footer />
        </Fragment>
    );
};

export default SubmitNomination;