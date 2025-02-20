import {GetServerSideProps} from 'next';
import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useRouter} from 'next/router';
import {createClient} from 'backend/supabase/server-props';
import {User} from "@supabase/supabase-js";
import IconBox from 'components/reuseable/IconBox';

interface DashboardProps {
    tab: 'users' | 'events' | 'articles';
    users: any[];
    totalUsers: number;
    page: number;
    perPage: number;
    events: any[];
}

function Dashboard({tab, users, totalUsers, page, perPage, events}: DashboardProps) {
    const router = useRouter();

    // Sidebar navigation items with icons
    const sidebarLinks = [
        {title: 'Users', url: '/admin?tab=users', icon: 'uil-users-alt'},
        {title: 'Events', url: '/admin?tab=events', icon: 'uil-calendar-alt'},
        {title: 'Articles', url: '/admin?tab=articles', icon: 'uil-document-layout-left'}
    ];

    // Stats cards data
    const stats = [
        {title: 'Total Users', value: totalUsers, icon: 'uil-users-alt', color: 'blue'},
        {title: 'Active Events', value: events.length, icon: 'uil-calendar-alt', color: 'green'},
        {title: 'Articles', value: '0', icon: 'uil-document-layout-left', color: 'purple'}
    ];

    const renderContent = () => {
        if (tab === 'users') {
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
                                            <span
                                                className={`badge bg-soft-${user.user_metadata?.role === 'admin' ? 'primary' : 'secondary'}`}>
                                              {user.user_metadata?.role || 'user'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-soft-primary rounded-pill me-1">Edit
                                            </button>
                                            <button className="btn btn-sm btn-soft-danger rounded-pill">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <nav className="d-flex justify-content-center mt-6">
                            <ul className="pagination">
                                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                    <NextLink
                                        title={<i className="uil uil-arrow-left"/>}
                                        href={`/admin/dashboard?tab=users&page=${page - 1}`}
                                        className="page-link"
                                    />
                                </li>
                                {Array.from({length: Math.ceil(totalUsers / perPage)}).map((_, i) => (
                                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                        <NextLink
                                            title={`${i + 1}`}
                                            href={`/admin/dashboard?tab=users&page=${i + 1}`}
                                            className="page-link"
                                        />
                                    </li>
                                ))}
                                <li className={`page-item ${page >= Math.ceil(totalUsers / perPage) ? 'disabled' : ''}`}>
                                    <NextLink
                                        title={<i className="uil uil-arrow-right"/>}
                                        href={`/admin/dashboard?tab=users&page=${page + 1}`}
                                        className="page-link"
                                    />
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            );
        }

        if (tab === 'events') {
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
                                            </span>
                                            {' - '}
                                            <span className="badge bg-soft-primary">
                                              {new Date(event.endDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-soft-blue">
                                              {event.signups?.length || 0} signups
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-soft-primary rounded-pill me-1">Edit
                                            </button>
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
        }

        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="text-center">Articles section coming soon...</h4>
                </div>
            </div>
        );
    };

    return (
        <div className="wrapper bg-light">
            <div className="container py-8 py-md-10">
                <div className="row mb-8">
                    <div className="col-12">
                        <h1 className="display-6 mb-0">Admin Dashboard</h1>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="row gx-md-8 gx-xl-12 gy-6 mb-8">
                    {stats.map(({title, value, icon, color}) => (
                        <div key={title} className="col-md-4">
                            <div className="card shadow-lg lift h-100">
                                <div className="card-body">
                                    <div className="d-flex flex-row align-items-center">
                                        <div>
                                            <div
                                                className={`icon btn btn-circle btn-lg btn-soft-${color} pe-none me-4`}>
                                                <i className={`uil ${icon}`}></i>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="counter mb-1">{value}</h3>
                                            <p className="mb-0">{title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row gx-md-8 gx-xl-12 gy-12">
                    {/* Sidebar */}
                    <aside className="col-md-4 col-lg-3">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <div className="list-group list-group-flush">
                                    {sidebarLinks.map((link) => {
                                        const active = router.query.tab === link.url.split('=')[1];
                                        return (
                                            <NextLink
                                                key={link.url}
                                                href={link.url}
                                                title={
                                                    <div className="d-flex align-items-center">
                                                        <i className={`uil ${link.icon} fs-20 me-3`}></i>
                                                        <span>{link.title}</span>
                                                    </div>
                                                }
                                                className={`list-group-item list-group-item-action d-flex align-items-center ${active ? 'active' : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="col-md-8 col-lg-9">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Use the dedicated admin client with the service role key.
    const supabase = createClient(ctx);

    // Check session if needed (optional if admin pages are behind a middleware)
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    // Also check if session.user.user_metadata.role is 'admin' if required.

    // Read query parameters for tab and pagination.
    const {tab = 'users', page = '1'} = ctx.query;
    const currentTab = (tab as string) as 'users' | 'events' | 'articles';
    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = 10;

    let users: User[] = [];
    let totalUsers = 0;
    if (currentTab === 'users') {
        // Use admin API to list users with pagination.
        const {data: userData, error: usersError} = await supabase.auth.admin.listUsers({
            page: currentPage,
            perPage,
        });
        if (usersError) {
            console.error("Error listing users:", usersError);
        }
        users = userData?.users || [];
        totalUsers = userData?.total_count || 0;
    }

    // For events, fetch from your API route.
    let events = [];
    if (currentTab === 'events') {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const eventsResponse = await fetch(`${baseUrl}/api/events`);
        events = await eventsResponse.json();
    }

    return {
        props: {
            tab: currentTab,
            users,
            totalUsers,
            page: currentPage,
            perPage,
            events,
        },
    };
};