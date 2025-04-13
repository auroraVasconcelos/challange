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
  const [selectedType, setSelectedType] = useState<string>("");
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


  const visiblePokemons = selectedType ? 
    pokemons.filter((pokemon) => pokemon.types.some((type) => type.type.name === selectedType)) : 
    pokemons;
  
  if (loading) return <Spinner />;
  console.log("Pokemons", pokemons);
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
            types={pokemon.types.map((type) => type.type.name)}
            ></PokemonCard>
        ))}
      </div>

      {nextUrl && (
        <div ref={sentinelRef} className="w-full py-8 flex justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-t-black border-b-black rounded-full" />
        </div>
    )}
    </div>
  )
}