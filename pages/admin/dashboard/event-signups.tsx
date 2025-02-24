import {GetServerSideProps, NextPage} from 'next';
import React, {useState} from 'react';
import AdminSidebar, {SidebarLink} from 'components/blocks/admin/AdminSidebar';
import DataTable from 'components/blocks/admin/DataTable';
import {IEvent} from 'backend/models/event';
import {User} from '@supabase/supabase-js';
import {createClient} from 'backend/supabase/server-props';
import NextLink from 'components/reuseable/links/NextLink';
import AdminPage from "../../../src/components/blocks/admin/AdminPage";

interface EventSignupsPageProps {
    event: IEvent;
    signups: (User | null)[];
}

const EventSignupsPage: NextPage<EventSignupsPageProps> = ({event, signups}) => {
    const [currentSignups, setCurrentSignups] = useState<(User | null)[]>(signups);

    // Handler to remove a user from the event's signups
    const handleRemoveSignup = async (userId: string) => {
        try {
            const res = await fetch('/api/events/cancelSignup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({eventId: event._id, userId}),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to remove signup.');
            } else {
                // Filter out the removed user
                setCurrentSignups(prev => prev.filter(u => u && u.id !== userId));
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

    const renderRow = (user: User | null) => {
        if (!user) {
            return (
                <tr>
                    <td colSpan={4}>User not found</td>
                </tr>
            );
        }
        const metadata = user.user_metadata || {};
        return (
            <tr key={user.id}>
                <td>{metadata.email || user.email || '—'}</td>
                <td>{metadata.firstname || '—'}</td>
                <td>{metadata.lastname || '—'}</td>
                <td>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveSignup(user.id)}
                    >
                        Remove
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <AdminPage title={event.title}>
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

    // Get the list of signup IDs from the event.
    const signupIds: string[] = event.signups || [];
    let signups: (User | null)[] = [];

    // For each signup id, call the GET /api/user endpoint.
    if (signupIds.length > 0) {
        signups = await Promise.all(
            signupIds.map(async (id) => {
                try {
                    const res = await fetch(`${baseUrl}/api/user?userId=${id}`);
                    if (!res.ok) return null;
                    return await res.json();
                } catch (error) {
                    return null;
                }
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