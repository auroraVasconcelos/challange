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
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?offset=0&limit=25");
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMorePokemons = async () => {
    if(!nextUrl) return;
    setIsFetchingMore(true);
    try {
      const response = await fetch(nextUrl);
      const data = await response.json();

      const detailedPokemons: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
          const response = await fetch(pokemon.url);
          return await response.json();
        })
      );

      setPokemons((previous) => [...previous, ...detailedPokemons]);
      setNextUrl(data.next);

      const updatedTypes = new Set(types);
      detailedPokemons.forEach((pokemon) => {
      pokemon.types.forEach((t) => updatedTypes.add(t.type.name));
    });
    setTypes([...updatedTypes]);

    } catch (err) {
      console.error("Failed to fetch more pokemons", err);
    }
    
    setIsFetchingMore(false);
  };

  useEffect(() => {
    if(pokemons.length === 0 && nextUrl) {
      loadMorePokemons().then(() => setLoading(false));
    }
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

      {nextUrl && (
        <div className="flex justify-center mt-6">
          {isFetchingMore ? <Spinner /> : 
          <button
            onClick={loadMorePokemons}
            className="px-6 py-2 rounded-md border-4 border-gray-800 text-gray-800 hover:bg-gray-800 transition hover:text-white"
            disabled={isFetchingMore}
          >
            {"Load More"}
          </button>}
        </div>
      )}
    </div>
  )
}