import React, { useState } from 'react';
import EncounterGenerator from './components/EncounterGenerator';
import { Canvas } from '@react-three/fiber';
import AnimatedModel from './components/animatedModel.jsx';

const ArenaApp = () => {
    const [fighterCount, setFighterCount] = useState(0);
    const [monsterData, setMonsterData] = useState([]);

    const handleGenerateEncounter = (fighters, monsters) => {
        setFighterCount(fighters);
        setMonsterData(monsters);
    };

    return (
        <div style={{ display: 'flex' }}>
            <EncounterGenerator onGenerate={handleGenerateEncounter} />
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />
                
                {/* Render Fighters */}
                {Array.from({ length: fighterCount }).map((_, i) => (
                    <AnimatedModel
                        key={`fighter-${i}`}
                        type={['spartan', 'knight', 'mage'][i % 3]} // Cycle through hero types
                        position={[i % 5 * 2, 0, Math.floor(i / 5) * 2]}
                        scale={1} // Default scale for fighters
                    />
                ))}

                {/* Render Monsters */}
                {monsterData.map((monster, index) => {
                    const scale = monster.count >= 10 ? 0.3 : monster.count >= 5 ? 0.5 : 1;
                    return Array.from({ length: monster.count }).map((_, i) => (
                        <AnimatedModel
                            key={`monster-${index}-${i}`}
                            type={monster.type}
                            position={[i % 5 * 3, 0, -5 - Math.floor(i / 5) * 3]}
                            scale={scale}
                        />
                    ));
                })}
            </Canvas>
        </div>
    );
};

export default ArenaApp;
