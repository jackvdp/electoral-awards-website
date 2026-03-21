import {NextPage} from 'next';
import {Fragment, useEffect, useRef} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Register from 'components/blocks/register/Register';
import {useRouter} from 'next/router';
import {useAuth} from 'auth/useAuth';
import CustomHead from 'components/common/CustomHead';
import {AWARDS_EVENT_ID} from 'data/awards-config';
import {createMutableUserData} from 'backend/models/user';
import {createBookingAPI} from 'backend/use_cases/bookings/api/createBooking+SendConfirmation';

const RegisterAwardsPage: NextPage = () => {
    const router = useRouter();
    const {isLoggedIn, currentUser} = useAuth();
    const hasBooked = useRef(false);

    useEffect(() => {
        if (!isLoggedIn || !currentUser || !AWARDS_EVENT_ID || hasBooked.current) return;
        hasBooked.current = true;

        const registerForEvent = async () => {
            try {
                const eventRes = await fetch(`/api/events/${AWARDS_EVENT_ID}`);
                if (!eventRes.ok) return;
                const event = await eventRes.json();

                // Check if already booked
                const bookingsRes = await fetch(`/api/bookings/users/upcoming-bookings?userId=${currentUser.id}`);
                if (bookingsRes.ok) {
                    const {data} = await bookingsRes.json();
                    const alreadyBooked = data.find((b: any) => b.booking.eventId === AWARDS_EVENT_ID);
                    if (alreadyBooked) {
                        router.push('/account');
                        return;
                    }
                }

                await createBookingAPI({
                    user: createMutableUserData(currentUser),
                    event,
                });
            } catch {
                // Booking failed — still redirect to account
            }
            router.push('/account');
        };

        registerForEvent();
    }, [isLoggedIn, currentUser]);

    return (
        <Fragment>
            <CustomHead
                title="Register for the Awards"
                description="Create an account and register for the 22nd International Electoral Awards & Symposium, 29 November – 3 December 2026 in Manila, Philippines."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper bg-gray">
                <div className="container py-14 py-md-16">
                    <Register
                        heading="Register for the Awards"
                        description="Create an account to register for the 22nd International Electoral Awards & Symposium (29 November – 3 December 2026, Manila, Philippines). Once registered, you will automatically be signed up for the event."
                    />
                </div>
            </main>

            <Footer/>
        </Fragment>
    );
};

export default RegisterAwardsPage;
