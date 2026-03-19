// Data for the 2026 Delegate Acquisition Comms Plan dashboard

export interface CommEmail {
    id: number;
    wc: string;       // w/c date
    weekStart: string; // ISO date for calendar positioning
    primary: string;
    secondary: string;
    subject: string;
    cta: string;
    audience: string;
    detail: string;
    status: 'drafted' | 'sent' | 'pending';
    phase: number;
    tags: string[];    // e.g. ['registration', 'nominations', 'speakers']
    templateFile?: string; // .eml filename in emails/ directory
}

export interface Phase {
    id: number;
    name: string;
    period: string;
    goal: string;
    targetRegistrations: string;
    colour: string;
    phoneWave?: string;
}

export interface SocialPost {
    wc: string;
    count: number;
    description: string;
}

export interface CommsPlanData {
    title: string;
    subtitle: string;
    coHost: string;
    targetDelegates: string;
    phases: Phase[];
    emails: CommEmail[];
    socialPosts: SocialPost[];
    sellingPoints: { icon: string; text: string }[];
    notes: string[];
    calendarMonths: { name: string; year: number; month: number }[];
    eventMarker: { label: string; position: number };
    keyDates: { label: string; position: number; colour: string }[];
}

export const commsPlan2026: CommsPlanData = {
    title: '2026 Programme: 22nd International Electoral Awards & Symposium | Webinars',
    subtitle: '29 November – 3 December 2026 | The Manila Hotel, Manila, Philippines',
    coHost: 'Co-hosted by ICPS & COMELEC',
    targetDelegates: '150–200',

    calendarMonths: [
        { name: 'Mar', year: 2026, month: 2 },
        { name: 'Apr', year: 2026, month: 3 },
        { name: 'May', year: 2026, month: 4 },
        { name: 'Jun', year: 2026, month: 5 },
        { name: 'Jul', year: 2026, month: 6 },
        { name: 'Aug', year: 2026, month: 7 },
        { name: 'Sep', year: 2026, month: 8 },
        { name: 'Oct', year: 2026, month: 9 },
        { name: 'Nov', year: 2026, month: 10 },
    ],

    eventMarker: { label: 'EVENT: 29 Nov – 3 Dec', position: (8 + 4.2 / 5) / 9 },

    keyDates: [
        { label: 'Noms open', position: (1 + 0.2) / 9, colour: '#45c4a0' },
        { label: 'Webinar 1', position: (1 + 2.4 / 5) / 9, colour: '#e8a317' },
        { label: 'Webinar 2', position: (3 + 1.6 / 5) / 9, colour: '#e8a317' },
        { label: 'Noms close', position: (5 + 4.2 / 5) / 9, colour: '#e2626b' },
        { label: 'Webinar 3', position: (6 + 2.3 / 5) / 9, colour: '#e8a317' },
    ],

    phases: [
        { id: 1, name: 'Launch & Early Momentum', period: 'March – April', goal: 'Announce the event, drive early registrations, open nominations', targetRegistrations: '30–40', colour: '#3f78e0', phoneWave: 'Wave 1: w/c 24 Mar – 11 Apr — VIPs, past attendees, Asia-Pacific EMBs' },
        { id: 2, name: 'Build Awareness & Credibility', period: 'May – June', goal: 'Sustain momentum, announce programme milestones, convert interest', targetRegistrations: '60–80', colour: '#45c4a0', phoneWave: 'Wave 2: 12–30 May — Contacts who opened but didn\'t register, under-represented regions' },
        { id: 3, name: 'Summer Push & Nominations Close', period: 'July – August', goal: 'Drive registrations through summer, close nominations strongly', targetRegistrations: '100–120', colour: '#f78b77', phoneWave: 'Wave 3: 14 Jul – 1 Aug — Remaining priority contacts, nomination pipeline leads' },
        { id: 4, name: 'Final Conversion', period: 'September – October', goal: 'Convert remaining prospects, build anticipation, lock in numbers', targetRegistrations: '140–160', colour: '#7c69ef', phoneWave: 'Wave 4: 22 Sep – 10 Oct — Final fence-sitters, new leads from nominations' },
        { id: 5, name: 'Final Countdown', period: 'November', goal: 'Confirm logistics, build excitement, last-chance registrations', targetRegistrations: '150–200', colour: '#e2626b', phoneWave: 'Wave 5: 3–14 Nov — Last-chance personal outreach to high-value contacts' },
    ],

    emails: [
        {
            id: 1, wc: '16 Mar', weekStart: '2026-03-16', phase: 1,
            primary: 'Formal invitation & event launch',
            secondary: 'Register now; introduce 2026 co-host',
            subject: 'Invitation to the 22nd International Electoral Awards — Manila',
            cta: 'Register now',
            audience: 'Full database. Personalised versions for 2025 attendees.',
            detail: 'Full event details, dates, venue, COMELEC co-host, free attendance, accommodation covered.',
            status: 'drafted',
            tags: ['registration'],
            templateFile: '2026-03-email-01-invitation.eml',
        },
        {
            id: 2, wc: '30 Mar', weekStart: '2026-03-30', phase: 1,
            primary: '2026 programme announcement',
            secondary: 'Introduce the year ahead; tease nominations',
            subject: 'Our 2026 programme — Awards, webinars, and more',
            cta: 'Register now / Save the dates',
            audience: 'Full database.',
            detail: 'Announce the full 2026 programme: the 22nd International Electoral Awards in Manila (29 Nov – 3 Dec), plus three webinars — Empowering the Election Workforce (17 Apr), Speed in Election Results Transmission (11 Jun), and Inclusive Elections (16 Sep). Recap 2025 highlights and set the tone for the year. Soft tease that nominations open in April.',
            status: 'pending',
            tags: ['registration', 'nominations', 'webinars'],
        },
        {
            id: 3, wc: '6 Apr', weekStart: '2026-04-06', phase: 1,
            primary: 'Webinar invitation: Empowering the Election Workforce',
            secondary: 'Nominations opening soon; register for Manila',
            subject: 'Join us — Empowering the Election Workforce | 17 April',
            cta: 'Register for webinar',
            audience: 'Full database.',
            detail: 'Dedicated invitation for the first webinar of the year (17 April, 14:00 UTC). ICPS global workforce survey findings across 26 jurisdictions — recruitment, training, retention challenges, blockchain solutions. Mention nominations opening the following week and the Awards in Manila.',
            status: 'pending',
            tags: ['webinars'],
        },
        {
            id: 4, wc: '13 Apr', weekStart: '2026-04-13', phase: 1,
            primary: 'Nominations now open',
            secondary: 'Webinar this Friday; register for Manila',
            subject: 'Nominations open — 22nd International Electoral Awards',
            cta: 'Submit a nomination / Register',
            audience: 'Full database.',
            detail: 'Explain the 8 categories, the process, the deadline (31 August). "Haven\'t registered yet? Attendance is free and accommodation at The Manila Hotel is covered." Reminder: Workforce webinar this Friday (17 April) — last chance to sign up.',
            status: 'pending',
            tags: ['nominations', 'registration', 'webinars'],
        },
        {
            id: 5, wc: '27 Apr', weekStart: '2026-04-27', phase: 1,
            primary: 'Category spotlight (3–4 categories)',
            secondary: 'Workforce webinar recap; Manila venue info',
            subject: 'Which category fits your initiative?',
            cta: 'Submit a nomination / Register',
            audience: 'Full database (emphasis on EMBs who haven\'t nominated).',
            detail: 'Deep-dive on 3–4 award categories with criteria and past winner examples. Help contacts identify the right category. Include a short recap of the Workforce webinar — key takeaways and link to recording for those who missed it.',
            status: 'pending',
            tags: ['nominations', 'webinars'],
        },
        {
            id: 6, wc: '11 May', weekStart: '2026-05-11', phase: 2,
            primary: 'Symposium themes revealed',
            secondary: 'Nominations progress; next webinar preview',
            subject: 'Symposium themes announced — shape the conversation',
            cta: 'Register now',
            audience: 'Full database.',
            detail: 'Announce 3–4 symposium themes/tracks. "This is what you\'ll learn and discuss." Share nominations progress. Preview the next webinar: Speed in Election Results Transmission (11 June).',
            status: 'pending',
            tags: ['programme', 'nominations', 'registration', 'webinars'],
        },
        {
            id: 7, wc: '18 May', weekStart: '2026-05-18', phase: 2,
            primary: 'Webinar invitation: Speed in Election Results Transmission',
            secondary: 'Nominations reminder (3 months left)',
            subject: 'Join us — Speed in Election Results Transmission | 11 June',
            cta: 'Register for webinar',
            audience: 'Full database.',
            detail: 'Dedicated invitation for the second webinar (11 June, 14:00 UTC). End-to-end results workflows, transparency servers, public communication during results consolidation. "Three months left to nominate for the Awards."',
            status: 'pending',
            tags: ['webinars', 'nominations'],
        },
        {
            id: 8, wc: '25 May', weekStart: '2026-05-25', phase: 2,
            primary: 'Speaker announcement #1',
            secondary: 'Upcoming webinar; nominations reminder',
            subject: 'First speakers confirmed — 22nd Electoral Awards',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'First confirmed speakers (2–3 names, titles, topics). Build programme credibility. "Three months left to nominate." Reminder: Results Transmission webinar on 11 June — sign up now.',
            status: 'pending',
            tags: ['speakers', 'nominations', 'registration', 'webinars'],
        },
        {
            id: 9, wc: '8 Jun', weekStart: '2026-06-08', phase: 2,
            primary: 'Category spotlight (remaining categories)',
            secondary: 'Webinar this Thursday; registration milestone',
            subject: 'Award categories in focus — could your work be recognised?',
            cta: 'Submit a nomination / Join webinar',
            audience: 'Full database (emphasis on non-nominators).',
            detail: 'Spotlight remaining award categories not covered in Email 5. Past winner testimonials or case study excerpts. Reminder: Results Transmission webinar this Thursday (11 June) — last chance to register.',
            status: 'pending',
            tags: ['nominations', 'speakers', 'webinars'],
        },
        {
            id: 10, wc: '22 Jun', weekStart: '2026-06-22', phase: 2,
            primary: 'Speaker announcement #2',
            secondary: 'Webinar recap; nominations midpoint (2 months left)',
            subject: 'More speakers join the programme — Manila 2026',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'Second speaker announcement (2–3 more names). "Here\'s who you\'ll hear from." Nominations midpoint reminder. Short recap of the Results Transmission webinar — key insights and link to recording.',
            status: 'pending',
            tags: ['speakers', 'nominations', 'registration', 'webinars'],
        },
        {
            id: 11, wc: '6 Jul', weekStart: '2026-07-06', phase: 3,
            primary: 'Registration milestone',
            secondary: 'Nominations update; programme preview',
            subject: '[X] delegates from [Y] countries — join them in Manila',
            cta: 'Register now',
            audience: 'Non-registered contacts (milestone); full database (update).',
            detail: 'Social proof with country list or notable organisations. "[X] delegates from [Y] countries have registered. Join them."',
            status: 'pending',
            tags: ['registration'],
        },
        {
            id: 12, wc: '20 Jul', weekStart: '2026-07-20', phase: 3,
            primary: 'Speaker/programme update #3',
            secondary: 'Nominations — 6 weeks left',
            subject: 'Programme taking shape — here\'s what to expect',
            cta: 'Register / Nominate',
            audience: 'Full database.',
            detail: 'Additional speakers or session details. "The programme is coming together." Nominations — six weeks left.',
            status: 'pending',
            tags: ['speakers', 'programme', 'nominations'],
        },
        {
            id: 13, wc: '3 Aug', weekStart: '2026-08-03', phase: 3,
            primary: 'Nominations final call',
            secondary: 'Speaker/programme highlights',
            subject: 'Final weeks to nominate — deadline 31 August',
            cta: 'Submit a nomination',
            audience: 'Full database (segmented emphasis on non-nominators).',
            detail: '"Less than four weeks to submit. Don\'t miss this opportunity for global recognition." Highlight programme/speaker news.',
            status: 'pending',
            tags: ['nominations', 'speakers'],
        },
        {
            id: 14, wc: '17 Aug', weekStart: '2026-08-17', phase: 3,
            primary: 'Past winner case study / testimonial',
            secondary: 'Nominations — 2 weeks left; register',
            subject: 'From nomination to recognition — a winner\'s story',
            cta: 'Nominate / Register',
            audience: 'Full database.',
            detail: '"From nomination to global recognition — here\'s what it meant to [Winner]." Two weeks left to nominate.',
            status: 'pending',
            tags: ['nominations', 'registration'],
        },
        {
            id: 15, wc: '25 Aug', weekStart: '2026-08-25', phase: 3,
            primary: 'Webinar invitation: Inclusive Elections',
            secondary: 'Nominations closing this week; register for Manila',
            subject: 'Join us — Inclusive Elections: Ensuring the Right to Vote for All | 16 September',
            cta: 'Register for webinar / Last chance to nominate',
            audience: 'Full database.',
            detail: 'Dedicated invitation for the third webinar (16 September, 14:00 UTC). Voter-centred design, accessibility, frontline staff training, preserving independence and secrecy. "Nominations close on 31 August — just days left."',
            status: 'pending',
            tags: ['webinars', 'nominations'],
        },
        {
            id: 16, wc: '31 Aug', weekStart: '2026-08-31', phase: 3,
            primary: 'Nominations closed — what\'s next',
            secondary: 'Thank nominators; upcoming webinar; register to see winners',
            subject: 'Nominations closed — thank you',
            cta: 'Register to attend',
            audience: 'Full database. Personalised thank-you to nominators.',
            detail: 'Thank all nominators. Share headline stats. "Winners announced at the Awards Ceremony on 1 December. Register to be there." Reminder: Inclusive Elections webinar on 16 September.',
            status: 'pending',
            tags: ['nominations', 'registration', 'webinars'],
        },
        {
            id: 17, wc: '7 Sep', weekStart: '2026-09-07', phase: 4,
            primary: 'Webinar reminder: Inclusive Elections',
            secondary: 'Awards programme preview; registration push',
            subject: 'Next week — Inclusive Elections webinar | 16 September',
            cta: 'Register for webinar / Register for Manila',
            audience: 'Full database (priority to webinar non-registrants).',
            detail: 'One-week reminder for the Inclusive Elections webinar (16 Sep). Spotlight the speakers and topics. "Meanwhile, the full Awards programme will be published soon — register now to secure your place in Manila."',
            status: 'pending',
            tags: ['webinars', 'registration'],
        },
        {
            id: 18, wc: '14 Sep', weekStart: '2026-09-14', phase: 4,
            primary: 'Full programme published',
            secondary: 'Webinar this Wednesday; speaker line-up recap',
            subject: 'Full programme released — 22nd Electoral Awards',
            cta: 'Register now / Join webinar',
            audience: 'Full database (priority to non-registered).',
            detail: 'Day-by-day itinerary, all speakers, session titles, cultural tour, ceremony details. Major conversion moment. Reminder: Inclusive Elections webinar this Wednesday (16 September).',
            status: 'pending',
            tags: ['programme', 'registration', 'webinars'],
        },
        {
            id: 19, wc: '28 Sep', weekStart: '2026-09-28', phase: 4,
            primary: 'Speaker deep-dive / session preview',
            secondary: 'Webinar recap; registration push; shortlist tease',
            subject: 'Session spotlight — [Topic/Speaker]',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'Deep-dive on one compelling panel or keynote. Why it matters, who\'s speaking, what to expect. Tease shortlist. Short recap of the Inclusive Elections webinar — key takeaways and link to recording.',
            status: 'pending',
            tags: ['speakers', 'programme', 'registration', 'webinars'],
        },
        {
            id: 20, wc: '12 Oct', weekStart: '2026-10-12', phase: 4,
            primary: 'Shortlist announced',
            secondary: 'Register to see the winners in person',
            subject: 'Shortlist announced — who will win in Manila?',
            cta: 'Register now',
            audience: 'Full database. Notify shortlisted organisations directly.',
            detail: 'Category-by-category shortlisted nominees. "Who will win? Join us in Manila to find out."',
            status: 'pending',
            tags: ['nominations', 'registration'],
        },
        {
            id: 21, wc: '26 Oct', weekStart: '2026-10-26', phase: 5,
            primary: 'One month to go',
            secondary: 'Logistics preview; final speaker news',
            subject: 'One month to go — 22nd Electoral Awards, Manila',
            cta: 'Register (last chance) / Confirm details',
            audience: 'Split — registered (logistics) / non-registered (convert).',
            detail: 'Excitement-builder — delegate count, country count, programme highlights, Manila preview. Logistics for registered.',
            status: 'pending',
            tags: ['registration', 'programme'],
        },
        {
            id: 22, wc: '9 Nov', weekStart: '2026-11-09', phase: 5,
            primary: 'Final registration call',
            secondary: 'Logistics; delegate country count',
            subject: 'Final call — join [X] delegates in Manila',
            cta: 'Register now',
            audience: 'Non-registered contacts only.',
            detail: '"Registration closes [date]. [X] delegates confirmed. Free. Accommodation covered."',
            status: 'pending',
            tags: ['registration'],
        },
        {
            id: 23, wc: '23 Nov', weekStart: '2026-11-23', phase: 5,
            primary: 'Pre-event logistics & welcome',
            secondary: 'Programme at a glance; what to pack',
            subject: 'Your guide to the 22nd Electoral Awards — Manila',
            cta: 'Confirm attendance',
            audience: 'Registered delegates only.',
            detail: 'Arrival info, hotel check-in, programme, cultural tour, dress code, weather, emergency contacts.',
            status: 'pending',
            tags: ['logistics'],
        },
    ],

    socialPosts: [
        { wc: '16 Mar', count: 4, description: 'Event announcement series — venue reveal, value prop, 2025 highlights' },
        { wc: '30 Mar', count: 3, description: '2026 programme announcement — Awards + 3 webinars overview, save-the-dates graphic' },
        { wc: '6 Apr', count: 2, description: 'Webinar 1 promo — Empowering the Election Workforce (17 Apr), speaker/topic teaser' },
        { wc: '13 Apr', count: 3, description: 'Nominations open — category spotlights, winner testimonial' },
        { wc: '20 Apr', count: 2, description: 'Webinar 1 recap — key findings graphic, link to recording, quote from speaker' },
        { wc: '11 May', count: 2, description: 'Programme themes — poll/engagement post' },
        { wc: '18 May', count: 2, description: 'Webinar 2 promo — Speed in Election Results Transmission (11 Jun), topic preview' },
        { wc: '25 May', count: 3, description: 'Speaker reveals with headshots and quotes' },
        { wc: '8 Jun', count: 3, description: 'Category deep-dive, nomination reminder, Webinar 2 this week reminder' },
        { wc: '15 Jun', count: 2, description: 'Webinar 2 recap — key insights graphic, link to recording' },
        { wc: '6 Jul', count: 2, description: 'Milestone celebration — delegate map graphic' },
        { wc: '3 Aug', count: 3, description: 'Nominations closing countdown (4 weeks, 2 weeks, final days)' },
        { wc: '25 Aug', count: 2, description: 'Webinar 3 promo — Inclusive Elections (16 Sep), topic preview, speaker teaser' },
        { wc: '7 Sep', count: 2, description: 'Webinar 3 reminder — one week to go, sign up now' },
        { wc: '14 Sep', count: 3, description: 'Programme release — infographic, session spotlight, Webinar 3 this week' },
        { wc: '21 Sep', count: 2, description: 'Webinar 3 recap — key takeaways graphic, link to recording' },
        { wc: '12 Oct', count: 4, description: 'Shortlist announcement — category-by-category spotlights' },
        { wc: '26 Oct', count: 4, description: 'Countdown series — one month, behind-the-scenes, two weeks, this week' },
    ],

    sellingPoints: [
        { icon: 'uil-check-circle', text: 'Free attendance — no registration fee' },
        { icon: 'uil-bed', text: 'Accommodation covered at The Manila Hotel' },
        { icon: 'uil-calendar-alt', text: '5-day programme including cultural tour & Awards Ceremony' },
        { icon: 'uil-users-alt', text: 'Co-hosted with COMELEC (Philippines)' },
        { icon: 'uil-globe', text: 'Networking with 150+ electoral leaders worldwide' },
    ],

    notes: [
        'Segment the database by region and engagement level. <strong>Asia-Pacific contacts</strong> should receive additional emphasis given the Manila location.',
        'Phone outreach is most effective <strong>1–2 weeks after an email campaign</strong>, when the event is fresh in recipients\' minds.',
        'LinkedIn posts should mix promotional content with engagement posts (polls, questions, throwbacks) to avoid being purely transactional.',
        'Track registration sources to understand which channels convert best and adjust resource allocation accordingly.',
    ],
};
