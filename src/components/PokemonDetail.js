import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPokemon, savePokemon } from '../indexedDB';
import axios from 'axios';

function PokemonDetail() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let pokemonData = await getPokemon(pokemonId);
        if (!pokemonData) {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
          pokemonData = response.data;
          await savePokemon(pokemonData);
        }
        console.log('Fetched Pokémon detail in PokemonDetail:', pokemonData); // Log the data
        setPokemon(pokemonData);
      } catch (error) {
        setError('Failed to fetch Pokémon data.');
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pokemonId]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!pokemon) {
    return <div className="text-center p-4">Pokemon data not available.</div>;
  }

  const weightInKg = pokemon.weight / 10; // Convert weight to kg (assuming API returns weight in hectograms)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{pokemon.name}</h1>
        {pokemon.sprites && pokemon.sprites.front_default && (
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32 rounded-full mx-auto" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>Height: {pokemon.height} cm</p>
          <p>Weight: {weightInKg.toFixed(2)} kg</p>
          {pokemon.types && (
            <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
          )}
          {pokemon.abilities && (
            <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          )}
        </div>
        <div>
          <h2>Stats:</h2>
          <ul className="list-disc space-y-2">
            {pokemon.stats.map(stat => (
              <li key={stat.stat.name}>{`${stat.stat.name}: ${stat.base_stat}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
