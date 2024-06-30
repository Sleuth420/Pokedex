import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Settings, { SettingsProvider } from './components/Settings';
import PokemonDetail from './components/PokemonDetail';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <SettingsProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/pokemon/:pokemonId" element={<PokemonDetail />} />
          </Routes>
        </div>
      </SettingsProvider>
    </Router>
  );
};

export default App;
