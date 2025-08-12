import { encounterTables, monstersDict } from '../data/encounterData';

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

  if (adjustedCount === 1) return 1;
  if (adjustedCount === 2) return 1.5;
  if (adjustedCount <= 6) return 2;
  if (adjustedCount <= 10) return 2.5;
  if (adjustedCount <= 14) return 3;
  return 4;
};

// Best monster count within budget (max 20)
export const buildEncounterSize = (partySize, monsterXp, xpBudget) => {
  let bestCount = 0;
  for (let count = 1; count <= 20; count++) {
    if (count * monsterXp * getMultiplier(count, partySize) <= xpBudget) {
      bestCount = count;
    } else break;
  }
  return bestCount;
};
const baseStatsUrl = 'https://5e.tools/bestiary.html#';

export const rndSelectMonster = (xpBudget, monsterTypes, partySize) => {
    let validMonsters = [];

    for (const monster of Object.values(monstersDict)) {
        if (monsterTypes !== 'all' && !monsterTypes.includes(monster.type)) {
            continue; // Skip monsters not in selected types
        }
        const count = buildEncounterSize(partySize, monster.xp, xpBudget);
        if (count >= 1) {
            const multiplier = getMultiplier(count, partySize);
            const adjustedXP = count * monster.xp * multiplier;
            if (adjustedXP >= 0.8 * xpBudget && adjustedXP <= xpBudget) {
                // Generate URL-safe monster name for 5e.tools
                const monsterUrlName = monster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const statsUrl = `${baseStatsUrl}${monsterUrlName}_mm`;

                validMonsters.push({
                    ...monster,
                    count,
                    adjustedXP,
                    rawXP: count * monster.xp,
                    xpPerPlayer: Math.floor(adjustedXP / partySize),
                    statsUrl, 
                });
            }
        }
    }

    if (validMonsters.length === 0) {
        throw new Error('No valid monsters found for the given XP budget.');
    }

    const randomIndex = Math.floor(Math.random() * validMonsters.length);
    return validMonsters[randomIndex];
};
