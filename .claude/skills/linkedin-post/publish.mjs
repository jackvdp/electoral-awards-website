#!/usr/bin/env node

/**
 * Publish a post to the LinkedIn organisation page.
 *
 * Environment variables:
 *   POST_TEXT  (required)  — The post body text
 *   POST_URL   (optional)  — Article URL to attach
 *   POST_TITLE (optional)  — Title for the article attachment
 *
 * Reads LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID from .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
const envPath = resolve(process.cwd(), ".env.local");
let envVars = {};
try {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    envVars[key] = value;
  }
} catch {
  console.error("Error: Could not read .env.local — run oauth-setup.mjs first.");
  process.exit(1);
}

const accessToken = envVars.LINKEDIN_ACCESS_TOKEN;
const orgId = envVars.LINKEDIN_ORG_ID;

if (!accessToken) {
  console.error("Error: LINKEDIN_ACCESS_TOKEN not found in .env.local");
  console.error("Run: node .claude/skills/linkedin-post/oauth-setup.mjs");
  process.exit(1);
}
if (!orgId) {
  console.error("Error: LINKEDIN_ORG_ID not found in .env.local");
  console.error("Run: node .claude/skills/linkedin-post/oauth-setup.mjs");
  process.exit(1);
}

const postText = process.env.POST_TEXT;
if (!postText) {
  console.error("Error: POST_TEXT environment variable is required.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Build the post payload
// ---------------------------------------------------------------------------
const payload = {
  author: `urn:li:organization:${orgId}`,
  commentary: postText,
  visibility: "PUBLIC",
  distribution: {
    feedDistribution: "MAIN_FEED",
    targetEntities: [],
    thirdPartyDistributionChannels: [],
  },
  lifecycleState: "PUBLISHED",
};

// Attach an article link if provided
const postUrl = process.env.POST_URL;
if (postUrl) {
  payload.content = {
    article: {
      source: postUrl,
      title: process.env.POST_TITLE || "",
      description: "",
    },
  };
}

// ---------------------------------------------------------------------------
// Publish
// ---------------------------------------------------------------------------
async function publish() {
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 201) {
    const postUrn = res.headers.get("x-restli-id") || "(unknown)";
    console.log(`Published successfully.`);
    console.log(`Post URN: ${postUrn}`);
    console.log(`View at: https://www.linkedin.com/feed/update/${postUrn}`);
  } else {
    const body = await res.text();
    console.error(`LinkedIn API error (${res.status}):`);
    console.error(body);

    if (res.status === 401) {
      console.error("\nYour access token may have expired (tokens last 60 days).");
      console.error("Run: node .claude/skills/linkedin-post/oauth-setup.mjs");
    }
    process.exit(1);
  }
}

publish();
