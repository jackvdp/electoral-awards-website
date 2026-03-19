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
    title: '22nd International Electoral Awards & Symposium',
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
        { label: 'Noms close', position: (5 + 4.2 / 5) / 9, colour: '#e2626b' },
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
            primary: '2025 highlights & what\'s coming',
            secondary: 'Tease nominations opening next week',
            subject: 'Looking back, looking ahead — Manila 2026',
            cta: 'Register now',
            audience: 'Full database.',
            detail: 'Recap of the 21st Awards in Gaborone — photos, key moments, winner highlights. "Now we\'re heading to Manila." Soft tease for nominations.',
            status: 'pending',
            tags: ['registration', 'nominations'],
        },
        {
            id: 3, wc: '13 Apr', weekStart: '2026-04-13', phase: 1,
            primary: 'Nominations now open',
            secondary: 'Register to attend + nominate',
            subject: 'Nominations open — 22nd International Electoral Awards',
            cta: 'Submit a nomination / Register',
            audience: 'Full database.',
            detail: 'Explain the 8 categories, the process, the deadline (31 August). "Haven\'t registered yet? Attendance is free and accommodation at The Manila Hotel is covered."',
            status: 'pending',
            tags: ['nominations', 'registration'],
        },
        {
            id: 4, wc: '27 Apr', weekStart: '2026-04-27', phase: 1,
            primary: 'Category spotlight (3–4 categories)',
            secondary: 'Registration reminder; Manila venue info',
            subject: 'Which category fits your initiative?',
            cta: 'Submit a nomination / Register',
            audience: 'Full database (emphasis on EMBs who haven\'t nominated).',
            detail: 'Deep-dive on 3–4 award categories with criteria and past winner examples. Help contacts identify the right category.',
            status: 'pending',
            tags: ['nominations'],
        },
        {
            id: 5, wc: '11 May', weekStart: '2026-05-11', phase: 2,
            primary: 'Symposium themes revealed',
            secondary: 'Nominations progress update',
            subject: 'Symposium themes announced — shape the conversation',
            cta: 'Register now',
            audience: 'Full database.',
            detail: 'Announce 3–4 symposium themes/tracks. "This is what you\'ll learn and discuss." Share nominations progress.',
            status: 'pending',
            tags: ['programme', 'nominations', 'registration'],
        },
        {
            id: 6, wc: '25 May', weekStart: '2026-05-25', phase: 2,
            primary: 'Speaker announcement #1',
            secondary: 'Nominations reminder (3 months left)',
            subject: 'First speakers confirmed — 22nd Electoral Awards',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'First confirmed speakers (2–3 names, titles, topics). Build programme credibility. "Three months left to nominate."',
            status: 'pending',
            tags: ['speakers', 'nominations', 'registration'],
        },
        {
            id: 7, wc: '8 Jun', weekStart: '2026-06-08', phase: 2,
            primary: 'Category spotlight (remaining categories)',
            secondary: 'Speaker tease; registration milestone',
            subject: 'Award categories in focus — could your work be recognised?',
            cta: 'Submit a nomination',
            audience: 'Full database (emphasis on non-nominators).',
            detail: 'Spotlight remaining award categories not covered in Email 4. Past winner testimonials or case study excerpts.',
            status: 'pending',
            tags: ['nominations', 'speakers'],
        },
        {
            id: 8, wc: '22 Jun', weekStart: '2026-06-22', phase: 2,
            primary: 'Speaker announcement #2',
            secondary: 'Nominations midpoint (2 months left)',
            subject: 'More speakers join the programme — Manila 2026',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'Second speaker announcement (2–3 more names). "Here\'s who you\'ll hear from." Nominations midpoint reminder.',
            status: 'pending',
            tags: ['speakers', 'nominations', 'registration'],
        },
        {
            id: 9, wc: '6 Jul', weekStart: '2026-07-06', phase: 3,
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
            id: 10, wc: '20 Jul', weekStart: '2026-07-20', phase: 3,
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
            id: 11, wc: '3 Aug', weekStart: '2026-08-03', phase: 3,
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
            id: 12, wc: '17 Aug', weekStart: '2026-08-17', phase: 3,
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
            id: 13, wc: '31 Aug', weekStart: '2026-08-31', phase: 3,
            primary: 'Nominations closed — what\'s next',
            secondary: 'Thank nominators; register to see winners',
            subject: 'Nominations closed — thank you',
            cta: 'Register to attend',
            audience: 'Full database. Personalised thank-you to nominators.',
            detail: 'Thank all nominators. Share headline stats. "Winners announced at the Awards Ceremony on 1 December. Register to be there."',
            status: 'pending',
            tags: ['nominations', 'registration'],
        },
        {
            id: 14, wc: '14 Sep', weekStart: '2026-09-14', phase: 4,
            primary: 'Full programme published',
            secondary: 'Speaker line-up recap; logistics preview',
            subject: 'Full programme released — 22nd Electoral Awards',
            cta: 'Register now',
            audience: 'Full database (priority to non-registered).',
            detail: 'Day-by-day itinerary, all speakers, session titles, cultural tour, ceremony details. Major conversion moment.',
            status: 'pending',
            tags: ['programme', 'registration'],
        },
        {
            id: 15, wc: '28 Sep', weekStart: '2026-09-28', phase: 4,
            primary: 'Speaker deep-dive / session preview',
            secondary: 'Registration push; shortlist tease',
            subject: 'Session spotlight — [Topic/Speaker]',
            cta: 'Register to attend',
            audience: 'Full database.',
            detail: 'Deep-dive on one compelling panel or keynote. Why it matters, who\'s speaking, what to expect. Tease shortlist.',
            status: 'pending',
            tags: ['speakers', 'programme', 'registration'],
        },
        {
            id: 16, wc: '12 Oct', weekStart: '2026-10-12', phase: 4,
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
            id: 17, wc: '26 Oct', weekStart: '2026-10-26', phase: 5,
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
            id: 18, wc: '9 Nov', weekStart: '2026-11-09', phase: 5,
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
            id: 19, wc: '23 Nov', weekStart: '2026-11-23', phase: 5,
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
        { wc: '13 Apr', count: 3, description: 'Nominations open — category spotlights, winner testimonial' },
        { wc: '11 May', count: 2, description: 'Programme themes — poll/engagement post' },
        { wc: '25 May', count: 3, description: 'Speaker reveals with headshots and quotes' },
        { wc: '8 Jun', count: 2, description: 'Category deep-dive, nomination reminder' },
        { wc: '6 Jul', count: 2, description: 'Milestone celebration — delegate map graphic' },
        { wc: '3 Aug', count: 3, description: 'Nominations closing countdown (4 weeks, 2 weeks, final days)' },
        { wc: '14 Sep', count: 3, description: 'Programme release — infographic, session spotlight, cultural preview' },
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
