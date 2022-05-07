import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';
import route from './Routes/index';

function App() {
  return (
    <div className="App">
      { route() }
    </div>
  );
}

export default App;
