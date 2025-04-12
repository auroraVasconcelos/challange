import React from "react";
import Link from "next/link";

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, image }) => {
  return (
    <Link href={`/pokemon/${id}`}>
      <div className="p-4 border rounded-lg shadow hover:scale-105 transition-transform flex flex-col items-center cursor-pointer bg-white">
        <img src={image} alt={name} className="w-24 h-24 object-contain" />
        <h2 className="capitalize font-semibold mt-2 text-center">{name}</h2>
      </div>
    </Link>
  );
};

export default PokemonCard;