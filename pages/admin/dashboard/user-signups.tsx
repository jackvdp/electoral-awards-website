import {GetServerSideProps, NextPage} from 'next';
import React, {useEffect, useState} from 'react';
import DataTable from 'components/blocks/admin/reusables/DataTable';
import {IEvent} from 'backend/models/event';
import {User} from '@supabase/supabase-js';
import {createClient} from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import {userHeaders, userColumns, userRow} from "../../../src/components/blocks/admin/reusables/userColumns";
import {
    createCustomUserData,
    createMutableUserData,
    CustomUserData,
    MutableUserData
} from "../../../src/backend/models/user";
import ReusableForm, {InputItem} from "../../../src/components/reuseable/Form";
import Modal from "../../../src/components/reuseable/modal/Modal";

interface UserSignupsPageProps {
    userId: string;
    user: CustomUserData | null;
    events: IEvent[];
}

const EventSignupsPage: NextPage<UserSignupsPageProps> = ({userId, user, events: availableEvents}) => {

    const [currentSignups, setCurrentSignups] = useState<IEvent[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Fetch current signups on mount.
    useEffect(() => {
        const fetchSignups = async () => {
            try {
                const res = await fetch(`/api/users/signups?userId=${userId}`);
                const data = await res.json();
                setCurrentSignups(data);
            } catch (error) {
                console.error("Error fetching user signups", error);
            }
        };
        fetchSignups();
    }, []);

    const handleRemoveSignup = async (eventId: string) => {
        try {
            const res = await fetch('/api/events/signup', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId, eventId}),
            });
            const data = await res.json();
            if (!res.ok) {
                setAlertMessage(data.error || 'Failed to remove signup.');
            } else {
                // Update local state by removing the event from current signups.
                setCurrentSignups(prev => prev.filter(e => e._id !== eventId));
            }
        } catch (error: any) {
            setAlertMessage(error.message);
        }
    };

    const handleAddSignup = async (values: Record<string, string>) => {
        setAlertMessage(null);
        try {
            const res = await fetch('/api/events/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId, eventId: values.event}),
            });
            const data = await res.json();
            if (!res.ok) {
                setAlertMessage(data.error || 'Failed to add signup.');
            } else {
                setAlertMessage('User signed up successfully.');
                // Refresh current signups.
                const res2 = await fetch(`/api/users/signups?userId=${userId}`);
                const data2 = await res2.json();
                setCurrentSignups(data2);
            }
        } catch (error: any) {
            setAlertMessage(error.message);
        }
    };

    // Compute available events to add (exclude those already signed up)
    const availableForSignup = availableEvents.filter(event =>
        !currentSignups.some(signup => signup._id === event._id)
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
            required: true,
            options: availableForSignup.map(ev => ({
                label: ev.title,
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
                            {currentSignups.map(ev => (
                                <li key={ev._id as string}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    {ev.title}
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveSignup(ev._id as string)}
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

export default EventSignupsPage;

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

    let user: (MutableUserData | null) = null;
    const {data, error} = await supabase.auth.admin.getUserById(userId);
    if (!error && data) {
        user = createMutableUserData(data.user);
    }

    let events = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const eventsResponse = await fetch(`${baseUrl}/api/events`);
    events = await eventsResponse.json();

    return {
        props: {
            events,
            user,
            userId
        },
    };
};