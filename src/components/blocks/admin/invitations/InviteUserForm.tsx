import React, { useState } from 'react';
import { IEvent } from 'backend/models/event';
import { MutableUserData } from 'backend/models/user';
import { createInvitationAndSendConfirmation} from "backend/use_cases/bookings/api/createInvitation+SendConfirmation";

interface InviteUserFormProps {
    events: IEvent[];
    users: MutableUserData[];
    onSuccess: () => void;
}

export default function InviteUserForm({ events, users, onSuccess }: InviteUserFormProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Find the selected user and event objects
            const user = users.find(u => u.id === selectedUser);
            const event = events.find(e => e._id === selectedEvent);

            if (!user || !event) {
                throw new Error('Please select both a user and an event');
            }

            await createInvitationAndSendConfirmation({ user, event });

            setSuccess(`Successfully invited ${user.firstname} ${user.lastname} to ${event.title}`);
            setSelectedUser('');
            setSelectedEvent('');
            onSuccess();
        } catch (err) {
            console.error('Error inviting user:', err);
            setError(err instanceof Error ? err.message : 'Failed to invite user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Invite User to Event</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="user" className="block text-gray-700 font-medium mb-2">
                        Select User
                    </label>
                    <select
                        id="user"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstname} {user.lastname} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="event" className="block text-gray-700 font-medium mb-2">
                        Select Event
                    </label>
                    <select
                        id="event"
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an event</option>
                        {events.map((event) => {
                            const startDate = new Date(event.startDate).toLocaleDateString();
                            return (
                                <option key={event._id as string} value={event._id as string}>
                                    {event.title} ({startDate})
                                </option>
                            );
                        })}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
                </button>
            </form>
        </div>
    );
}