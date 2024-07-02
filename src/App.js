import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Settings, { SettingsProvider } from './components/Settings';
import PokemonDetail from './components/PokemonDetail';
import Navbar from './components/Navbar';
import Favorites from './components/Favorites';

const App = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.key) {
        case 'ArrowUp':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'up' } }));
          break;
        case 'ArrowDown':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'down' } }));
          break;
        case 'Enter':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'select' } }));
          break;
        case 'Backspace':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'back' } }));
          break;
        case 'Escape':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'start' } }));
          break;
        case 'Tab':
          window.dispatchEvent(new CustomEvent('navigate', { detail: { action: 'select' } }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Router>
      <SettingsProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/pokemon/:pokemonId" element={<PokemonDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </SettingsProvider>
    </Router>
  );
};

export default App;
