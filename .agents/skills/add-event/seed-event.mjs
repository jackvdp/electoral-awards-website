#!/usr/bin/env node

/**
 * Generic event seed script for the Electoral Network website.
 *
 * Usage:
 *   EVENT_JSON='{ "title": "...", "startDate": "...", "endDate": "...", "location": "...", "description": "..." }' node seed-event.mjs
 *
 * The EVENT_JSON environment variable must contain a valid JSON object.
 * See the SKILL.md alongside this file for the full schema.
 */

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ── Load MongoDB URI from .env.local ──────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../../..');
const envFile = readFileSync(resolve(projectRoot, '.env.local'), 'utf-8');
const MONGODB_URI = envFile.match(/MONGODB_URI=(.*)/)?.[1]?.trim();

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

// ── Parse event data from environment variable ───────────────────────────────

const raw = process.env.EVENT_JSON;
if (!raw) {
  console.error('Error: EVENT_JSON environment variable is required.');
  console.error('Usage: EVENT_JSON=\'{ "title": "...", ... }\' node seed-event.mjs');
  process.exit(1);
}

let eventData;
try {
  eventData = JSON.parse(raw);
} catch (err) {
  console.error('Error: EVENT_JSON is not valid JSON.');
  console.error(err.message);
  process.exit(1);
}

// ── Validate required fields ─────────────────────────────────────────────────

const required = ['title', 'startDate', 'endDate', 'location', 'description'];
const missing = required.filter((f) => !eventData[f]);
if (missing.length > 0) {
  console.error(`Error: Missing required fields: ${missing.join(', ')}`);
  process.exit(1);
}

// ── Define Mongoose schema (matches src/backend/models/event.ts) ─────────────

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  imageURL: { type: String },
  description: { type: String, required: true },
  location: { type: String, required: true },
  signups: { type: [String], default: [] },
  speakers: { type: [speakerSchema], default: [] },
});

const Event = mongoose.model('Event', eventSchema);

// ── Insert event ─────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const doc = {
    title: eventData.title,
    startDate: new Date(eventData.startDate),
    endDate: new Date(eventData.endDate),
    location: eventData.location,
    description: eventData.description,
    imageURL: eventData.imageURL || undefined,
    speakers: (eventData.speakers || []).map((s) => ({
      name: s.name,
      description: s.description,
      imageURL: s.imageURL || undefined,
    })),
  };

  const created = await Event.create(doc);
  console.log(`Event created successfully.`);
  console.log(`  Title:    ${created.title}`);
  console.log(`  ID:       ${created._id}`);
  console.log(`  URL path: /events/${created._id}`);
  console.log(`  Dates:    ${created.startDate.toISOString()} – ${created.endDate.toISOString()}`);
  console.log(`  Location: ${created.location}`);
  console.log(`  Speakers: ${created.speakers.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Failed to create event:', err.message);
  process.exit(1);
});