'use client';

import { getPokemonDetail } from "@/apis/pokemon.api";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import PokemonItem from "../../parts/PokemonItem";

interface Props {
  pokemonUrl: string;
}

function Pokemon({
  pokemonUrl,
}: Props) {
  const handleGetPokemon = useCallback(() => getPokemonDetail(pokemonUrl), [pokemonUrl]);
  const { isPending, data: pokemon } = useQuery({ queryKey: ['pokemon', pokemonUrl.split('/').filter(Boolean).pop()], queryFn: handleGetPokemon, refetchOnReconnect: false, refetchOnWindowFocus: false, refetchOnMount: false });

  if (isPending) {
    return (
      <>
        <h3>Loading...</h3>
        <div className="w-20 h-[87px]" />
      </>
    );
  }

  if (!pokemon) return null;

  return <PokemonItem pokemon={pokemon} />;
}

export default Pokemon;
