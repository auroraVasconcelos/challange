import React from "react";
import Link from "next/link";
import Image from "next/image";
import typeColorMap from "@/lib/typeColor";

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, image, types }) => {
  return (
    <Link href={`/pokemon/${id}`}>
      <div className="pt-4 border border-black dark:border-white shadow hover:scale-105 transition-transform flex flex-col items-center cursor-pointer bg-white dark:bg-gray-900">
        <div className="text-xs text-gray-500 font-mono w-full flex justify-end pr-4">#{id.toString().padStart(3, "0")}</div>
        <Image
          src={image}
          alt={name}
          width={96}
          height={96}
          className="w-24 h-24 object-contain" />
        <div className="border-t border-black dark:border-white w-full p-2 capitalize text-black dark:text-gray-400 flex flex-row justify-between">
          {name}
          <span className="flex items-center gap-1">
            {types.map((type) => (
              <span
              key={type}
              className={`inline-block w-3 h-3 rounded-full`}
              style={{ backgroundColor: typeColorMap[type] }}
            >
              </span>
          ))}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;