// pages/admin/index.tsx
import {GetServerSideProps} from 'next';
import React from 'react';
import UsersTable from 'components/blocks/admin/UsersTable';
import EventsTable from 'components/blocks/admin/EventsTable';
import {createClient} from 'backend/supabase/server-props';
import {User} from '@supabase/supabase-js';
import AdminPage from "components/blocks/admin/AdminPage";

interface DashboardProps {
    tab: 'users' | 'events' | 'articles';
    users: User[];
    totalUsers: number;
    page: number;
    perPage: number;
    events: any[];
}

const Index: React.FC<DashboardProps> = ({tab, users, totalUsers, page, perPage, events}) => {


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
        <AdminPage title={"Admin Index"}>{renderContent()}</AdminPage>
    );
};

export default Index;

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