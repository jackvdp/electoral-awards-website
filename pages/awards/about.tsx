import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import FAQ from 'components/blocks/faq/FAQ';
import Organisers from 'components/blocks/organisers/Organisers';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';

const AboutAwards: NextPage = () => {

    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">

                <SimpleBanner title={"20th International Electoral Awards"}></SimpleBanner>
                
                <div className="container pt-14 pt-md-16 pb-7 pt-md-8">

                    <div className='mb-15'>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Welcome to the 20th International Electoral Affairs Symposium &amp; Awards Ceremony, a four-day event held from <b>30th September to 3rd October 2024.</b>
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            This event is organized by the <b>International Centre for Parliamentary Studies</b> in collaboration with the <b>Junta Central Electoral de la República Dominicana</b>, and will draw together leading figures in the world of electoral affairs, and recognise excellence in electoral management.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            {"Be part of the dynamic dialogue, participate in enlightening panel discussions, and join us in celebrating the significant contributions to electoral democracy at the prestigious Awards Ceremony. Don't miss this exclusive opportunity to engage, share, and learn with global peers."}
                        </p >
                    </div>

                    <FAQ />

                </div>

                <Organisers />

            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export default AboutAwards;
