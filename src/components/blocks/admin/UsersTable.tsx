// components/admin/UsersTable.tsx
import React from 'react';
import DataTable, {PaginationProps} from './DataTable';
import {User} from '@supabase/supabase-js';

interface UsersTableProps {
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage}) => {
    // Define the columns to display.
    const columns = [
        {key: 'email', label: 'Email'},
        {key: 'country', label: 'Country'},
        {key: 'firstname', label: 'First Name'},
        {key: 'lastname', label: 'Last Name'},
        {key: 'organisation', label: 'Organisation'},
        {key: 'phone', label: 'Phone'},
        {key: 'position', label: 'Position'},
    ];

    // Create table headers.
    const headers = columns.map((col) => col.label).concat(['Actions']);

    const renderRow = (user: User) => {
        const metadata = user.user_metadata || {};
        // For email, fallback to user.email if not provided in metadata.
        const email = metadata.email || user.email || '—';
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
                    <button className="btn btn-sm btn-soft-primary rounded-pill me-1">Edit</button>
                    <button className="btn btn-sm btn-soft-red rounded-pill">Delete</button>
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
        <button className="btn btn-sm btn-primary rounded-pill">Add User</button>
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