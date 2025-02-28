import {GetServerSideProps, NextPage} from 'next';
import React, {useState} from 'react';
import DataTable from 'components/blocks/admin/reusables/DataTable';
import {IEvent} from 'backend/models/event';
import {User} from '@supabase/supabase-js';
import {createClient} from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import {userHeaders, userColumns, userRow} from "../../../src/components/blocks/admin/reusables/userColumns";
import {createMutableUserData, MutableUserData} from "../../../src/backend/models/user";

interface EventSignupsPageProps {
    event: IEvent;
    signups: (MutableUserData | string)[];
}

const EventSignupsPage: NextPage<EventSignupsPageProps> = ({event, signups}) => {
    const [currentSignups, setCurrentSignups] = useState<(MutableUserData | string)[]>(signups);
    const [isDownloading, setIsDownloading] = useState(false);

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

    // Helper function to escape CSV field values
    const escapeCSV = (field: string | null | undefined): string => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        // If the field contains commas, quotes, or newlines, wrap it in quotes
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            // Double up any quotes
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };

    // Generate CSV content directly from the current signups
    const generateCSV = (): string => {
        // Define columns to include in the CSV
        const columns = [
            'id',
            'email',
            'firstname',
            'lastname',
            'organisation',
            'position',
            'country',
            'role'
        ];

        // Create header row
        const header = columns.join(',');

        // Create data rows
        const rows = currentSignups.map(user => {
            if (typeof user === 'string') {
                return `${user},,,,,,,"User not found"`;
            }
            return columns.map(col => escapeCSV(user[col as keyof MutableUserData])).join(',');
        });

        // Combine header and rows
        return [header, ...rows].join('\n');
    };

    // Handler to download signups as CSV directly from client-side
    const handleDownloadCSV = () => {
        try {
            setIsDownloading(true);

            // Generate CSV content
            const csv = generateCSV();

            // Create a blob from the CSV string
            const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);

            // Create an anchor element and trigger the download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Create a sanitized filename based on event title
            const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_signups.csv`;
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating CSV:', error);
            alert('Failed to generate CSV');
        } finally {
            setIsDownloading(false);
        }
    };

    const headers = userHeaders.concat(['Actions']);

    const renderRow = (user: MutableUserData | string) => {
        if (typeof user === 'string') {
            return (
                <tr>
                    <td colSpan={4}>User not found: {user}</td>
                    {removeButton(user)}
                </tr>
            );
        }
        return (
            <tr key={user.id}>
                {userRow(user)}
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

    const headerAction = (
        <button
            onClick={handleDownloadCSV}
            disabled={isDownloading || currentSignups.length === 0}
            className="btn btn-sm btn-success rounded-pill"
        >
            {isDownloading ? 'Downloading...' : 'Download Signups'}
        </button>
    );

    return (
        <AdminPage title={"Signups: " + event.title}>
            <DataTable
                headerTitle="Signups"
                headers={headers}
                headerAction={headerAction}
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
    if (!session || session.user.user_metadata.role !== 'admin') {
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

    let signups: (MutableUserData | string)[] = [];

    if (signupIds.length > 0) {
        signups = await Promise.all(
            signupIds.map(async (id) => {
                const {data, error} = await supabase.auth.admin.getUserById(id);
                if (error || !data) {
                    return id;
                }
                return createMutableUserData(data.user);
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