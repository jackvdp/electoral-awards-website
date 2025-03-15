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
import Head from 'next/head';
import UserInvitationsList from "components/blocks/admin/invitations/InvitationsList";
import {getInvitations} from 'backend/use_cases/bookings/api/getInvitations';
import {createInvitationAndSendConfirmation} from 'backend/use_cases/bookings/api/createInvitation+SendConfirmation';
import UserSignUpsList from "components/blocks/admin/invitations/SignupsList";
import TabNavigation from "components/blocks/admin/invitations/TabNavigation";
import {getUserBookingsAPI} from "backend/use_cases/bookings/api/getUserBookings";

interface Signup {
    event: IEvent,
    booking: IBooking
}

interface UserSignupsPageProps {
    userId: string;
    user: MutableUserData;
    signups: Signup[];
    events: IEvent[];
    invitations: IBooking[];
}

const UserSignupsPage: NextPage<UserSignupsPageProps> = ({userId, user, signups, events, invitations}) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [currentSignups, setCurrentSignups] = useState<Signup[]>([]);
    const [currentInvitations, setCurrentInvitations] = useState<IBooking[]>(invitations);
    const [activeTab, setActiveTab] = useState<'signup' | 'invite'>('signup');

    useEffect(() => {
        setCurrentSignups(signups);
    }, [signups]);

    useEffect(() => {
        setCurrentInvitations(invitations);
    }, [invitations]);

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

    // Common function to handle event selection validation and error handling
    const handleEventAction = async (values: Record<string, string>, actionType: 'signup' | 'invite') => {
        setAlertMessage(null);
        try {
            const event = events.find(ev => ev._id === values.event);
            if (!event) {
                setAlertMessage('Invalid event selected.');
                return;
            }

            if (actionType === 'signup') {
                // Handle signup
                const booking = await createBookingAPI({user, event});
                setAlertMessage('User signed up successfully.');

                // Update the current signups with the new signup
                const newSignup = {event, booking};
                setCurrentSignups(prev => [...prev, newSignup]);
            } else {
                // Handle invitation
                const booking = await createInvitationAndSendConfirmation({user, event});
                setAlertMessage('Invitation sent successfully.');

                // Update the current invitations list
                setCurrentInvitations(prev => [...prev, booking]);

                // Refresh invitations from server
                refreshInvitations();
            }
        } catch (error: any) {
            const action = actionType === 'signup' ? 'add signup' : 'send invitation';
            setAlertMessage(error.message || `Failed to ${action}.`);
        }
    };

    const handleAddSignup = async (values: Record<string, string>) => {
        await handleEventAction(values, 'signup');
    };

    const handleInviteUser = async (values: Record<string, string>) => {
        await handleEventAction(values, 'invite');
    };

    const refreshInvitations = async () => {
        try {
            const {bookings} = await getInvitations(userId);
            setCurrentInvitations(bookings);
        } catch (error) {
            console.error('Failed to refresh invitations:', error);
        }
    };

    const refreshSignups = async () => {
        try {
            const {bookings} = await getUserBookingsAPI({userId});
            // Filter accepted bookings
            const acceptedBookings = bookings.filter(booking => booking.status === 'accepted');

            // Create updated signups with event data
            const updatedSignups = acceptedBookings.map(booking => {
                const event = events.find(e => e._id === booking.eventId);
                if (!event) return null;
                return {event, booking};
            }).filter(Boolean) as Signup[];

            setCurrentSignups(updatedSignups);
        } catch (error) {
            console.error('Failed to refresh signups:', error);
        }
    };

    // Filter out events that the user is already signed up for or invited to
    const getAvailableEvents = () => {
        const signedUpEventIds = currentSignups.map(signup => signup.event._id);
        const invitedEventIds = currentInvitations.map(invitation => invitation.eventId);

        return events.filter(event =>
            !signedUpEventIds.includes(event._id) &&
            !invitedEventIds.includes(event._id as string)
        ).sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
    };

    // Create event options for both forms
    const eventOptions = getAvailableEvents().map(ev => ({
        label: new Date(ev.startDate).toLocaleDateString("en-GB") + " – " + ev.title,
        value: ev._id as string,
    }));

    // Reusable input item configuration
    const createEventSelectItem = (title: string): InputItem => ({
        title,
        placeholder: 'Select an event',
        type: 'select',
        name: 'event',
        defaultValue: '',
        required: false,
        options: eventOptions,
    });

    const signupInputItems: InputItem[] = [createEventSelectItem('Select Event')];
    const inviteInputItems: InputItem[] = [createEventSelectItem('Select Event')];

    return (
        <AdminPage title={"Signups: " + user?.firstname + " " + user?.lastname}>
            <Head>
                <title>Admin Dashboard | User Signups: {user.firstname + " " + user.lastname}</title>
            </Head>
            <div>
                <h1 className="mb-4">User Event Management</h1>
                {alertMessage && <p className="text-info">{alertMessage}</p>}

                {/* Tab Navigation */}
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab}/>

                <div className="tab-content mt-0 mt-md-5">
                    <div className={`tab-pane fade ${activeTab === 'signup' ? 'show active' : ''}`} id="signup-tab">
                        {/* Current Signups */}
                        <UserSignUpsList
                            currentSignups={currentSignups}
                            handleRemoveSignup={handleRemoveSignup}
                        />

                        <hr className="my-8"/>

                        {/* Add Signup Form */}
                        <div>
                            <h5>Add Event Signup:</h5>
                            <ReusableForm
                                inputItems={signupInputItems}
                                submitButtonTitle="Add Signup"
                                onSubmit={handleAddSignup}
                                disableSubmitInitially={false}
                            />
                        </div>
                    </div>

                    <div className={`tab-pane fade ${activeTab === 'invite' ? 'show active' : ''}`} id="invite-tab">
                        {/* Invitations List */}
                        <UserInvitationsList
                            currentInvitations={currentInvitations}
                            setCurrentInvitations={setCurrentInvitations}
                            userId={userId}
                            user={user}
                            events={events}
                            onStatusChange={() => {
                                refreshInvitations();
                                refreshSignups();
                            }}
                        />

                        <hr className="my-8"/>

                        {/* Send Invitation Form */}
                        <div>
                            <h5>Send Event Invitation:</h5>
                            <ReusableForm
                                inputItems={inviteInputItems}
                                submitButtonTitle="Send Invitation"
                                onSubmit={handleInviteUser}
                                disableSubmitInitially={false}
                            />
                        </div>
                    </div>
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

    // Fetch bookings (signups)
    const {bookings} = await getUserBookings({userId});
    // Fetch all events
    const events: IEvent[] = await getAllEventsAPI();
    // Fetch invitations
    const {bookings: invitations} = await getInvitations(userId);

    // Filter accepted bookings only
    const acceptedBookings = bookings.filter(booking => booking.status === 'accepted');

    // Create a lookup map for faster access
    const bookingMap = new Map();
    acceptedBookings.forEach(booking => {
        bookingMap.set(booking.eventId, booking);
    });

    // Map events to signups
    const signups = events
        .filter(event => bookingMap.has(event._id as string))
        .map(event => ({
            event,
            booking: bookingMap.get(event._id as string)
        }));

    return {
        props: {
            userId,
            user: user,
            events: JSON.parse(JSON.stringify(events)),
            signups: JSON.parse(JSON.stringify(signups)),
            invitations: JSON.parse(JSON.stringify(invitations))
        },
    };
};