import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getPokemons, savePokemon } from '../indexedDB';
import { SettingsContext } from './Settings';

function Home() {
  const [pokemons, setPokemons] = useState([]);
  const { searchQuery, listSize, setSearchQuery } = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track any errors

  useEffect(() => {
    setIsLoading(true); // Set loading state on mount
    getPokemons().then(data => {
      if (data.length > 0) {
        setPokemons(data);
      } else {
        fetchAndCachePokemons();
      }
    }).finally(() => setIsLoading(false)); // Clear loading state after fetch
  }, []);

  const fetchAndCachePokemons = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
      const pokemonDetails = await Promise.all(response.data.results.map(async pokemon => {
        const detailResponse = await axios.get(pokemon.url);
        console.log('Fetched Pokémon detail:', detailResponse.data); // Log the detailed response
        await savePokemon(detailResponse.data);
        return detailResponse.data;
      }));
      setPokemons(pokemonDetails);
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
      setError(error); // Set error state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button className="text-blue-500 hover:underline" onClick={() => setSearchQuery('')}>Clear</button>
      </div>

      {isLoading && <p className="text-center">Loading Pokémon...</p>}
      {error && <p className="text-center text-red-500">Error fetching Pokémon: {error.message}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, listSize)
          .map(pokemon => (
            <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="group bg-white shadow-md rounded p-4 hover:bg-gray-100">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-center">{pokemon.name}</h3>
              {/* Add more info like types, stats, etc. */}
            </Link>
          ))}
      </div>

      {/* Add pagination buttons if needed */}
    </div>
  );
}

export default Home;
