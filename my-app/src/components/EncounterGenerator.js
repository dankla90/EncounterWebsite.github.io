import React, { useState } from 'react';
import { encounterTables, attitude, needWant, complication } from '../data/encounterData';
import { getXpBudget, rndSelectMonster, buildEncounterSize } from '../utils/encounterUtils';

const EncounterGenerator = () => {
    const [partySize, setPartySize] = useState(4);
    const [partyLevel, setPartyLevel] = useState(3);
    const [difficulty, setDifficulty] = useState('medium');
    const [monsterType, setMonsterType] = useState('all');
    const [numberOfEncounters, setNumberOfEncounters] = useState(1);
    const [encounters, setEncounters] = useState([]);

    const handleGenerateEncounter = () => {
        const newEncounters = [];
        const encounterXp = getXpBudget(partySize, partyLevel, difficulty);
        

        for (let i = 0; i < numberOfEncounters; i++) {
            const monster = rndSelectMonster(encounterXp, monsterType);
            const monsterCount = buildEncounterSize(partySize, monster.xp, encounterXp);
            const monsterXp = monster.xp * monsterCount;
            const partyMemberXp = Math.floor(monsterXp / partySize);


            let encounterText = `There are ${monsterCount} ${monster.name} that are ${attitude[Math.floor(Math.random() * attitude.length)]}, they seek ${needWant[Math.floor(Math.random() * needWant.length)]}, but they are ${complication[Math.floor(Math.random() * complication.length)]}. `;
            encounterText += `The ${monster.name} can be found in ${monster.manpage}, the individual monster XP is ${monster.xp}, and the total XP is ${monsterXp}. Each party member should get ${partyMemberXp} XP for this encounter.`;

            newEncounters.push(encounterText);
        }

        setEncounters(newEncounters);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Encounter Generator</h1>
            <div>
                <label>
                    Party Size:
                    <input type="number" value={partySize} min={1} max={20} onChange={e => setPartySize(Number(e.target.value))} />
                </label>
            </div>
            <div>
                <label>
                    Party Level:
                    <input type="number" value={partyLevel} min={1} max={20}  onChange={e => setPartyLevel(Number(e.target.value))} />
                </label>
            </div>
            <div>
                <label>
                    Difficulty:
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="deadly">Deadly</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Monster Type:
                    <select value={monsterType} onChange={e => setMonsterType(e.target.value)}>
                        {encounterTables.monsterTypesList.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Number of Encounters:
                    <input type="number" value={numberOfEncounters} onChange={e => setNumberOfEncounters(Number(e.target.value))} />
                </label>
            </div>
            <button onClick={handleGenerateEncounter}>Generate Encounter</button>
            {encounters.map((encounter, index) => (
                <div key={index}>
                    <h2>Encounter {index + 1}:</h2>
                    <p>{encounter}</p>
                </div>
            ))}
        </div>
    );
};

export default EncounterGenerator;
