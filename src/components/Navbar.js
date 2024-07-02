import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white flex items-center justify-between px-4 py-2">
      <Link to="/" className="text-xl font-bold">Pokédex</Link>

      <ul className="hidden md:flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-400">Home</Link>
        </li>
        <li>
          <Link to="/favorites" className="hover:text-grey-400">Favourites</Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-gray-400">Settings</Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default Navbar;
