import React, { useState } from 'react';
import styled from 'styled-components';
import {
  encounterTables,
  attitude,
  needWant,
  needWantMonster,
  complication as complications,
  attitudeMonster,
} from '../data/encounterData';
import { getXpBudget, rndSelectMonster } from '../utils/encounterUtils';

// ---------- STYLED COMPONENTS ----------


const Container = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  font-family: "Teko", sans-serif;
  color: #222;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  flex: 1 1 100%;
  font-weight: 700;
  font-size: 2.2rem;
  margin: 0 0 18px 0;
  color: #222;
  user-select: none;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #444;
  user-select: none;
`;

const Input = styled.input`
  margin-left: 10px;
  width: 70px;
  padding: 6px 10px;
  font-size: 1rem;
  border: 1.8px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.25s ease;
  &:focus {
    border-color: #3f83f8;
    outline: none;
    box-shadow: 0 0 6px #a6c8ff88;
  }
`;

const Select = styled.select`
  margin-left: 10px;
  padding: 6px 10px;
  font-size: 1rem;
  border: 1.8px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.25s ease;
  &:focus {
    border-color: #3f83f8;
    outline: none;
    box-shadow: 0 0 6px #a6c8ff88;
  }
`;

const CheckboxGroup = styled.div`
  min-width: 230px;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.6rem; /* bigger label text */
  color: #555;
  cursor: pointer;

  input[type='checkbox'] {
    width: 24px;
    height: 24px;
    cursor: pointer;
    accent-color: #3f83f8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  margin-left: auto;
  flex-wrap: wrap;

  button {
    background-color: #3f83f8;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgb(63 131 248 / 0.3);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      background-color: #2a5fcb;
      box-shadow: 0 6px 12px rgb(42 95 203 / 0.5);
    }

    &:active {
      background-color: #1d4486;
      box-shadow: none;
    }
  }
`;

const EncounterList = styled.div`
  margin-top: 30px;
`;

const EncounterCard = styled.div`
  margin-bottom: 26px;
  padding: 20px 24px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 5px 18px rgb(0 0 0 / 0.12);
  }
`;

const EncounterHeading = styled.h2`
  font-family: "Teko", sans-serif;
  font-size: 1.5rem;
  color: #222;
  user-select: none;
`;

const EncounterDescription = styled.p`
  font-family: "Goudy Bookletter 1911", serif;
  font-size: 1.2rem;
  color: #232222ff;
  margin-bottom: 14px;
  line-height: 1.45;
`;

const ToggleButton = styled.button`
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 7px;
  border: 1.8px solid #bbb;
  background: ${({ $expanded }) => ($expanded ? '#e4e7ec' : '#f9fafb')};
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: ${({ $expanded }) => ($expanded ? '#d0d5dd' : '#e7eaf3')};
    border-color: #9aa0a6;
  }
`;

const XpBreakdown = styled.div`
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: 10px;
  background: #f4f6f8;
  border: 1.8px solid #d1d9e6;
  font-size: 1rem;
  color: #444;
`;

const XpSection = styled.div`
  margin-bottom: 10px;
  font-weight: 600;
`;

const MonsterBox = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background: #ffffff;
  border: 1.5px solid #e1e8f0;
  margin-bottom: ${({ $marginBottom }) => ($marginBottom ? '10px' : '0')};
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05);
`;

const MonsterName = styled.strong`
  font-size: 1.1rem;
  color: #222;
`;

const MonsterXP = styled.div`
  font-size: 1.1rem;
  color: #555;
  margin-top: 6px;
  font-style: italic;
`;

const AdjustedXP = styled.div`
  margin-top: 8px;
  font-style: italic;
  color: #777;
  font-size: 1.4rem;
  a {
    color: #3f83f8;
    text-decoration: none;
    margin-left: 6px;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;


// ---------- COMPONENT ----------

export default function EncounterGenerator() {
  const [partySize, setPartySize] = useState(4);
  const [partyLevel, setPartyLevel] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [monsterType, setMonsterType] = useState(['all']);
  const [numberOfEncounters, setNumberOfEncounters] = useState(1);
  const [encounters, setEncounters] = useState([]);
  const [expandedSet, setExpandedSet] = useState(new Set());

  const getSearchUrl = (monsterName) => {
    const encodedName = encodeURIComponent(monsterName.toLowerCase());
    return `https://5e.tools/search.html?q=${encodedName}`;
  };

  const pluralize = (name, count) => {
    if (count === 1) return name;
    if (/y$/i.test(name) && !/[aeiou]y$/i.test(name)) return name.slice(0, -1) + 'ies';
    if (/(s|x|z|ch|sh)$/i.test(name)) return name + 'es';
    return name + 's';
  };

  const xpLine = (xpEach, count, partySize) => {
    const xpEachNum = Number(xpEach) || 0;
    const total = xpEachNum * (count || 0);
    const xpEachMember = partySize > 0 ? Math.floor(total / partySize) : 0;
    return `The individual monster XP is ${xpEachNum}, the total XP is ${total}. Each party member should get ${xpEachMember} XP for this encounter.`;
  };

  const toggleExpanded = (index) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleGenerateEncounter = () => {
    try {
      const newEncounters = [];
      setExpandedSet(new Set());
      const encounterXp = getXpBudget(partySize, partyLevel, difficulty);
      const selectedMonsterTypes =
        monsterType.length === 1 && monsterType[0] === 'all' ? 'all' : monsterType;

      for (let i = 0; i < numberOfEncounters; i++) {
        const monster = rndSelectMonster(encounterXp, selectedMonsterTypes, partySize);
        const mCount = monster.count ?? 1;
        const mXpEach = monster.xp ?? 0;
        const mTotalXp = mXpEach * mCount;
        const mAdjustedXp = monster.adjustedXP ?? monster.adjustedXp ?? mTotalXp;

        const attitude1 = attitude[Math.floor(Math.random() * attitude.length)];
        const need1 = needWant[Math.floor(Math.random() * needWant.length)];

        const compChoice = complications[Math.floor(Math.random() * complications.length)];
        let comp = {
          type: compChoice,
          description: compChoice,
          xpEach: 0,
          count: 0,
          totalXp: 0,
          adjustedXp: 0,
          name: null,
          attitude: null,
          need: null,
        };

        if (compChoice === 'Monster') {
          const compMonster = rndSelectMonster(encounterXp, selectedMonsterTypes, partySize);
          const cCount = compMonster.count ?? 1;
          const cXpEach = compMonster.xp ?? 0;
          const cTotalXp = cXpEach * cCount;
          const cAdjustedXp = compMonster.adjustedXP ?? compMonster.adjustedXp ?? cTotalXp;
          const attitude2 = attitudeMonster[Math.floor(Math.random() * attitudeMonster.length)];
          const need2 = needWantMonster[Math.floor(Math.random() * needWantMonster.length)];

          comp = {
            type: 'Monster',
            name: compMonster.name,
            count: cCount,
            xpEach: cXpEach,
            totalXp: cTotalXp,
            adjustedXp: cAdjustedXp,
            attitude: attitude2,
            need: need2,
            description: `attacked by ${cCount} ${pluralize(compMonster.name, cCount)} that are ${attitude2}, they seek ${need2}.`,
          };
        }

        const encounterData = {
          xpBudget: encounterXp,
          monster: {
            name: monster.name,
            count: mCount,
            xpEach: mXpEach,
            totalXp: mTotalXp,
            adjustedXp: mAdjustedXp,
          },
          attitude: attitude1,
          need: need1,
          complication: comp,
        };

        newEncounters.push(encounterData);
      }

      setEncounters(newEncounters);
    } catch (error) {
      setEncounters([{ error: error.message }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleGenerateEncounter();
  };

  return (
    <Container>
      <HeaderRow>
        <Title as="h2">D&D 5e Encounter Generator</Title>

        <div>
          <Label>
            Party Size:
            <Input
              type="number"
              value={partySize}
              min={1}
              max={20}
              onChange={(e) => setPartySize(Number(e.target.value))}
            />
          </Label>
        </div>

        <div>
          <Label>
            Party Level:
            <Input
              type="number"
              value={partyLevel}
              min={1}
              max={20}
              onChange={(e) => setPartyLevel(Number(e.target.value))}
            />
          </Label>
        </div>

        <div>
          <Label>
            Difficulty:
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="deadly">Deadly</option>
            </Select>
          </Label>
        </div>

        <CheckboxGroup>
          <Label>
            Monster Type:
            <CheckboxList>
              {encounterTables.monsterTypesList.map((type) => (
                <CheckboxLabel key={type}>
                  <input
                    type="checkbox"
                    checked={monsterType.includes(type)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      let newTypes;

                      if (type === 'all') {
                        if (!isChecked) {
                          // Trying to uncheck 'all'
                          // Only allow if some other type is selected, otherwise keep 'all'
                          if (monsterType.length === 1 && monsterType[0] === 'all') {
                            // Only 'all' is selected, prevent unchecking
                            newTypes = ['all'];
                          } else {
                            // Other types are selected, so remove 'all'
                            newTypes = monsterType.filter(t => t !== 'all');
                          }
                        } else {
                          // Checking 'all' means reset to just 'all'
                          newTypes = ['all'];
                        }
                      } else {
                        if (isChecked) {
                          // Adding a specific type
                          newTypes = monsterType.includes('all')
                            ? [type]  // Replace 'all' with this type only
                            : [...monsterType, type];
                        } else {
                          // Removing a specific type
                          newTypes = monsterType.filter(t => t !== type);

                          // If after removal nothing left, revert to 'all'
                          if (newTypes.length === 0) {
                            newTypes = ['all'];
                          }
                        }

                        // Remove 'all' if other types are selected
                        if (newTypes.includes('all') && newTypes.length > 1) {
                          newTypes = newTypes.filter(t => t !== 'all');
                        }
                      }

                      setMonsterType(newTypes);
                    }}

                  />
                  <span style={{ fontSize: 13 }}>{type}</span>
                </CheckboxLabel>
              ))}
            </CheckboxList>
          </Label>
        </CheckboxGroup>

        <div>
          <Label>
            Number of Encounters:
            <Input
              type="number"
              value={numberOfEncounters}
              min={1}
              max={20}
              onChange={(e) => setNumberOfEncounters(Number(e.target.value))}
              onKeyDown={handleKeyPress}
            />
          </Label>
        </div>

        <ButtonGroup>
          <button onClick={handleGenerateEncounter} aria-label="Generate a random D&D 5e encounter">
            Generate Encounter
          </button>

          <button
            onClick={() => {
              setEncounters([]);
              setExpandedSet(new Set());
            }}
          >
            Clear Encounters
          </button>
        </ButtonGroup>
      </HeaderRow>

      <EncounterList>
        {encounters.length === 0 && <div style={{ color: '#666' }}>No encounters yet — click Generate Encounter.</div>}

        {encounters.map((enc, idx) => {
          if (enc.error) {
            return (
              <EncounterCard key={idx}>
                <EncounterHeading>Encounter {idx + 1}:</EncounterHeading>
                <div style={{ color: 'red' }}>Error: {enc.error}</div>
              </EncounterCard>
            );
          }

          const monster = enc.monster;
          const comp = enc.complication;
          const usedXp =
            (Number(monster.adjustedXp ?? monster.adjustedXP ?? monster.totalXp ?? 0) || 0) +
            (comp ? Number(comp.adjustedXp ?? comp.adjustedXP ?? comp.totalXp ?? 0) : 0);
          const remain = enc.xpBudget - usedXp;

          return (
            <EncounterCard key={idx}>
              <EncounterHeading>Encounter {idx + 1}:</EncounterHeading>

              <div>
                <EncounterDescription>
                  There are {monster.count} {pluralize(monster.name, monster.count)} that are {enc.attitude}, they seek {enc.need}, but they are {comp.description}.
                </EncounterDescription>
              </div>

            <div>
              <ToggleButton
                $expanded={expandedSet.has(idx)}
                onClick={() => toggleExpanded(idx)}
                aria-expanded={expandedSet.has(idx)}
                aria-controls={`xpbox-${idx}`}
              >
                {expandedSet.has(idx) ? 'Hide XP breakdown' : 'XP breakdown'}
              </ToggleButton>
            </div>

              {expandedSet.has(idx) && (
                <XpBreakdown id={`xpbox-${idx}`}>
                  <XpSection>
                    <strong>Encounter budget:</strong> {enc.xpBudget}
                  </XpSection>
                  <XpSection>
                    <strong>Used XP:</strong> {usedXp} — remaining: {remain}
                  </XpSection>

                  <MonsterBox $marginBottom={true}>
                    <MonsterName>
                      {monster.count} × {monster.name}
                    </MonsterName>
                    <MonsterXP>{xpLine(monster.xpEach ?? monster.xp ?? 0, monster.count, partySize)}</MonsterXP>
                    <AdjustedXP>
                      <a href={getSearchUrl(monster.name)} target="_blank" rel="noopener noreferrer">
                        Stats
                      </a>
                    </AdjustedXP>
                  </MonsterBox>

                  {comp && comp.type === 'Monster' && (
                    <MonsterBox>
                      <MonsterName>
                        {comp.count} × {comp.name}
                      </MonsterName>
                      <MonsterXP>{xpLine(comp.xpEach, comp.count, partySize)}</MonsterXP>
                      <AdjustedXP>
                        <a href={getSearchUrl(comp.name)} target="_blank" rel="noopener noreferrer">
                          Stats
                        </a>
                      </AdjustedXP>
                    </MonsterBox>
                  )}
                </XpBreakdown>
              )}
            </EncounterCard>
          );
        })}
      </EncounterList>
    </Container>
  );
}
