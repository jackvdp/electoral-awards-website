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
    // Define the columns you want to show with keys and labels.
    const columns = [
        {key: 'email', label: 'Email'},
        {key: 'country', label: 'Country'},
        {key: 'firstname', label: 'First Name'},
        {key: 'lastname', label: 'Last Name'},
        {key: 'organisation', label: 'Organisation'},
        {key: 'phone', label: 'Phone'},
        {key: 'position', label: 'Position'},
    ];

    // Build the header labels and add an extra header for actions.
    const headers = columns.map((col) => col.label).concat(['Actions']);

    const renderRow = (user: User) => {
        // Get the metadata object.
        const metadata = user.user_metadata || {};
        // For email, fallback to user.email if not present in metadata.
        const email = metadata.email || user.email || '—';
        return (
            <tr key={user.id}>
                {columns.map((col) => (
                    <td key={col.key}>
                        {col.key === 'email'
                            ? email
                            : metadata[col.key] ? String(metadata[col.key]) : '—'}
                    </td>
                ))}
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