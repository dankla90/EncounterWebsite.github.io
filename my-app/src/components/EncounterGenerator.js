import React, { useState } from 'react';
import { encounterTables, attitude, needWant, needWantMonster, complication, attitudeMonster } from '../data/encounterData';
import { getXpBudget, rndSelectMonster, buildEncounterSize } from '../utils/encounterUtils';


const EncounterGenerator = () => {
    const [partySize, setPartySize] = useState(4);
    const [partyLevel, setPartyLevel] = useState(3);
    const [difficulty, setDifficulty] = useState('medium');
    const [monsterType, setMonsterType] = useState(['all']);
    const [numberOfEncounters, setNumberOfEncounters] = useState(1);
    const [encounters, setEncounters] = useState([]);

    const handleGenerateEncounter = () => {
        const newEncounters = [];
        const encounterXp = getXpBudget(partySize, partyLevel, difficulty);
        const selectedMonsterTypes = monsterType.length === 1 && monsterType[0] === 'all' ? 'all' : monsterType;

        for (let i = 0; i < numberOfEncounters; i++) {
            const monster = rndSelectMonster(encounterXp, selectedMonsterTypes);
            const monsterCount = buildEncounterSize(partySize, monster.xp, encounterXp);
            const monsterXp = monster.xp * monsterCount;
            const partyMemberXp = Math.floor(monsterXp / partySize);

            let complicationText = complication[Math.floor(Math.random() * complication.length)];

            if (complicationText === "Monster") {
                const newMonster = rndSelectMonster(encounterXp, selectedMonsterTypes);
                const newMonsterCount = buildEncounterSize(partySize, newMonster.xp, encounterXp);
                const newMonsterXp = newMonster.xp * newMonsterCount;
                const newPartyMemberXp = Math.floor(newMonsterXp / partySize);

                let newEncounterText = `attacked by ${newMonsterCount} ${newMonster.name} that are ${attitudeMonster[Math.floor(Math.random() * attitudeMonster.length)]}, they seek ${needWantMonster[Math.floor(Math.random() * needWantMonster.length)]} `;
                newEncounterText += `(The ${newMonster.name} can be found in ${newMonster.manpage}, the individual monster XP is ${newMonster.xp}, and the total XP is ${newMonsterXp}. Each party member should get ${newPartyMemberXp} XP for this encounter.) `;

                complicationText = newEncounterText;
            }

            let encounterText = `There are ${monsterCount} ${monster.name} that are ${attitude[Math.floor(Math.random() * attitude.length)]}, they seek ${needWant[Math.floor(Math.random() * needWant.length)]}, but they are ${complicationText}. `;
            encounterText += `The ${monster.name} can be found in ${monster.manpage}, the individual monster XP is ${monster.xp}, and the total XP is ${monsterXp}. Each party member should get ${partyMemberXp} XP for this encounter.`;

            newEncounters.push(encounterText);
        }

        setEncounters(newEncounters);
    };

    return (
        <div className="App">
            <div className="header">
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
                        <div>
                        {encounterTables.monsterTypesList.map(type => (
                            <label key={type}>
                                <input
                                    type="checkbox"
                                    checked={monsterType.includes(type)}
                                    onChange={e => {
                                        const isChecked = e.target.checked;
                                        let newTypes;

                                        if (type === 'all') {
                                            // If "All" checkbox is checked, deselect all other checkboxes
                                            newTypes = isChecked ? ['all'] : [];
                                        } else {
                                            if (isChecked) {
                                                // Add the selected type to the list
                                                newTypes = monsterType.includes('all') ? [type] : [...monsterType, type];
                                            } else {
                                                // Remove the selected type from the list
                                                newTypes = monsterType.filter(t => t !== type);
                                            }
                                            // If "All" checkbox is selected and any other checkbox is clicked, deselect "All"
                                            if (monsterType.includes('all') && type !== 'all') {
                                                newTypes = newTypes.filter(t => t !== 'all');
                                            }
                                        }

                                        setMonsterType(newTypes);
                                    }}
                                />
                                {type}
                            </label>
                        ))}

                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Number of Encounters:
                        <input type="number" value={numberOfEncounters} min={1} onChange={e => setNumberOfEncounters(Number(e.target.value))} />
                    </label>
                </div>
                <button onClick={handleGenerateEncounter}>Generate Encounter</button>
            </div>
            <div className="encounters">
                {encounters.map((encounter, index) => (
                    <div key={index} className="encounter">
                        <h2>Encounter {index + 1}:</h2>
                        <p>{encounter}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EncounterGenerator;
