// components/admin/EventsTable.tsx
import React from 'react';
import DataTable from './DataTable';
import {IEvent} from "../../../backend/models/event";

interface EventsTableProps {
    events: IEvent[];
}

const EventsTable: React.FC<EventsTableProps> = ({events}) => {
    const headers = ['Title', 'Dates', 'Signups', 'Actions'];

    const renderRow = (event: any) => (
        <tr key={event._id}>
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

    return <DataTable headers={headers} data={events} renderRow={renderRow}/>;
};

export default EventsTable;