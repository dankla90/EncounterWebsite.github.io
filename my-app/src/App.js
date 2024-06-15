import React from 'react';
import './App.css';
import EncounterGenerator from './components/EncounterGenerator';
import ThreeDScene from './components/ThreeDSceene';
// Note to self to deploy run: npm run deploy 

const App = () => {
    return (
      <div className="App">
        <div className='EncounterGenerator'>
            <EncounterGenerator />
        </div>
        <div className='ThreeDSceene'>
            <ThreeDScene />
        </div>
      </div>
    );
};

export default App;

