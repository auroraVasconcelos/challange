"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import PokemonCard from "./PokemonCard";
import TypeFilter from "./TypeFilter";

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
}

export default function PokemonOverview() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
        const data = await response.json();

        const detailedPokemons: Pokemon[] = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const response = await fetch(pokemon.url);
            return await response.json();
          })
        );

        setPokemons(detailedPokemons);
        setLoading(false);

        const uniqueTypes = new Set<string>();
        detailedPokemons.forEach((pokemon) => {
          pokemon.types.forEach((type) => { uniqueTypes.add(type.type.name); });
        });

        setTypes([...uniqueTypes]);

      } catch (err) {
        console.error("Failed to fetch pokemons", err);
      }
    };

    fetchPokemons();
  }, []);

  const visiblePokemons = selectedType ? 
    pokemons.filter((pokemon) => pokemon.types.some((type) => type.type.name === selectedType)) : 
    pokemons;
  
  if (loading) return <Spinner />;

  return (
    <div>
      <TypeFilter
        types={types}
        selectedType={selectedType}
        onChange={setSelectedType}>
      </TypeFilter>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visiblePokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
            ></PokemonCard>
        ))}
      </div>
  </div>
)}