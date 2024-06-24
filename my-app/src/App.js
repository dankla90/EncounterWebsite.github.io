import React from 'react';
import './App.css';
import EncounterGenerator from './components/EncounterGenerator';
import ThreeDScene from './components/ThreeDSceene';
import { Canvas } from '@react-three/fiber';
// Note to self to deploy run: npm run deploy 

const App = () => {
    return (
      <div className="App">
        <EncounterGenerator />
      
        <Canvas>
            <ThreeDScene />
        </Canvas>
      </div>
    );
};

export default App;

