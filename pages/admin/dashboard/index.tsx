// pages/admin/index.tsx
import {GetServerSideProps} from 'next';
import React from 'react';
import UsersTable from 'components/blocks/admin/UsersTable';
import EventsTable from 'components/blocks/admin/EventsTable';
import {createClient} from 'backend/supabase/server-props';
import supabaseAdmin from "backend/supabase/admin";
import {User} from '@supabase/supabase-js';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import {MutableUserData} from "backend/models/user";
import {IEvent} from "backend/models/event";
import {IBooking} from "backend/models/booking";
import {getMultipleEventBookings} from "backend/use_cases/bookings/getMultipleEventBookings";
import Head from "next/head";

interface DashboardProps {
    tab: 'users' | 'future-events' | 'past-events' | 'articles';
    users: MutableUserData[];
    totalUsers: number;
    page: number;
    perPage: number;
    events: IEvent[];
    bookingsByEvent: Record<string, IBooking[]>
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

const Index: React.FC<DashboardProps> = ({tab, users, totalUsers, page, perPage, events, bookingsByEvent}) => {
    const renderContent = () => {
        switch (tab) {
            case 'users':
                return <UsersTable users={users} totalUsers={totalUsers} page={page} perPage={perPage}/>;
            case 'future-events':
            case 'past-events':
                return <EventsTable
                    events={events}
                    bookingsByEvent={bookingsByEvent}
                    title={tab === 'future-events' ? 'Upcoming Events' : 'Past Events'}
                />
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
        <AdminPage title={"Admin Dashboard"}>
            <Head>
                <title>Admin Dashboard | { tab.charAt(0).toUpperCase() + tab.slice(1) }</title>
            </Head>
            {renderContent()}
        </AdminPage>
    );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const {data: {session}} = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const {
        tab = 'users',
        page = '1',
        search = '',
        sortBy = 'country',  // Default sort field
        sortOrder = 'asc'     // Default sort order
    } = ctx.query;

    const currentTab = (tab as string) as 'users' | 'future-events' | 'past-events' | 'articles';
    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = 50;
    const currentSortBy = sortBy as string;
    const currentSortOrder = (sortOrder as string) === 'desc' ? 'desc' : 'asc';

    let users: User[] = [];
    let totalUsers = 0;

    if (currentTab === 'users') {
        // Initialize the query
        let query = supabaseAdmin
            .from('users')
            .select('*', {count: 'exact'});

        // Apply search filter if present
        if (search && search.length > 0) {
            const searchTerm = `%${search}%`;
            query = query.or(`email.ilike.${searchTerm},firstname.ilike.${searchTerm},lastname.ilike.${searchTerm}`);
        }

        // Apply sorting - validate sortBy against allowed columns first
        const allowedSortColumns = ['email', 'country', 'firstname', 'lastname', 'organisation', 'position', 'role'];
        const sortColumn = allowedSortColumns.includes(currentSortBy) ? currentSortBy : 'lastname';

        // Primary sort by the selected column
        query = query.order(sortColumn, {ascending: currentSortOrder === 'asc'});

        // If not sorting by lastname as primary, add it as secondary sort
        if (sortColumn !== 'lastname') {
            query = query.order('lastname', {ascending: true});
        }

        // Apply pagination
        const from = (currentPage - 1) * perPage;
        const to = from + perPage - 1;
        query = query.range(from, to);

        // Execute the query
        const {data: userData, error: usersError, count} = await query;

        if (usersError) {
            console.error("Error fetching users:", usersError);
        }

        users = userData || [];
        totalUsers = count || 0;
    }

    let events: IEvent[] = [];
    let bookingsByEventRecord: Record<string, IBooking[]> = {};

    if (currentTab === 'future-events' || currentTab === 'past-events') {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const eventsResponse = await fetch(`${baseUrl}/api/events`);
        events = await eventsResponse.json() as IEvent[];
        const isFutureEvents = currentTab === 'future-events';
        const currentDate = new Date();
        // Filter events based on tab
        events = events.filter(event => {
            const eventDate = new Date(event.endDate);
            return isFutureEvents ? eventDate >= currentDate : eventDate < currentDate;
        });
        // Sort events (ascending for future, descending for past)
        events = events.sort((a, b) => {
            const dateA = new Date(a.endDate).getTime();
            const dateB = new Date(b.endDate).getTime();
            return isFutureEvents ? dateA - dateB : dateB - dateA;
        });

        const eventIds = events.map(event => event._id as string);
        const { bookingsByEvent } = await getMultipleEventBookings({ eventIds: eventIds, status: 'accepted' });
        bookingsByEventRecord = bookingsByEvent
    }

    return {
        props: {
            tab: currentTab,
            users,
            totalUsers,
            page: currentPage,
            perPage,
            events,
            bookingsByEvent: JSON.parse(JSON.stringify(bookingsByEventRecord)),
            search: search || null,
            sortBy: currentSortBy,
            sortOrder: currentSortOrder
        },
    };
};