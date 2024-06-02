import { encounterTables, monstersDict } from '../data/encounterData';

export const getXpBudget = (partySize, partyLevel, difficulty) => {
    if (partyLevel > 20 || partyLevel < 1 || partySize < 1) {
        throw new Error('Party level should be between 1 and 20, while party size should be 1 or greater.');
    }
    return encounterTables.xp_difficulties[difficulty][partyLevel - 1] * partySize;
};

export const rndSelectMonster = (xp, monsterType) => {
    //let validMonsters = Object.values(monstersDict).filter(m => m.xp <= xp);

    let validMonsters = [];
    for (const monster of Object.values(monstersDict)) {
        const xpThreshold = xp / 15;
        if (monster.xp >= xpThreshold && monster.xp <= xp) {
            validMonsters.push(monster);
        }
    }

    if (monsterType !== 'all') {
        validMonsters = validMonsters.filter(m => m.type === monsterType);
    }

    //const nearestMonster = validMonsters.reduce((prev, curr) => (Math.abs(curr.xp - xp) < Math.abs(prev.xp - xp) ? curr : prev));
    //return nearestMonster;
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
    const result = numMonsters * encounterMultiplier[index];
    return Math.floor(result);
};