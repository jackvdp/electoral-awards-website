// components/admin/UserEventModal.tsx
import React, {FC, useEffect, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {IEvent} from "backend/models/event";

interface UserEventModalProps {
    modalID: string;
    userId: string;
    availableEvents: IEvent[];
    onUpdated: () => void;
}

const UserEventModal: FC<UserEventModalProps> = ({modalID, userId, availableEvents, onUpdated}) => {
    const [currentSignups, setCurrentSignups] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);

    // Fetch current signups on mount.
    useEffect(() => {
        const fetchSignups = async () => {
            try {
                const res = await fetch(`/api/events/mySignups?userId=${userId}`);
                const data = await res.json();
                setCurrentSignups(data);
            } catch (error) {
                console.error("Error fetching user signups", error);
            }
        };
        fetchSignups();
    }, [userId]);

    const handleRemoveSignup = async (eventId: string) => {
        try {
            const res = await fetch('/api/events/cancelSignup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId, eventId}),
            });
            const data = await res.json();
            if (!res.ok) {
                setAlertMessage(data.error || 'Failed to remove signup.');
            } else {
                // Update local state by removing the event from current signups.
                setCurrentSignups(prev => prev.filter(e => e._id !== eventId));
                onUpdated();
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
                const res2 = await fetch(`/api/events/mySignups?userId=${userId}`);
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
    );

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
        <Modal
            id={modalID}
            size="lg"
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => setCloseModalProgrammatically(false),
            }}
            content={
                <div>
                    <h4 className="mb-3">User Event Signups</h4>
                    {alertMessage && <p className="text-info">{alertMessage}</p>}

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
            }
        />
    );
};

export default UserEventModal;