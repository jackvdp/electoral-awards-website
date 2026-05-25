#!/usr/bin/env node

/**
 * Article seed script for the Electoral Network website.
 *
 * Usage:
 *   ARTICLE_JSON='{ "title": "...", "link": "...", "image": "...", "category": "...", "description": "...", "content": "..." }' node seed-article.mjs
 */

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../../..');
const envFile = readFileSync(resolve(projectRoot, '.env.local'), 'utf-8');
const MONGODB_URI = envFile.match(/MONGODB_URI=(.*)/)?.[1]?.trim();

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

const raw = process.env.ARTICLE_JSON;
if (!raw) {
  console.error('Error: ARTICLE_JSON environment variable is required.');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error('Error: ARTICLE_JSON is not valid JSON.');
  console.error(err.message);
  process.exit(1);
}

const required = ['title', 'link', 'image', 'category', 'description', 'content'];
const missing = required.filter((f) => !data[f]);
if (missing.length > 0) {
  console.error(`Error: Missing required fields: ${missing.join(', ')}`);
  process.exit(1);
}

const articleSchema = new mongoose.Schema({
  link: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
});

const Article = mongoose.model('Article', articleSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const doc = {
    title: data.title,
    link: data.link,
    image: data.image,
    category: data.category,
    description: data.description,
    date: data.date || new Date().toISOString(),
    content: data.content,
  };

  const created = await Article.create(doc);
  console.log('Article created successfully.');
  console.log(`  Title:    ${created.title}`);
  console.log(`  ID:       ${created._id}`);
  console.log(`  URL path: /articles/${created._id}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Failed to create article:', err.message);
  process.exit(1);
});
