import {GetServerSideProps, NextPage} from 'next';
import React, {useState} from 'react';
import DataTable from 'components/blocks/admin/DataTable';
import {IEvent} from 'backend/models/event';
import {User} from '@supabase/supabase-js';
import {createClient} from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/AdminPage";

interface EventSignupsPageProps {
    event: IEvent;
    signups: (User | string)[];
}

const EventSignupsPage: NextPage<EventSignupsPageProps> = ({event, signups}) => {
    const [currentSignups, setCurrentSignups] = useState<(User | string)[]>(signups);

    // Handler to remove a user from the event's signups
    const handleRemoveSignup = async (userId: string) => {
        try {
            const res = await fetch('/api/events/signup', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({eventId: event._id, userId}),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to remove signup.');
            } else {
                // Filter out the removed user
                setCurrentSignups(prev => prev.filter(u => (typeof u !== 'string') && u.id !== userId));
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Define columns for the signups table.
    const columns = [
        {key: 'email', label: 'Email'},
        {key: 'firstname', label: 'First Name'},
        {key: 'lastname', label: 'Last Name'},
        {key: 'actions', label: 'Actions'},
    ];
    const headers = columns.map(col => col.label);

    const renderRow = (user: User | string) => {
        if (typeof user === 'string') {
            return (
                <tr>
                    <td colSpan={4}>User not found: {user}</td>
                    {removeButton(user)}
                </tr>
            );
        }
        const metadata = user.user_metadata || {};
        return (
            <tr key={user.id}>
                <td>{metadata.email || user.email || '—'}</td>
                <td>{metadata.firstname || '—'}</td>
                <td>{metadata.lastname || '—'}</td>
                {removeButton(user.id)}
            </tr>
        );
    };

    const removeButton = (userId: string) => (
        <td>
            <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveSignup(userId)}
            >
                Remove
            </button>
        </td>
    )

    return (
        <AdminPage title={"Signups: " + event.title}>
            <DataTable
                headerTitle="Signups"
                headers={headers}
                data={currentSignups}
                renderRow={renderRow}
            />
        </AdminPage>
    );
};

export default EventSignupsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const {eventId} = ctx.query;
    if (!eventId || typeof eventId !== 'string') {
        return {notFound: true};
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
    }
    // Fetch the event from your API route.
    const eventRes = await fetch(`${baseUrl}/api/events/${eventId}`);
    if (!eventRes.ok) {
        return {notFound: true};
    }
    const event = await eventRes.json();

    const signupIds: string[] = event.signups || [];

    let signups: (User | string)[] = [];

    if (signupIds.length > 0) {
        signups = await Promise.all(
            signupIds.map(async (id) => {
                const {data, error} = await supabase.auth.admin.getUserById(id);
                if (error || !data) {
                    return id;
                }
                return data.user;
            })
        );
    }

    return {
        props: {
            event,
            signups,
        },
    };
};