import type {NextPage} from 'next';
import {Fragment} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import CustomHead from 'components/common/CustomHead';
import PageProgress from 'components/common/PageProgress';
import EventSignupButton from 'components/blocks/awards/EventSignupButton';
import {AWARDS_EVENT_ID} from 'data/awards-config';
import {Workshop, workshopBookingLink, workshops} from 'data/workshops';

/**
 * Stock photography on this page is from Pexels (free licence, commercial use,
 * no attribution required):
 *   workshop-working-session.jpg  pexels.com/photo/32074897
 *   workshop-delegates.jpg        pexels.com/photo/33543226
 * nomos-poll-worker.jpg is the existing repo asset also used on /nomos.
 */


const WorkshopCard = ({workshop}: { workshop: Workshop }) => (
    <div className="card mb-8" id={workshop.id}>
        <div className="card-body p-6 p-md-8">

            <h3 className="mb-3">{workshop.title}</h3>

            <ul className="list-inline text-muted mb-5">
                <li className="list-inline-item me-4">
                    <i className="uil uil-clock pe-1"/>{workshop.duration}
                </li>
                <li className="list-inline-item me-4">
                    <i className="uil uil-map-marker pe-1"/>{workshop.venue}
                </li>
                <li className="list-inline-item">
                    <i className="uil uil-calendar-alt pe-1"/>{workshop.dates}
                </li>
            </ul>

            <p className="lead mb-6">{workshop.summary}</p>

            <div className="row gx-md-8 gy-6 align-items-center mb-6">
                <div className="col-md-5">
                    <Image
                        width={1600}
                        height={1067}
                        src="/img/photos/nomos-poll-worker.jpg"
                        alt="Polling staff overseeing a ballot box as a voter casts her vote at a polling place"
                        className="rounded"
                        style={{width: '100%', height: 'auto'}}
                    />
                </div>
                <div className="col-md-7">
                    {workshop.background.map((paragraph, i) => (
                        <p key={i} className={i === workshop.background.length - 1 ? 'mb-0' : 'mb-4'}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <p className="mb-6">{workshop.format}</p>

            <div className="row gx-md-8 gy-6 mb-6">
                <div className="col-md-6">
                    <h5 className="mb-3">What the session covers</h5>
                    <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
                        {workshop.covers.map((item, i) => (
                            <li key={i}>
                                <i className="uil uil-check"/><span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h5 className="mb-3">What you will take away</h5>
                    <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
                        {workshop.takeaways.map((item, i) => (
                            <li key={i}>
                                <i className="uil uil-check"/><span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="mb-5">
                Places are limited and we expect this session to be oversubscribed. If you would like to take
                part, please put your name down now rather than wait for the full programme.
            </p>

            <a
                className="btn btn-primary rounded-pill"
                href={workshopBookingLink(workshop)}
            >
                Reserve my place
            </a>

        </div>
    </div>
);

const Workshops: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="Workshops - 22nd International Electoral Awards"
                description="Hands-on workshops at the 22nd International Electoral Awards & Symposium, Manila, 29 November to 3 December 2026. Two-hour working sessions where delegates tackle a real electoral problem alongside peers from other jurisdictions."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={'Workshops'}/>

            <main className="content-wrapper">
                <section className="container wrapper py-md-10 py-5">

                    <div className="row">
                        <div className="col-lg-10 col-xl-9 mx-auto">

                            <h2 className="mb-5 text-uppercase text-muted text-center">
                                New for Manila 2026
                            </h2>

                            <p className="lead mb-5">
                                We are adding something new to this year&rsquo;s symposium in Manila:
                                hands-on workshops. These are two-hour working sessions where you tackle a
                                real electoral problem alongside peers from other jurisdictions, and leave
                                with material you can use at home.
                            </p>

                            <p className="mb-8">
                                This is the first time we have run them, and places at each session are
                                limited. The workshops below are open for bookings now. Further sessions
                                will be announced as the programme takes shape.
                            </p>

                            <Image
                                width={1800}
                                height={1200}
                                src="/img/photos/workshop-working-session.jpg"
                                alt="Delegates working through printed worksheets and coloured cards spread across a table"
                                className="rounded mb-10"
                                style={{width: '100%', height: 'auto'}}
                                priority
                            />

                            {workshops.map((workshop) => (
                                <WorkshopCard key={workshop.id} workshop={workshop}/>
                            ))}

                            <Image
                                width={1800}
                                height={1200}
                                src="/img/photos/workshop-delegates.jpg"
                                alt="Delegates seated at a conference table with papers, name badges and microphones"
                                className="rounded mt-4"
                                style={{width: '100%', height: 'auto'}}
                            />

                            <div className="text-center mt-10">
                                <h4 className="mb-3">Not yet registered for Manila?</h4>
                                <p className="mb-4">
                                    The symposium runs from 29 November to 3 December 2026 at The Manila
                                    Hotel, co-hosted with the Commission on Elections of the Philippines
                                    (COMELEC). Attendance is free and accommodation at The Manila Hotel is
                                    covered.
                                </p>
                                {AWARDS_EVENT_ID
                                    ? <EventSignupButton eventId={AWARDS_EVENT_ID}/>
                                    : (
                                        <Link className="btn btn-primary rounded-pill" href="/awards">
                                            About the Awards
                                        </Link>
                                    )}
                            </div>

                        </div>
                    </div>

                </section>
            </main>

            <Footer/>
        </Fragment>
    );
};

export default Workshops;
