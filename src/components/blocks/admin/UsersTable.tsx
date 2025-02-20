// components/admin/UsersTable.tsx
import React from 'react';
import DataTable, {PaginationProps} from './DataTable';
import NextLink from 'components/reuseable/links/NextLink';
import {User} from '@supabase/supabase-js';

interface UsersTableProps {
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage}) => {
    const headers = ['Email', 'Name', 'Role', 'Actions'];

    const renderRow = (user: User) => (
        <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.user_metadata?.name || '—'}</td>
            <td>
        <span className={`badge bg-soft-${user.user_metadata?.role === 'admin' ? 'primary' : 'secondary'}`}>
          {user.user_metadata?.role || 'user'}
        </span>
            </td>
            <td>
                <button className="btn btn-sm btn-soft-primary rounded-pill me-1">Edit</button>
                <button className="btn btn-sm btn-soft-danger rounded-pill">Delete</button>
            </td>
        </tr>
    );

    const pagination: PaginationProps = {
        page,
        totalCount: totalUsers,
        perPage,
        baseUrl: '/admin/dashboard?tab=users',
    };

    return <DataTable headers={headers} data={users} renderRow={renderRow} pagination={pagination}/>;
};

export default UsersTable;