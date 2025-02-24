// components/admin/UsersTable.tsx
import React, {useState} from 'react';
import DataTable, {PaginationProps} from './DataTable';
import NextLink from 'components/reuseable/links/NextLink';
import {User} from '@supabase/supabase-js';
import UpdateUserModal from './UserUpdateModal';
import {MutableUserData} from 'backend/models/user';
import {convertUser} from 'helpers/convertUser';
import CreateUserModal from "./UserCreateModal";
import UserEventModal from "./UserEventModal";
import {IEvent} from "backend/models/event";

interface UsersTableProps {
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
    allEvents: IEvent[];
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage, allEvents}) => {
    const [selectedUser, setSelectedUser] = useState<MutableUserData | null>(null);

    // Define fixed columns.
    const columns = [
        {key: 'email', label: 'Email'},
        {key: 'country', label: 'Country'},
        {key: 'firstname', label: 'First Name'},
        {key: 'lastname', label: 'Last Name'},
        {key: 'organisation', label: 'Organisation'},
        {key: 'phone', label: 'Phone'},
        {key: 'position', label: 'Position'},
        {key: 'role', label: 'Role'},
    ];

    const headers = columns.map((col) => col.label).concat(['Actions']);

    const renderRow = (user: User) => {
        const metadata = user.user_metadata || {};
        const email = metadata.email || user.email || '—';
        let mutableUser = convertUser(user)
        return (
            <tr key={user.id}>
                {columns.map((col) => {
                    let cellContent = '';
                    if (col.key === 'email') {
                        cellContent = email;
                    } else {
                        cellContent = metadata[col.key] ? String(metadata[col.key]) : '—';
                    }
                    return <td key={col.key}>{cellContent}</td>;
                })}
                <td>
                    <button
                        className="btn btn-sm btn-soft-primary rounded-pill me-1"
                        data-bs-toggle="modal"
                        data-bs-target={`#update-user-modal-${user.id}`}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary rounded-pill me-1"
                        data-bs-toggle="modal"
                        data-bs-target={`#user-event-modal-${user.id}`}
                    >
                        Signups
                    </button>
                    <button className="btn btn-sm btn-soft-red rounded-pill">Delete</button>
                    <UpdateUserModal
                        modalID={`update-user-modal-${user.id}`}
                        userData={mutableUser}
                        onUpdated={(updatedUser) => {
                            // Optionally update local state here.
                            setSelectedUser(null);
                        }}
                    />
                    <UserEventModal
                        modalID={`user-event-modal-${user.id}`}
                        userId={user.id}
                        availableEvents={allEvents}
                        onUpdated={() => {
                            // Optionally refresh signups if needed.
                        }}
                    />
                </td>
            </tr>
        );
    };

    const pagination: PaginationProps = {
        page,
        totalCount: totalUsers,
        perPage,
        baseUrl: '/admin/dashboard?tab=users',
    };

    const headerAction = (
        <>
            <button
                data-bs-toggle="modal"
                data-bs-target="#create-user-modal"
                className="btn btn-sm btn-primary rounded-pill">Add User
            </button>
            <CreateUserModal modalID={"create-user-modal"}/>
        </>
    );

    return (
        <DataTable
            headerTitle="All Users"
            headerAction={headerAction}
            headers={headers}
            data={users}
            renderRow={renderRow}
            pagination={pagination}
        />
    );
};

export default UsersTable;