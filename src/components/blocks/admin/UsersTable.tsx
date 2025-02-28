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
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage}) => {
    const router = useRouter();
    const {sortBy, sortOrder} = router.query;
    const [isDownloading, setIsDownloading] = useState(false);

    // Include sortBy and sortOrder in the pagination base URL
    const baseUrl = `/admin/dashboard?tab=users${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`;

    const handleDownloadCSV = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch('/api/users/export-users');

            if (!response.ok) {
                throw new Error('Failed to download users data');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'users.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading users:', error);
            alert('Failed to download users data');
        } finally {
            setIsDownloading(false);
        }
    };

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
                            router.reload();
                        }}
                    />
                    <UserDeleteModal
                        modalID={`delete-user-modal-${mutableUser.id}`}
                        userData={mutableUser}
                        onDeleted={() => {
                            router.reload();
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
        baseUrl,
    };

    const headerAction = (
        <>
            <button
                onClick={handleDownloadCSV}
                disabled={isDownloading}
                className="btn btn-sm btn-success rounded-pill me-2">
                {isDownloading ? 'Downloading...' : 'Download Users'}
            </button>
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