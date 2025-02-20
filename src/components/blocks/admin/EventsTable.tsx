// components/admin/EventsTable.tsx
import React from 'react';
import DataTable from './DataTable';
import {IEvent} from 'backend/models/event';
import CreateEventModal from "./CreateEventModal";

interface EventsTableProps {
    events: IEvent[];
}

const EventsTable: React.FC<EventsTableProps> = ({events}) => {
    const headers = ['Title', 'Dates', 'Signups', 'Actions'];

    const renderRow = (event: IEvent) => (
        <tr>
            <td>{event.title}</td>
            <td>
                <span className="badge bg-soft-primary">
                  {new Date(event.startDate).toLocaleDateString()}
                </span>{' '}
                -{' '}
                <span className="badge bg-soft-primary">
                  {new Date(event.endDate).toLocaleDateString()}
                </span>
            </td>
            <td>
                <span className="badge bg-soft-blue">
                  {event.signups ? event.signups.length : 0} signups
                </span>
            </td>
            <td>
                <button className="btn btn-sm btn-soft-primary rounded-pill me-1">Edit</button>
                <button className="btn btn-sm btn-soft-danger rounded-pill">Delete</button>
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