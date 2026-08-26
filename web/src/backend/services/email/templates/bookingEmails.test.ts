import { describe, it, expect } from 'vitest';
import {
    BookingEmailModel,
    renderBookingCancellation,
    renderBookingConfirmation,
    renderBookingInvitation,
} from './bookingEmails';

const model: BookingEmailModel = {
    name: 'Jane Smith',
    event_name: '22nd International Electoral Awards',
    event_date: '17 September 2026',
    event_location: 'Manila, Philippines',
    agenda_url: 'https://www.electoralnetwork.org/events/abc123',
};

describe('renderBookingConfirmation', () => {
    it('confirms the place and carries the event details in both parts', () => {
        const email = renderBookingConfirmation(model, false);

        expect(email.subject).toBe('Registration confirmed: 22nd International Electoral Awards');
        expect(email.html).toContain('Jane Smith');
        expect(email.html).toContain('17 September 2026');
        expect(email.html).toContain('Manila, Philippines');
        expect(email.html).toContain(model.agenda_url);
        expect(email.text).toContain('17 September 2026');
        expect(email.text).toContain(model.agenda_url);
    });

    it('uses webinar wording for a webinar', () => {
        const email = renderBookingConfirmation({ ...model, event_location: 'Online webinar' }, true);

        expect(email.html).toContain('webinar');
        expect(email.html).toContain('joining link');
    });
});

describe('renderBookingInvitation', () => {
    it('offers accept and decline links as buttons and as plain text', () => {
        const email = renderBookingInvitation({
            ...model,
            accept_url: 'https://www.electoralnetwork.org/api/bookings/respond?response=accepted',
            decline_url: 'https://www.electoralnetwork.org/api/bookings/respond?response=rejected',
        }, false);

        expect(email.subject).toBe('Invitation: 22nd International Electoral Awards');
        expect(email.html).toContain('response=accepted');
        expect(email.html).toContain('response=rejected');
        expect(email.text).toContain('Accept: https://www.electoralnetwork.org/api/bookings/respond?response=accepted');
        expect(email.text).toContain('Decline: https://www.electoralnetwork.org/api/bookings/respond?response=rejected');
    });

    it('falls back to the event page when no response links are supplied', () => {
        const email = renderBookingInvitation(model, false);

        expect(email.text).toContain(`Accept: ${model.agenda_url}`);
        expect(email.text).toContain(`Decline: ${model.agenda_url}`);
    });
});

describe('renderBookingCancellation', () => {
    it('confirms the cancellation and links back to the event', () => {
        const email = renderBookingCancellation(model);

        expect(email.subject).toBe('Registration cancelled: 22nd International Electoral Awards');
        expect(email.html).toContain('cancelled');
        expect(email.html).toContain(model.agenda_url);
        expect(email.text).toContain(model.agenda_url);
    });
});

describe('escaping', () => {
    it('escapes HTML in the recipient name and event fields', () => {
        const email = renderBookingConfirmation({
            ...model,
            name: '<script>alert("x")</script>',
            event_name: 'Elections & Democracy',
        }, false);

        expect(email.html).not.toContain('<script>');
        expect(email.html).toContain('&lt;script&gt;');
        expect(email.html).toContain('Elections &amp; Democracy');
    });
});
