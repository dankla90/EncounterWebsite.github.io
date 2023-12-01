import logo from './logo.svg';
import './App.css';
import Encounter from './EncounterGenerator';
// Note to self to deploy run: npm run deploy 



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Here is where the encounter generator will be displayed
        </p>
        <div><Encounter></Encounter></div>
        <a
          className="App-link"
          href="https://github.com/dankla90/DnDEncounterGenerator"
          target="_blank"
          rel="noopener noreferrer"
        >
          This is the project I am wanting to recreate, just on a website
        </a>
      </header>
    </div>
  );
}

export default App;
