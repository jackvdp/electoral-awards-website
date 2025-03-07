import {GetServerSideProps, NextPage} from 'next';
import React, {useState} from 'react';
import DataTable from 'components/blocks/admin/reusables/DataTable';
import {IEvent} from 'backend/models/event';
import {createClient} from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import {userHeaders, userRow} from "components/blocks/admin/reusables/userColumns";
import {createMutableUserData, MutableUserData} from "backend/models/user";
import {deleteBookingAndSendCancellation} from "backend/use_cases/bookings/deleteBooking+SendConfirmation";
import {deleteBooking} from "backend/use_cases/bookings/deleteBooking";
import {getEventBookings} from "backend/use_cases/bookings/getEventBookings";
import {IBooking} from "backend/models/booking";

interface EventSignupsPageProps {
    event: IEvent;
    signups: {user: (MutableUserData | string), booking: IBooking}[];
}

const EventSignupsPage: NextPage<EventSignupsPageProps> = ({event, signups}) => {
    const [currentSignups, setCurrentSignups] = useState<({user: (MutableUserData | string), booking: IBooking})[]>(signups);
    const [isDownloading, setIsDownloading] = useState(false);

    // Handler to remove a user from the event's signups
    const handleRemoveSignup = async (user: MutableUserData | string, booking: IBooking) => {
        const userId = (typeof user === 'string') ? user : user.id;

        try {
            let result;

            // Check if we have the full user data
            if (typeof user !== 'string') {
                // We have the full user object, so use the complete use case
                result = await deleteBookingAndSendCancellation({
                    bookingId: booking._id as string,
                    user,
                    event
                });
            } else {
                // We only have the userId, so just delete the booking without email
                result = await deleteBooking({
                    bookingId: booking._id as string
                });
            }

            if (!result.success) {
                alert(result.message || 'Failed to remove signup.');
            } else {
                // Filter out the removed signup
                setCurrentSignups(prev => prev.filter(signup =>
                    signup.booking._id !== booking._id
                ));
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
        const rows = currentSignups.map(signup => {
            const user = signup.user;
            if (typeof user === 'string') {
                return `${user},,,,,,,"User not found"`;
            }
            return columns.map(col => escapeCSV((user as MutableUserData)[col as keyof MutableUserData])).join(',');
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

    function renderRow({user, booking}:{user: MutableUserData | string, booking: IBooking }) {
        return (
            <tr>
                {(typeof user === 'string')  ? <td colSpan={4}>User not found: {user}</td> : userRow(user)}
                <td>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveSignup(user, booking)}
                    >
                        Remove
                    </button>
                </td>
            </tr>
        );
    };

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

    // Get bookings for this event
    const { bookings } = await getEventBookings({
        eventId: eventId as string,
        status: 'accepted'
    });

    // Create the combined signups array with user and booking data
    const signups = await Promise.all(
        bookings.map(async (booking) => {
            const {data, error} = await supabase.auth.admin.getUserById(booking.userId);

            // If user not found, return the user ID as string
            const user = error || !data
                ? booking.userId
                : createMutableUserData(data.user);

            return {
                user,
                booking: JSON.parse(JSON.stringify(booking)) // Serialize MongoDB object
            };
        })
    );

    return {
        props: {
            event,
            signups,
        },
    };
};