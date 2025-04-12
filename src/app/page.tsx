import PokemonOverview from "@/components/PokemonOverview";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Pocket Monsters</h1>
      <p className="text-center text-gray-500">Explore and filter all monsters by type.</p>

      <PokemonOverview />

    </div>
  );
}