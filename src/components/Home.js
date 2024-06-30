import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getPokemons, savePokemon } from '../indexedDB';
import { SettingsContext } from './Settings';

function Home() {
  const [pokemons, setPokemons] = useState([]);
  const { searchQuery, listSize, setSearchQuery } = useContext(SettingsContext);

  useEffect(() => {
    getPokemons().then(data => {
      if (data.length > 0) {
        setPokemons(data);
      } else {
        fetchAndCachePokemons();
      }
    });
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
    }
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search Pokémon"
        className="block w-full p-2 mb-4 border rounded"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
                 .slice(0, listSize)
                 .map(pokemon => (
          <div key={pokemon.id} className="bg-white shadow-md rounded p-4">
            <Link to={`/pokemon/${pokemon.id}`} className="text-blue-500">
              <h3 className="text-xl font-bold">{pokemon.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
