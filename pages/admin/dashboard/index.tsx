// pages/admin/index.tsx
import {GetServerSideProps} from 'next';
import React from 'react';
import UsersTable from 'components/blocks/admin/UsersTable';
import EventsTable from 'components/blocks/admin/EventsTable';
import {createClient} from 'backend/supabase/server-props';
import supabaseAdmin from "backend/supabase/admin";
import {User} from '@supabase/supabase-js';
import AdminPage from "components/blocks/admin/AdminPage";
import {MutableUserData} from "../../../src/backend/models/user";
import {IEvent} from "../../../src/backend/models/event";

interface DashboardProps {
    tab: 'users' | 'events' | 'articles';
    users: MutableUserData[];
    totalUsers: number;
    page: number;
    perPage: number;
    events: IEvent[];
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
    // if (!session || session.user.user_metadata.role !== '') {
    //     return {
    //         redirect: {
    //             destination: '/',
    //             permanent: false,
    //         },
    //     };
    // }

    const {tab = 'users', page = '1', search = ''} = ctx.query;
    const currentTab = (tab as string) as 'users' | 'events' | 'articles';
    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = 20;

    let users: User[] = [];
    let totalUsers = 0;
    if (currentTab === 'users') {

        if (search && search.length > 0) {
            // Use direct database query with search filter
            let query = supabaseAdmin
                .from('users')
                .select('*', {count: 'exact'});

            // Add search filter across multiple columns
            const searchTerm = `%${search}%`;
            query = query.or(`email.ilike.${searchTerm},firstname.ilike.${searchTerm},lastname.ilike.${searchTerm}`);

            // Add sorting
            query = query.order('country', {ascending: true})
                .order('lastname', {ascending: true});

            // Add pagination
            const from = (currentPage - 1) * perPage;
            const to = from + perPage - 1;
            query = query.range(from, to);

            // Execute the query
            const {data: userData, error: usersError, count} = await query;

            if (usersError) {
                console.error("Error searching users:", usersError);
            }

            users = userData || [];
            totalUsers = count || 0;
        } else {
            // No search term, just get paginated and sorted users
            const {data: userData, error: usersError, count} = await supabaseAdmin
                .from('users')
                .select('*', {count: 'exact'})
                .order('country', {ascending: true})
                .order('lastname', {ascending: true})
                .range((currentPage - 1) * perPage, currentPage * perPage - 1);

            if (usersError) {
                console.error("Error listing users:", usersError);
            }

            users = userData || [];
            totalUsers = count || 0;
        }
    }

    let events = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
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
            search
        },
    };
};