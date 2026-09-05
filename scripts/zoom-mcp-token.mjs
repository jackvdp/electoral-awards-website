#!/usr/bin/env node
// Token helper for the Claude Code zoom-plugin (Zoom MCP servers).
//
// Zoom's MCP servers don't support the automatic OAuth that Claude Code uses,
// so the plugin expects a bearer token in ZOOM_MCP_ACCESS_TOKEN. Zoom access
// tokens expire after ~1 hour; this script does the browser sign-in once,
// stores the refresh token, and mints fresh access tokens on demand.
//
// Credentials/state live in ~/.zoom-mcp/ (never in the repo):
//   credentials.env  ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET from the Zoom app
//   tokens.json      access + refresh tokens (chmod 600)
//
// Usage:
//   node scripts/zoom-mcp-token.mjs init     one-off browser authorisation
//   node scripts/zoom-mcp-token.mjs token    print a valid access token
//                                            (auto-refreshes if < 10 min left)
//   node scripts/zoom-mcp-token.mjs refresh  force a refresh now
//   node scripts/zoom-mcp-token.mjs status   show token expiry and scopes
//
// The Zoom app's redirect URL must be exactly: http://localhost:53682/oauth/zoom/callback

import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, chmodSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DIR = join(homedir(), '.zoom-mcp');
const CREDS_FILE = join(DIR, 'credentials.env');
const TOKENS_FILE = join(DIR, 'tokens.json');
const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/zoom/callback`;
const REFRESH_MARGIN_SECONDS = 600;

const cmd = process.argv[2];
const quiet = process.argv.includes('--quiet');

function fail(msg) {
  if (!quiet) console.error(msg);
  process.exit(1);
}

function loadCreds() {
  if (!existsSync(CREDS_FILE)) {
    fail(`Missing ${CREDS_FILE}\nCreate it with:\n  ZOOM_CLIENT_ID=...\n  ZOOM_CLIENT_SECRET=...`);
  }
  const creds = {};
  for (const line of readFileSync(CREDS_FILE, 'utf8').split('\n')) {
    const m = line.match(/^\s*(ZOOM_CLIENT_ID|ZOOM_CLIENT_SECRET)\s*=\s*"?([^"\s]+)"?\s*$/);
    if (m) creds[m[1]] = m[2];
  }
  if (!creds.ZOOM_CLIENT_ID || !creds.ZOOM_CLIENT_SECRET) {
    fail(`Could not read ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET from ${CREDS_FILE}`);
  }
  return creds;
}

function saveTokens(data) {
  const expiresAt = Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600);
  const record = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    scope: data.scope,
    expires_at: expiresAt,
  };
  mkdirSync(DIR, { recursive: true });
  writeFileSync(TOKENS_FILE, JSON.stringify(record, null, 2));
  chmodSync(TOKENS_FILE, 0o600);
  return record;
}

function loadTokens() {
  if (!existsSync(TOKENS_FILE)) fail(`No tokens yet. Run: node scripts/zoom-mcp-token.mjs init`);
  return JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
}

async function exchange(creds, params) {
  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${creds.ZOOM_CLIENT_ID}:${creds.ZOOM_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    fail(`Zoom token endpoint error (HTTP ${res.status}): ${JSON.stringify(body)}`);
  }
  return body;
}

async function refresh(creds) {
  const tokens = loadTokens();
  const data = await exchange(creds, {
    grant_type: 'refresh_token',
    refresh_token: tokens.refresh_token,
  });
  return saveTokens(data);
}

async function init(creds) {
  const state = randomBytes(16).toString('hex');
  const authUrl =
    `https://zoom.us/oauth/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(creds.ZOOM_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}`;

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      if (url.pathname !== '/oauth/zoom/callback') {
        res.writeHead(404).end();
        return;
      }
      if (url.searchParams.get('state') !== state) {
        res.writeHead(400).end('State mismatch - try again.');
        return;
      }
      const c = url.searchParams.get('code');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Zoom authorised.</h2><p>You can close this tab and return to the terminal.</p>');
      server.close();
      c ? resolve(c) : reject(new Error('No code in callback'));
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log('Opening Zoom sign-in in your browser...');
      console.log(`If it does not open, visit:\n${authUrl}\n`);
      execFile('open', [authUrl]);
    });
    setTimeout(() => { server.close(); reject(new Error('Timed out after 5 minutes')); }, 300_000);
  });

  const data = await exchange(creds, {
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });
  const record = saveTokens(data);
  console.log(`Authorised. Token stored in ${TOKENS_FILE}`);
  console.log(`Scopes: ${record.scope}`);
}

const creds = loadCreds();

if (cmd === 'init') {
  await init(creds);
} else if (cmd === 'refresh') {
  const record = await refresh(creds);
  if (!quiet) console.log(`Refreshed. Expires ${new Date(record.expires_at * 1000).toLocaleTimeString()}`);
} else if (cmd === 'token') {
  let tokens = loadTokens();
  if (tokens.expires_at - Date.now() / 1000 < REFRESH_MARGIN_SECONDS) {
    tokens = await refresh(creds);
  }
  process.stdout.write(tokens.access_token);
} else if (cmd === 'status') {
  const tokens = loadTokens();
  const secondsLeft = Math.floor(tokens.expires_at - Date.now() / 1000);
  console.log(`Access token: ${secondsLeft > 0 ? `valid for ${Math.floor(secondsLeft / 60)} min` : 'EXPIRED'}`);
  console.log(`Scopes: ${tokens.scope}`);
} else {
  fail('Usage: zoom-mcp-token.mjs <init|token|refresh|status> [--quiet]');
}
