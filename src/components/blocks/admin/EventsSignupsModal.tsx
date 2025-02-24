// components/admin/EventSignupsModal.tsx
import React, {FC, useEffect, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import DataTable from './DataTable';
import {User} from '@supabase/supabase-js';

interface EventSignupsModalProps {
    modalID: string;
    eventId: string;
    onUpdated?: () => void;
}

const EventSignupsModal: FC<EventSignupsModalProps> = ({modalID, eventId, onUpdated}) => {
    const [signups, setSignups] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        console.log("*** EventSignupsModal useEffect called")
        const fetchEventAndUsers = async () => {
            setLoading(true);
            try {
                // First, fetch the event details using your existing route.
                const eventRes = await fetch(`/api/events/${eventId}`);
                const eventData = await eventRes.json();
                if (!eventRes.ok) {
                    setAlertMessage(eventData.error || 'Failed to load event.');
                    setLoading(false);
                    return;
                }
                // Extract the signups array (an array of user IDs)
                const signupIds: string[] = eventData.signups || [];
                if (signupIds.length === 0) {
                    setSignups([]);
                    setLoading(false);
                    return;
                }
                // For each signup ID, fetch the user using your GET /api/user endpoint.
                const usersData: User[] = await Promise.all(
                    signupIds.map(async (id) => {
                        const res = await fetch(`/api/user?userId=${id}`);
                        return res.json();
                    })
                );
                setSignups(usersData);
            } catch (error: any) {
                setAlertMessage(error.message);
            }
            setLoading(false);
        };

        fetchEventAndUsers();
    }, [eventId]);

    // Define columns similar to your UsersTable.
    const columns = [
        {key: 'email', label: 'Email'},
        {key: 'firstname', label: 'First Name'},
        {key: 'lastname', label: 'Last Name'},
    ];
    const headers = columns.map((col) => col.label);

    const renderRow = (user: User) => {
        const metadata = user.user_metadata || {};
        return (
            <tr key={user.id}>
                {columns.map((col) => {
                    let cellContent = '';
                    if (col.key === 'email') {
                        cellContent = metadata.email || user.email || '—';
                    } else {
                        cellContent = metadata[col.key] ? String(metadata[col.key]) : '—';
                    }
                    return <td key={col.key}>{cellContent}</td>;
                })}
            </tr>
        );
    };

    return (
        <Modal
            id={modalID}
            size="xl"
            programmaticClose={{
                closeTriggered: false, resetAfterClose: () => {
                }
            }}
            content={
                <div>
                    <h4 className="mb-3">Event Signups</h4>
                    {alertMessage && <p className="text-red">{alertMessage}</p>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : signups.length === 0 ? (
                        <p>No users have signed up for this event.</p>
                    ) : (
                        <DataTable headers={headers} data={signups} renderRow={renderRow}/>
                    )}
                </div>
            }
        />
    );
};

export default EventSignupsModal;