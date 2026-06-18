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
    { date: '4 June 2026', label: 'Webinar — Strengthening the Electoral Profession', highlight: true },
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

const preWebinarWeeks = ['W/C 4 May', 'W/C 11 May', 'W/C 18 May', 'W/C 25 May', 'W/C 1 Jun'];

const preWebinarRows: GanttRow[] = [
    { label: 'Data', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Database expansion (managerial tier)', bars: ['full', 'full', 'full', 'full', 'full'] },
    { label: 'Webinar Preparation', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Speaker recruitment', bars: ['full', 'full', 'full', 'full', 'none'] },
    { label: 'Content & slides development', bars: ['full', 'full', 'full', 'full', 'full'] },
    { label: 'Run-sheet & logistics', bars: ['none', 'none', 'light', 'light', 'light'] },
    { label: 'Recruitment Emails', group: true, bars: ['none', 'none', 'none', 'none', 'none'] },
    { label: 'Email 1 — Webinar invitation', bars: ['accent', 'none', 'none', 'none', 'none'] },
    { label: 'Email 2 — Speakers confirmed', bars: ['none', 'none', 'none', 'accent', 'none'] },
    { label: 'Email 3 — Final reminder', bars: ['none', 'none', 'none', 'none', 'accent'] },
    { label: '★ Webinar — 4 Jun', bars: ['none', 'none', 'none', 'none', 'star'] },
];

const campaignMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const campaignRows: GanttRow[] = [
    { label: 'Data', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'Database expansion (ongoing)', bars: ['light', 'light', 'light', 'light', 'light', 'light', 'none'] },
    { label: 'Awareness Campaigns', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'C1 — Information Environment (w/c 15 Jun)', bars: ['accent', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'C2 — Content Providers (w/c 13 Jul)', bars: ['none', 'accent', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'C3 — Inclusive Participation (w/c 10 Aug)', bars: ['none', 'none', 'accent', 'none', 'none', 'none', 'none'] },
    { label: 'C4 — Electoral Integrity & Trust (w/c 21 Sep)', bars: ['none', 'none', 'none', 'accent', 'none', 'none', 'none'] },
    { label: 'C5 — Pre-Symposium Engagement (w/c 19 Oct)', bars: ['none', 'none', 'none', 'none', 'accent', 'none', 'none'] },
    { label: 'Symposium & Awards', group: true, bars: ['none', 'none', 'none', 'none', 'none', 'none', 'none'] },
    { label: 'NOMOS presentation development', bars: ['none', 'none', 'none', 'none', 'full', 'full', 'none'] },
    { label: 'Exhibition & logistics', bars: ['none', 'none', 'none', 'none', 'none', 'full', 'none'] },
    { label: '★ Symposium & Awards — Manila', bars: ['none', 'none', 'none', 'none', 'none', 'star', 'star'] },
];

const deliverables = [
    { component: 'Data Collection', detail: 'Expand database to include managerial-grade electoral contacts globally', lead: 'ICPS', target: 'From late April' },
    { component: 'Recruitment Email 1', detail: 'Webinar invitation — Strengthening the Electoral Profession (Knowledge Sharing)', lead: 'ICPS', target: '~4 May' },
    { component: 'Recruitment Email 2', detail: 'Speakers confirmed — Tammy Patrick (Election Center) and Sy Mamabolo (Electoral Commission of South Africa)', lead: 'ICPS', target: '~25 May' },
    { component: 'Recruitment Email 3', detail: 'Final reminder with registration link', lead: 'ICPS', target: '~1 June' },
    { component: 'Webinar', detail: 'Knowledge-sharing webinar: speakers, facilitation, slides, run-sheet, plus a NOMOS presentation.', lead: 'Joint', target: '4 June' },
    { component: 'Campaign 1', detail: 'The Information Environment — challenges facing EMBs in a 24/7 news cycle: monitoring, disinformation, and structured intelligence gathering.', lead: 'Joint', target: 'w/c 15 Jun' },
    { component: 'Campaign 2', detail: 'Content Providers — expand the Network into content-producing organisations and academics, with the audience built in three tranches by ICPS.', lead: 'Joint', target: 'w/c 13 Jul' },
    { component: 'Campaign 3', detail: 'Inclusive Participation & Accessibility — voter-centred design, accessible processes, and reaching under-represented communities.', lead: 'Joint', target: 'w/c 10 Aug' },
    { component: 'Campaign 4', detail: 'Electoral Integrity & Trust — building public confidence in electoral institutions through transparency, security, and communication.', lead: 'Joint', target: 'w/c 21 Sep' },
    { component: 'Campaign 5', detail: 'Pre-Symposium Engagement — build anticipation for NOMOS presence at Manila: booth, presentation, and in-person delegate engagement.', lead: 'Joint', target: 'w/c 19 Oct' },
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
                    <h5 className="mb-0">Gantt — Pre-Webinar Phase (May – early June)</h5>
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

            {/* ── Campaign Details ── */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Campaign Details — June to October</h5>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ fontSize: '0.8rem' }}>
                                <th style={{ width: 50, background: BLUE, color: '#fff' }}>#</th>
                                <th style={{ width: 110, background: BLUE, color: '#fff' }}>Send date</th>
                                <th style={{ width: 200, background: BLUE, color: '#fff' }}>Theme</th>
                                <th style={{ background: BLUE, color: '#fff' }}>Focus & linkage</th>
                                <th style={{ width: 90, background: BLUE, color: '#fff' }}>Lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 700, color: ORANGE }}>1</td>
                                <td style={{ whiteSpace: 'nowrap' }}>w/c 15 Jun</td>
                                <td style={{ fontWeight: 600 }}>The Information Environment</td>
                                <td className="text-muted">How EMBs monitor the 24/7 news cycle, identify disinformation, and build structured intelligence-gathering practices. Follows the Knowledge Sharing webinar (4 Jun).</td>
                                <td><span className="badge" style={{ background: ORANGE, fontSize: '0.7rem' }}>Joint</span></td>
                            </tr>
                            <tr style={{ background: '#f8f9fa' }}>
                                <td style={{ fontWeight: 700, color: ORANGE }}>2</td>
                                <td style={{ whiteSpace: 'nowrap' }}>w/c 13 Jul</td>
                                <td style={{ fontWeight: 600 }}>Content Providers — Network Expansion</td>
                                <td className="text-muted">Expand the Network into the organisations and academics who produce electoral content: research bodies, EMB associations, intergovernmental experts, and leading scholars. Audience built in three tranches by ICPS, from close personal contacts out to new scoping-list targets.</td>
                                <td><span className="badge" style={{ background: ORANGE, fontSize: '0.7rem' }}>Joint</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 700, color: ORANGE }}>3</td>
                                <td style={{ whiteSpace: 'nowrap' }}>w/c 10 Aug</td>
                                <td style={{ fontWeight: 600 }}>Inclusive Participation & Accessibility</td>
                                <td className="text-muted">Voter-centred design, accessible electoral processes, frontline staff training, and reaching under-represented communities. Timed ahead of nominations close (31 Aug).</td>
                                <td><span className="badge" style={{ background: ORANGE, fontSize: '0.7rem' }}>Joint</span></td>
                            </tr>
                            <tr style={{ background: '#f8f9fa' }}>
                                <td style={{ fontWeight: 700, color: ORANGE }}>4</td>
                                <td style={{ whiteSpace: 'nowrap' }}>w/c 21 Sep</td>
                                <td style={{ fontWeight: 600 }}>Electoral Integrity & Trust</td>
                                <td className="text-muted">Building public confidence in electoral institutions through transparency, security, and strategic communications. Follows the Inclusive Elections webinar (16 Sep).</td>
                                <td><span className="badge" style={{ background: ORANGE, fontSize: '0.7rem' }}>Joint</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 700, color: ORANGE }}>5</td>
                                <td style={{ whiteSpace: 'nowrap' }}>w/c 19 Oct</td>
                                <td style={{ fontWeight: 600 }}>Pre-Symposium Engagement</td>
                                <td className="text-muted">Build anticipation for the NOMOS presence at the Manila Symposium. Encourage in-person engagement at the exhibition booth, main programme presentation, and Advocate Syndicate Room.</td>
                                <td><span className="badge" style={{ background: ORANGE, fontSize: '0.7rem' }}>Joint</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="card-footer bg-white" style={{ fontSize: '0.8rem', color: '#666' }}>
                    All campaign copy drafted by ICPS editorial team. NOMOS to review and approve each send. ICPS staff follow-up calls 1–2 weeks after each send.
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
