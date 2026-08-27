export const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

export const toHtmlParagraph = (value: string): string =>
    escapeHtml(value).replace(/\n/g, '<br>');

/**
 * Wraps message content in the Network's email shell. Inline styles only:
 * most email clients strip stylesheets.
 */
export function renderLayout(contentHtml: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#22252a;">
<div style="background-color:#ffffff;border-radius:6px;padding:32px;">
${contentHtml}
</div>
<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">
Electoral Members' Network, International Centre for Parliamentary Studies<br>
<a href="https://www.electoralnetwork.org" style="color:#6b7280;">www.electoralnetwork.org</a>
</p>
</div>
</body>
</html>`;
}

export interface ButtonStyle {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
}

/** Renders a call-to-action button that degrades to a plain link. */
export function renderButton(url: string, label: string, style: ButtonStyle = {}): string {
    const backgroundColor = style.backgroundColor || '#1a3a6b';
    const color = style.color || '#ffffff';
    const border = style.borderColor ? `border:1px solid ${style.borderColor};` : '';
    return `<a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 24px;margin:4px 8px 4px 0;background-color:${backgroundColor};color:${color};${border}text-decoration:none;border-radius:4px;font-weight:bold;">${escapeHtml(label)}</a>`;
}

export const SIGN_OFF_HTML =
    '<p style="margin:24px 0 0;">Best wishes,<br>The International Centre for Parliamentary Studies</p>';

export const SIGN_OFF_TEXT = ['Best wishes,', 'The International Centre for Parliamentary Studies'];
