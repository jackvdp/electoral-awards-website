// components/admin/EventsTable.tsx
import React from 'react';
import DataTable from './DataTable';
import {IEvent} from 'backend/models/event';
import CreateEventModal from "./CreateEventModal";
import UpdateEventModal from "./UpdateEventModal";

interface EventsTableProps {
    events: IEvent[];
}

const EventsTable: React.FC<EventsTableProps> = ({events}) => {
    const headers = ['Title', 'Dates', 'Signups', 'Actions'];

    const renderRow = (event: IEvent) => (
        <tr>
            <td>
                <a href={"/events/" + event._id}>{event.title}</a>
            </td>
            <td>
                {new Date(event.startDate).toLocaleDateString()}
                {' '}-{' '}
                {new Date(event.endDate).toLocaleDateString()}
            </td>
            <td>
                {event.signups ? event.signups.length : 0} signups
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
            }}/>
        </>
    );

    return (
        <DataTable
            headerTitle="All Events"
            headerAction={headerAction}
            headers={headers}
            data={events}
            renderRow={renderRow}
        />
    );
};

export default EventsTable;