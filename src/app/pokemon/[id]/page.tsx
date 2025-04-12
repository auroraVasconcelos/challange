import { notFound } from "next/navigation";

export default function PokemonDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) return notFound();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Pokémon Detail Page</h1>
      <p>This will show details for Pokémon with ID: <strong>{id}</strong></p>
    </div>
  );
}