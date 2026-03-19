import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { createClient } from 'backend/supabase/server-props';
import AdminPage from "components/blocks/admin/reusables/AdminPage";
import Head from 'next/head';
import { CommsPlanData } from 'data/comms-plan-2026';
import { commsPlan2026 } from 'data/comms-plan-2026';

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────

const tagColours: Record<string, string> = {
    registration: '#3f78e0',
    nominations: '#45c4a0',
    speakers: '#7c69ef',
    programme: '#f78b77',
    webinars: '#e8a317',
    logistics: '#6c757d',
};

const statusConfig: Record<string, { label: string; bg: string }> = {
    drafted: { label: 'Drafted', bg: '#fff3cd' },
    sent: { label: 'Sent', bg: '#d1e7dd' },
    pending: { label: 'Pending', bg: '#f8f9fa' },
};

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

interface CommsPlanPageProps {
    plan: CommsPlanData;
}

const CommsPlan: NextPage<CommsPlanPageProps> = ({ plan }) => {
    const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
    const [filterTag, setFilterTag] = useState<string | null>(null);

    const { phases, emails, socialPosts, calendarMonths, sellingPoints, notes, eventMarker, keyDates } = plan;

    const filteredEmails = filterTag
        ? emails.filter(e => e.tags.includes(filterTag))
        : emails;

    const allTags = ['registration', 'nominations', 'speakers', 'programme', 'webinars', 'logistics'];

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
                            <h4 className="mb-1">{plan.title}</h4>
                            <p className="text-muted mb-0">{plan.subtitle}</p>
                            <p className="text-muted mb-0">{plan.coHost}</p>
                        </div>
                        <div className="col-lg-4">
                            <div className="row text-center mt-3 mt-lg-0">
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#3f78e0' }}>{plan.targetDelegates}</h3>
                                    <small className="text-muted">Target delegates</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#45c4a0' }}>{emails.length}</h3>
                                    <small className="text-muted">Emails</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="mb-0" style={{ color: '#7c69ef' }}>~{socialPosts.reduce((sum, p) => sum + p.count, 0)}</h3>
                                    <small className="text-muted">Social posts</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Calendar Timeline ── */}
            <div className="card mb-4">
                <div className="card-header bg-white d-flex align-items-center gap-3">
                    <h5 className="mb-0">Communications Calendar</h5>
                    <div className="d-flex gap-3 ms-auto" style={{ fontSize: '0.75rem' }}>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#6c757d', display: 'inline-block' }} />
                            Email
                        </span>
                        <span className="d-flex align-items-center gap-1">
                            <span style={{ width: 12, height: 12, borderRadius: 2, background: '#0a66c2', display: 'inline-block', transform: 'rotate(45deg)' }} />
                            LinkedIn
                        </span>
                    </div>
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
                                // Social posts that fall within this phase's email date range
                                const phaseStartDates = phaseEmails.map(e => e.weekStart);
                                const phaseStart = phaseStartDates.length > 0 ? phaseStartDates[0] : '';
                                const phaseEnd = phaseStartDates.length > 0 ? phaseStartDates[phaseStartDates.length - 1] : '';
                                // Find social posts in this phase's time range
                                const phaseSocial = socialPosts.filter(sp => {
                                    if (!phaseStart || !phaseEnd) return false;
                                    // Extend end by 2 weeks to catch recap posts
                                    const endDate = new Date(phaseEnd);
                                    endDate.setDate(endDate.getDate() + 14);
                                    return sp.weekStart >= phaseStart && sp.weekStart <= endDate.toISOString().slice(0, 10);
                                });
                                return (
                                    <div key={phase.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <div className="d-flex align-items-center py-1 px-2" style={{ background: '#f8f9fa' }}>
                                            <span className="badge me-2" style={{ background: phase.colour, fontSize: '0.7rem' }}>
                                                Phase {phase.id}
                                            </span>
                                            <small className="fw-bold">{phase.name}</small>
                                            <small className="text-muted ms-auto">Target: {phase.targetRegistrations} delegates</small>
                                        </div>
                                        <div className="d-flex position-relative" style={{ height: 56 }}>
                                            {calendarMonths.map(m => (
                                                <div key={m.name} style={{ flex: 1, borderRight: '1px solid #f0f0f0' }} />
                                            ))}
                                            {/* Email circles (top row) */}
                                            {phaseEmails.map(email => {
                                                const monthIdx = getMonthIndex(email.weekStart);
                                                const calIdx = calendarMonths.findIndex(m => m.month === monthIdx);
                                                if (calIdx === -1) return null;
                                                const weekInMonth = getWeekOfMonth(email.weekStart);
                                                const leftPct = ((calIdx + (weekInMonth - 1) / 5) / calendarMonths.length) * 100;
                                                return (
                                                    <div
                                                        key={email.id}
                                                        onClick={() => {
                                                            setExpandedEmail(expandedEmail === email.id ? null : email.id);
                                                            setTimeout(() => {
                                                                document.getElementById(`email-${email.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            }, 50);
                                                        }}
                                                        title={`Email ${email.id}: ${email.primary}`}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${leftPct}%`,
                                                            top: 4,
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            background: phase.colour,
                                                            color: '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.7rem',
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
                                            {/* Social diamonds (bottom row) */}
                                            {phaseSocial.map((sp, i) => {
                                                const monthIdx = getMonthIndex(sp.weekStart);
                                                const calIdx = calendarMonths.findIndex(m => m.month === monthIdx);
                                                if (calIdx === -1) return null;
                                                const weekInMonth = getWeekOfMonth(sp.weekStart);
                                                const leftPct = ((calIdx + (weekInMonth - 1) / 5) / calendarMonths.length) * 100;
                                                return (
                                                    <div
                                                        key={`social-${i}`}
                                                        title={`LinkedIn (${sp.count} posts): ${sp.description}`}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${leftPct}%`,
                                                            top: 36,
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: 2,
                                                            background: '#0a66c2',
                                                            transform: 'rotate(45deg)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                                            zIndex: 1,
                                                            marginLeft: 6,
                                                        }}
                                                    >
                                                        <span style={{ transform: 'rotate(-45deg)', color: '#fff', fontSize: '0.55rem', fontWeight: 700 }}>
                                                            {sp.count}
                                                        </span>
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
                                        left: `${eventMarker.position * 100}%`,
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
                                    {eventMarker.label}
                                </div>
                            </div>

                            {/* Key dates row */}
                            <div className="d-flex position-relative" style={{ height: 28, borderTop: '1px dashed #dee2e6' }}>
                                {calendarMonths.map(m => (
                                    <div key={m.name} style={{ flex: 1, borderRight: '1px solid #f0f0f0' }} />
                                ))}
                                {keyDates.map((kd, i) => (
                                    <div key={i} style={{ position: 'absolute', left: `${kd.position * 100}%`, top: 4, fontSize: '0.65rem', color: kd.colour, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {kd.label}
                                    </div>
                                ))}
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

            {/* ── Unified Communications Schedule ── */}
            <div className="card mb-4">
                <div className="card-header bg-white d-flex align-items-center justify-content-between flex-wrap">
                    <h5 className="mb-0">Communications Schedule</h5>
                    <div className="d-flex gap-2 flex-wrap mt-2 mt-md-0">
                        <button
                            className={`btn btn-sm ${!filterTag ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => setFilterTag(null)}
                        >
                            All
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
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
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
                                    <th>Focus</th>
                                    <th>Secondary Thread</th>
                                    <th>Subject Line</th>
                                    <th style={{ width: 100 }}>Social</th>
                                    <th style={{ width: 90 }}>Status</th>
                                    <th style={{ width: 40 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    // Build a map of social posts by weekStart for matching
                                    const socialByWeek = new Map<string, typeof socialPosts[0]>();
                                    socialPosts.forEach(sp => socialByWeek.set(sp.weekStart, sp));

                                    // Track which social weeks are covered by emails
                                    const coveredSocialWeeks = new Set<string>();
                                    filteredEmails.forEach(e => {
                                        if (socialByWeek.has(e.weekStart)) coveredSocialWeeks.add(e.weekStart);
                                    });

                                    // Standalone social posts (weeks with no email)
                                    const standaloneSocial = socialPosts.filter(sp => !coveredSocialWeeks.has(sp.weekStart));

                                    // Build unified rows: emails + standalone social, sorted by date
                                    type UnifiedRow = { type: 'email'; weekStart: string; email: typeof emails[0] } | { type: 'social'; weekStart: string; social: typeof socialPosts[0] };
                                    const rows: UnifiedRow[] = [
                                        ...filteredEmails.map(e => ({ type: 'email' as const, weekStart: e.weekStart, email: e })),
                                        ...standaloneSocial
                                            .filter(sp => !filterTag || filterTag === 'webinars') // show standalone social when unfiltered or filtering webinars
                                            .map(sp => ({ type: 'social' as const, weekStart: sp.weekStart, social: sp })),
                                    ].sort((a, b) => a.weekStart.localeCompare(b.weekStart));

                                    return rows.map(row => {
                                        if (row.type === 'email') {
                                            const email = row.email;
                                            const phase = phases.find(p => p.id === email.phase)!;
                                            const isExpanded = expandedEmail === email.id;
                                            const matchedSocial = socialByWeek.get(email.weekStart);
                                            return (
                                                <React.Fragment key={`email-${email.id}`}>
                                                    <tr
                                                        id={`email-${email.id}`}
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
                                                            {matchedSocial ? (
                                                                <span
                                                                    className="badge"
                                                                    title={matchedSocial.description}
                                                                    style={{ background: '#0a66c2', fontSize: '0.7rem', cursor: 'help' }}
                                                                >
                                                                    <i className="uil uil-linkedin me-1"></i>
                                                                    {matchedSocial.count} {matchedSocial.count === 1 ? 'post' : 'posts'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>—</span>
                                                            )}
                                                        </td>
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
                                                            {email.templateFile && (
                                                                <i className="uil uil-file-download-alt ms-2" style={{ color: '#3f78e0', fontSize: '1rem' }} title="Template available"></i>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <i className={`uil ${isExpanded ? 'uil-angle-up' : 'uil-angle-down'}`}></i>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && (
                                                        <tr>
                                                            <td colSpan={8} style={{ background: '#f8f9fa', borderLeft: `3px solid ${phase.colour}` }}>
                                                                <div className="p-3">
                                                                    <div className="row">
                                                                        <div className="col-md-8">
                                                                            <p className="mb-2"><strong>Detail:</strong> {email.detail}</p>
                                                                            <p className="mb-2"><strong>Audience:</strong> {email.audience}</p>
                                                                            <p className="mb-2"><strong>CTA:</strong> {email.cta}</p>
                                                                            {email.templateFile && (
                                                                                <a
                                                                                    href={`/api/comms-templates/${email.templateFile}`}
                                                                                    className="btn btn-sm btn-primary mt-1"
                                                                                    download={email.templateFile}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    <i className="uil uil-download-alt me-1"></i>
                                                                                    Download Outlook Template
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="p-2 mb-2" style={{ background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                                                                                <small className="text-muted d-block mb-1">Phase {phase.id}: {phase.name}</small>
                                                                                <small className="d-block"><strong>Target:</strong> {phase.targetRegistrations} cumulative delegates</small>
                                                                                <small className="d-block"><strong>Period:</strong> {phase.period}</small>
                                                                            </div>
                                                                            {matchedSocial && (
                                                                                <div className="p-2" style={{ background: '#fff', borderRadius: 4, border: '1px solid #0a66c2' }}>
                                                                                    <small className="d-block mb-1" style={{ color: '#0a66c2', fontWeight: 600 }}>
                                                                                        <i className="uil uil-linkedin me-1"></i>
                                                                                        LinkedIn — {matchedSocial.count} posts this week
                                                                                    </small>
                                                                                    <small className="d-block">{matchedSocial.description}</small>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        } else {
                                            // Standalone social post row
                                            const sp = row.social;
                                            return (
                                                <tr key={`social-${sp.weekStart}`} style={{ borderLeft: '3px solid #0a66c2', background: '#f8fbff' }}>
                                                    <td>
                                                        <span
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 26,
                                                                height: 26,
                                                                borderRadius: 4,
                                                                background: '#0a66c2',
                                                                color: '#fff',
                                                                fontSize: '0.85rem',
                                                            }}
                                                        >
                                                            <i className="uil uil-linkedin"></i>
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{sp.wc}</td>
                                                    <td colSpan={3} style={{ fontSize: '0.85rem' }}>
                                                        {sp.description}
                                                    </td>
                                                    <td>
                                                        <span className="badge" style={{ background: '#0a66c2', fontSize: '0.7rem' }}>
                                                            {sp.count} {sp.count === 1 ? 'post' : 'posts'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>—</span>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            );
                                        }
                                    });
                                })()}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: '#f8f9fa', fontSize: '0.8rem' }}>
                                    <td colSpan={5} className="fw-bold">Total</td>
                                    <td>
                                        <span className="badge" style={{ background: '#0a66c2', fontSize: '0.7rem' }}>
                                            {socialPosts.reduce((sum, p) => sum + p.count, 0)} posts
                                        </span>
                                    </td>
                                    <td colSpan={2}>
                                        <strong>{emails.length} emails</strong>
                                    </td>
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
                        {sellingPoints.map((point, i) => (
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
                        {notes.map((note, i) => (
                            <li key={i} className={i < notes.length - 1 ? 'mb-2' : ''} dangerouslySetInnerHTML={{ __html: note }} />
                        ))}
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

    return { props: { plan: commsPlan2026 } };
};
