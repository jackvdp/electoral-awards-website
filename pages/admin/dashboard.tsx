// pages/admin/dashboard.tsx
import {GetServerSideProps} from 'next';
import React from 'react';
import {useRouter} from 'next/router';
import AdminSidebar, {SidebarLink} from 'components/blocks/admin/AdminSidebar';
import UsersTable from 'components/blocks/admin/UsersTable';
import EventsTable from 'components/blocks/admin/EventsTable';
import {createClient} from 'backend/supabase/server-props';
import {User} from '@supabase/supabase-js';

interface DashboardProps {
    tab: 'users' | 'events' | 'articles';
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
    events: any[];
}

const Dashboard: React.FC<DashboardProps> = ({tab, users, totalUsers, page, perPage, events}) => {
    const router = useRouter();

    const sidebarLinks: SidebarLink[] = [
        {title: 'Users', url: '/admin/dashboard?tab=users', icon: 'uil-users-alt'},
        {title: 'Events', url: '/admin/dashboard?tab=events', icon: 'uil-calendar-alt'},
        {title: 'Articles', url: '/admin/dashboard?tab=articles', icon: 'uil-document-layout-left'},
    ];

    const stats = [
        {title: 'Total Users', value: totalUsers, icon: 'uil-users-alt', color: 'blue'},
        {title: 'Active Events', value: events.length, icon: 'uil-calendar-alt', color: 'green'},
        {title: 'Articles', value: '0', icon: 'uil-document-layout-left', color: 'purple'},
    ];

    const renderContent = () => {
        switch (tab) {
            case 'users':
                return <UsersTable users={users} totalUsers={totalUsers} page={page} perPage={perPage}
                                   allEvents={events}/>;
            case 'events':
                return <EventsTable events={events}/>;
            case 'articles':
                return (
                    <div className="card">
                        <div className="card-body">
                            <h4 className="text-center">Articles section coming soon...</h4>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="wrapper bg-light">
            <div className="py-8 py-md-10 px-4 px-lg-8">
                <div className="row mb-8">
                    <div className="col-12">
                        <h1 className="display-6 mb-0">Admin Dashboard</h1>
                    </div>
                </div>

                <div className="row gy-12">
                    {/* Sidebar */}
                    <div className="col-md-4 col-lg-3">
                        <AdminSidebar links={sidebarLinks}/>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-8 col-lg-9">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    // Read query parameters for tab and pagination.
    const {tab = 'users', page = '1'} = ctx.query;
    const currentTab = (tab as string) as 'users' | 'events' | 'articles';
    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = 10;

    let users: User[] = [];
    let totalUsers = 0;
    if (currentTab === 'users') {
        const {data: userData, error: usersError} = await supabase.auth.admin.listUsers({
            page: currentPage,
            perPage,
        });
        if (usersError) {
            console.error("Error listing users:", usersError);
        }
        users = userData?.users || [];
        totalUsers = userData?.users.length || 0;
    }

    let events = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const eventsResponse = await fetch(`${baseUrl}/api/events`);
    events = await eventsResponse.json();

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