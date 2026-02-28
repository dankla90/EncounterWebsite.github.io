/**
 * mergeMonsters.mjs
 *
 * Merges scripts/monsters-raw.js into app/data/encounterData.js.
 * Skips named unique characters and fuzzy duplicates of existing entries.
 * A backup of encounterData.js must exist before running this.
 *
 * Usage:
 *   node scripts/mergeMonsters.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { monstersDict as existingMonsters } from '../app/data/encounterData.js';
import { monstersDict as newMonsters } from './monsters-raw.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Named unique characters, named bosses, and explicit NPC stat blocks
const REMOVE_BY_NAME = new Set([
  // Original clear cuts
  'Animal Lord, Mammoth Queen',
  "Baba Yaga's Horsemen, Black Night",
  "Baba Yaga's Horsemen, Bright Day",
  "Baba Yaga's Horsemen, Red Sun",
  "Baba Yaga's Horsemen",
  'King Fomor',
  'Lady in White',
  'Lord of the Hunt',
  'Lord Zombie',
  'Queen of Night and Magic',
  'Queen of Witches',
  'Elder Vampire',
  // Named unique bosses (second pass)
  'Hraesvelgr The Corpse Swallower',
  'Bear King',
  'River King',
  'Moonlit King',
  'Forest Emperor',
  'Monkey King',
  'Snow Queen',
  'Witch Queen',
  'Dark Father',
  'Avatar of Shoth',
  'Eye of the Gods',
  'Son of Fenris',
  'Son Of Fenris',
  // Explicit NPC stat blocks
  'Npc: Apostle',
  'Npc: Atavist',
  'Npc: Breathstealer',
  'Npc: Cultist Psychophant',
  'Npc: Field Commander',
  'Npc: First Servant',
  'Npc: Fixer',
  'Npc: Frost-Afflicted',
  'Npc: Infested Duelist',
  'Npc: Infiltrator',
  'Npc: Merchant Captain',
  'Npc: Warlock Of The Genie Lord',
  'Npc: Wind Acolyte',
  // Intra-list duplicates — capitalisation variants (keep the cleaner form)
  'Child Of The Briar',
  'Folk Of Leng',
  'Herald Of Blood',
  'Herald Of Darkness',
  'Hound Of The Night',
  "Ia'Affrat",
  'Iceworm',
  'Spawn Of Arbeyach',
  'Spider Of Leng',
  'Star Spawn Of Cthulhu',
  'Tosculi Hive-Queen',
]);

// Fuzzy duplicates — same monster, different word order in name
const FUZZY_DUPES = new Set([
  'Ape, Giant',
  'Badger, Giant',
  'Bat, Giant',
  'Bear, Black',
  'Bear, Brown',
  'Bear, Polar',
  'Boar, Giant',
  'Crab, Giant',
  'Crocodile, Giant',
  'Eagle, Giant',
  'Elk, Giant',
  'Frog, Giant',
  'Goat, Giant',
  'Hawk, Blood',
  'Hyena, Giant',
  'Lizard, Giant',
  'Octopus, Giant',
  'Owl, Giant',
  'Rat, Giant',
  'Shark, Giant',
  'Shark, Hunter',
  'Shark, Reef',
  'Snake, Constrictor',
  'Snake, Flying',
  'Snake, Giant Constrictor',
  'Snake, Giant Poisonous',
  'Snake, Poisonous',
  'Spider, Giant',
  'Spider, Giant Wolf',
  'Vulture, Giant',
  'Weasel, Giant',
  'Wolf, Dire',
]);

// Build merged dict: existing entries first, then filtered new entries
const merged = { ...existingMonsters };
let added = 0;
let skipped = 0;

for (const m of Object.values(newMonsters)) {
  if (REMOVE_BY_NAME.has(m.name)) { skipped++; continue; }
  if (FUZZY_DUPES.has(m.name))    { skipped++; continue; }

  const key = m.name
    .replace(/['']/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  if (merged[key]) { skipped++; continue; } // already exists

  merged[key] = m;
  added++;
}

// Sort all keys alphabetically
const sortedKeys = Object.keys(merged).sort();

// Build the replacement monstersDict block
const dictLines = ['export const monstersDict = {'];
for (const key of sortedKeys) {
  const m = merged[key];
  const safeName = m.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const slugPart = m.slug ? `, slug: '${m.slug}'` : '';
  dictLines.push(
    `    ${key}: { name: '${safeName}', cr: ${m.cr}, xp: ${m.xp}, size: '${m.size}', type: '${m.type}'${slugPart} },`
  );
}
dictLines.push('};');
const newDictBlock = dictLines.join('\n');

// Read encounterData.js and splice in the new block
const filePath = path.resolve(__dirname, '../app/data/encounterData.js');
const original = readFileSync(filePath, 'utf8');

const startMarker = 'export const monstersDict = {';
const startIdx = original.indexOf(startMarker);
if (startIdx === -1) throw new Error('Could not find monstersDict in encounterData.js');

// Find the closing "};" that ends the dict
let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < original.length; i++) {
  if (original[i] === '{') depth++;
  if (original[i] === '}') {
    depth--;
    if (depth === 0) {
      // consume the trailing semicolon if present
      endIdx = original[i + 1] === ';' ? i + 2 : i + 1;
      break;
    }
  }
}
if (endIdx === -1) throw new Error('Could not find end of monstersDict');

const updated = original.slice(0, startIdx) + newDictBlock + original.slice(endIdx);
writeFileSync(filePath, updated, 'utf8');

console.log(`Merge complete.`);
console.log(`  Added   : ${added} new monsters`);
console.log(`  Skipped : ${skipped} (dupes / removed)`);
console.log(`  Total   : ${sortedKeys.length} monsters in db`);
console.log(`\nTo revert: copy app/data/encounterData.backup.js back to app/data/encounterData.js`);
