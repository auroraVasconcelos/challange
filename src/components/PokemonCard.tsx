import React from "react";
import Link from "next/link";
import typeEmoji from "@/lib/typeEmoji";

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, image, types }) => {
  return (
    <Link href={`/pokemon/${id}`}>
      <div className="p-4 border rounded-lg shadow hover:scale-105 transition-transform flex flex-col items-center cursor-pointer bg-white">
        <div className="text-xs text-gray-500 font-mono w-full flex justify-end">#{id.toString().padStart(3, "0")}</div>
        <img src={image} alt={name} className="w-24 h-24 object-contain" />
        <p className="capitalize font-semibold mt-2 flex text-center">{name}
          {types.map((type) => (
            <span className="ml-2.5" key={type}>
              {typeEmoji[type] || ""}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
};

export default PokemonCard;