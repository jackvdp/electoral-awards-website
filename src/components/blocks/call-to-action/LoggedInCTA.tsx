import React, { useEffect, useState } from 'react';
import { useAuth } from 'auth/useAuth';
import NextLink from 'components/reuseable/links/NextLink';
import formatEventDates from 'helpers/formatEventDates';

interface BookingWithEvent {
    booking: { _id: string };
    event: {
        _id: string;
        title: string;
        startDate: string;
        endDate: string;
    };
}

const LoggedInCTA: React.FC = () => {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!currentUser?.id) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`/api/bookings/users/upcoming-bookings?userId=${currentUser.id}`);
                const result = await response.json();
                if (result.success) {
                    setBookings(result.data);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentUser]);

    return (
        <section className="wrapper bg-light">
            <div className="container py-14 py-md-16">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2 className="display-4 mb-3 text-center">Your Events</h2>

                        {loading ? (
                            <p className="text-center text-muted">Loading...</p>
                        ) : bookings.length > 0 ? (
                            <>
                                <p className="lead text-center mb-8">
                                    You&apos;re registered for the following upcoming events.
                                </p>
                                <div className="card mb-8">
                                    <ul className="list-group list-group-flush">
                                        {bookings.map((item) => (
                                            <li
                                                key={item.event._id}
                                                className="list-group-item d-flex justify-content-between align-items-center py-4 px-5"
                                            >
                                                <div>
                                                    <a className="hover fw-bold" href={`/events/${item.event._id}`}>
                                                        {item.event.title}
                                                    </a>
                                                    <div className="text-muted mt-1">
                                                        <i className="uil uil-calendar-alt me-1" />
                                                        {formatEventDates(item.event.startDate, item.event.endDate)}
                                                    </div>
                                                </div>
                                                <NextLink
                                                    href={`/events/${item.event._id}`}
                                                    title="View"
                                                    className="btn btn-sm btn-soft-primary rounded-pill"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="lead text-center mb-8">
                                You haven&apos;t registered for any upcoming events yet. Browse our events to find your next one.
                            </p>
                        )}

                        <div className="text-center d-flex flex-column flex-md-row justify-content-center gap-3">
                            <NextLink
                                href="/account"
                                title="Your Profile"
                                className="btn btn-lg btn-primary rounded-pill"
                            />
                            <NextLink
                                href="/events"
                                title="Browse Events"
                                className="btn btn-lg btn-outline-primary rounded-pill"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoggedInCTA;
