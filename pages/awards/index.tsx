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
                title="22nd International Electoral Awards"
                description="Honouring excellence in electoral innovation and democratic integrity. The 22nd International Electoral Awards take place 25–28 November 2026 in Manila, Philippines."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper">

                <SimpleBanner title={"22nd International Electoral Awards"}></SimpleBanner>

                <div className="container pt-14 pt-md-16 pb-7 pt-md-8">

                    <div className='mb-5 mb-md-10'>
                        <h2 className="mb-5 text-uppercase text-muted text-center">About</h2>

                        <p className="mb-5 px-lg-12 px-xl-15">
                            Welcome to the <strong>22nd International Electoral Awards</strong>, taking place from <strong>25th to 28th November 2026</strong> in <strong>Manila, Philippines</strong>. This prestigious event is co-hosted by the <strong>Commission on Elections of the Philippines (COMELEC)</strong> and the <strong>International Centre for Parliamentary Studies (ICPS)</strong>.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Join leading electoral experts, innovators, and practitioners from across the globe to celebrate achievements in election management and explore the most pressing themes facing democracies today. This year&apos;s symposium themes include <strong>Electoral Innovation &amp; Technology in Asia-Pacific</strong> and <strong>Strengthening Public Trust &amp; Combating Disinformation</strong>.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            Through keynote addresses, panels, fringe events, and networking opportunities, this four-day gathering offers a platform to learn, connect, and shape the future of democratic processes worldwide.
                        </p>

                        <div className='px-lg-12 px-xl-15'>
                            <h3 className="mt-10 mb-5 ">Key Links</h3>
                            <ul>
                                {/*<li>*/}
                                {/*    <Link className="text-decoration-none" href="/events/TODO">Register for the event</Link>*/}
                                {/*</li>*/}
                                <li>
                                    <Link className="text-decoration-none" href="/awards/schedule">View the provisional schedule</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/categories">Explore award categories</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="#faq">FAQs</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/submit">Submit a Nomination</Link>
                                </li>
                            </ul>

                            <h3 className="mt-10 mb-5">Previous Years</h3>
                            <ul>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/2025/">21st International Electoral Awards (2025) — Gaborone, Botswana</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/2024/">20th International Electoral Awards (2024) — Santo Domingo, Dominican Republic</Link>
                                </li>
                                <li>
                                    <Link className="text-decoration-none" href="/awards/2023/about">19th International Electoral Awards (2023) — Cascais, Portugal</Link>
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
