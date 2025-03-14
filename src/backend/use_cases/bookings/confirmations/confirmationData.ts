import {MutableUserData} from "backend/models/user";
import {IEvent} from "backend/models/event";
import formatEventDates from "helpers/formatEventDates";

export interface BookingConfirmationData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
    event_location: string;
    agenda_url: string;
    userId: string;
    eventId: string;
}

export function createBookingConfirmationData(user: MutableUserData, event: IEvent): BookingConfirmationData {

    return {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        event_name: event.title,
        event_date: formatEventDates(event.startDate, event.endDate),
        event_location: event.location,
        agenda_url: `https://www.electoralnetwork.org/events/${event._id}`,
        userId: user.id,
        eventId: event._id as string
    };
}