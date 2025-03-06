import {CustomUserData} from "../../../models/user";
import {IEvent} from "../../../models/event";
import formatEventDates from "../../../../helpers/formatEventDates";

export interface BookingConfirmationData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
    event_location: string;
    agenda_url: string;
}

export function createBookingConfirmationData(user: CustomUserData, event: IEvent): BookingConfirmationData {

    return {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        event_name: event.title,
        event_date: formatEventDates(event.startDate, event.endDate),
        event_location: event.location,
        agenda_url: `https://www.electoralnetwork.org/events/${event._id}`
    };
}