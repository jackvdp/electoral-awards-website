import {
    escapeHtml,
    renderButton,
    renderLayout,
    SIGN_OFF_HTML,
    SIGN_OFF_TEXT,
} from './layout';

/**
 * Booking emails, rendered here rather than by the mail provider.
 *
 * These replace the Postmark stored templates (event-confirmation,
 * webinar-confirmation, event-invitation, webinar-invitation and
 * event-cancellation), which SMTP.com has no equivalent of. The model is
 * unchanged, so callers pass the same fields as before.
 */
export interface BookingEmailModel {
    name: string;
    event_name: string;
    event_date: string;
    event_location: string;
    agenda_url: string;
    accept_url?: string;
    decline_url?: string;
}

export interface RenderedEmail {
    subject: string;
    html: string;
    text: string;
}

function detailsHtml(model: BookingEmailModel, locationLabel: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;border-collapse:collapse;">
<tr><td style="padding:4px 16px 4px 0;color:#6b7280;">Event</td><td style="padding:4px 0;"><strong>${escapeHtml(model.event_name)}</strong></td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#6b7280;">Date</td><td style="padding:4px 0;">${escapeHtml(model.event_date)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#6b7280;">${escapeHtml(locationLabel)}</td><td style="padding:4px 0;">${escapeHtml(model.event_location)}</td></tr>
</table>`;
}

function detailsText(model: BookingEmailModel, locationLabel: string): string[] {
    return [
        `Event: ${model.event_name}`,
        `Date: ${model.event_date}`,
        `${locationLabel}: ${model.event_location}`,
    ];
}

export function renderBookingConfirmation(model: BookingEmailModel, isWebinar: boolean): RenderedEmail {
    const label = isWebinar ? 'webinar' : 'event';
    const locationLabel = isWebinar ? 'Format' : 'Location';
    const joiningLine = isWebinar
        ? 'We will send the joining link and any reading ahead of the session.'
        : 'We will be in touch with the final details closer to the date.';

    const html = renderLayout(`
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Your place is confirmed</h1>
<p style="margin:0 0 8px;">Dear ${escapeHtml(model.name)},</p>
<p style="margin:0 0 8px;">Thank you for registering. Your place at the following ${label} is confirmed:</p>
${detailsHtml(model, locationLabel)}
<p style="margin:0 0 16px;">${joiningLine}</p>
<p style="margin:0 0 8px;">${renderButton(model.agenda_url, 'View the agenda')}</p>
<p style="margin:16px 0 0;">If your plans change, please let us know by replying to this email.</p>
${SIGN_OFF_HTML}`);

    const text = [
        `Dear ${model.name},`,
        '',
        `Thank you for registering. Your place at the following ${label} is confirmed:`,
        '',
        ...detailsText(model, locationLabel),
        '',
        joiningLine,
        '',
        `Agenda: ${model.agenda_url}`,
        '',
        'If your plans change, please let us know by replying to this email.',
        '',
        ...SIGN_OFF_TEXT,
    ].join('\n');

    return {
        subject: `Registration confirmed: ${model.event_name}`,
        html,
        text,
    };
}

export function renderBookingInvitation(model: BookingEmailModel, isWebinar: boolean): RenderedEmail {
    const label = isWebinar ? 'webinar' : 'event';
    const locationLabel = isWebinar ? 'Format' : 'Location';
    const acceptUrl = model.accept_url || model.agenda_url;
    const declineUrl = model.decline_url || model.agenda_url;

    const html = renderLayout(`
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">You are invited</h1>
<p style="margin:0 0 8px;">Dear ${escapeHtml(model.name)},</p>
<p style="margin:0 0 8px;">We would be delighted to welcome you to the following ${label}:</p>
${detailsHtml(model, locationLabel)}
<p style="margin:0 0 16px;">Please let us know whether you can join us:</p>
<p style="margin:0 0 16px;">${renderButton(acceptUrl, 'Accept')}${renderButton(declineUrl, 'Decline', { backgroundColor: '#6b7280' })}</p>
<p style="margin:0;">${renderButton(model.agenda_url, 'View the agenda', { backgroundColor: '#ffffff', color: '#1a3a6b', borderColor: '#1a3a6b' })}</p>
<p style="margin:16px 0 0;font-size:14px;color:#6b7280;">If the buttons do not work, you can accept at ${escapeHtml(acceptUrl)} or decline at ${escapeHtml(declineUrl)}.</p>
${SIGN_OFF_HTML}`);

    const text = [
        `Dear ${model.name},`,
        '',
        `We would be delighted to welcome you to the following ${label}:`,
        '',
        ...detailsText(model, locationLabel),
        '',
        'Please let us know whether you can join us:',
        `Accept: ${acceptUrl}`,
        `Decline: ${declineUrl}`,
        '',
        `Agenda: ${model.agenda_url}`,
        '',
        ...SIGN_OFF_TEXT,
    ].join('\n');

    return {
        subject: `Invitation: ${model.event_name}`,
        html,
        text,
    };
}

export function renderBookingCancellation(model: BookingEmailModel): RenderedEmail {
    const html = renderLayout(`
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Your registration has been cancelled</h1>
<p style="margin:0 0 8px;">Dear ${escapeHtml(model.name)},</p>
<p style="margin:0 0 8px;">We can confirm that your registration for the following has been cancelled:</p>
${detailsHtml(model, 'Location')}
<p style="margin:0 0 16px;">If this was not what you intended, you can register again on the event page.</p>
<p style="margin:0 0 8px;">${renderButton(model.agenda_url, 'View the event')}</p>
<p style="margin:16px 0 0;">We hope to see you at a future session.</p>
${SIGN_OFF_HTML}`);

    const text = [
        `Dear ${model.name},`,
        '',
        'We can confirm that your registration for the following has been cancelled:',
        '',
        ...detailsText(model, 'Location'),
        '',
        'If this was not what you intended, you can register again on the event page:',
        model.agenda_url,
        '',
        'We hope to see you at a future session.',
        '',
        ...SIGN_OFF_TEXT,
    ].join('\n');

    return {
        subject: `Registration cancelled: ${model.event_name}`,
        html,
        text,
    };
}
