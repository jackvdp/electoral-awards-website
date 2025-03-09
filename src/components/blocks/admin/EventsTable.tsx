// components/admin/EventsTable.tsx
import React from 'react';
import DataTable from './reusables/DataTable';
import {IEvent} from 'backend/models/event';
import CreateEventModal from "./eventModals/CreateEventModal";
import UpdateEventModal from "./eventModals/UpdateEventModal";
import Link from "next/link";
import {router} from "next/client";
import formatEventDates from "helpers/formatEventDates";
import {IBooking} from "backend/models/booking";

interface EventsTableProps {
    events: IEvent[];
    bookingsByEvent: Record<string, IBooking[]>
    title: string;
}

const EventsTable: React.FC<EventsTableProps> = ({events, bookingsByEvent, title}) => {
    const headers = ['Title', 'Dates', 'Signups', 'Actions'];

    function bookingsForEvent(event: IEvent) {
        return bookingsByEvent[event._id as string] || [];
    }

    const renderRow = (event: IEvent) => (
        <tr>
            <td>
                <a href={"/events/" + event._id}>{event.title}</a>
            </td>
            <td>
                {formatEventDates(event.startDate, event.endDate)}
            </td>
            <td>
                <Link href={"/admin/dashboard/event-signups?eventId=" + event._id}>
                    {bookingsForEvent(event).length} signups
                </Link>
            </td>
            <td>
                <button
                    className="btn btn-sm btn-soft-primary rounded-pill me-1"
                    data-bs-toggle="modal"
                    data-bs-target={`#update-event-modal-${event._id}`}
                >
                    Edit
                </button>
                <button className="btn btn-sm btn-soft-red rounded-pill">Delete</button>
                <UpdateEventModal
                    modalID={`update-event-modal-${event._id}`}
                    eventData={event}
                    onUpdated={() => {
                        router.reload()
                    }}
                />
            </td>
        </tr>
    );

    const headerAction = (
        <>
            <button
                data-bs-toggle="modal"
                data-bs-target={`#create-event-modal`}
                className="btn btn-sm btn-primary rounded-pill">Create Event
            </button>
            <CreateEventModal modalID="create-event-modal" onCreated={() => {
                router.reload();
            }}/>
        </>
    );

    return (
        <DataTable
            headerTitle={title}
            headerAction={headerAction}
            headers={headers}
            data={events}
            renderRow={renderRow}
        />
    );
};

export default EventsTable;