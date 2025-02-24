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
import {userHeaders, userRow} from "./userColumns";

interface UsersTableProps {
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
    allEvents: IEvent[];
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage, allEvents}) => {
    const [selectedUser, setSelectedUser] = useState<MutableUserData | null>(null);

    const headers = userHeaders.concat(['Actions']);

    const renderRow = (user: User) => {
        let mutableUser = convertUser(user)
        return (
            <tr key={user.id}>
                {userRow(user)}
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