// pages/events/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import { IEvent } from 'backend/models/event';
import { Fragment, useEffect } from 'react';
import PageProgress from 'components/common/PageProgress';
import { Navbar } from 'components/blocks/navbar';
import NextLink from 'components/reuseable/links/NextLink';
import { Footer } from 'components/blocks/footer';
import formatEventDates from 'helpers/formatEventDates';
import ReactMarkdown from 'react-markdown';
import EventsSidebar from 'components/blocks/events/EventsSidebar';
import { useAuth } from 'auth/AuthProvider';

interface EventPageProps {
    event: IEvent
}

const EventPage: NextPage<EventPageProps> = ({ event }) => {

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
                                        <NextLink href="#" className="hover" title={event.location} />
                                    </div>
                                    <h1 className="display-1 mb-4">{event.title}</h1>
                                    <ul className="post-meta mb-5">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt" />
                                            <span>{formatEventDates(event.startDate, event.endDate)}</span>
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
                        <div className="row gx-8 gx-xl-12">
                            <div className="col-md-8 mx-auto">
                                <ReactMarkdown>{event.description}</ReactMarkdown>
                            </div>
                            <div className="col-md-4 mx-auto">
                                <EventsSidebar />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    let event: IEvent;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        if (baseUrl === undefined) {
            throw new Error('Base URL is undefined')
        }
        const res = await fetch(`${baseUrl}/api/events/${id}`);
        if (!res.ok) {
            context.res.writeHead(302, { Location: '/404' });
            context.res.end();
            return { props: {} };
        }
        event = await res.json();
    } catch (err: any) {
        console.error(err.message);
        context.res.writeHead(302, { Location: '/404' });
        context.res.end();
        return { props: {} };
    }

    return {
        props: { event },
    };
};

export default EventPage;
