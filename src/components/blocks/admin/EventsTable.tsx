// components/admin/EventsTable.tsx
import React from 'react';

interface EventsTableProps {
    events: any[];
}

const EventsTable: React.FC<EventsTableProps> = ({events}) => {
    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <h4 className="card-title mb-0">All Events</h4>
                <button className="btn btn-sm btn-primary rounded-pill ms-auto">Create Event</button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Dates</th>
                            <th scope="col">Signups</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.map((event) => (
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
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventsTable;