import { memo } from "react";
import Image from "next/image";
import { IPokemon } from "@/types/pokemon.types";

interface Props {
  pokemon: IPokemon;
}

function PokemonItem({ pokemon }: Props) {
  return (
    <div className="flex flex-col items-center justify-between">
      <h3>{pokemon.name}</h3>
      <Image
        src={pokemon.sprites.other.showdown.front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
        width={35}
        height={53}
        className="w-20 text-transparent"
      />
      <p>Number: {pokemon.id}</p>
    </div>
  );
}

export default memo(PokemonItem);
