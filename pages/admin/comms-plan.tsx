import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { createClient } from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import Head from 'next/head';

// ──────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────

interface CommEmail {
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
}

interface Phase {
    id: number;
    name: string;
    period: string;
    goal: string;
    targetRegistrations: string;
    colour: string;
    phoneWave?: string;
}

const phases: Phase[] = [
    { id: 1, name: 'Launch & Early Momentum', period: 'March – April', goal: 'Announce the event, drive early registrations, open nominations', targetRegistrations: '30–40', colour: '#3f78e0', phoneWave: 'Wave 1: w/c 24 Mar – 11 Apr — VIPs, past attendees, Asia-Pacific EMBs' },
    { id: 2, name: 'Build Awareness & Credibility', period: 'May – June', goal: 'Sustain momentum, announce programme milestones, convert interest', targetRegistrations: '60–80', colour: '#45c4a0', phoneWave: 'Wave 2: 12–30 May — Contacts who opened but didn\'t register, under-represented regions' },
    { id: 3, name: 'Summer Push & Nominations Close', period: 'July – August', goal: 'Drive registrations through summer, close nominations strongly', targetRegistrations: '100–120', colour: '#f78b77', phoneWave: 'Wave 3: 14 Jul – 1 Aug — Remaining priority contacts, nomination pipeline leads' },
    { id: 4, name: 'Final Conversion', period: 'September – October', goal: 'Convert remaining prospects, build anticipation, lock in numbers', targetRegistrations: '140–160', colour: '#7c69ef', phoneWave: 'Wave 4: 22 Sep – 10 Oct — Final fence-sitters, new leads from nominations' },
    { id: 5, name: 'Final Countdown', period: 'November', goal: 'Confirm logistics, build excitement, last-chance registrations', targetRegistrations: '150–200', colour: '#e2626b', phoneWave: 'Wave 5: 3–14 Nov — Last-chance personal outreach to high-value contacts' },
];

const emails: CommEmail[] = [
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
];

const socialPosts = [
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
];

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────

const tagColours: Record<string, string> = {
    registration: '#3f78e0',
    nominations: '#45c4a0',
    speakers: '#7c69ef',
    programme: '#f78b77',
    logistics: '#6c757d',
};

const statusConfig: Record<string, { label: string; bg: string }> = {
    drafted: { label: 'Drafted', bg: '#fff3cd' },
    sent: { label: 'Sent', bg: '#d1e7dd' },
    pending: { label: 'Pending', bg: '#f8f9fa' },
};

// Calendar months Mar–Nov 2026
const calendarMonths = [
    { name: 'Mar', year: 2026, month: 2 },
    { name: 'Apr', year: 2026, month: 3 },
    { name: 'May', year: 2026, month: 4 },
    { name: 'Jun', year: 2026, month: 5 },
    { name: 'Jul', year: 2026, month: 6 },
    { name: 'Aug', year: 2026, month: 7 },
    { name: 'Sep', year: 2026, month: 8 },
    { name: 'Oct', year: 2026, month: 9 },
    { name: 'Nov', year: 2026, month: 10 },
];

function getWeekOfMonth(dateStr: string): number {
    const d = new Date(dateStr);
    const day = d.getDate();
    return Math.ceil(day / 7);
}

function getMonthIndex(dateStr: string): number {
    const d = new Date(dateStr);
    return d.getMonth(); // 0-indexed
}

// ──────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────

const CommsPlan: NextPage = () => {
    const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
    const [filterTag, setFilterTag] = useState<string | null>(null);

    const filteredEmails = filterTag
        ? emails.filter(e => e.tags.includes(filterTag))
        : emails;

    const allTags = ['registration', 'nominations', 'speakers', 'programme', 'logistics'];

    return (
        <AdminPage title="Delegate Acquisition — Comms Plan">
            <Head>
                <title>Admin Dashboard | Comms Plan</title>
            </Head>

            {/* ── Header ── */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h4 className="mb-1">22nd International Electoral Awards & Symposium</h4>
                            <p className="text-muted mb-0">29 November – 3 December 2026 | The Manila Hotel, Manila, Philippines</p>
                            <p className="text-muted mb-0">Co-hosted by ICPS & COMELEC</p>
                        </div>
                        <div className="col-lg-4">
                            <div className="row text-center mt-3 mt-lg-0">
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#3f78e0' }}>150–200</h3>
                                    <small className="text-muted">Target delegates</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#45c4a0' }}>19</h3>
                                    <small className="text-muted">Emails</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#7c69ef' }}>~30</h3>
                                    <small className="text-muted">Social posts</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Calendar Timeline ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Email Calendar</h5>
                </div>
                <div className="card-body p-0">
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: 900, padding: '1rem' }}>
                            {/* Month headers */}
                            <div className="d-flex" style={{ borderBottom: '2px solid #dee2e6' }}>
                                {calendarMonths.map(m => (
                                    <div key={m.name} style={{ flex: 1, textAlign: 'center', padding: '0.5rem 0', fontWeight: 600 }}>
                                        {m.name}
                                    </div>
                                ))}
                            </div>

                            {/* Phase rows */}
                            {phases.map(phase => {
                                const phaseEmails = emails.filter(e => e.phase === phase.id);
                                return (
                                    <div key={phase.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <div className="d-flex align-items-center py-1 px-2" style={{ background: '#f8f9fa' }}>
                                            <span className="badge me-2" style={{ background: phase.colour, fontSize: '0.7rem' }}>
                                                Phase {phase.id}
                                            </span>
                                            <small className="fw-bold">{phase.name}</small>
                                            <small className="text-muted ms-auto">Target: {phase.targetRegistrations} delegates</small>
                                        </div>
                                        <div className="d-flex position-relative" style={{ height: 48 }}>
                                            {calendarMonths.map(m => (
                                                <div key={m.name} style={{ flex: 1, borderRight: '1px solid #f0f0f0' }} />
                                            ))}
                                            {phaseEmails.map(email => {
                                                const monthIdx = getMonthIndex(email.weekStart);
                                                const calIdx = calendarMonths.findIndex(m => m.month === monthIdx);
                                                if (calIdx === -1) return null;
                                                const weekInMonth = getWeekOfMonth(email.weekStart);
                                                const leftPct = ((calIdx + (weekInMonth - 1) / 5) / calendarMonths.length) * 100;
                                                return (
                                                    <div
                                                        key={email.id}
                                                        onClick={() => setExpandedEmail(expandedEmail === email.id ? null : email.id)}
                                                        title={`Email ${email.id}: ${email.primary}`}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${leftPct}%`,
                                                            top: 8,
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            background: phase.colour,
                                                            color: '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                            border: expandedEmail === email.id ? '3px solid #212529' : '2px solid #fff',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                            zIndex: 2,
                                                        }}
                                                    >
                                                        {email.id}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Event marker */}
                            <div className="d-flex position-relative" style={{ height: 36 }}>
                                {calendarMonths.map(m => (
                                    <div key={m.name} style={{ flex: 1, borderRight: '1px solid #f0f0f0' }} />
                                ))}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${((8 + 4.2 / 5) / 9) * 100}%`,
                                        top: 4,
                                        background: '#e2626b',
                                        color: '#fff',
                                        padding: '2px 10px',
                                        borderRadius: 4,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    EVENT: 29 Nov – 3 Dec
                                </div>
                            </div>

                            {/* Key dates row */}
                            <div className="d-flex position-relative" style={{ height: 28, borderTop: '1px dashed #dee2e6' }}>
                                {calendarMonths.map(m => (
                                    <div key={m.name} style={{ flex: 1, borderRight: '1px solid #f0f0f0' }} />
                                ))}
                                {/* Nominations open */}
                                <div style={{ position: 'absolute', left: `${((1 + 0.2) / 9) * 100}%`, top: 4, fontSize: '0.65rem', color: '#45c4a0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    Noms open
                                </div>
                                {/* Nominations close */}
                                <div style={{ position: 'absolute', left: `${((5 + 4.2 / 5) / 9) * 100}%`, top: 4, fontSize: '0.65rem', color: '#e2626b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    Noms close
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Phase Cards ── */}
            <div className="row mb-4">
                {phases.map(phase => (
                    <div className="col-12 col-md-6 col-xl mb-3" key={phase.id}>
                        <div className="card h-100" style={{ borderTop: `3px solid ${phase.colour}` }}>
                            <div className="card-body p-3">
                                <h6 className="mb-1" style={{ color: phase.colour }}>Phase {phase.id}</h6>
                                <p className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>{phase.name}</p>
                                <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>{phase.period}</p>
                                <p className="mb-2" style={{ fontSize: '0.8rem' }}>{phase.goal}</p>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="uil uil-users-alt me-2" style={{ color: phase.colour }}></i>
                                    <strong style={{ fontSize: '0.85rem' }}>{phase.targetRegistrations} delegates</strong>
                                </div>
                                {phase.phoneWave && (
                                    <div style={{ fontSize: '0.75rem', background: '#f8f9fa', borderRadius: 4, padding: '0.4rem 0.5rem' }}>
                                        <i className="uil uil-phone me-1"></i>
                                        {phase.phoneWave}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter Tags ── */}
            <div className="card mb-4">
                <div className="card-header bg-white d-flex align-items-center justify-content-between flex-wrap">
                    <h5 className="mb-0">Fortnightly Email Schedule</h5>
                    <div className="d-flex gap-2 flex-wrap mt-2 mt-md-0">
                        <button
                            className={`btn btn-sm ${!filterTag ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterTag(null)}
                        >
                            All ({emails.length})
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                className={`btn btn-sm ${filterTag === tag ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: tagColours[tag],
                                        marginRight: 4,
                                    }}
                                />
                                {tag.charAt(0).toUpperCase() + tag.slice(1)} ({emails.filter(e => e.tags.includes(tag)).length})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr style={{ fontSize: '0.8rem' }}>
                                    <th style={{ width: 40 }}>#</th>
                                    <th style={{ width: 80 }}>W/C</th>
                                    <th>Primary Focus</th>
                                    <th>Secondary Thread</th>
                                    <th>Subject Line</th>
                                    <th style={{ width: 90 }}>Status</th>
                                    <th style={{ width: 60 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmails.map(email => {
                                    const phase = phases.find(p => p.id === email.phase)!;
                                    const isExpanded = expandedEmail === email.id;
                                    return (
                                        <React.Fragment key={email.id}>
                                            <tr
                                                onClick={() => setExpandedEmail(isExpanded ? null : email.id)}
                                                style={{ cursor: 'pointer', borderLeft: `3px solid ${phase.colour}` }}
                                            >
                                                <td>
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 26,
                                                            height: 26,
                                                            borderRadius: '50%',
                                                            background: phase.colour,
                                                            color: '#fff',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {email.id}
                                                    </span>
                                                </td>
                                                <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{email.wc}</td>
                                                <td style={{ fontSize: '0.85rem' }}>
                                                    {email.primary}
                                                    <div className="d-flex gap-1 mt-1">
                                                        {email.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                style={{
                                                                    display: 'inline-block',
                                                                    padding: '1px 6px',
                                                                    borderRadius: 3,
                                                                    background: tagColours[tag] + '20',
                                                                    color: tagColours[tag],
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="text-muted" style={{ fontSize: '0.8rem' }}>{email.secondary}</td>
                                                <td style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{email.subject}</td>
                                                <td>
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: statusConfig[email.status].bg,
                                                            color: email.status === 'pending' ? '#6c757d' : '#212529',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        {statusConfig[email.status].label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <i className={`uil ${isExpanded ? 'uil-angle-up' : 'uil-angle-down'}`}></i>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={7} style={{ background: '#f8f9fa', borderLeft: `3px solid ${phase.colour}` }}>
                                                        <div className="p-3">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <p className="mb-2"><strong>Detail:</strong> {email.detail}</p>
                                                                    <p className="mb-2"><strong>Audience:</strong> {email.audience}</p>
                                                                    <p className="mb-0"><strong>CTA:</strong> {email.cta}</p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="p-2" style={{ background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                                                                        <small className="text-muted d-block mb-1">Phase {phase.id}: {phase.name}</small>
                                                                        <small className="d-block"><strong>Target:</strong> {phase.targetRegistrations} cumulative delegates</small>
                                                                        <small className="d-block"><strong>Period:</strong> {phase.period}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Social Media Schedule ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">LinkedIn Posts</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr style={{ fontSize: '0.8rem' }}>
                                    <th style={{ width: 80 }}>W/C</th>
                                    <th style={{ width: 60 }}>Posts</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {socialPosts.map((post, i) => (
                                    <tr key={i}>
                                        <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{post.wc}</td>
                                        <td>
                                            <span className="badge" style={{ background: '#0a66c2', fontSize: '0.75rem' }}>
                                                {post.count} {post.count === 1 ? 'post' : 'posts'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{post.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <td className="fw-bold">Total</td>
                                    <td><strong>{socialPosts.reduce((sum, p) => sum + p.count, 0)} posts</strong></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Key Selling Points ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Key Selling Points (include in every communication)</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        {[
                            { icon: 'uil-check-circle', text: 'Free attendance — no registration fee' },
                            { icon: 'uil-bed', text: 'Accommodation covered at The Manila Hotel' },
                            { icon: 'uil-calendar-alt', text: '5-day programme including cultural tour & Awards Ceremony' },
                            { icon: 'uil-users-alt', text: 'Co-hosted with COMELEC (Philippines)' },
                            { icon: 'uil-globe', text: 'Networking with 150+ electoral leaders worldwide' },
                        ].map((point, i) => (
                            <div className="col-12 col-md-6 col-lg-4 mb-2" key={i}>
                                <div className="d-flex align-items-start">
                                    <i className={`uil ${point.icon} fs-20 me-2`} style={{ color: '#45c4a0' }}></i>
                                    <span style={{ fontSize: '0.85rem' }}>{point.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Notes ── */}
            <div className="card">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Notes</h5>
                </div>
                <div className="card-body" style={{ fontSize: '0.85rem' }}>
                    <ul className="mb-0">
                        <li className="mb-2">Segment the database by region and engagement level. <strong>Asia-Pacific contacts</strong> should receive additional emphasis given the Manila location.</li>
                        <li className="mb-2">Phone outreach is most effective <strong>1–2 weeks after an email campaign</strong>, when the event is fresh in recipients' minds.</li>
                        <li className="mb-2">LinkedIn posts should mix promotional content with engagement posts (polls, questions, throwbacks) to avoid being purely transactional.</li>
                        <li>Track registration sources to understand which channels convert best and adjust resource allocation accordingly.</li>
                    </ul>
                </div>
            </div>
        </AdminPage>
    );
};

export default CommsPlan;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return { props: {} };
};
