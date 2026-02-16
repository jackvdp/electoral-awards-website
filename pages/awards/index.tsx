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
                        <h2 className="mb-5 text-uppercase text-muted text-center">The Premier Global Electoral Event</h2>

                        <p className="mb-5 px-lg-12 px-xl-15">
                            For over two decades, the <strong>International Electoral Awards &amp; Symposium</strong> has been the foremost gathering for electoral professionals worldwide. The <strong>22nd edition</strong> takes place from <strong>25th to 28th November 2026</strong> in <strong>Manila, Philippines</strong>, co-hosted by the <strong>Commission on Elections of the Philippines (COMELEC)</strong> and the <strong>International Centre for Parliamentary Studies (ICPS)</strong>.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Building on 21 years of success, the 2026 event promises to be the <strong>largest and most ambitious yet</strong>. This will be the <strong>only international electoral symposium of its kind this year</strong> &mdash; an unmissable opportunity for election management bodies, technology providers, civil society organisations, and anyone committed to strengthening democratic processes around the world.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            <strong>New for 2026:</strong> alongside the main symposium programme, this year will feature <strong>dedicated breakout sessions</strong> &mdash; offering fresh opportunities to engage in focused discussions, hands-on demonstrations, and peer-to-peer exchanges. Whether you want to dive deeper into a specific topic or connect directly with fellow practitioners and innovators, these sessions are designed to maximise your experience.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            The symposium programme will cover a <strong>wide range of topics impacting the electoral community</strong>. Confirmed topics will be announced shortly &mdash; watch this space as the programme takes shape over the coming weeks.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            Whether you are an electoral commission looking to showcase your innovations, a technology provider seeking to connect with decision-makers, or a practitioner wanting to learn from global best practice &mdash; <strong>Manila 2026 is the place to be</strong>.
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
