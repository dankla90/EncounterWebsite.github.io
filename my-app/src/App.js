import React from 'react';
import './App.css';
import EncounterGenerator from './components/EncounterGenerator';
// Note to self to deploy run: npm run deploy 

const App = () => {
    return (
      <div className="App">
        <div>
            <EncounterGenerator />
        </div>
      </div>
    );
};

export default App;

