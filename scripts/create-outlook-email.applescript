-- Create a formatted HTML email in Microsoft Outlook
-- Supports: bold, italic, underlined text, hyperlinks, lists, colours, spacing

set recipientEmail to "recipient@example.com"
set emailSubject to "Your Subject Here"

-- HTML body Ñ edit this section to customise your email
set htmlBody to "<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 15px;
      color: #1a1a1a;
      line-height: 1.6;
      max-width: 620px;
    }
    p { margin: 0 0 14px 0; }
    .greeting { font-size: 15px; }
    .section-heading {
      font-weight: bold;
      font-size: 16px;
      color: #003366;
      margin: 20px 0 6px 0;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 4px;
    }
    ul { margin: 6px 0 14px 0; padding-left: 20px; }
    li { margin-bottom: 6px; }
    a { color: #0056b3; text-decoration: underline; }
    .highlight { background-color: #fff3cd; padding: 2px 4px; }
    .signature { margin-top: 28px; font-size: 14px; color: #333; }
    .sig-name { font-weight: bold; font-size: 15px; }
    .sig-divider { border: none; border-top: 1px solid #cccccc; margin: 10px 0; }
  </style>
</head>
<body>

  <p class='greeting'>Dear [Name],</p>

  <p>
    Thank you for your interest in the <strong>International Electoral Awards &amp; Symposium</strong>.
    We are pleased to share the following information regarding the <u>22nd International Electoral Awards</u>,
    taking place in <em>Manila, Philippines</em>.
  </p>

  <p class='section-heading'>Key Details</p>
  <ul>
    <li><strong>Dates:</strong> 29 November Ð 3 December 2026</li>
    <li><strong>Venue:</strong> The Manila Hotel, Manila, Philippines</li>
    <li><strong>Co-host:</strong> Commission on Elections of the Philippines (COMELEC)</li>
    <li><strong>Accommodation:</strong> Provided for all delegates at the venue</li>
  </ul>

  <p class='section-heading'>How to Nominate</p>
  <p>
    Nominations are submitted via our online portal. The process takes approximately
    <span class='highlight'>20Ð30 minutes</span> and covers five steps including nominee details,
    category selection, and supporting documentation.
  </p>
  <p>
    <a href='https://electoralnetwork.org/awards/submit'>Submit a nomination &rarr;</a>
  </p>

  <p class='section-heading'>Further Information</p>
  <p>
    Full details on <strong>award categories</strong>, <strong>eligibility criteria</strong>, and the
    <strong>judging process</strong> are available on our website:
    <a href='https://electoralnetwork.org/awards'>electoralnetwork.org/awards</a>
  </p>

  <p>
    Should you have any questions, please do not hesitate to
    <a href='mailto:info@electoralnetwork.org'>contact us directly</a>.
  </p>

  <p>We look forward to receiving your nomination.</p>

  <p>Kind regards,</p>

  <div class='signature'>
    <p class='sig-name'>Jack Vanderpump</p>
    <hr class='sig-divider'>
    <p>
      Head of Policy Research<br>
      <strong>International Centre for Parliamentary Studies (ICPS)</strong><br>
      <a href='https://electoralnetwork.org'>electoralnetwork.org</a>
    </p>
  </div>

</body>
</html>"

-- Create the email in Outlook
tell application "Microsoft Outlook"
	set newMessage to make new outgoing message with properties {subject:emailSubject, content:htmlBody}

	-- Add recipient (remove or comment out if you want to leave To: blank)
	-- make new recipient at newMessage with properties {email address:{address:recipientEmail}}

	-- Open the compose window so you can review before sending
	open newMessage
	activate
end tell