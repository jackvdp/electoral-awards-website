#!/usr/bin/env node

/**
 * One-time OAuth 2.0 setup for LinkedIn API access.
 *
 * Prerequisites:
 *   1. Create a LinkedIn Developer App at https://www.linkedin.com/developers/
 *   2. Request the "Community Management API" product
 *   3. Add http://localhost:3000/callback as a redirect URL
 *   4. Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to .env.local
 *
 * This script will:
 *   - Open your browser to LinkedIn's authorisation page
 *   - Capture the auth code via a local callback server
 *   - Exchange it for an access token
 *   - Fetch your administered organisation pages
 *   - Save LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID to .env.local
 */

import { createServer } from "http";
import { readFileSync, appendFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { exec } from "child_process";
import { createInterface } from "readline";

const envPath = resolve(process.cwd(), ".env.local");
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = "w_organization_social r_organization_social openid profile";

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
function loadEnv() {
  const vars = {};
  try {
    const envFile = readFileSync(envPath, "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      vars[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
    }
  } catch {
    // .env.local doesn't exist yet — that's fine
  }
  return vars;
}

function saveEnvVar(key, value) {
  let content;
  try {
    content = readFileSync(envPath, "utf-8");
  } catch {
    content = "";
  }

  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
    writeFileSync(envPath, content);
  } else {
    appendFileSync(envPath, `\n${key}=${value}\n`);
  }
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const env = loadEnv();

  const clientId = env.LINKEDIN_CLIENT_ID;
  const clientSecret = env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Error: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in .env.local");
    console.error("");
    console.error("Steps:");
    console.error("  1. Go to https://www.linkedin.com/developers/");
    console.error("  2. Create an app (or use an existing one)");
    console.error("  3. Request the 'Community Management API' product");
    console.error("  4. Under Auth > OAuth 2.0 settings, add redirect URL: http://localhost:3000/callback");
    console.error("  5. Add to .env.local:");
    console.error("     LINKEDIN_CLIENT_ID=your_client_id");
    console.error("     LINKEDIN_CLIENT_SECRET=your_client_secret");
    console.error("  6. Re-run this script");
    process.exit(1);
  }

  console.log("Starting LinkedIn OAuth setup...\n");

  // Step 1: Start local server and open browser
  const authCode = await new Promise((resolveCode) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:3000`);
      if (url.pathname === "/callback") {
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`<h1>Error</h1><p>${error}: ${url.searchParams.get("error_description")}</p>`);
          server.close();
          console.error(`LinkedIn authorisation error: ${error}`);
          process.exit(1);
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Authorised!</h1><p>You can close this tab and return to the terminal.</p>");
        server.close();
        resolveCode(code);
      }
    });

    server.listen(3000, () => {
      const authUrl =
        `https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(SCOPES)}`;

      console.log("Opening LinkedIn authorisation page in your browser...");
      console.log(`If it doesn't open, visit:\n${authUrl}\n`);
      openBrowser(authUrl);
    });
  });

  console.log("Auth code received. Exchanging for access token...\n");

  // Step 2: Exchange code for token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: REDIRECT_URI,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error(`Token exchange failed (${tokenRes.status}): ${err}`);
    process.exit(1);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in; // seconds

  const expiryDate = new Date(Date.now() + expiresIn * 1000).toISOString().split("T")[0];
  console.log(`Access token obtained (expires ${expiryDate}).\n`);

  saveEnvVar("LINKEDIN_ACCESS_TOKEN", accessToken);
  console.log("Saved LINKEDIN_ACCESS_TOKEN to .env.local\n");

  // Step 3: Fetch administered organisations
  console.log("Fetching your administered organisation pages...\n");

  const orgRes = await fetch(
    "https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(localizedName,vanityName,id)))",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );

  if (!orgRes.ok) {
    const err = await orgRes.text();
    console.error(`Could not fetch organisations (${orgRes.status}): ${err}`);
    console.error("\nYou can manually set LINKEDIN_ORG_ID in .env.local");
    console.error("Find your org ID from your LinkedIn page URL: linkedin.com/company/{id}");
    process.exit(1);
  }

  const orgData = await orgRes.json();
  const orgs = (orgData.elements || []).map((el) => {
    const org = el["organization~"] || {};
    return {
      id: org.id,
      name: org.localizedName || "(unknown)",
      vanity: org.vanityName || "",
    };
  });

  if (orgs.length === 0) {
    console.log("No administered organisation pages found.");
    console.log("You can manually set LINKEDIN_ORG_ID in .env.local");
    console.log("Find your org ID from your LinkedIn page URL.\n");
    const manualId = await prompt("Enter organisation ID (or press Enter to skip): ");
    if (manualId) {
      saveEnvVar("LINKEDIN_ORG_ID", manualId);
      console.log(`Saved LINKEDIN_ORG_ID=${manualId} to .env.local`);
    }
  } else if (orgs.length === 1) {
    console.log(`Found organisation: ${orgs[0].name} (ID: ${orgs[0].id})`);
    saveEnvVar("LINKEDIN_ORG_ID", String(orgs[0].id));
    console.log(`Saved LINKEDIN_ORG_ID=${orgs[0].id} to .env.local`);
  } else {
    console.log("Found multiple organisations:\n");
    orgs.forEach((org, i) => {
      console.log(`  ${i + 1}. ${org.name} (${org.vanity}) — ID: ${org.id}`);
    });
    const choice = await prompt(`\nSelect organisation (1-${orgs.length}): `);
    const idx = parseInt(choice, 10) - 1;
    if (idx >= 0 && idx < orgs.length) {
      saveEnvVar("LINKEDIN_ORG_ID", String(orgs[idx].id));
      console.log(`\nSaved LINKEDIN_ORG_ID=${orgs[idx].id} to .env.local`);
    } else {
      console.error("Invalid selection.");
      process.exit(1);
    }
  }

  console.log("\nSetup complete! You can now use /linkedin-post to publish posts.");
  console.log(`Token expires: ${expiryDate} — re-run this script to refresh.`);
}

main();
