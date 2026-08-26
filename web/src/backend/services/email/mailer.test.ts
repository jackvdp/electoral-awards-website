import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createTransportMock, sendMailMock } = vi.hoisted(() => ({
    createTransportMock: vi.fn(),
    sendMailMock: vi.fn(),
}));

vi.mock('nodemailer', () => ({
    default: { createTransport: createTransportMock },
    createTransport: createTransportMock,
}));

const loadMailer = async () => {
    vi.resetModules();
    return import('./mailer');
};

beforeEach(() => {
    createTransportMock.mockReset().mockReturnValue({ sendMail: sendMailMock });
    sendMailMock.mockReset().mockResolvedValue({ rejected: [] });
    process.env.SMTP_USER = 'electoralnetwork';
    process.env.SMTP_PASSWORD = 'test-password';
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_FROM;
});

describe('sendMail', () => {
    it('connects to SMTP.com on port 587 with STARTTLS, never implicit SSL', async () => {
        const { sendMail } = await loadMailer();
        await sendMail({ to: 'someone@example.org', subject: 'Hello', text: 'Hi' });

        expect(createTransportMock).toHaveBeenCalledWith(expect.objectContaining({
            host: 'send.smtp.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: { user: 'electoralnetwork', pass: 'test-password' },
        }));
    });

    it('reuses a single transport across sends', async () => {
        const { sendMail } = await loadMailer();
        await sendMail({ to: 'a@example.org', subject: 'One', text: 'One' });
        await sendMail({ to: 'b@example.org', subject: 'Two', text: 'Two' });

        expect(createTransportMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledTimes(2);
    });

    it('takes host, port and sender from the environment when set', async () => {
        process.env.SMTP_HOST = 'smtp.example.org';
        process.env.SMTP_PORT = '2525';
        process.env.SMTP_FROM = 'noreply@example.org';

        const { sendMail } = await loadMailer();
        await sendMail({ to: 'someone@example.org', subject: 'Hello', text: 'Hi' });

        expect(createTransportMock).toHaveBeenCalledWith(expect.objectContaining({
            host: 'smtp.example.org',
            port: 2525,
        }));
        expect(sendMailMock.mock.calls[0][0].from).toBe('noreply@example.org');
    });

    it('defaults the sender to the Network address and passes the message through', async () => {
        const { sendMail } = await loadMailer();
        await sendMail({
            to: 'someone@example.org',
            replyTo: 'nominator@example.org',
            subject: 'Hello',
            html: '<p>Hi</p>',
            text: 'Hi',
        });

        expect(sendMailMock).toHaveBeenCalledWith({
            from: 'info@electoralnetwork.org',
            to: 'someone@example.org',
            replyTo: 'nominator@example.org',
            subject: 'Hello',
            html: '<p>Hi</p>',
            text: 'Hi',
        });
    });

    it('throws when credentials are missing, rather than opening a connection', async () => {
        delete process.env.SMTP_PASSWORD;

        const { sendMail } = await loadMailer();
        await expect(sendMail({ to: 'someone@example.org', subject: 'Hello', text: 'Hi' }))
            .rejects.toThrow(/SMTP credentials/);
        expect(createTransportMock).not.toHaveBeenCalled();
    });

    it('throws when the server rejects the recipient', async () => {
        sendMailMock.mockResolvedValue({ rejected: ['someone@example.org'] });

        const { sendMail } = await loadMailer();
        await expect(sendMail({ to: 'someone@example.org', subject: 'Hello', text: 'Hi' }))
            .rejects.toThrow(/rejected recipient/);
    });
});
