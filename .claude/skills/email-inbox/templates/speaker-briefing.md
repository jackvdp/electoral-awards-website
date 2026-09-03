# Template: pre-event speaker briefing (logistics email to confirmed speakers)

The logistics email sent to a webinar or roundtable's confirmed speakers about a week before the event. Structure: thanks; the things needed from them (bio, slides); agenda with per-speaker timings; Zoom log-in details; screen-sharing and slide-backup note; timings caveat; Jack's contact number; closing thanks.

Compose it in Outlook via `compose.sh` with `--html`. Recipients are the speakers (Jack usually adds the addresses himself; use `placeholder@example.com` if unknown).

Substitute the bracketed fields: event title, date, agenda slots (start–end time, speaker name, title, organisation, format note), Zoom join link, Meeting ID, Passcode, speaker join time (usually 15 minutes before start), slide deadline (usually close of business the working day before), and the event-page URL on electoralnetwork.org.

Times: give UTC first with BST in brackets (or the reverse for a UK-centred event). Use en dashes for time ranges. Never use em dashes anywhere in the email.

```bash
.claude/skills/email-inbox/compose.sh \
  --to "placeholder@example.com" \
  --subject "Speaker briefing: [EVENT TITLE] ([DATE])" \
  --html \
  --body "<p>Dear all,</p>
<p>First, thank you for taking the time to share your views and experience at our webinar, <b>[EVENT TITLE]</b>, taking place on [DAY DATE]. This session is hosted online via Zoom.</p>
<p>Second, a couple of things I need from you if you have not sent them across already:</p>
<ol>
<li><p>A short bio I can use to introduce you (a few lines is plenty). If you would like us to change anything on <a href='[EVENT PAGE URL]'>the event page</a>, let me know.</p></li>
<li><p>Your presentation, if you intend to use one.</p></li>
</ol>
<p>Third, some logistical details for the day.</p>
<p><b>Speakers, timings and agenda</b> (all times [TIMEZONE NOTE])</p>
<p>[START] &ndash; [END]<br>
Welcome and introduction by the International Centre for Parliamentary Studies (ICPS)</p>
<p>[START] &ndash; [END]<br>
[Speaker Name], [Title], [Organisation] (20 minute presentation plus 5 minutes Q&amp;A)</p>
<p>[START] &ndash; [END]<br>
Open discussion and audience Q&amp;A. Not every topic on the advertised programme will be covered in the presentations, so if anything is missed I will raise it here to see whether any of you would like to comment.</p>
<p>[START] &ndash; [END]<br>
Close and final remarks from ICPS</p>
<p><b>Log in details</b></p>
<p>Join Zoom Meeting: <a href='[ZOOM JOIN LINK]'>click here</a><br>
Meeting ID: [MEETING ID]<br>
Passcode: [PASSCODE]</p>
<p>If you are able, please log in by [JOIN TIME] so we can iron out any IT issues before we start.</p>
<p><b>Presentations</b></p>
<p>Zoom allows you to share your screen, so you can have your slides open on your computer and present them directly. In case of technical issues on the day, please also email me your slides by close of business on [SLIDE DEADLINE].</p>
<p><b>Timings</b></p>
<p>We will do our best to keep to the agenda, but these things can move around. If we need to reach you privately during the call, please keep an eye on the chat box.</p>
<p><b>Contact details</b></p>
<p>I will be on hand throughout the event, so if you need anything let me know. My number is +44 7831 640003; please call or text at any point if you have any issues.</p>
<p>Thank you again for your support. We look forward to a lively discussion on the [DATE].</p>
<p>Kind regards,</p>"
```

Notes:

- Keep the "First / Second / Third" structure; it is the house style for this email.
- The standard slot is a 20 minute presentation plus 5 minutes of Q&A; adjust per event.
- No signature or sign-off name after "Kind regards," (the client appends Jack's signature).
- Based on the Public Policy Exchange speaker-briefing format Jack used previously.
