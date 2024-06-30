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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemon) {
    return <div>Pokemon data not available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{pokemon.name}</h1>
      <p>{`Height: ${pokemon.height}`}</p>
      <p>{`Weight: ${pokemon.weight}`}</p>
      {pokemon.types && (
        <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
      )}
      {pokemon.abilities && (
        <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
      )}
      {pokemon.stats && (
        <div>
          <h2>Stats:</h2>
          <ul>
            {pokemon.stats.map(stat => (
              <li key={stat.stat.name}>{`${stat.stat.name}: ${stat.base_stat}`}</li>
            ))}
          </ul>
        </div>
      )}
      {pokemon.sprites && pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
      )}
    </div>
  );
}

export default PokemonDetail;
