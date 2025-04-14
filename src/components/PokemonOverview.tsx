"use client";

import React, { useEffect, useState, useRef } from "react";
import Spinner from "./Spinner";
import PokemonCard from "./PokemonCard";
import TypeFilter from "./TypeFilter";
import { fetchPokemonList, fetchPokemonDetails } from "@/lib/services/pokemonService";
import { useCallback } from "react";

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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?offset=0&limit=25");
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMorePokemons = useCallback(async () => {
    if(!nextUrl) return;
    setLoadingMore(true);

    try {
      const data = await fetchPokemonList(nextUrl);

      const detailedPokemons: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
          return await fetchPokemonDetails(pokemon.url);
        })
      );

      setPokemons((previous) => {
        const existingIds = new Set(previous.map((previous) => previous.id));
        const newUniquePokemons = detailedPokemons.filter((pokemon) => !existingIds.has(pokemon.id));
        return [...previous, ...newUniquePokemons];
      });
      setNextUrl(data.next);

      const updatedTypes = new Set(types);
      detailedPokemons.forEach((pokemon) => {
      pokemon.types.forEach((type) => updatedTypes.add(type.type.name));
    });
    setTypes([...updatedTypes]);

    } catch (err) {
      console.error("Failed to fetch more pokemons", err);
    }
    
    setLoadingMore(false);
  }, [nextUrl, types]);

  useEffect(() => {
    if (pokemons.length === 0 && nextUrl) {
      loadMorePokemons().then(() => setLoading(false));
    }
  }, [loadMorePokemons, pokemons.length, nextUrl]);

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if(!currentSentinel || !nextUrl) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        loadMorePokemons();
      }
    }, {threshold: 1.0});

    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loadMorePokemons, loadingMore, nextUrl]);


  const visiblePokemons =
  selectedTypes.length > 0
    ? pokemons.filter((pokemon) =>
        selectedTypes.every((filterType) =>
          pokemon.types.some((type) => type.type.name === filterType)
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