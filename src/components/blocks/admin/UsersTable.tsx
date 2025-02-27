// components/admin/UsersTable.tsx
import React, {useState} from 'react';
import DataTable, {PaginationProps} from './reusables/DataTable';
import UpdateUserModal from './userModals/UserUpdateModal';
import {MutableUserData} from 'backend/models/user';
import CreateUserModal from "./userModals/UserCreateModal";
import {IEvent} from "backend/models/event";
import {userColumns, userRow} from "./reusables/userColumns";
import Link from "next/link";
import {useRouter} from 'next/router';
import UserDeleteModal from "./userModals/UserDeleteModal";

interface UsersTableProps {
    users: MutableUserData[];
    totalUsers: number;
    page: number;
    perPage: number;
    allEvents: IEvent[];
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage, allEvents}) => {
    const [selectedUser, setSelectedUser] = useState<MutableUserData | null>(null);
    const router = useRouter();
    const {sortBy, sortOrder} = router.query;

    // Include sortBy and sortOrder in the pagination base URL
    const baseUrl = `/admin/dashboard?tab=users${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`;

    const renderRow = (mutableUser: MutableUserData) => {
        return (
            <tr key={mutableUser.id}>
                {userRow(mutableUser)}
                <td>
                    <button
                        className="btn btn-sm btn-soft-primary rounded-pill me-1"
                        data-bs-toggle="modal"
                        data-bs-target={`#update-user-modal-${mutableUser.id}`}
                    >
                        Edit
                    </button>
                    <Link className="btn btn-sm btn-outline-secondary rounded-pill me-1"
                          href={"/admin/dashboard/user-signups?userId=" + mutableUser.id}>
                        Signups
                    </Link>
                    <button className="btn btn-sm btn-soft-red rounded-pill"
                            data-bs-toggle="modal"
                            data-bs-target={`#delete-user-modal-${mutableUser.id}`}
                    >
                        Delete
                    </button>
                    <UpdateUserModal
                        modalID={`update-user-modal-${mutableUser.id}`}
                        userData={mutableUser}
                        onUpdated={(updatedUser) => {
                            setSelectedUser(null);
                            router.reload();
                        }}
                    />
                    <UserDeleteModal
                        modalID={`delete-user-modal-${mutableUser.id}`}
                        userData={mutableUser}
                        onDeleted={
                            () => {
                                setSelectedUser(null);
                                router.reload();
                            }
                        }
                    />
                </td>
            </tr>
        );
    };

    const pagination: PaginationProps = {
        page,
        totalCount: totalUsers,
        perPage,
        baseUrl,
    };

    const headerAction = (
        <>
            <button
                data-bs-toggle="modal"
                data-bs-target="#create-user-modal"
                className="btn btn-sm btn-primary rounded-pill">Add User
            </button>
            <CreateUserModal
                modalID={"create-user-modal"}
                onCreated={() => router.reload()}
            />
        </>
    );

    // Add 'Actions' column (not sortable)
    const allColumns = [...userColumns, {key: 'actions', label: 'Actions', sortable: false}];

    return (
        <DataTable
            headerTitle="All Users"
            headerAction={headerAction}
            columns={allColumns}
            data={users}
            renderRow={renderRow}
            pagination={pagination}
            searchable
        />
    );
};

export default UsersTable;