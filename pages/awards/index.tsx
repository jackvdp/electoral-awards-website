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
                        <h2 className="mb-5 text-uppercase text-muted text-center">About</h2>

                        <p className="mb-5 px-lg-12 px-xl-15">
                            Welcome to the <strong>20th International Electoral Affairs Symposium & Awards Ceremony</strong>, taking place from <strong>September 30th to October 3rd, 2024</strong>. This prestigious four-day event will be held in collaboration with the <strong>International Centre for Parliamentary Studies</strong> and the <strong>Junta Central Electoral de la República Dominicana</strong>.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Join us as we convene leading experts and pioneers from the global electoral community to discuss, deliberate, and celebrate advancements in electoral management. The symposium serves as a platform to honor exceptional achievements and foster discussions on the future of electoral processes.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            Engage in enriching dialogues, participate in insightful panel discussions, and be part of the distinguished Awards Ceremony. This event is a unique opportunity to share knowledge, network with peers, and contribute to shaping the future of electoral democracy worldwide.
                        </p>

                        <h3 className="mt-10 mb-5 px-lg-12 px-xl-15">Key Links</h3>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            <a href="/awards/schedule" className="text-decoration-none">View the Schedule</a>
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            <a href="/awards/categories" className="text-decoration-none">Explore Award Categories</a>
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            <a href="/awards/submit" className="text-decoration-none">Submit a Nomination</a>
                        </p>
                    </div>

                    <Organisers />

                    <FAQ />

                </div>


            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export default AboutAwards;
