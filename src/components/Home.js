import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getPokemons, savePokemon } from '../indexedDB';
import { SettingsContext } from './Settings';

function Home() {
  const [pokemons, setPokemons] = useState([]);
  const { searchQuery, listSize, setSearchQuery } = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getPokemons().then(data => {
      if (data.length > 0) {
        setPokemons(data);
      } else {
        fetchAndCacheAllPokemons();
      }
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleNavigate = (event) => {
      switch(event.detail.action) {
        case 'up':
          setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
          break;
        case 'down':
          setSelectedIndex(prevIndex => Math.min(prevIndex + 1, pokemons.length - 1));
          break;
        case 'select':
          navigate(`/pokemon/${pokemons[selectedIndex].id}`);
          break;
        default:
          break;
      }
    };

    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, [pokemons, selectedIndex, navigate]);

  const fetchAndCacheAllPokemons = async () => {
    let allPokemon = [];
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=150'; // Initial URL to fetch the first 100 Pokémon

    try {
      while (nextUrl) {
        const response = await axios.get(nextUrl);
        const pokemonDetails = await Promise.all(response.data.results.map(async pokemon => {
          const detailResponse = await axios.get(pokemon.url);
          console.log('Fetched Pokémon detail:', detailResponse.data);
          await savePokemon(detailResponse.data);
          return detailResponse.data;
        }));
        allPokemon = [...allPokemon, ...pokemonDetails];
        nextUrl = response.data.next; // Update the nextUrl to the next page URL provided by the API
      }
      setPokemons(allPokemon);
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
      setError(error);
    }
  };

  const toggleFavorite = async (pokemon) => {
    pokemon.isFavorite = !pokemon.isFavorite;
    await savePokemon(pokemon);
    setPokemons(prev => prev.map(p => p.id === pokemon.id ? pokemon : p));
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button className="ml-2 text-blue-500 hover:underline dark:text-blue-300" onClick={() => setSearchQuery('')}>
          Clear
        </button>
      </div>
  
      {isLoading && <p className="text-center dark:text-white">Loading Pokémon...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-300">Error fetching Pokémon: {error.message}</p>}
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, listSize)
          .map((pokemon, index) => (
            <div
              key={pokemon.id}
              className={`group bg-white shadow-md rounded p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 ${index === selectedIndex ? 'border-2 border-blue-500 dark:border-blue-300' : ''}`}
            >
              <button onClick={() => toggleFavorite(pokemon)} className="text-xl">
                {pokemon.isFavorite ? '★' : '☆'}
              </button>
              <Link to={`/pokemon/${pokemon.id}`} className="block mt-2">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-16 h-16 mx-auto mb-2 hidden sm:block"
                />
                <h3 className="text-xl font-bold text-center dark:text-white">{pokemon.name}</h3>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );  
}

export default Home;
