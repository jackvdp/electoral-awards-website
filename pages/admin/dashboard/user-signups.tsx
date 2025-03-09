import {GetServerSideProps, NextPage} from 'next';
import React, {useEffect, useState} from 'react';
import {IEvent} from 'backend/models/event';
import {createClient} from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import {
    createMutableUserData,
    MutableUserData
} from "backend/models/user";
import ReusableForm, {InputItem} from "components/reuseable/Form";
import {IBooking} from "backend/models/booking";
import {getUserBookings} from "backend/use_cases/bookings/getUserBookings";
import {createBookingAPI} from "backend/use_cases/bookings/api/createBooking+SendConfirmation";
import {deleteBookingAPI} from "backend/use_cases/bookings/api/deleteBooking+SendConfirmation";
import {getAllEventsAPI} from "backend/use_cases/events/api/getEvents";

interface Signup { event: IEvent, booking: IBooking }
interface UserSignupsPageProps {
    userId: string;
    user: MutableUserData;
    signups: Signup[];
    events: IEvent[];
}

const UserSignupsPage: NextPage<UserSignupsPageProps> = ({userId, user, signups, events }) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [currentSignups, setCurrentSignups] = useState<Signup[]>([]);

    useEffect(() => {

        setCurrentSignups(signups);
    }, [signups]);

    const handleRemoveSignup = async (signup: Signup) => {
        try {
            await deleteBookingAPI({
                bookingId: signup.booking._id as string,
                user,
                event: signup.event
            });

            setCurrentSignups(prev =>
                prev.filter(oldSignup => oldSignup.booking._id !== signup.booking._id)
            );

            setAlertMessage('Signup removed successfully.');
        } catch (error: any) {
            setAlertMessage(error.message || 'Failed to remove signup.');
        }
    };

    const handleAddSignup = async (values: Record<string, string>) => {
        setAlertMessage(null);
        try {
            const event = events.find(ev => ev._id === values.event);
            if (!event) {
                setAlertMessage('Invalid event selected.');
                return;
            }

            // The createBookingAndSendConfirmation function returns the booking directly
            const booking = await createBookingAPI({
                user,
                event
            });

            console.log("****", booking);

            setAlertMessage('User signed up successfully.');

            // Update the current signups with the new signup
            const newSignup = { event, booking };
            setCurrentSignups(prev => [...prev, newSignup]);

        } catch (error: any) {
            setAlertMessage(error.message || 'Failed to add signup.');
        }
    };

    // Compute available events to add (exclude those already signed up)
    const availableForSignup = events.filter(event =>
        !currentSignups.some(signup => signup.event._id === event._id)
    ).sort((a, b) => {
        return (a.startDate < b.startDate) ? 1 : -1;
    })

    const addInputItems: InputItem[] = [
        {
            title: 'Select Event',
            placeholder: 'Select an event',
            type: 'select',
            name: 'event',
            defaultValue: '',
            required: false,
            options: availableForSignup.map(ev => ({
                label: new Date(ev.startDate).toLocaleDateString("en-GB") + " – " + ev.title,
                value: ev._id as string,
            })),
        },
    ];

    return (
        <AdminPage title={"Signups: " + user?.firstname + " " + user?.lastname}>
            <div>
                <h1 className="mb-4">User Event Signups</h1>
                {alertMessage && <p className="text-info">{alertMessage}</p>}

                <hr className="my-8"/>

                {/* Current Signups */}
                <div className="mb-4">
                    <h5>Currently Signed Up Events:</h5>
                    {currentSignups.length === 0 ? (
                        <p>No current signups.</p>
                    ) : (
                        <ul className="list-group">
                            {currentSignups.map(signup => (
                                <li key={signup.booking._id as string}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    {signup.booking._id as string}
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveSignup(signup)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <hr className="my-8"/>

                {/* Add Signup Form */}
                <div>
                    <h5>Add Event Signup:</h5>
                    <ReusableForm
                        inputItems={addInputItems}
                        submitButtonTitle="Add Signup"
                        onSubmit={handleAddSignup}
                        disableSubmitInitially={false}
                    />
                </div>
            </div>
        </AdminPage>
    );
};

export default UserSignupsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const {data: {session}} = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const {userId} = ctx.query;
    if (!userId || typeof userId !== 'string') {
        return {notFound: true};
    }


    const {data, error} = await supabase.auth.admin.getUserById(userId);
    if (error || !data.user) {
        return {notFound: true};
    }

    const user: MutableUserData = createMutableUserData(data.user);

    const { bookings } = await getUserBookings({ userId });
    const eventIds = bookings.map(booking => booking.eventId);
    const events: IEvent[] = await getAllEventsAPI()

    // Create a lookup map for faster access
    const bookingMap = new Map();
    bookings.forEach(booking => {
        bookingMap.set(booking.eventId, booking);
    });

    const signups = events
        .filter(event => eventIds.includes(event._id as string))
        .map(event => ({
            event,
            booking: bookingMap.get(event._id as string)
        }));

    return {
        props: {
            userId,
            user: user,
            events: JSON.parse(JSON.stringify(events)),
            signups: JSON.parse(JSON.stringify(signups))
        },
    };
};