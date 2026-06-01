#!/usr/bin/env node
// Country & EC coverage analysis for the Electoral Network.
// Reads the prospect CSV + Supabase users, dedupes, classifies institutions,
// writes two CSVs to analysis/.
//
// Run from web/:  node scripts/analyse-coverage.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const WEB_DIR = path.resolve(path.dirname(__filename), '..');
const REPO_ROOT = path.resolve(WEB_DIR, '..');
// Prefer the cleaned CSV if it exists, otherwise fall back to the raw export.
const CSV_CLEAN = path.join(REPO_ROOT, 'Electoral data - Manager Level TW (cleaned).csv');
const CSV_RAW = path.join(REPO_ROOT, 'Electoral data - Manager Level TW.csv');
const CSV_PATH = fs.existsSync(CSV_CLEAN) ? CSV_CLEAN : CSV_RAW;
const ANALYSIS_DIR = path.join(REPO_ROOT, 'analysis');

// ---- env ----
const envPath = path.join(WEB_DIR, '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  if (!line || line.startsWith('#')) continue;
  const i = line.indexOf('=');
  if (i < 0) continue;
  const k = line.slice(0, i).trim();
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  if (!process.env[k]) process.env[k] = v;
}

// ---- CSV parser (RFC 4180-ish, handles quoted fields with commas + newlines) ----
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip; \n will flush */ }
      else { field += c; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// ---- normalisation helpers ----
const clean = (s) => (s ?? '').toString().replace(/\s+/g, ' ').trim();
const lc = (s) => clean(s).toLowerCase();

const COUNTRY_ALIASES = new Map(Object.entries({
  // Standard aliases
  'uk': 'United Kingdom',
  'u.k.': 'United Kingdom',
  'great britain': 'United Kingdom',
  'england': 'United Kingdom',
  'usa': 'United States',
  'u.s.a.': 'United States',
  'u.s.': 'United States',
  'united states of america': 'United States',
  'america': 'United States',
  'u.s. virgin islands': 'United States',
  'us virgin islands': 'United States',
  'czechia': 'Czech Republic',
  'russia': 'Russian Federation',
  'south korea': 'Republic of Korea',
  'korea, south': 'Republic of Korea',
  'korea (south)': 'Republic of Korea',
  'north korea': "Democratic People's Republic of Korea",
  'ivory coast': "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  'cape verde': 'Cabo Verde',
  'east timor': 'Timor-Leste',
  'timor': 'Timor-Leste',
  'burma': 'Myanmar',
  'macedonia': 'North Macedonia',
  'republic of macedonia': 'North Macedonia',
  'republic of moldova': 'Moldova',
  'swaziland': 'Eswatini',
  'bosnia & herzegovina': 'Bosnia and Herzegovina',
  'democratic republic of congo': 'Democratic Republic of the Congo',
  'zanzibar': 'Tanzania',
  'fos-belgium': 'Belgium',
  // Typos / misspellings observed in this dataset
  'azerbaijian': 'Azerbaijan',
  'belguim': 'Belgium',
  'cameron': 'Cameroon',
  'kerela': 'India', // misspelled Kerala (Indian state)
  'krygyzstan': 'Kyrgyzstan',
  'latvai': 'Latvia',
  'luxambourg': 'Luxembourg',
  'myanamar': 'Myanmar',
  'romanis': 'Romania',
  'saudi aradia': 'Saudi Arabia',
  'slovania': 'Slovenia',
  'tunisai': 'Tunisia',
  // Indian states/UTs → India
  'andhra pradesh': 'India',
  'arunachal pradesh': 'India',
  'assam': 'India',
  'bihar': 'India',
  'chhattisgarh': 'India',
  'chhattishgarh': 'India',
  'goa': 'India',
  'gujarat': 'India',
  'haryana': 'India',
  'himachal pradesh': 'India',
  'jharkhand': 'India',
  'karnataka': 'India',
  'kerala': 'India',
  'madhya pradesh': 'India',
  'maharashtra': 'India',
  'manipur': 'India',
  'meghalaya': 'India',
  'mizoram': 'India',
  'nagaland': 'India',
  'odisha': 'India',
  'punjab': 'India',
  'rajasthan': 'India',
  'sikkim': 'India',
  'tamil nadu': 'India',
  'telangana': 'India',
  'tripura': 'India',
  'uttar pradesh': 'India',
  'uttarakhand': 'India',
  'west bengal': 'India',
}));

const COUNTRY_STOP_WORDS = new Set(['and','of','the','de','la','le','du','des','und','y','&']);
function normCountry(raw) {
  const c = clean(raw);
  if (!c) return '';
  const alias = COUNTRY_ALIASES.get(c.toLowerCase());
  if (alias) return alias;
  // Title-case but keep small connector words lowercase (avoids "Bosnia And Herzegovina").
  // Don't touch words that already contain mixed case (e.g. acronyms).
  return c.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok)) return tok;
    if (/[A-Z]/.test(tok) && /[a-z]/.test(tok)) return tok; // mixed case → leave alone
    const lower = tok.toLowerCase();
    if (i > 0 && COUNTRY_STOP_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

function normInstitution(raw) {
  let s = clean(raw);
  // strip surrounding double quotes left over from broken CSV escapes
  s = s.replace(/^"+|"+$/g, '').trim();
  return s;
}

function splitEmails(raw) {
  if (!raw) return [];
  return clean(raw)
    .split(/[;,/\s]+/)
    .map((e) => e.toLowerCase())
    .filter((e) => /.+@.+\..+/.test(e));
}

// ---- EMB classifier ----
const EMB_PHRASE_RE = /(election|electoral)\s+(commission|management body|office|authority|tribunal|court|board|council)/i;
const EMB_SHORT_CODES = new Set([
  'EMB','CEC','IEC','IEBC','COMELEC','ECI','TSE','JNE','ONPE','AEC','CNE',
  'CENI','INE','IFE','GECOM','SEC','PEC','BEC',
]);
const EMB_EXTRA_PHRASES = [
  /national election office/i,
  /department of elections/i,
  /\bbundeswahlleiter\b/i,
  /electoral management/i,
  /elections? canada/i,
  /elections? new zealand/i,
  /\bjunta electoral\b/i,
  /\btribunal supremo electoral\b/i,
];

// Disqualifiers: regional forums, associations, observer missions, academia, training centres.
const NON_EMB_RE = /\b(forum|association|network|alliance|federation|union|conference|institute|university|college|school|faculty|academy|training center|training centre|center for training|centre for training|osce|odihr|aceeeo|idea|ifes|undp|carter center|ndi|iri|ministry|department of foreign|embassy|consulate|party|parliament|senate|assembly|court of audit|uaceg)\b/i;

function isEMB(institution) {
  const s = clean(institution);
  if (!s) return false;
  if (NON_EMB_RE.test(s)) return false;
  if (EMB_PHRASE_RE.test(s)) return true;
  for (const re of EMB_EXTRA_PHRASES) if (re.test(s)) return true;
  // short-code match only when the whole string is the code or a tight wrapper
  const compact = s.replace(/[^A-Za-z]/g, '');
  if (compact.length <= 8 && EMB_SHORT_CODES.has(compact.toUpperCase())) return true;
  // pattern like "IEBC - Kenya" or "IEBC, Nairobi"
  const head = s.split(/[\s,\-–—:]/)[0].toUpperCase();
  if (EMB_SHORT_CODES.has(head) && s.length < 40) return true;
  return false;
}

// ---- load CSV ----
const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const rows = parseCsv(csvText);
const header = rows[0];
const idx = (name) => header.findIndex((h) => clean(h).toLowerCase().startsWith(name.toLowerCase()));
const I = {
  country: idx('Country'),
  institution: idx('Institution'),
  fullname: idx('Full name'),
  role: idx('Role category'),
  direct: idx('Direct email'),
  general: idx('Departmental'),
};

const csvContacts = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.every((c) => !clean(c))) continue;
  const country = normCountry(row[I.country]);
  if (!country) continue; // skip the principles/header notes
  const institution = normInstitution(row[I.institution]);
  if (!institution) continue; // no institution means it's not a real contact row
  const fullname = clean(row[I.fullname]);
  const emails = [...splitEmails(row[I.direct]), ...splitEmails(row[I.general])];
  csvContacts.push({
    source: 'csv',
    country,
    institution,
    fullname,
    role: clean(row[I.role]),
    emails,
    primaryEmail: emails[0] || '',
  });
}

console.log(`CSV: parsed ${csvContacts.length} contact rows`);

// ---- load Supabase users ----
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: dbRows, error: dbErr, count: dbCount } = await sb
  .from('users')
  .select('email,country,organisation,position,firstname,lastname', { count: 'exact' });
if (dbErr) { console.error('Supabase error:', dbErr); process.exit(1); }
console.log(`Supabase users: ${dbCount}`);

const dbContacts = (dbRows || []).map((u) => {
  const country = normCountry(u.country);
  const institution = normInstitution(u.organisation);
  const email = lc(u.email);
  const emails = email ? [email] : [];
  return {
    source: 'db',
    country,
    institution,
    fullname: clean(`${u.firstname || ''} ${u.lastname || ''}`),
    role: clean(u.position),
    emails,
    primaryEmail: email,
  };
});

// ---- dedupe across sources ----
function dedupeKey(c) {
  if (c.primaryEmail) return `e:${c.primaryEmail}`;
  // fallback: country|institution|fullname
  return `n:${lc(c.country)}|${lc(c.institution)}|${lc(c.fullname)}`;
}

const merged = new Map();
for (const c of [...csvContacts, ...dbContacts]) {
  const key = dedupeKey(c);
  const existing = merged.get(key);
  if (!existing) {
    merged.set(key, { ...c, sources: new Set([c.source]) });
  } else {
    existing.sources.add(c.source);
    // prefer DB record fields when both exist
    if (c.source === 'db') {
      existing.country = c.country || existing.country;
      existing.institution = c.institution || existing.institution;
      existing.fullname = c.fullname || existing.fullname;
      existing.role = c.role || existing.role;
    }
    // union of emails
    existing.emails = Array.from(new Set([...existing.emails, ...c.emails]));
  }
}

const contacts = Array.from(merged.values());
console.log(`Deduped contacts: ${contacts.length} (from ${csvContacts.length + dbContacts.length} raw)`);

// Canonical key for an institution within a country, to merge near-duplicates
// like "Central Election Commission of the Republic of Armenia",
// "Central Electoral Commission", "Cental Election Commission" (typo), etc.
function canonicalInst(institution, country) {
  let s = lc(institution);
  if (!s) return '';
  // Drop "of the republic of X", "of X" tail when X = country.
  const cy = lc(country);
  if (cy) {
    s = s.replace(new RegExp(`\\b(of|in|for)\\s+(the\\s+)?(republic\\s+of\\s+)?${cy}\\b.*$`, 'i'), '').trim();
  }
  // Drop trailing country name in any form
  if (cy) s = s.replace(new RegExp(`\\b${cy}\\b\\s*$`, 'i'), '').trim();
  // Normalise common variants
  s = s
    .replace(/&/g, 'and')
    .replace(/electoral/g, 'election')
    .replace(/\bcental\b/g, 'central') // common typo
    .replace(/\bcomm(\.|n)?\b/g, 'commission')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Drop stop words
  const stop = new Set(['the','of','for','in','and','a','an','republic','office']);
  s = s.split(' ').filter((w) => w && !stop.has(w)).join(' ');
  return s;
}

// ---- classify institutions ----
const institutionMap = new Map(); // key: country||canonical -> {country, institution, variants, type, contacts, withEmail, sources}
for (const c of contacts) {
  if (!c.institution) continue;
  const canon = canonicalInst(c.institution, c.country) || lc(c.institution);
  const key = `${c.country}||${canon}`;
  let inst = institutionMap.get(key);
  if (!inst) {
    inst = {
      country: c.country,
      institution: c.institution, // canonical display = first-seen variant; we'll prefer the longest below
      variants: new Set([c.institution]),
      type: 'Other', // recomputed once all variants are known
      contacts: 0,
      contacts_with_email: 0,
      sources: new Set(),
    };
    institutionMap.set(key, inst);
  } else {
    inst.variants.add(c.institution);
    // Prefer the longest variant as display name (usually the most explicit)
    if (c.institution.length > inst.institution.length) inst.institution = c.institution;
  }
  inst.contacts += 1;
  if (c.emails.length) inst.contacts_with_email += 1;
  for (const s of c.sources) inst.sources.add(s);
}

// Classify once per merged institution — using whichever variant best signals EMB-ness.
for (const inst of institutionMap.values()) {
  inst.type = Array.from(inst.variants).some(isEMB) ? 'EMB' : 'Other';
}

// ---- per-country roll-up ----
const countryMap = new Map();
for (const c of contacts) {
  const key = c.country || '(unknown)';
  let cy = countryMap.get(key);
  if (!cy) {
    cy = {
      country: key,
      contacts_total: 0,
      contacts_with_email: 0,
      contacts_from_csv: 0,
      contacts_from_db: 0,
      contacts_in_both: 0,
      embs: new Set(),
      others: new Set(),
    };
    countryMap.set(key, cy);
  }
  cy.contacts_total += 1;
  if (c.emails.length) cy.contacts_with_email += 1;
  if (c.sources.has('csv')) cy.contacts_from_csv += 1;
  if (c.sources.has('db')) cy.contacts_from_db += 1;
  if (c.sources.has('csv') && c.sources.has('db')) cy.contacts_in_both += 1;
}

for (const inst of institutionMap.values()) {
  const cy = countryMap.get(inst.country);
  if (!cy) continue;
  if (inst.type === 'EMB') cy.embs.add(lc(inst.institution));
  else cy.others.add(lc(inst.institution));
}

const countryRows = Array.from(countryMap.values())
  .map((cy) => ({
    country: cy.country,
    contacts_total: cy.contacts_total,
    contacts_with_email: cy.contacts_with_email,
    contacts_from_csv: cy.contacts_from_csv,
    contacts_from_db: cy.contacts_from_db,
    contacts_in_both: cy.contacts_in_both,
    embs_covered: cy.embs.size,
    other_institutions: cy.others.size,
    institutions_total: cy.embs.size + cy.others.size,
  }))
  .sort((a, b) => b.contacts_total - a.contacts_total);

const institutionRows = Array.from(institutionMap.values())
  .map((i) => ({
    country: i.country,
    institution: i.institution,
    type: i.type,
    contacts: i.contacts,
    contacts_with_email: i.contacts_with_email,
    sources: Array.from(i.sources).sort().join(','),
    name_variants: Array.from(i.variants).filter((v) => v !== i.institution).join(' | '),
  }))
  .sort((a, b) => a.country.localeCompare(b.country) || b.contacts - a.contacts);

// ---- write CSVs ----
function toCsv(rows, columns) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.join(',')];
  for (const r of rows) lines.push(columns.map((c) => esc(r[c])).join(','));
  return lines.join('\n') + '\n';
}

fs.mkdirSync(ANALYSIS_DIR, { recursive: true });

const countryCsv = toCsv(countryRows, [
  'country','contacts_total','contacts_with_email','contacts_from_csv','contacts_from_db','contacts_in_both','embs_covered','other_institutions','institutions_total',
]);
fs.writeFileSync(path.join(ANALYSIS_DIR, 'country-coverage.csv'), countryCsv);

const instCsv = toCsv(institutionRows, ['country','institution','type','contacts','contacts_with_email','sources','name_variants']);
fs.writeFileSync(path.join(ANALYSIS_DIR, 'institutions-by-country.csv'), instCsv);

// ---- summary to stdout ----
const totalEmbs = countryRows.reduce((a, c) => a + c.embs_covered, 0);
const totalOthers = countryRows.reduce((a, c) => a + c.other_institutions, 0);
const totalWithEmail = countryRows.reduce((a, c) => a + c.contacts_with_email, 0);

console.log('');
console.log(`Countries:           ${countryRows.length}`);
console.log(`Deduped contacts:    ${contacts.length}`);
console.log(`  with any email:    ${totalWithEmail}`);
console.log(`  in both sources:   ${contacts.filter(c => c.sources.has('csv') && c.sources.has('db')).length}`);
console.log(`Institutions total:  ${institutionMap.size}`);
console.log(`  EMBs:              ${totalEmbs}`);
console.log(`  Other:             ${totalOthers}`);
console.log('');
console.log(`Wrote: ${path.relative(REPO_ROOT, path.join(ANALYSIS_DIR, 'country-coverage.csv'))}`);
console.log(`Wrote: ${path.relative(REPO_ROOT, path.join(ANALYSIS_DIR, 'institutions-by-country.csv'))}`);
console.log('');
console.log('--- Top 10 countries by contacts ---');
for (const r of countryRows.slice(0, 10)) {
  console.log(`  ${r.country.padEnd(30)} contacts=${String(r.contacts_total).padStart(4)}  email=${String(r.contacts_with_email).padStart(4)}  EMBs=${String(r.embs_covered).padStart(3)}  Other=${String(r.other_institutions).padStart(3)}`);
}
console.log('');
console.log('--- EMB institutions flagged (sample, first 40) ---');
const embList = Array.from(institutionMap.values()).filter((i) => i.type === 'EMB').sort((a, b) => a.country.localeCompare(b.country));
for (const i of embList.slice(0, 40)) console.log(`  [${i.country}] ${i.institution}  (contacts=${i.contacts})`);
console.log(`  ... ${Math.max(0, embList.length - 40)} more`);
