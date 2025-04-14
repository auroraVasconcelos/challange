const BASE_URL = "https://pokeapi.co/api/v2";

export const fetchPokemonList = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Pokémon list");
  return response.json();
};

export const fetchPokemonDetails = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Pokémon details");
  return response.json();
};