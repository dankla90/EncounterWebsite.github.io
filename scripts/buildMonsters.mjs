/**
 * buildMonsters.mjs
 *
 * Fetches all monsters from the Open5e API, maps them to the encounterData.js
 * format, and writes scripts/monsters-raw.js for review.
 *
 * Usage:
 *   node scripts/buildMonsters.mjs
 *
 * After running:
 *   1. Open scripts/monsters-raw.js and remove named characters, unique NPCs,
 *      and anything else that doesn't belong in a random encounter pool.
 *   2. Replace the monstersDict in app/data/encounterData.js with the cleaned list.
 *
 * XP values are always derived from CR using the official D&D 5e table —
 * the API's XP field is never trusted.
 */

import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { monstersDict as existingMonsters } from '../app/data/encounterData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Official D&D 5e CR → XP table (DMG p. 274)
const CR_TO_XP = {
  0:     10,
  0.125: 25,
  0.25:  50,
  0.5:   100,
  1:     200,
  2:     450,
  3:     700,
  4:     1100,
  5:     1800,
  6:     2300,
  7:     2900,
  8:     3900,
  9:     5000,
  10:    5900,
  11:    7200,
  12:    8400,
  13:    10000,
  14:    11500,
  15:    13000,
  16:    15000,
  17:    18000,
  18:    20000,
  19:    22000,
  20:    25000,
  21:    33000,
  22:    41000,
  23:    50000,
  24:    62000,
  25:    75000,
  26:    90000,
  27:    105000,
  28:    120000,
  29:    135000,
  30:    155000,
};

// Types that exist in encounterData.js monsterTypesList
const KNOWN_TYPES = new Set([
  'beast', 'monstrosity', 'fiend', 'dragon', 'humanoid',
  'aberration', 'undead', 'giant', 'fey', 'construct',
  'celestial', 'elemental', 'ooze', 'plant',
]);

// Parse CR string ("1/8", "1/4", "1/2", "1", "5", etc.) to a number
function parseCr(raw) {
  if (raw === '1/8') return 0.125;
  if (raw === '1/4') return 0.25;
  if (raw === '1/2') return 0.5;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

// Strip subtype qualifiers and map to a known type
// e.g. "humanoid (elf)" → "humanoid", "swarm of Tiny beasts" → "beast"
function normalizeType(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();

  // Swarms are beasts for encounter purposes
  if (lower.startsWith('swarm')) return 'beast';

  // Strip parenthetical subtypes: "humanoid (any race)" → "humanoid"
  const base = lower.replace(/\s*\(.*?\)/, '').trim();

  return KNOWN_TYPES.has(base) ? base : null;
}

// Convert a monster name to a valid JS object key
function toKey(name) {
  return name
    .replace(/['']/g, '')           // remove apostrophes
    .replace(/[^a-zA-Z0-9 ]/g, '')  // remove other special chars
    .trim()
    .replace(/\s+/g, '_');
}

// Normalize size to Title Case
function normalizeSize(raw) {
  if (!raw) return 'Medium';
  const s = raw.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchAllMonsters() {
  const all = [];
  let url = 'https://api.open5e.com/v1/monsters/?limit=100';

  while (url) {
    process.stdout.write(`Fetching: ${url}\n`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const data = await res.json();
    all.push(...data.results);
    url = data.next;
  }

  return all;
}

async function main() {
  const raw = await fetchAllMonsters();
  console.log(`\nFetched ${raw.length} entries from API.\n`);

  const existingKeys = new Set(Object.keys(existingMonsters));
  console.log(`Existing db has ${existingKeys.size} monsters — these will be skipped.\n`);

  const entries = {};       // key → entry (deduped)
  const unknownTypes = [];  // for reporting
  const skipped = [];       // for reporting

  for (const m of raw) {
    const name = (m.name ?? '').trim();
    if (!name) continue;

    // Parse CR
    const crRaw = String(m.challenge_rating ?? m.cr ?? '0');
    const cr = parseCr(crRaw);
    if (cr === null) {
      skipped.push(`${name} — unknown CR: "${crRaw}"`);
      continue;
    }

    // Look up XP from CR table
    const xp = CR_TO_XP[cr];
    if (xp === undefined) {
      skipped.push(`${name} — CR ${cr} not in XP table`);
      continue;
    }

    // Normalize type
    const type = normalizeType(m.type);
    if (!type) {
      unknownTypes.push(`  ${name}: "${m.type}"`);
      skipped.push(`${name} — unrecognised type: "${m.type}"`);
      continue;
    }

    const key = toKey(name);
    const size = normalizeSize(m.size);

    // Skip if already in the existing db
    if (existingKeys.has(key)) {
      skipped.push(`${name} — already in existing db`);
      continue;
    }

    // Keep first occurrence of a given key within the new batch
    if (entries[key]) {
      skipped.push(`${name} — duplicate key "${key}" (kept first)`);
      continue;
    }

    // Strip any apostrophe variants from slug — they're invalid in URLs
    const slug = m.slug ? m.slug.replace(/[''`]/g, '') : null;
    entries[key] = { name, cr, xp, size, type, ...(slug ? { slug } : {}) };
  }

  // Sort alphabetically by key
  const sortedKeys = Object.keys(entries).sort();

  // Build JS output
  const lines = [
    '// Auto-generated by scripts/buildMonsters.mjs — review before using.',
    '// Remove named characters, unique NPCs, and anything that does not belong',
    '// in a random encounter pool, then replace monstersDict in encounterData.js.',
    '',
    `// Total: ${sortedKeys.length} monsters`,
    'export const monstersDict = {',
  ];

  for (const key of sortedKeys) {
    const m = entries[key];
    const safeName = m.name.replace(/'/g, "\\'");
    const slugPart = m.slug ? `, slug: '${m.slug.replace(/'/g, "\\'")}'` : '';
    lines.push(
      `  ${key}: { name: '${safeName}', cr: ${m.cr}, xp: ${m.xp}, size: '${m.size}', type: '${m.type}'${slugPart} },`
    );
  }

  lines.push('};');

  const outPath = path.join(__dirname, 'monsters-raw.js');
  writeFileSync(outPath, lines.join('\n') + '\n');

  // Summary
  console.log(`Written to: scripts/monsters-raw.js`);
  console.log(`  Monsters kept : ${sortedKeys.length}`);
  console.log(`  Skipped       : ${skipped.length}`);

  if (unknownTypes.length > 0) {
    console.log(`\nUnknown types (skipped) — you may want to add these manually:`);
    console.log(unknownTypes.join('\n'));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
