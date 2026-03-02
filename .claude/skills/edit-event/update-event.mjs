#!/usr/bin/env node

/**
 * Generic event update script for the Electoral Network website.
 *
 * Usage:
 *   List all events:
 *     node update-event.mjs --list
 *
 *   Show a single event:
 *     EVENT_ID='<id>' node update-event.mjs --show
 *
 *   Update an event (only fields provided are changed):
 *     EVENT_ID='<id>' UPDATE_JSON='{ "title": "New Title" }' node update-event.mjs
 *
 * See the SKILL.md alongside this file for full documentation.
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d) {
  return new Date(d).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function printEvent(event) {
  console.log(`  Title:       ${event.title}`);
  console.log(`  ID:          ${event._id}`);
  console.log(`  URL path:    /events/${event._id}`);
  console.log(`  Start:       ${formatDate(event.startDate)}`);
  console.log(`  End:         ${formatDate(event.endDate)}`);
  console.log(`  Location:    ${event.location}`);
  console.log(`  Image:       ${event.imageURL || '(none)'}`);
  console.log(`  Speakers:    ${event.speakers.length}`);
  if (event.speakers.length > 0) {
    event.speakers.forEach((s, i) => {
      console.log(`    ${i + 1}. ${s.name} — ${s.description}`);
    });
  }
  console.log(`  Description: ${event.description.substring(0, 120)}...`);
}

// ── Modes ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const mode = args.includes('--list') ? 'list' : args.includes('--show') ? 'show' : 'update';

async function run() {
  await mongoose.connect(MONGODB_URI);

  // ── List all events ──────────────────────────────────────────────────────

  if (mode === 'list') {
    const events = await Event.find({}).sort({ startDate: -1 });
    if (events.length === 0) {
      console.log('No events found.');
    } else {
      console.log(`Found ${events.length} event(s):\n`);
      events.forEach((e) => {
        const upcoming = new Date(e.endDate) >= new Date() ? '[UPCOMING]' : '[PAST]';
        console.log(`${upcoming} ${e.title}`);
        console.log(`  ID: ${e._id}  |  ${formatDate(e.startDate)}  |  ${e.location}`);
        console.log();
      });
    }
    await mongoose.disconnect();
    return;
  }

  // ── Require EVENT_ID for show/update ─────────────────────────────────────

  const eventId = process.env.EVENT_ID;
  if (!eventId) {
    console.error('Error: EVENT_ID environment variable is required.');
    console.error('Use --list to find event IDs.');
    process.exit(1);
  }

  const event = await Event.findById(eventId);
  if (!event) {
    console.error(`Error: No event found with ID ${eventId}`);
    process.exit(1);
  }

  // ── Show event ───────────────────────────────────────────────────────────

  if (mode === 'show') {
    console.log('Event details:\n');
    printEvent(event);
    console.log(`\n  Full description:\n`);
    console.log(event.description);
    await mongoose.disconnect();
    return;
  }

  // ── Update event ─────────────────────────────────────────────────────────

  const raw = process.env.UPDATE_JSON;
  if (!raw) {
    console.error('Error: UPDATE_JSON environment variable is required for updates.');
    console.error('Example: UPDATE_JSON=\'{ "title": "New Title" }\' EVENT_ID=\'...\' node update-event.mjs');
    process.exit(1);
  }

  let updates;
  try {
    updates = JSON.parse(raw);
  } catch (err) {
    console.error('Error: UPDATE_JSON is not valid JSON.');
    console.error(err.message);
    process.exit(1);
  }

  const allowedFields = ['title', 'startDate', 'endDate', 'location', 'description', 'imageURL', 'speakers'];
  const fieldsToUpdate = Object.keys(updates).filter((k) => allowedFields.includes(k));

  if (fieldsToUpdate.length === 0) {
    console.error('Error: No valid fields to update. Allowed fields: ' + allowedFields.join(', '));
    process.exit(1);
  }

  // Show what will change
  console.log(`Updating event: ${event.title}\n`);
  console.log('Changes:');

  for (const field of fieldsToUpdate) {
    if (field === 'description') {
      console.log(`  ${field}: (description updated)`);
    } else if (field === 'speakers') {
      console.log(`  ${field}: ${event.speakers.length} speaker(s) → ${updates.speakers.length} speaker(s)`);
    } else if (field === 'startDate' || field === 'endDate') {
      console.log(`  ${field}: ${formatDate(event[field])} → ${formatDate(updates[field])}`);
    } else {
      console.log(`  ${field}: ${event[field] || '(none)'} → ${updates[field]}`);
    }
  }

  // Apply updates
  const updateDoc = {};
  for (const field of fieldsToUpdate) {
    if (field === 'startDate' || field === 'endDate') {
      updateDoc[field] = new Date(updates[field]);
    } else if (field === 'speakers') {
      updateDoc[field] = updates[field].map((s) => ({
        name: s.name,
        description: s.description,
        imageURL: s.imageURL || undefined,
      }));
    } else {
      updateDoc[field] = updates[field];
    }
  }

  await Event.findByIdAndUpdate(eventId, updateDoc);
  console.log('\nEvent updated successfully.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});