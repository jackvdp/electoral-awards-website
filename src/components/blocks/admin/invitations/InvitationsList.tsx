import React, { useState, useEffect } from 'react';
import { IBooking } from 'backend/models/booking';
import { IEvent } from 'backend/models/event';
import { getInvitations } from "backend/use_cases/bookings/api/getInvitations";
import { updateBookingAPI } from "backend/use_cases/bookings/api/updateBooking+SendConfirmation";
import { MutableUserData } from 'backend/models/user';
import formatEventDates from "helpers/formatEventDates";

interface UserInvitationsListProps {
    currentInvitations: IBooking[];
    setCurrentInvitations: (invitations: IBooking[]) => void;
    userId: string;
    events: IEvent[];
    user: MutableUserData;
    onStatusChange?: () => void;
}

export default function UserInvitationsList({ currentInvitations, setCurrentInvitations, userId, events, user, onStatusChange }: UserInvitationsListProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserInvitations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { bookings } = await getInvitations(userId);
            setCurrentInvitations(bookings);
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

                // Change status to 'accepted'
                await updateBookingAPI({
                    bookingId,
                    status: 'accepted',
                    user,
                    event
                });

                fetchUserInvitations();
                if (onStatusChange) onStatusChange();
            } catch (err) {
                console.error('Error confirming invitation:', err);
                alert('Failed to confirm invitation');
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
        return <div>Loading invitations...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!currentInvitations || currentInvitations.length === 0) {
        return <p>No invitations found for this user.</p>;
    }

    return (
        <div className="mb-4">
            <h5>Event Invitations:</h5>
            <ul className="list-group">
                {currentInvitations.map((invitation) => (
                    <li key={invitation._id as string}
                        className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <span className="d-block">{getEventTitle(invitation.eventId)}</span>
                            <small className="text-muted">{getEventDate(invitation.eventId)} - </small>
                            <small className={`
                                ${invitation.status === 'invited' ? 'text-warning' :
                                invitation.status === 'accepted' ? 'text-success' :
                                    'text-danger'}
                            `}>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </small>
                        </div>
                        <div>
                            {invitation.status === 'invited' && (
                                <>
                                    <button
                                        onClick={() => handleResendInvitation(invitation._id as string, invitation.eventId)}
                                        className="btn btn-sm btn-outline-primary me-1"
                                    >
                                        Resend
                                    </button>
                                    <button
                                        onClick={() => handleConfirmInvitation(invitation._id as string, invitation.eventId)}
                                        className="btn btn-sm btn-outline-success me-1"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => handleCancelInvitation(invitation._id as string, invitation.eventId)}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                            {invitation.status === 'rejected' && (
                                <button
                                    onClick={() => handleResendInvitation(invitation._id as string, invitation.eventId)}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    Reinvite
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}