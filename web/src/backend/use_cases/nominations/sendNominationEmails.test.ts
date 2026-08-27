import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendNominationEmails } from './sendNominationEmails';
import { INomination } from 'backend/models/nomination';
import { NOMINATIONS_PERIOD } from 'data/awards-config';

const { sendMailMock } = vi.hoisted(() => ({ sendMailMock: vi.fn() }));

vi.mock('backend/services/email/mailer', () => ({
    sendMail: sendMailMock,
}));

const NOMINATOR_EMAIL = 'jane@example.org';
const DEFAULT_ADMIN_EMAIL = 'jack.vanderpump@publicpolicyexchange.co.uk';

const buildNomination = (overrides: Record<string, unknown> = {}): INomination => ({
    _id: 'nom-123',
    nominatorName: 'Jane Smith',
    nominatorOrganization: 'Electoral Commission of Testland',
    nominatorPosition: 'Director of Elections',
    email: NOMINATOR_EMAIL,
    nominatorPhone: '+441234567890',
    nomineeName: 'Testland EMB',
    nomineeEmail: 'emb@example.org',
    nomineePhone: '+449876543210',
    awardCategory: 'Accessibility Award',
    initiativeDescription: 'A description of the initiative.',
    supportingEvidence: 'Some supporting evidence.',
    documents: [],
    createdAt: new Date('2026-07-01T12:00:00Z'),
    ...overrides,
}) as unknown as INomination;

const sentMessages = () => sendMailMock.mock.calls.map(call => call[0]);
const messageTo = (recipient: string) => sentMessages().find(msg => msg.to === recipient);

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
    sendMailMock.mockReset().mockResolvedValue(undefined);
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    consoleError.mockRestore();
});

describe('sendNominationEmails', () => {
    it('sends a confirmation to the nominator and a notification to the administrator', async () => {
        await sendNominationEmails(buildNomination());

        expect(sendMailMock).toHaveBeenCalledTimes(2);
        const confirmation = messageTo(NOMINATOR_EMAIL);
        const notification = messageTo(DEFAULT_ADMIN_EMAIL);
        expect(confirmation).toBeDefined();
        expect(notification).toBeDefined();
        expect(confirmation.from).toBe('info@electoralnetwork.org');
        expect(notification.from).toBe('info@electoralnetwork.org');
    });

    it('summarises the submission in the nominator confirmation', async () => {
        await sendNominationEmails(buildNomination());

        const confirmation = messageTo(NOMINATOR_EMAIL);
        expect(confirmation.subject).toContain(NOMINATIONS_PERIOD.edition);
        expect(confirmation.html).toContain('Testland EMB');
        expect(confirmation.html).toContain('Accessibility Award');
        expect(confirmation.html).toContain('1 July 2026');
        expect(confirmation.html).toContain('No supporting documents');
        expect(confirmation.text).toContain('Testland EMB');
    });

    it('includes the account page link only for logged-in submitters', async () => {
        await sendNominationEmails(buildNomination({ userId: 'supabase-uid-1' }));
        expect(messageTo(NOMINATOR_EMAIL).html).toContain('/account');

        sendMailMock.mockClear();

        await sendNominationEmails(buildNomination());
        expect(messageTo(NOMINATOR_EMAIL).html).not.toContain('/account');
    });

    it('gives the administrator the full submission with Reply-To set to the nominator', async () => {
        await sendNominationEmails(buildNomination());

        const notification = messageTo(DEFAULT_ADMIN_EMAIL);
        expect(notification.replyTo).toBe(NOMINATOR_EMAIL);
        expect(notification.subject).toBe('New nomination: Testland EMB – Accessibility Award');
        expect(notification.html).toContain('Jane Smith');
        expect(notification.html).toContain('Electoral Commission of Testland');
        expect(notification.html).toContain('A description of the initiative.');
        expect(notification.html).toContain('Some supporting evidence.');
        expect(notification.html).toContain('nom-123');
    });

    it('lists uploaded documents in both emails', async () => {
        await sendNominationEmails(buildNomination({
            documents: [
                { name: 'evidence.pdf', url: 'https://blob.example/evidence.pdf', size: 123, contentType: 'application/pdf' },
            ],
        }));

        expect(messageTo(NOMINATOR_EMAIL).html).toContain('1 supporting document');
        const notification = messageTo(DEFAULT_ADMIN_EMAIL);
        expect(notification.html).toContain('https://blob.example/evidence.pdf');
        expect(notification.html).toContain('evidence.pdf');
    });

    it('escapes HTML in user-supplied fields', async () => {
        await sendNominationEmails(buildNomination({
            nomineeName: '<script>alert("x")</script>',
            initiativeDescription: 'Line one\nLine <b>two</b>',
        }));

        for (const message of sentMessages()) {
            expect(message.html).not.toContain('<script>');
            expect(message.html).toContain('&lt;script&gt;');
        }
        const notification = messageTo(DEFAULT_ADMIN_EMAIL);
        expect(notification.html).toContain('Line one<br>Line &lt;b&gt;two&lt;/b&gt;');
    });

    it('still sends the admin notification when the nominator email fails, without throwing', async () => {
        // The nominator confirmation is dispatched first, so reject the first call only.
        sendMailMock.mockRejectedValueOnce(new Error('SMTP down'));

        await expect(sendNominationEmails(buildNomination())).resolves.toBeUndefined();

        expect(sendMailMock).toHaveBeenCalledTimes(2);
        expect(messageTo(DEFAULT_ADMIN_EMAIL)).toBeDefined();
        expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining('nominator confirmation'),
            expect.any(Error),
        );
    });

    it('logs both failures without throwing when the SMTP send rejects', async () => {
        sendMailMock.mockRejectedValue(new Error('Inactive recipient'));

        await expect(sendNominationEmails(buildNomination())).resolves.toBeUndefined();

        expect(consoleError).toHaveBeenCalledTimes(2);
    });

    it('sends the admin notification to NOMINATIONS_ADMIN_EMAIL when set', async () => {
        vi.resetModules();
        process.env.NOMINATIONS_ADMIN_EMAIL = 'awards@icps.example';
        try {
            const freshModule = await import('./sendNominationEmails');
            await freshModule.sendNominationEmails(buildNomination());

            expect(messageTo('awards@icps.example')).toBeDefined();
            expect(messageTo(DEFAULT_ADMIN_EMAIL)).toBeUndefined();
        } finally {
            delete process.env.NOMINATIONS_ADMIN_EMAIL;
            vi.resetModules();
        }
    });
});
