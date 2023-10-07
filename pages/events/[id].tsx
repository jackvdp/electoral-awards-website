import { NextPage } from 'next';
import { Fragment } from 'react';
import { FC } from 'react';
import PageProgress from 'components/common/PageProgress';
import { events, Event } from 'data/events';
import { GetServerSidePropsContext } from 'next';
import { Footer } from 'components/blocks/footer';
import { Navbar } from 'components/blocks/navbar';
import NextLink from 'components/reuseable/links/NextLink';

interface EventDetailsProps {
    event: Event;
}

const EventPage: NextPage<EventDetailsProps> = ({ event }) => {
    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                {/* ========== title section ========== */}
                <section className="wrapper bg-soft-primary">
                    <div className="container pt-8 pb-8 pt-md-12 pb-md-12 text-center">
                        <div className="row">
                            <div className="col-md-10 col-xl-8 mx-auto">
                                <div className="post-header">
                                    <div className="post-category text-line">
                                        <NextLink href="#" className="hover" title={event.type} />
                                    </div>
                                    <h1 className="display-1 mb-4">{event.title}</h1>
                                    <ul className="post-meta mb-5">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt" />
                                            <span>{event.time}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== details section ========== */}
                <section className="wrapper bg-light">
                    <div className="container py-6 py-md-8">
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <EventDetailsComponent event={event} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export default EventPage

const EventDetailsComponent: FC<EventDetailsProps> = ({ event }) => {

    return (
        <div className="card">
            <div className="card-body">
                <div className="classic-view">
                    <article className="post">
                        <div className="post-content mb-5">
                            {event.overview && <p>Overview: {event.overview}</p>}
                            {event.talkTopic && <p>Talk Topic: {event.talkTopic}</p>}

                            <div className="speakers-section">
                                <h5 className='pb-2'>Speakers:</h5>
                                <ol>
                                    {event.speakers.map((speaker, index) => (
                                        <li key={index} className="speaker-item">
                                            <p>{speaker.name}</p>
                                            <p className="speaker-title">{speaker.title}</p>
                                            {speaker.organization && <p className="speaker-organization">{speaker.organization}</p>}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}


export const getServerSideProps = (context: GetServerSidePropsContext) => {
    const eventId = parseInt(context.params!.id as string); // Assuming the page path is /events/[id], where id is an index
    const event = events[eventId];

    if (!event) {
        return { notFound: true }; // If the event is not found, render the 404 page
    }

    return { props: { event } };
}