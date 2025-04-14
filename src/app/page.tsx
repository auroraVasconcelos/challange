import PokemonOverview from "@/components/PokemonOverview";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl">These are our products</h1>

      <PokemonOverview />

    </div>
  );
}