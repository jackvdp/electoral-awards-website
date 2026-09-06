# Delegate briefing (joining details to registered delegates)

## When to use

The joining-instructions email sent to registered delegates ahead of a webinar or roundtable, usually the day before the event.

## Recipients

Normally sent out by the admin team (Devianee, `cnithoo@parlistudies.org`) rather than by Jack, so compose it to whoever will send it, with the body addressed to the delegate.

## Subject

`Joining details: [EVENT TITLE] ([DATE])`

## Fields to substitute

- Event title and date
- Speaker list: name, title, organisation, one per line. A line can also describe a partner or product rather than a person, e.g. `NOMOS, a news, content, and connection layer built specifically for electoral bodies.`
- Start time and recommended join time (normally 15 minutes before the start)
- Zoom join link, Meeting ID, Passcode
- Event-page URL on electoralnetwork.org

## Body

```bash
.claude/skills/email-inbox/compose.sh \
  --to "cnithoo@parlistudies.org" \
  --subject "Joining details: [EVENT TITLE] ([DATE])" \
  --html \
  --body "<p>Dear Delegate,</p>
<p>Thank you for registering to attend the International Centre for Parliamentary Studies (ICPS) webinar: <b>[EVENT TITLE]</b>, taking place [DAY DATE]. This webinar is hosted online via Zoom.</p>
<p>We are delighted to confirm the following speakers:</p>
<p>[Speaker Name], [Title], [Organisation]<br>
[Speaker Name], [Title], [Organisation]</p>
<p>The event starts at [START TIME] BST (UTC+1), but as a caveat we advise that you join using the link provided at [JOIN TIME] BST, as this will allow us to iron out any potential IT issues before the agenda starts.</p>
<p>Below are the details you will require in order to join. The link is already active, but you will be unable to join the room until the session starts.</p>
<p><b>Topic:</b> [EVENT TITLE]<br>
<b>Time:</b> [DAY DATE], [START TIME] BST (UTC+1)</p>
<p><b>Join Zoom Meeting:</b> <a href='[ZOOM JOIN LINK]'>click here</a></p>
<p>Meeting ID: [MEETING ID]<br>
Passcode: [PASSCODE]</p>
<p>For the full programme and session details, please see our event page: <a href='[EVENT PAGE URL]'>click here</a></p>
<p>I will be present throughout the entire event to assist with any technical issues that may arise.</p>
<p>If you have any questions, please do not hesitate to ask.</p>
<p>Kind regards,</p>"
```

## Notes

- Confirm with the user when the email will actually be sent before writing "tomorrow"; default to the explicit date if there is any doubt.
- Adjust the timezone label (BST/GMT) to the date of the event.
