import {NextPage} from 'next';
import Link from 'next/link';
import {Fragment} from 'react';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import FAQ from 'components/blocks/faq/FAQ';
import Organisers from 'components/blocks/organisers/Organisers';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import CustomHead from "../../src/components/common/CustomHead";

const AboutAwards: NextPage = () => {

    return (
        <Fragment>
            <CustomHead
                title="20th International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper">

                <SimpleBanner title={"20th International Electoral Awards"}></SimpleBanner>

                <div className="container pt-14 pt-md-16 pb-7 pt-md-8">

                    <div className='mb-5 mb-md-10'>
                        <h2 className="mb-5 text-uppercase text-muted text-center">About</h2>

                        <p className="mb-5 px-lg-12 px-xl-15">
                            Welcome to the <strong>20th International Electoral Affairs Symposium & Awards
                            Ceremony</strong>, taking place from <strong>December 15th to 18th, 2024</strong>. This
                            prestigious four-day event will be held in collaboration with the <strong>International
                            Centre for Parliamentary Studies</strong> and the <strong>Junta Central Electoral de la
                            República Dominicana</strong>.
                        </p>
                        <p className="mb-5 px-lg-12 px-xl-15">
                            Join us as we convene leading experts and pioneers from the global electoral community to
                            discuss, deliberate, and celebrate advancements in electoral management. The symposium
                            serves as a platform to honor exceptional achievements and foster discussions on the future
                            of electoral processes.
                        </p>
                        <p className="px-lg-12 px-xl-15">
                            Engage in enriching dialogues, participate in insightful panel discussions, and be part of
                            the distinguished Awards Ceremony. This event is a unique opportunity to share knowledge,
                            network with peers, and contribute to shaping the future of electoral democracy worldwide.
                        </p>

                        <div className='px-lg-12 px-xl-15'>
                            <h3 className="mt-10 mb-5 ">Key Links</h3>
                            <ul>
                                <li className="">
                                    <Link className="text-decoration-none" href="/events/66211b8c90317b890e2f468d">Event
                                        details</Link>
                                </li>
                                <li className="">
                                    <Link className="text-decoration-none" href="/awards/schedule">View the
                                        schedule</Link>
                                </li>
                                <li className="">
                                    <Link className="text-decoration-none" href="/awards/categories">Explore award
                                        categories</Link>
                                </li>
                                <li className="">
                                    <Link className="text-decoration-none" href="/awards/location">Book your
                                        hotel</Link>
                                </li>
                                <li className="">
                                    <Link href="/awards/visa" className="text-decoration-none">Visa Requirements</Link>
                                </li>
                                <li className="">
                                    <Link className="text-decoration-none" href="#faq">
                                        FAQs
                                    </Link>
                                </li>
                                {/* <li className="">
                                    <Link href="/awards/submit" className="text-decoration-none">Submit a Nomination</Link>
                                </li> */}
                            </ul>
                        </div>

                    </div>

                    <Organisers/>

                    <section id="faq">
                        <FAQ/>
                    </section>

                </div>


            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

export default AboutAwards;
