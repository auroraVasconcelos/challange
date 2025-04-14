"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const [selectedTypes, setSelectedTypes] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?offset=0&limit=25");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

      setPokemons((previous) => {
        const existingIds = new Set(previous.map((p) => p.id));
        const newUniquePokemons = detailedPokemons.filter((pokemon) => !existingIds.has(pokemon.id));
        return [...previous, ...newUniquePokemons];
      });
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
    if (pokemons.length === 0 && nextUrl) {
      loadMorePokemons().then(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if(!sentinelRef.current || !nextUrl) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingMore) {
        loadMorePokemons();
      }
    }, {threshold: 1.0});

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [sentinelRef.current, isFetchingMore, nextUrl]);


  const visiblePokemons =
  selectedTypes.length > 0
    ? pokemons.filter((pokemon) =>
        selectedTypes.every((filterType) =>
          pokemon.types.some((t) => t.type.name === filterType)
        )
      )
    : pokemons;
  
  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <aside className="border p-4 bg-white dark:bg-gray-900">
        <h2 className="font-bold mb-4">Filter</h2>
        <p className="text-sm font-medium text-gray-500 mb-2">Type</p>
        <TypeFilter
          types={types}
          selectedTypes={selectedTypes}
          onChange={setSelectedTypes}>
        </TypeFilter>
      </aside>

      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visiblePokemons.map((pokemon) => (
            <PokemonCard
              key={`${pokemon.name}-${pokemon.id}`}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
              types={pokemon.types.map((type) => type.type.name)}
              ></PokemonCard>
          ))}
          {visiblePokemons.length === 0 && <p className="col-span-full text-center text-gray-800 dark:text-gray-400 mt-8">
            Oops! No Pokémon found. Try changing your filters.
          </p>}
        </div>

        {nextUrl && (
        <div ref={sentinelRef} className="w-full py-8 flex justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-t-black border-b-black rounded-full" />
        </div>
        )}
      </section>
    </div>
  )
}