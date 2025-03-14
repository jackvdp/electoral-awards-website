import React, { useState, useEffect } from 'react';
import { IBooking } from 'backend/models/booking';
import { IEvent } from 'backend/models/event';
import { getInvitations } from "backend/use_cases/bookings/api/getInvitations";
import { updateBookingAPI } from "backend/use_cases/bookings/api/updateBooking+SendConfirmation";
import { MutableUserData } from 'backend/models/user';
import formatEventDates from "helpers/formatEventDates";

interface UserInvitationsListProps {
    userId: string;
    events: IEvent[];
    user: MutableUserData;
    onStatusChange?: () => void;
}

export default function UserInvitationsList({ userId, events, user, onStatusChange }: UserInvitationsListProps) {
    const [invitations, setInvitations] = useState<IBooking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserInvitations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { bookings } = await getInvitations(userId);
            setInvitations(bookings);
        } catch (err) {
            console.error('Error fetching user invitations:', err);
            setError('Failed to load invitations for this user');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserInvitations();
        }
    }, [userId]);

    const handleResendInvitation = async (bookingId: string, eventId: string) => {
        if (window.confirm('Are you sure you want to resend this invitation?')) {
            try {
                // Find the event for this invitation
                const event = events.find(e => e._id === eventId);
                if (!event) {
                    throw new Error('Event not found');
                }

                // Change status back to 'invited' to effectively resend the invitation
                await updateBookingAPI({
                    bookingId,
                    status: 'invited',
                    user,
                    event
                });

                fetchUserInvitations();
                if (onStatusChange) onStatusChange();
            } catch (err) {
                console.error('Error resending invitation:', err);
                alert('Failed to resend invitation');
            }
        }
    };

    const handleConfirmInvitation = async (bookingId: string, eventId: string) => {
        if (window.confirm('Are you sure you want to accept this invitation for the user?')) {
            try {
                // Find the event for this invitation
                const event = events.find(e => e._id === eventId);
                if (!event) {
                    throw new Error('Event not found');
                }

                // Change status back to 'invited' to effectively resend the invitation
                await updateBookingAPI({
                    bookingId,
                    status: 'accepted',
                    user,
                    event
                });

                fetchUserInvitations();
                if (onStatusChange) onStatusChange();
            } catch (err) {
                console.error('Error resending invitation:', err);
                alert('Failed to resend invitation');
            }
        }
    }

    const handleCancelInvitation = async (bookingId: string, eventId: string) => {
        if (window.confirm('Are you sure you want to cancel this invitation?')) {
            try {
                // Find the event for this invitation
                const event = events.find(e => e._id === eventId);
                if (!event) {
                    throw new Error('Event not found');
                }

                await updateBookingAPI({
                    bookingId,
                    status: 'rejected',
                    user,
                    event
                });

                fetchUserInvitations();
                if (onStatusChange) onStatusChange();
            } catch (err) {
                console.error('Error canceling invitation:', err);
                alert('Failed to cancel invitation');
            }
        }
    };

    const getEventTitle = (eventId: string) => {
        const event = events.find(e => e._id === eventId);
        return event ? event.title : 'Unknown Event';
    };

    const getEventDate = (eventId: string) => {
        const event = events.find(e => e._id === eventId);
        return event ? formatEventDates(event.startDate, event.endDate) : 'Unknown Date';
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading invitations...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    if (!invitations || invitations.length === 0) {
        return (
            <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-500 text-center">No invitations found for this user.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Invitations for {user.firstname} {user.lastname}</h3>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-pale-sky">
                    <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invited At
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-soft-ash divide-y divide-gray-200">
                    {invitations.map((invitation) => (
                        <tr key={invitation._id as string}>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{getEventTitle(invitation.eventId)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{getEventDate(invitation.eventId)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${invitation.status === 'invited' ? 'bg-soft-yellow text-yellow' :
                                  invitation.status === 'accepted' ? 'bg-soft-green text-green' :
                                      'bg-red-100 text-red-800'}`}>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {new Date(invitation.invitedAt).toLocaleString()}
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                {invitation.status === 'invited' && (
                                    <>
                                        <button
                                            onClick={() => handleResendInvitation(invitation._id as string, invitation.eventId)}
                                            className="btn btn-primary rounded-pill mr-3 btn-sm"
                                        >
                                            Resend
                                        </button>
                                        <button
                                            onClick={() => handleConfirmInvitation(invitation._id as string, invitation.eventId)}
                                            className="btn btn-green rounded-pill mr-3 btn-sm"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleCancelInvitation(invitation._id as string, invitation.eventId)}
                                            className="btn btn-red rounded-pill mr-3 btn-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {invitation.status === 'rejected' && (
                                    <button
                                        onClick={() => handleResendInvitation(invitation._id as string, invitation.eventId)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Reinvite
                                    </button>
                                )}
                            </td>
                            <hr/>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}