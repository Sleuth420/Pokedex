import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPokemons, savePokemon } from '../indexedDB';

function Favorites() {
  const [favoritePokemons, setFavoritePokemons] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const pokemons = await getPokemons();
      const favorites = pokemons.filter(pokemon => pokemon.isFavorite);
      setFavoritePokemons(favorites);
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (pokemon) => {
    pokemon.isFavorite = !pokemon.isFavorite;
    await savePokemon(pokemon);
    setFavoritePokemons(prev => prev.filter(p => p.id !== pokemon.id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Favourite Pokémon</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favoritePokemons.map(pokemon => (
          <div key={pokemon.id} className="group bg-white shadow-md rounded p-4 hover:bg-gray-100">
            <button onClick={() => toggleFavorite(pokemon)}>
              {pokemon.isFavorite ? '★' : '☆'}
            </button>
            <Link to={`/pokemon/${pokemon.id}`}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-center">{pokemon.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
