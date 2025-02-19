// pages/events/[id].tsx
import {GetServerSideProps, NextPage} from 'next';
import {IEvent} from 'backend/models/event';
import {Fragment, useEffect, useState} from 'react';
import PageProgress from 'components/common/PageProgress';
import {Navbar} from 'components/blocks/navbar';
import NextLink from 'components/reuseable/links/NextLink';
import {Footer} from 'components/blocks/footer';
import formatEventDates from 'helpers/formatEventDates';
import ReactMarkdown from 'react-markdown';
import EventsSidebar from 'components/blocks/events/EventsSidebar';
import CustomHead from '../../src/components/common/CustomHead';
import {useAuth} from '../../src/auth/useAuth';

interface EventPageProps {
    event: IEvent;
}

const EventPage: NextPage<EventPageProps> = ({event}) => {
    const {isLoggedIn, currentUser} = useAuth();
    const [signupStatus, setSignupStatus] = useState<null | 'success' | 'failed'>(null);
    const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

    // Check if the user is already signed up when component mounts or event changes
    useEffect(() => {
        if (isLoggedIn && currentUser && event.signups) {
            setIsSignedUp(event.signups.includes(currentUser.id));
        }
    }, [isLoggedIn, currentUser, event]);

    const handleSignup = async () => {
        if (!isLoggedIn || !currentUser) return;

        try {
            const response = await fetch('/api/events/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({eventId: event._id, userId: currentUser.id})
            });
            const data = await response.json();
            if (response.ok) {
                setSignupStatus('success');
                setIsSignedUp(true);
            } else {
                setSignupStatus('failed');
            }
        } catch (error) {
            setSignupStatus('failed');
        }
    };

    // Helper to render the sign-up section
    const renderSignupSection = () => {
        if (!isLoggedIn || !currentUser) return null;
        if (isSignedUp) {
            return <p className="text-success mt-2">You are already signed up for this event!</p>;
        }
        return (
            <>
                <button onClick={handleSignup} className="btn btn-primary mt-4">
                    Sign Up for Event
                </button>
                {signupStatus === 'failed' && (
                    <p className="text-danger mt-2">There was a problem signing you up.</p>
                )}
            </>
        );
    };

    return (
        <Fragment>
            <CustomHead title={event.title} description={event.description}/>
            <PageProgress/>
            <Navbar/>

            <main className="content-wrapper">
                {/* ========== title section ========== */}
                <section className="wrapper bg-soft-primary">
                    <div className="container pt-8 pb-8 pt-md-12 pb-md-12 text-center">
                        <div className="row">
                            <div className="col-md-10 col-xl-8 mx-auto">
                                <div className="post-header">
                                    <div className="post-category text-line">
                                        <NextLink href="#" className="hover" title={event.location}/>
                                    </div>
                                    <h1 className="display-1 mb-4">{event.title}</h1>
                                    <ul className="post-meta mb-5">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt"/>
                                            <span>{formatEventDates(event.startDate, event.endDate)}</span>
                                        </li>
                                    </ul>
                                    {renderSignupSection()}
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
                                {/* Sign-up section at the bottom of the event details */}
                                {renderSignupSection()}
                            </div>
                            <div className="col-md-4 mx-auto">
                                <EventsSidebar/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.params as { id: string };
    let event: IEvent;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
            throw new Error('Base URL is undefined');
        }
        const res = await fetch(`${baseUrl}/api/events/${id}`);
        if (!res.ok) {
            context.res.writeHead(302, {Location: '/404'});
            context.res.end();
            return {props: {}};
        }
        event = await res.json();
    } catch (err: any) {
        console.error(err.message);
        context.res.writeHead(302, {Location: '/404'});
        context.res.end();
        return {props: {}};
    }

    return {
        props: {event}
    };
};

export default EventPage;