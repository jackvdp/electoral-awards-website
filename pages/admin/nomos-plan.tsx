import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import { createClient } from 'backend/supabase/server-props';
import AdminPage from 'components/blocks/admin/reusables/AdminPage';

// ──────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────

const BLUE = '#005f9e';
const ORANGE = '#e8781a';
const LIGHT_BLUE = '#7ab8d9';

const milestones = [
    { date: 'Late April 2026', label: 'Data collection begins; speaker recruitment opens', highlight: false },
    { date: '28 May 2026', label: 'Webinar — NOMOS News & Intelligence', highlight: true },
    { date: 'June – November 2026', label: 'Five awareness campaigns with follow-up', highlight: false },
    { date: '29 Nov – 3 Dec 2026', label: '22nd International Electoral Awards — Manila', highlight: true },
];

// Pre-webinar Gantt rows
// weeks: ['W/C 27 Apr', 'W/C 4 May', 'W/C 11 May', 'W/C 18 May', 'W/C 25 May']
type BarType = 'full' | 'light' | 'accent' | 'star' | 'none';

interface GanttRow {
    label: string;
    group?: boolean;
    bars: BarType[]; // one per column
}

const preWebinarWeeks = ['W/C 27 Apr', 'W/C 4 May', 'W/C 11 May', 'W/C 18 May', 'W/C 25 May'];

const preWebinarRows: GanttRow[] = [
    { label: 'Data', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Database expansion (managerial tier)', bars: ['full', 'full', 'full', 'full', 'full'] },
    { label: 'Webinar Preparation', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Speaker recruitment', bars: ['full', 'full', 'full', 'none', 'none'] },
    { label: 'Content & slides development', bars: ['full', 'full', 'full', 'full', 'none'] },
    { label: 'Run-sheet & logistics', bars: ['none', 'none', 'light', 'light', 'none'] },
    { label: 'Recruitment Emails', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Email 1 — Save the date / announcement', bars: ['accent', 'none', 'none', 'none', 'none'] },
    { label: 'Email 2 — Programme detail', bars: ['none', 'none', 'accent', 'none', 'none'] },
    { label: 'Email 3 — Final reminder', bars: ['none', 'none', 'none', 'accent', 'none'] },
    { label: '★ Webinar — 28 May', bars: ['none', 'none', 'none', 'none', 'star'] },
];

const campaignMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const campaignRows: GanttRow[] = [
    { label: 'Data', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'Database expansion (ongoing)', bars: ['light', 'light', 'light', 'light', 'light', 'light', 'none'] },
    { label: 'Awareness Campaigns', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'Campaign 1 — Send & follow-up', bars: ['accent', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'Campaign 2 — Send & follow-up', bars: ['none', 'accent', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'Campaign 3 — Send & follow-up', bars: ['none', 'none', 'accent', 'none', 'none', 'none', 'none'] },
    { label: 'Campaign 4 — Send & follow-up', bars: ['none', 'none', 'none', 'accent', 'none', 'none', 'none'] },
    { label: 'Campaign 5 — Send & follow-up', bars: ['none', 'none', 'none', 'none', 'accent', 'none', 'none'] },
    { label: 'Symposium & Awards', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'NOMOS presentation development', bars: ['none', 'none', 'none', 'none', 'full', 'full', 'none'] },
    { label: 'Exhibition & logistics', bars: ['none', 'none', 'none', 'none', 'none', 'full', 'none'] },
    { label: '★ Symposium & Awards — Manila', bars: ['none', 'none', 'none', 'none', 'none', 'star', 'star'] },
];

const deliverables = [
    { component: 'Data Collection', detail: 'Expand database to include managerial-grade electoral contacts globally', lead: 'ICPS', target: 'From late April' },
    { component: 'Recruitment Email 1', detail: 'Save-the-date / announcement email to full database', lead: 'ICPS', target: '~30 April' },
    { component: 'Recruitment Email 2', detail: 'Programme detail and speaker spotlight', lead: 'ICPS', target: '~11 May' },
    { component: 'Recruitment Email 3', detail: 'Final reminder with registration link', lead: 'ICPS', target: '~21 May' },
    { component: 'Webinar', detail: '1-hour event: speakers, facilitation, slides, run-sheet. NOMOS to advise on product messaging.', lead: 'Joint', target: '28 May' },
    { component: 'Campaigns 1–5', detail: 'Editorial copy linking NOMOS features to current electoral issues; follow-up calls by ICPS staff. NOMOS to review all copy.', lead: 'Joint', target: 'Jun–Oct' },
    { component: 'Symposium Presentation', detail: 'Fully aligned NOMOS presentation in main conference programme', lead: 'Joint', target: '29 Nov – 3 Dec' },
    { component: 'Exhibition Booth', detail: 'Prime-position booth; ICPS coordinates logistics', lead: 'ICPS', target: '29 Nov – 3 Dec' },
    { component: 'Award Presenting', detail: 'NOMOS representative presents an award at the ceremony', lead: 'ICPS', target: 'Awards night' },
    { component: 'Advocate Syndicate Room', detail: 'Subject to webinar/campaign recruitment — room for NOMOS advocates to present to attendees', lead: 'ICPS', target: 'TBC' },
];

// ──────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────

function GanttBar({ type }: { type: BarType }) {
    if (type === 'none') return null;
    if (type === 'star') return (
        <span style={{ fontSize: '1.1rem', color: ORANGE }}>★</span>
    );
    const bg = type === 'full' ? BLUE : type === 'light' ? LIGHT_BLUE : ORANGE;
    return (
        <div style={{
            width: '80%',
            height: 14,
            borderRadius: 3,
            background: bg,
            margin: '0 auto',
        }} />
    );
}

function GanttTable({ columns, rows }: { columns: string[]; rows: GanttRow[] }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered mb-0" style={{ fontSize: '0.8rem', minWidth: 560 }}>
                <thead>
                    <tr>
                        <th style={{ width: 220, background: BLUE, color: '#fff', fontWeight: 600 }}>Activity</th>
                        {columns.map(col => (
                            <th key={col} style={{ background: BLUE, color: '#fff', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={row.group ? { background: '#eef5fb' } : {}}>
                            <td style={{
                                fontWeight: row.group ? 700 : row.label.startsWith('★') ? 700 : 500,
                                color: row.group ? BLUE : row.label.startsWith('★') ? ORANGE : '#333',
                                fontSize: row.group ? '0.7rem' : undefined,
                                textTransform: row.group ? 'uppercase' : undefined,
                                letterSpacing: row.group ? '0.04em' : undefined,
                            }}>
                                {row.label}
                            </td>
                            {row.bars.map((bar, j) => (
                                <td key={j} style={{ textAlign: 'center', verticalAlign: 'middle', background: row.group ? '#eef5fb' : undefined }}>
                                    <GanttBar type={bar} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ──────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────

const NomosPage: NextPage = () => {
    return (
        <AdminPage title="NOMOS Partnership Plan 2026">
            <Head>
                <title>Admin Dashboard | Nomos Plan</title>
            </Head>

            {/* ── Header card ── */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h4 className="mb-1">ICPS / NOMOS — Marketing & Communication Partnership</h4>
                            <p className="text-muted mb-0">Electoral Community Campaign &nbsp;|&nbsp; April – December 2026</p>
                        </div>
                        <div className="col-lg-4">
                            <div className="row text-center mt-3 mt-lg-0">
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: BLUE }}>3</h3>
                                    <small className="text-muted">Recruitment emails</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: ORANGE }}>5</h3>
                                    <small className="text-muted">Campaigns</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#45c4a0' }}>~200</h3>
                                    <small className="text-muted">Expected delegates</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Milestones ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Key Milestones</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {milestones.map((m, i) => (
                            <div className="col-12 col-md-6 col-xl-3" key={i}>
                                <div
                                    className="rounded p-3 h-100"
                                    style={{
                                        background: m.highlight ? BLUE : '#f7fbff',
                                        border: `1px solid ${m.highlight ? BLUE : '#d0e4f0'}`,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: m.highlight ? '#fff' : BLUE,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {m.date}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: m.highlight ? '#fff' : '#333', lineHeight: 1.4 }}>
                                        {m.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Pre-Webinar Gantt ── */}
            <div className="card mb-4">
                <div className="card-header bg-white d-flex align-items-center gap-3">
                    <h5 className="mb-0">Gantt — Pre-Webinar Phase (April – May)</h5>
                    <div className="d-flex gap-3 ms-auto" style={{ fontSize: '0.75rem' }}>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 14, height: 10, borderRadius: 2, background: BLUE, display: 'inline-block' }} />
                            Core activity
                        </span>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 14, height: 10, borderRadius: 2, background: LIGHT_BLUE, display: 'inline-block' }} />
                            Ongoing
                        </span>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 14, height: 10, borderRadius: 2, background: ORANGE, display: 'inline-block' }} />
                            Campaigns / emails
                        </span>
                        <span style={{ color: ORANGE }}>★ Milestone</span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <GanttTable columns={preWebinarWeeks} rows={preWebinarRows} />
                </div>
            </div>

            {/* ── Campaign Gantt ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Gantt — Campaign & Symposium Phase (June – December)</h5>
                </div>
                <div className="card-body p-0">
                    <GanttTable columns={campaignMonths} rows={campaignRows} />
                </div>
            </div>

            {/* ── Deliverables ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Deliverables by Component</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ fontSize: '0.8rem' }}>
                                    <th style={{ width: 180, background: BLUE, color: '#fff' }}>Component</th>
                                    <th style={{ background: BLUE, color: '#fff' }}>ICPS Deliverable</th>
                                    <th style={{ width: 80, background: BLUE, color: '#fff' }}>Lead</th>
                                    <th style={{ width: 130, background: BLUE, color: '#fff' }}>Target Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliverables.map((d, i) => (
                                    <tr key={i}>
                                        <td className="fw-bold">{d.component}</td>
                                        <td className="text-muted">{d.detail}</td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: d.lead === 'Joint' ? ORANGE : BLUE,
                                                    fontSize: '0.7rem',
                                                }}
                                            >
                                                {d.lead}
                                            </span>
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{d.target}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AdminPage>
    );
};

export default NomosPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.user_metadata.role !== 'admin') {
        return { redirect: { destination: '/', permanent: false } };
    }

    return { props: {} };
};
