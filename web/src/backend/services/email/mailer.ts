import nodemailer, { Transporter } from 'nodemailer';

/**
 * Shared SMTP transport for every transactional email the site sends.
 *
 * The provider is SMTP.com. Port 587 uses STARTTLS, so the connection starts
 * in the clear and is upgraded before authentication: `secure` must stay false
 * and `requireTLS` must stay true. Implicit SSL on 587 does not work.
 *
 * Credentials come from the environment (see README). Nothing is hard-coded.
 */
const SMTP_HOST = process.env.SMTP_HOST || 'send.smtp.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';

export const DEFAULT_FROM_ADDRESS = process.env.SMTP_FROM || 'info@electoralnetwork.org';

let transporter: Transporter | null = null;

function getTransport(): Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
        });
    }
    return transporter;
}

export interface MailMessage {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
}

/**
 * Sends one message over SMTP. Rejects if the server refuses the message or
 * rejects every recipient, so callers can treat a resolved promise as a send.
 */
export async function sendMail(message: MailMessage): Promise<void> {
    if (!SMTP_USER || !SMTP_PASSWORD) {
        throw new Error('SMTP credentials are not configured (set SMTP_USER and SMTP_PASSWORD)');
    }

    const info = await getTransport().sendMail({
        from: message.from || DEFAULT_FROM_ADDRESS,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.html,
        text: message.text,
    });

    if (info?.rejected?.length) {
        throw new Error(`SMTP rejected recipient(s): ${info.rejected.join(', ')}`);
    }
}
