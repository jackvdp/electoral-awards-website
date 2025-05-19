import FAQ from 'components/blocks/faq/FAQ';
import Organisers from 'components/blocks/organisers/Organisers';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import CustomHead from "components/common/CustomHead";
import Link from 'next/link';
import { Fragment } from 'react';
import PageProgress from 'components/common/PageProgress';
import {Navbar} from 'components/blocks/navbar';
import Footer from 'components/blocks/footer/Footer';
import type { NextPage } from 'next';
import organisers from "data/organisers";
import {FAQs} from "../../src/data/faq";


const AboutAwards: NextPage = () => {

    return (
        <Fragment>
            <CustomHead
                title="21st International Electoral Awards"
                description="Honouring excellence in electoral innovation and democratic integrity. Celebrating leadership in election administration, inclusion, and transparency."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper">

                <SimpleBanner title={"21st International Electoral Awards"}></SimpleBanner>

                <div className="container pt-14 pt-md-16 pb-7 pt-md-8">

                    <div className='mb-5 mb-md-10'>
                        <h2 className="mb-5 text-uppercase text-muted text-center">About</h2>

                        <p className="mb-5 px-lg-12 px-xl-15">
                            Welcome to the <strong>21st International Electoral Awards</strong>, taking place from <strong>October 1st to 4th, 2025</strong> in <strong>Gaborone, Botswana</strong>. This prestigious event is co-hosted by the <strong>Independent Electoral Commission of Botswana</strong> and the <strong>International Centre for Parliamentary Studies (ICPS)</strong>.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Join leading electoral experts, innovators, and practitioners from across the globe to celebrate achievements in election management and explore the most pressing themes facing democracies today. While the core focus is the distinguished Awards Ceremony, the programme will include rich discussions on electoral integrity, inclusion, and technology.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            Through keynote addresses, panels, fringe events, and networking opportunities, this four-day gathering offers a platform to learn, connect, and shape the future of democratic processes worldwide.
                        </p>

                        <div className='px-lg-12 px-xl-15'>
                            <h3 className="mt-10 mb-5 ">Key Links</h3>
                            <ul>
                                <li>
                                    <Link className="text-decoration-none" href="/events/67ead7682ef2a52cc08dbb1c">Register for the event</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/schedule">View the schedule</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/categories">Explore award categories</Link>
                                </li>
                                {/*<li>*/}
                                {/*    <Link className="text-decoration-none" href="/awards/location">Book your hotel</Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link className="text-decoration-none" href="/awards/visa">Visa Requirements</Link>*/}
                                {/*</li>*/}
                                <li>
                                    <Link className="text-decoration-none" href="#faq">FAQs</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/submit">Submit a Nomination</Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <Organisers organisers={organisers}/>

                    <section id="faq">
                        <FAQ questions={FAQs}/>
                    </section>

                </div>
            </main>

            <Footer/>
        </Fragment>
    );
};

export default AboutAwards;
