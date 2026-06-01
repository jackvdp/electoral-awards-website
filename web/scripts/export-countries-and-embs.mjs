#!/usr/bin/env node
// Build a single, clean sheet of countries -> EMB(s) / commissions.
// Reads analysis/institutions-by-country.csv (output of analyse-coverage.mjs),
// filters to EMB-type rows, collapses generic "Election Commission" entries
// into the country's named EMB where possible, and writes one row per
// (country, EMB) to analysis/countries-and-embs.csv.
//
// Run from web/:  node scripts/export-countries-and-embs.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..', '..');
const IN = path.join(REPO_ROOT, 'analysis', 'institutions-by-country.csv');
const OUT = path.join(REPO_ROOT, 'analysis', 'countries-and-embs.csv');

function parseCsv(t) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i+1] === '"') { f += '"'; i++; } else { q = false; } } else f += c; }
    else { if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; } else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else if (c === '\r') { } else f += c; }
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
function toCsv(rows, columns) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.join(',')];
  for (const r of rows) lines.push(columns.map((c) => esc(r[c])).join(','));
  return lines.join('\n') + '\n';
}

const raw = parseCsv(fs.readFileSync(IN, 'utf8'));
const header = raw[0];
const col = (n) => header.indexOf(n);
const C = {
  country: col('country'),
  institution: col('institution'),
  type: col('type'),
  contacts: col('contacts'),
  contactsWithEmail: col('contacts_with_email'),
  sources: col('sources'),
};

// A "generic" EMB entry is one we can't trust as a specific named body.
const GENERIC_RE = /^(election|electoral)\s+commission$/i;
const TRUNCATED_RE = /\b[a-z]\s*$/i; // ends in a stray single letter, e.g. "Central Electoral Commission o"

function isGeneric(name) {
  const s = (name || '').trim();
  if (!s) return true;
  if (GENERIC_RE.test(s)) return true;
  if (TRUNCATED_RE.test(s) && s.length < 40) return true;
  return false;
}

// Bucket EMB rows by country.
const byCountry = new Map();
for (let i = 1; i < raw.length; i++) {
  const r = raw[i];
  if (!r || r[C.type] !== 'EMB') continue;
  const country = r[C.country];
  if (!country) continue;
  const entry = {
    country,
    institution: r[C.institution],
    contacts: parseInt(r[C.contacts], 10) || 0,
    contacts_with_email: parseInt(r[C.contactsWithEmail], 10) || 0,
    sources: r[C.sources] || '',
  };
  if (!byCountry.has(country)) byCountry.set(country, []);
  byCountry.get(country).push(entry);
}

// Within each country, fold generic rows into the largest named row when one exists.
const out = [];
for (const [country, rows] of byCountry) {
  const named = rows.filter((r) => !isGeneric(r.institution));
  const generic = rows.filter((r) => isGeneric(r.institution));

  if (named.length === 0) {
    // No named EMB — keep the generic row(s) as-is but flag.
    // If there's only one, treat it as the country's EMB. If multiple, combine.
    const merged = combine(generic);
    out.push({
      country,
      emb_institution: merged.institution || 'Election Commission',
      contacts: merged.contacts,
      contacts_with_email: merged.contacts_with_email,
      sources: merged.sources,
      note: 'Generic name in source data — verify which body this refers to',
    });
    continue;
  }

  // Sort named rows by contacts desc so the biggest is primary
  named.sort((a, b) => b.contacts - a.contacts);
  const primary = named[0];

  // Fold all generic rows for this country into the primary
  const folded = combine([primary, ...generic]);
  out.push({
    country,
    emb_institution: primary.institution,
    contacts: folded.contacts,
    contacts_with_email: folded.contacts_with_email,
    sources: folded.sources,
    note: generic.length ? `${generic.length} generic entr${generic.length === 1 ? 'y' : 'ies'} folded in` : '',
  });

  // Emit any *additional* distinct named EMBs separately (e.g. national + state)
  for (const extra of named.slice(1)) {
    out.push({
      country,
      emb_institution: extra.institution,
      contacts: extra.contacts,
      contacts_with_email: extra.contacts_with_email,
      sources: extra.sources,
      note: '',
    });
  }
}

function combine(rows) {
  if (!rows.length) return { institution: '', contacts: 0, contacts_with_email: 0, sources: '' };
  const sources = new Set();
  let contacts = 0, withEmail = 0;
  let institution = '';
  for (const r of rows) {
    contacts += r.contacts;
    withEmail += r.contacts_with_email;
    if (r.sources) for (const s of r.sources.split(',')) sources.add(s);
    if (r.institution.length > institution.length) institution = r.institution;
  }
  return {
    institution,
    contacts,
    contacts_with_email: withEmail,
    sources: Array.from(sources).sort().join(','),
  };
}

out.sort((a, b) => a.country.localeCompare(b.country) || b.contacts - a.contacts);

const columns = ['country', 'emb_institution', 'contacts', 'contacts_with_email', 'sources', 'note'];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, toCsv(out, columns));

const countries = new Set(out.map((r) => r.country));
console.log(`Wrote: ${path.relative(REPO_ROOT, OUT)}`);
console.log(`Rows:      ${out.length}`);
console.log(`Countries: ${countries.size}`);
console.log(`Generic-only entries (need verification): ${out.filter((r) => r.note.startsWith('Generic')).length}`);
