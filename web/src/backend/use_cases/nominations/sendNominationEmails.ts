import { INomination } from 'backend/models/nomination';
import { sendMail } from 'backend/services/email/mailer';
import { escapeHtml, toHtmlParagraph } from 'backend/services/email/templates/layout';
import { NOMINATIONS_PERIOD } from 'data/awards-config';

const FROM_ADDRESS = 'info@electoralnetwork.org';
const ADMIN_EMAIL = process.env.NOMINATIONS_ADMIN_EMAIL || 'jack.vanderpump@publicpolicyexchange.co.uk';

const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

async function sendConfirmationToNominator(nomination: INomination): Promise<void> {
    const documentsLine = nomination.documents.length
        ? `${nomination.documents.length} supporting document${nomination.documents.length === 1 ? '' : 's'}`
        : 'No supporting documents';

    // Only logged-in submitters can view and edit their nomination from the account page.
    const accountLine = nomination.userId
        ? '<p>You can view and edit your nomination from the <a href="https://electoralnetwork.org/account">account page</a> at any time while nominations remain open.</p>'
        : '';

    const htmlBody = `
        <p>Dear ${escapeHtml(nomination.nominatorName)},</p>
        <p>Thank you for your nomination for the ${NOMINATIONS_PERIOD.edition}. We have received the following submission:</p>
        <ul>
            <li><strong>Nominee:</strong> ${escapeHtml(nomination.nomineeName)}</li>
            <li><strong>Category:</strong> ${escapeHtml(nomination.awardCategory)}</li>
            <li><strong>Submitted:</strong> ${formatDate(nomination.createdAt ?? new Date())}</li>
            <li><strong>Documents:</strong> ${documentsLine}</li>
        </ul>
        ${accountLine}
        <p>If you have any questions, just reply to this email.</p>
        <p>Best wishes,<br>The International Centre for Parliamentary Studies</p>
    `;

    const textBody = [
        `Dear ${nomination.nominatorName},`,
        '',
        `Thank you for your nomination for the ${NOMINATIONS_PERIOD.edition}. We have received the following submission:`,
        '',
        `Nominee: ${nomination.nomineeName}`,
        `Category: ${nomination.awardCategory}`,
        `Submitted: ${formatDate(nomination.createdAt ?? new Date())}`,
        `Documents: ${documentsLine}`,
        '',
        'If you have any questions, just reply to this email.',
        '',
        'Best wishes,',
        'The International Centre for Parliamentary Studies',
    ].join('\n');

    await sendMail({
        from: FROM_ADDRESS,
        to: nomination.email,
        subject: `We have received your nomination – ${NOMINATIONS_PERIOD.edition}`,
        html: htmlBody,
        text: textBody,
    });
}

async function sendNotificationToAdmin(nomination: INomination): Promise<void> {
    const optional = (label: string, value?: string): string =>
        value && value.trim() ? `<li><strong>${label}:</strong> ${escapeHtml(value)}</li>` : '';

    const documentsHtml = nomination.documents.length
        ? `<ul>${nomination.documents.map(doc =>
            `<li><a href="${escapeHtml(doc.url)}">${escapeHtml(doc.name)}</a></li>`
        ).join('')}</ul>`
        : '<p>No supporting documents uploaded.</p>';

    const htmlBody = `
        <p>A new nomination has been submitted for the ${NOMINATIONS_PERIOD.edition}.</p>
        <h3>Nominee</h3>
        <ul>
            <li><strong>Name:</strong> ${escapeHtml(nomination.nomineeName)}</li>
            ${optional('Position', nomination.nomineePosition)}
            ${optional('Organisation', nomination.nomineeOrganization)}
            <li><strong>Email:</strong> ${escapeHtml(nomination.nomineeEmail)}</li>
            <li><strong>Phone:</strong> ${escapeHtml(nomination.nomineePhone)}</li>
            <li><strong>Category:</strong> ${escapeHtml(nomination.awardCategory)}</li>
        </ul>
        <h3>Nominator</h3>
        <ul>
            <li><strong>Name:</strong> ${escapeHtml(nomination.nominatorName)}</li>
            <li><strong>Position:</strong> ${escapeHtml(nomination.nominatorPosition)}</li>
            <li><strong>Organisation:</strong> ${escapeHtml(nomination.nominatorOrganization)}</li>
            <li><strong>Email:</strong> ${escapeHtml(nomination.email)}</li>
            <li><strong>Phone:</strong> ${escapeHtml(nomination.nominatorPhone)}</li>
        </ul>
        <h3>Description of the initiative</h3>
        <p>${toHtmlParagraph(nomination.initiativeDescription)}</p>
        <h3>Supporting evidence</h3>
        <p>${toHtmlParagraph(nomination.supportingEvidence)}</p>
        ${nomination.referenceName ? `
        <h3>Reference</h3>
        <ul>
            <li><strong>Name:</strong> ${escapeHtml(nomination.referenceName)}</li>
            ${optional('Position', nomination.referencePosition)}
            ${optional('Organisation', nomination.referenceOrganization)}
            ${optional('Email', nomination.referenceEmail)}
            ${optional('Phone', nomination.referencePhone)}
        </ul>` : ''}
        <h3>Documents</h3>
        ${documentsHtml}
        <p>Record ID: ${nomination._id}</p>
    `;

    const textBody = [
        `A new nomination has been submitted for the ${NOMINATIONS_PERIOD.edition}.`,
        '',
        `Nominee: ${nomination.nomineeName} (${nomination.awardCategory})`,
        `Nominator: ${nomination.nominatorName}, ${nomination.nominatorOrganization} (${nomination.email})`,
        '',
        'Description of the initiative:',
        nomination.initiativeDescription,
        '',
        'Supporting evidence:',
        nomination.supportingEvidence,
        '',
        nomination.documents.length
            ? `Documents:\n${nomination.documents.map(doc => `- ${doc.name}: ${doc.url}`).join('\n')}`
            : 'No supporting documents uploaded.',
        '',
        `Record ID: ${nomination._id}`,
    ].join('\n');

    await sendMail({
        from: FROM_ADDRESS,
        to: ADMIN_EMAIL,
        replyTo: nomination.email,
        subject: `New nomination: ${nomination.nomineeName} – ${nomination.awardCategory}`,
        html: htmlBody,
        text: textBody,
    });
}

/**
 * Sends the post-submission emails: a confirmation to the nominator and a
 * notification to the awards administrator. Failures are logged, never thrown,
 * so a mail outage cannot fail a submission that has already been saved.
 */
export async function sendNominationEmails(nomination: INomination): Promise<void> {
    const results = await Promise.allSettled([
        sendConfirmationToNominator(nomination),
        sendNotificationToAdmin(nomination),
    ]);
    const labels = ['nominator confirmation', 'admin notification'];
    results.forEach((result, i) => {
        if (result.status === 'rejected') {
            console.error(`Error sending ${labels[i]} email for nomination ${nomination._id}:`, result.reason);
        }
    });
}
