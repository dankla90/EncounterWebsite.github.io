import { encounterTables, monstersDict } from '../data/encounterData';

export const getXpBudget = (partySize, partyLevel, difficulty) => {
    if (partyLevel > 20 || partyLevel < 1 || partySize < 1) {
        throw new Error('Party level should be between 1 and 20, while party size should be 1 or greater.');
    }
    return encounterTables.xp_difficulties[difficulty][partyLevel - 1] * partySize;
};

export const rndSelectMonster = (xp, monsterTypes) => {
    let validMonsters = [];

    // Filter monsters by XP thresholds, The number is how many possible enemies are in an encounter
    // the max is very unlikely, so keep the number a bit higher than what you want the max to be
    for (const monster of Object.values(monstersDict)) {
        const xpThreshold = xp / 15;
        if (monster.xp >= xpThreshold && monster.xp <= xp) {
            validMonsters.push(monster);
        }
    }

    // If a specific type or types are selected, filter by those types
    if (monsterTypes !== 'all') {
        validMonsters = validMonsters.filter(m => monsterTypes.includes(m.type));

        // Fallback logic: expand the XP threshold if no valid monsters are found
        // A better solution is to increase the number of monsters in the database
        if (validMonsters.length === 0) {
            for (const monster of Object.values(monstersDict)) {
                const xpThreshold = xp / 30;
                if (monster.xp >= xpThreshold && monster.xp <= xp) {
                    validMonsters.push(monster);
                }
            }
            validMonsters = validMonsters.filter(m => monsterTypes.includes(m.type));
        }
    }

    // Throw an error if no valid monsters are found
    if (validMonsters.length === 0) {
        throw new Error('No valid monsters found for the given XP budget.');
    }

    // Select a random valid monster
    const randomIndex = Math.floor(Math.random() * validMonsters.length);
    return validMonsters[randomIndex];
};



export const buildEncounterSize = (partySize, monsterXp, xp) => {
    const monsterCount = [1, 2, 6, 10, 14];
    const encounterMultiplier = [1.0, 0.67, 0.50, 0.40, 0.33, 0.25];
    const numMonsters = Math.floor(xp / monsterXp);
    // Find appropriate index or default to last multiplier if not found
    let index = monsterCount.findIndex(count => numMonsters <= count);
    if (index === -1) {
        index = encounterMultiplier.length - 1;
    }
    // Adjust index for small parties
    if (partySize <= 2 && index !== encounterMultiplier.length - 1) {
        index += 1;
    }
    // Ensure numMonsters is 1 or more before applying multiplier
    if (numMonsters === 1) {
        return numMonsters;
    }
    const result = numMonsters;
    return Math.floor(result);
};