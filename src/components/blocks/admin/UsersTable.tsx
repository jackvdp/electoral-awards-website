// components/admin/UsersTable.tsx
import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {User} from '@supabase/supabase-js';

interface UsersTableProps {
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
}

const UsersTable: React.FC<UsersTableProps> = ({users, totalUsers, page, perPage}) => {
    const totalPages = Math.ceil(totalUsers / perPage);
    return (
        <div className="card">
            <div className="card-header d-flex align-items-center">
                <h4 className="card-title mb-0">All Users</h4>
                <button className="btn btn-sm btn-primary rounded-pill ms-auto">Add User</button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Name</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
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
                        ))}
                        </tbody>
                    </table>
                </div>
                <nav className="d-flex justify-content-center mt-6" aria-label="pagination">
                    <ul className="pagination">
                        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                            <NextLink
                                title={<i className="uil uil-arrow-left"></i>}
                                href={`/admin/dashboard?tab=users&page=${page - 1}`}
                                className="page-link"
                                aria-label="Previous"
                            />
                        </li>
                        {Array.from({length: totalPages}).map((_, i) => (
                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                <NextLink
                                    title={`${i + 1}`}
                                    href={`/admin/dashboard?tab=users&page=${i + 1}`}
                                    className="page-link"
                                />
                            </li>
                        ))}
                        <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                            <NextLink
                                title={<i className="uil uil-arrow-right"></i>}
                                href={`/admin/dashboard?tab=users&page=${page + 1}`}
                                className="page-link"
                                aria-label="Next"
                            />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default UsersTable;