#!/usr/bin/env node
// Clean the Electoral Network prospect CSV.
// - Normalises country names (typos, aliases, Indian states → India)
// - Fixes institution typos (Cental → Central, leading whitespace)
// - Repairs specific cross-country data-entry errors (row-level overrides)
// Writes:
//   ../Electoral data - Manager Level TW (cleaned).csv
//   ../analysis/csv-cleanup-audit.csv
//
// Run from web/:  node scripts/clean-csv.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..', '..');
const SRC = path.join(REPO_ROOT, 'Electoral data - Manager Level TW.csv');
const OUT = path.join(REPO_ROOT, 'Electoral data - Manager Level TW (cleaned).csv');
const AUDIT_DIR = path.join(REPO_ROOT, 'analysis');
const AUDIT = path.join(AUDIT_DIR, 'csv-cleanup-audit.csv');

// ---- CSV ----
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
function toCsv(rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(',')).join('\n') + '\n';
}

const clean = (s) => (s ?? '').toString().replace(/\s+/g, ' ').trim();

// ---- country normalisation (mirrors analyse-coverage.mjs) ----
const COUNTRY_ALIASES = new Map(Object.entries({
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
  // Typos
  'azerbaijian': 'Azerbaijan',
  'belguim': 'Belgium',
  'cameron': 'Cameroon',
  'kerela': 'India',
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
  return c.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok)) return tok;
    if (/[A-Z]/.test(tok) && /[a-z]/.test(tok)) return tok;
    const lower = tok.toLowerCase();
    if (i > 0 && COUNTRY_STOP_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

// ---- institution fixes ----
function normInstitution(raw) {
  let s = (raw ?? '').toString();
  // Strip leading/trailing whitespace and stray quotes
  s = s.replace(/^[\s"]+|[\s"]+$/g, '');
  // Collapse internal whitespace
  s = s.replace(/\s+/g, ' ');
  // Typo fixes
  s = s.replace(/\bCental\b/g, 'Central');
  s = s.replace(/\bElelction\b/gi, 'Election');
  return s;
}

// ---- per-row overrides for the cross-country leaks we identified ----
// Keyed by 1-based row number in the original CSV. Each override sets
// specific cells and gives a reason for the audit log.
const ROW_OVERRIDES = new Map([
  [6, {
    country: 'Bosnia and Herzegovina',
    institution: 'Central Election Commission of Bosnia and Herzegovina',
    reason: 'Institution misnamed as Belarus body; email izbori.ba confirms Bosnia EMB',
  }],
  [22, {
    country: 'Russian Federation',
    institution: 'Central Election Commission of the Russian Federation',
    reason: 'Country was Romania but institution + .ru email confirm Russia',
  }],
  [128, {
    country: 'Namibia',
    institution: 'Electoral Commission of Namibia',
    reason: 'Institution said "Burundi National Commission" but email ecn.na confirms Namibia EMB',
  }],
  [139, {
    country: 'Burundi',
    institution: 'Independent National Electoral Commission of Burundi (CENI)',
    reason: 'Institution mislabelled as Botswana EMB; burundiceni@ email confirms Burundi CENI',
  }],
]);

// ---- run ----
const raw = fs.readFileSync(SRC, 'utf8');
const rows = parseCsv(raw);
const header = rows[0];
const audit = [['row','field','old_value','new_value','reason']];

// Column indices (resolved against header for safety)
const idx = (name) => header.findIndex((h) => clean(h).toLowerCase().startsWith(name.toLowerCase()));
const COL = {
  country: idx('Country'),
  institution: idx('Institution'),
};
if (COL.country < 0 || COL.institution < 0) {
  console.error('Header lookup failed', { COL, header });
  process.exit(1);
}

let countryChanges = 0;
let institutionChanges = 0;
let overrideChanges = 0;

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.every((c) => !clean(c))) continue;
  const rowNum = i + 1; // 1-based, matching the source file

  // Row-level overrides first (they take precedence)
  const ov = ROW_OVERRIDES.get(rowNum);
  if (ov) {
    if (ov.country && row[COL.country] !== ov.country) {
      audit.push([rowNum, 'Country', row[COL.country], ov.country, ov.reason]);
      row[COL.country] = ov.country;
      overrideChanges++;
    }
    if (ov.institution && row[COL.institution] !== ov.institution) {
      audit.push([rowNum, 'Institution', row[COL.institution], ov.institution, ov.reason]);
      row[COL.institution] = ov.institution;
      overrideChanges++;
    }
    continue; // skip the generic passes for overridden rows
  }

  // Country normalisation
  const oldCountry = row[COL.country] ?? '';
  const newCountry = normCountry(oldCountry);
  if (newCountry && newCountry !== clean(oldCountry)) {
    audit.push([rowNum, 'Country', oldCountry, newCountry, 'Normalised (alias/typo/sub-national)']);
    row[COL.country] = newCountry;
    countryChanges++;
  } else if (oldCountry !== clean(oldCountry) && clean(oldCountry)) {
    // Just trimmed whitespace
    row[COL.country] = clean(oldCountry);
    audit.push([rowNum, 'Country', oldCountry, clean(oldCountry), 'Trimmed whitespace']);
    countryChanges++;
  }

  // Institution normalisation
  const oldInst = row[COL.institution] ?? '';
  const newInst = normInstitution(oldInst);
  if (newInst !== oldInst && newInst) {
    audit.push([rowNum, 'Institution', oldInst, newInst, 'Trimmed/typo-fixed']);
    row[COL.institution] = newInst;
    institutionChanges++;
  }
}

fs.writeFileSync(OUT, toCsv(rows));
fs.mkdirSync(AUDIT_DIR, { recursive: true });
fs.writeFileSync(AUDIT, toCsv(audit));

console.log(`Wrote cleaned CSV:  ${path.relative(REPO_ROOT, OUT)}`);
console.log(`Wrote audit log:    ${path.relative(REPO_ROOT, AUDIT)}`);
console.log('');
console.log(`Country fields changed:      ${countryChanges}`);
console.log(`Institution fields changed:  ${institutionChanges}`);
console.log(`Row-level overrides applied: ${overrideChanges}`);
