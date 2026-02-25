import { encounterTables, monstersDict } from '../data/encounterData';

const { typeWeights } = encounterTables;

// A monster group must fill at least this fraction of its budget to be valid
const MIN_BUDGET_FILL = 0.6;

// Hard limits on encounter size
const MAX_MONSTERS_PER_GROUP = 8;
const MAX_MONSTERS_TOTAL = 15;

// Gets the XP budget based on party size, level, and difficulty
export const getXpBudget = (partySize, partyLevel, difficulty) => {
  if (partyLevel > 20 || partyLevel < 1 || partySize < 1) {
    throw new Error(
      'Party level should be between 1 and 20, while party size should be 1 or greater.'
    );
  }
  return encounterTables.xp_difficulties[difficulty][partyLevel - 1] * partySize;
};

// Determines XP multiplier based on monster count and party size
const getMultiplier = (monsterCount, partySize) => {
  let adjustedCount = monsterCount;
  if (partySize < 3) adjustedCount += 1;
  if (partySize >= 6) adjustedCount -= 1;

  // DMG: single monster vs 6+ players uses ×0.5
  if (adjustedCount <= 0) return 0.5;
  if (adjustedCount === 1) return 1;
  if (adjustedCount === 2) return 1.5;
  if (adjustedCount <= 6) return 2;
  if (adjustedCount <= 10) return 2.5;
  if (adjustedCount <= 14) return 3;
  return 4;
};

// Best monster count within budget, capped at maxCount
export const buildEncounterSize = (partySize, monsterXp, xpBudget, maxCount = MAX_MONSTERS_PER_GROUP) => {
  let bestCount = 0;
  for (let count = 1; count <= maxCount; count++) {
    if (count * monsterXp * getMultiplier(count, partySize) <= xpBudget) {
      bestCount = count;
    } else break;
  }
  return bestCount;
};

// Pick a single weighted monster. Returns null if no valid monster found.
// maxCr excludes monsters at or above that CR (used for minion selection).
// maxCount caps the group size for this pick.
const pickMonster = (xpBudget, monsterTypes, partySize, maxCr = Infinity, maxCount = MAX_MONSTERS_PER_GROUP) => {
  const valid = [];

  for (const monster of Object.values(monstersDict)) {
    if (monsterTypes !== 'all' && !monsterTypes.includes(monster.type)) continue;
    if (monster.cr >= maxCr) continue;

    const count = buildEncounterSize(partySize, monster.xp, xpBudget, maxCount);
    if (count >= 1) {
      const multiplier = getMultiplier(count, partySize);
      const adjustedXP = count * monster.xp * multiplier;

      // Only include monsters whose best count fills at least 60% of the budget
      if (adjustedXP >= xpBudget * MIN_BUDGET_FILL) {
        valid.push({
          ...monster,
          count,
          adjustedXP,
          rawXP: count * monster.xp,
          xpPerPlayer: Math.floor(adjustedXP / partySize),
        });
      }
    }
  }

  if (valid.length === 0) return null;

  // Weight by adjustedXP × type bias so budget-efficient and preferred types are favoured
  const totalWeight = valid.reduce((sum, m) => sum + m.adjustedXP * (typeWeights[m.type] ?? 1), 0);
  let roll = Math.random() * totalWeight;
  for (const m of valid) {
    roll -= m.adjustedXP * (typeWeights[m.type] ?? 1);
    if (roll <= 0) return m;
  }
  return valid[valid.length - 1];
};

// Returns { primary, secondary } where secondary is a same-type lower-CR minion
// group that fills remaining budget, or null if no good fill exists.
export const rndSelectMonster = (xpBudget, monsterTypes, partySize) => {
  const primary = pickMonster(xpBudget, monsterTypes, partySize);
  if (!primary) throw new Error('No valid monsters found for the given XP budget.');

  // Try to fill remaining budget with a same-type, lower-CR minion group.
  // Secondary is capped so the combined total never exceeds MAX_MONSTERS_TOTAL.
  const remaining = xpBudget - primary.adjustedXP;
  if (remaining >= xpBudget * 0.2) {
    const secondaryMaxCount = Math.max(1, MAX_MONSTERS_TOTAL - primary.count);
    const secondary = pickMonster(remaining, [primary.type], partySize, primary.cr, secondaryMaxCount);
    if (secondary) return { primary, secondary };
  }

  return { primary, secondary: null };
};
