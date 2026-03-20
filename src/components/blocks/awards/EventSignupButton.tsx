import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useAuth} from 'auth/useAuth';
import {createMutableUserData} from 'backend/models/user';
import {createBookingAPI} from 'backend/use_cases/bookings/api/createBooking+SendConfirmation';

interface EventSignupButtonProps {
    eventId: string;
}

const EventSignupButton: React.FC<EventSignupButtonProps> = ({eventId}) => {
    const {isLoggedIn, currentUser} = useAuth();
    const [event, setEvent] = useState<any>(null);
    const [hasBooking, setHasBooking] = useState(false);
    const [signupStatus, setSignupStatus] = useState<null | 'success' | 'failed'>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                if (res.ok) {
                    setEvent(await res.json());
                }
            } catch {
                // Event not found — button stays hidden
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        if (!isLoggedIn || !currentUser) {
            setHasBooking(false);
            return;
        }
        const checkBooking = async () => {
            try {
                const res = await fetch(`/api/bookings/users/upcoming-bookings?userId=${currentUser.id}`);
                if (res.ok) {
                    const {data} = await res.json();
                    const match = data.find((b: any) => b.booking.eventId === eventId);
                    if (match) setHasBooking(true);
                }
            } catch {
                // Ignore — treat as no booking
            }
        };
        checkBooking();
    }, [isLoggedIn, currentUser, eventId]);

    const handleSignup = async () => {
        if (!isLoggedIn || !currentUser || !event) return;
        try {
            const result = await createBookingAPI({
                user: createMutableUserData(currentUser),
                event,
            });
            if (result) {
                setSignupStatus('success');
                setHasBooking(true);
            } else {
                setSignupStatus('failed');
            }
        } catch {
            setSignupStatus('failed');
        }
    };

    if (loading || !event) return null;
    if (new Date(event.endDate) < new Date()) return null;

    if (hasBooking || signupStatus === 'success') {
        return (
            <p className="text-success mt-2">
                You are registered for this event! Go to your{' '}
                <Link href="/account" className="hover">account</Link> page for more details.
            </p>
        );
    }

    if (!isLoggedIn || !currentUser) {
        return (
            <button
                data-bs-toggle="modal"
                data-bs-target="#modal-signin"
                className="btn btn-primary rounded-pill mt-4"
            >
                Register for the Awards
            </button>
        );
    }

    return (
        <>
            <button onClick={handleSignup} className="btn btn-primary rounded-pill mt-4">
                Register for the Awards
            </button>
            {signupStatus === 'failed' && (
                <p className="text-danger mt-2">There was a problem signing you up. Please try again.</p>
            )}
        </>
    );
};

export default EventSignupButton;
