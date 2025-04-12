"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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
          pokemon.types.forEach((type) => {
            uniqueTypes.add(type.type.name);
          });
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

  const Spinner = () => (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
    </div>
  );

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 justify-center mb-6 px-4">
            <button
              onClick={() => setSelectedType("")}
              className={`px-4 py-2 rounded-full border ${
                selectedType === "" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              All
            </button>
              
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full border capitalize ${
                  selectedType === type ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visiblePokemons.map((pokemon) => (
              <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                <div className="p-4 border rounded-lg shadow hover:scale-105 transition-transform flex flex-col items-center cursor-pointer bg-white">
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default ||
                      pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    className="w-24 h-24 object-contain"
                  />
                  <h2 className="capitalize font-semibold text-center">{pokemon.name}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}