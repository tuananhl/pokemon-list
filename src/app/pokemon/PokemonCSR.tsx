'use client';

import { useMemo } from "react";
import { Metadata } from "next";
import { getListPokemon, getListPokemonByType, getListPokemonCategories } from "@/apis/pokemon.api";
import Pagination from "@/components/common/Pagination";
import PokemonCategoryList from "@/modules/Pokemon/parts/PokemonCategoryList";
import { IPokemonMetadata } from "@/types/pokemon.types";
import { replaceWithValidNumber } from "@/utils/number.util";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Pokemon from "@/modules/Pokemon/clients/PokemonItem";

export const metadata: Metadata = {
  title: "Pokemon CSR",
  description: "The app to display and filter the Pokemon",
};

function PokemonCSR() {
  const searchParams = useSearchParams();
  const types = searchParams.get('type');
  const page = replaceWithValidNumber(Number(searchParams.get('page') ?? 1), 1);
  const listTypeSplitted = useMemo(() => {
    if (!types) return [];
    return types.split(',').filter(Boolean);
  }, [types]);

  const { data: categories } = useQuery({
    queryKey: ['pkm-categories'],
    queryFn: getListPokemonCategories,
  });
  const { data: pokemonData } = useQuery({
    queryKey: ['pkm-list'],
    queryFn: () => getListPokemon((page - 1) * 24, 24),
    enabled: listTypeSplitted.length === 0,
  });
  const { data: pokemonTypeData } = useQueries({
    queries: listTypeSplitted.map((type) => ({
      queryKey: ['pkm-type', type],
      queryFn: () => getListPokemonByType(type).then((result) => result.pokemon).catch(() => []),
    })),
    combine: (results) => {
      const hasPending = results.some((result) => result.isPending);
      if (hasPending) {
        return {
          data: { count: 0, results: [] },
          pending: true,
        };
      }
      const listPokemon = results.map((item) => item.data!).flat();
      if (listTypeSplitted.length === 1) {
        return {
          data: {
            count: listPokemon.length,
            results: listPokemon.map((item) => item.pokemon).slice((page - 1) * 24, (page - 1) * 24 + 24)
          },
          pending: false,
        };
      }
      const countMap = listPokemon.reduce<Map<string, IPokemonMetadata & { count: number }>>((pokemonCountMap, pkmData) => {
        if (!pkmData.pokemon) return pokemonCountMap;
        pokemonCountMap.set(pkmData.pokemon.name, {
          count: (pokemonCountMap.get(pkmData.pokemon.name)?.count || 0) + 1,
          name: pkmData.pokemon.name,
          url: pkmData.pokemon.url
        });
        return pokemonCountMap;
      }, new Map());
      const visiblePokemon = [...countMap.keys()]
        .filter((key) => (countMap.get(key)?.count ?? 0) >= 2)
        .map((key) => countMap.get(key)) as IPokemonMetadata[];
      return {
        pending: false,
        data: {
          count: visiblePokemon.length,
          results: visiblePokemon.slice((page - 1) * 24, (page - 1) * 24 + 24)
        },
      };
    },
  });

  if (!categories) return <div>Not found</div>

  const data = listTypeSplitted.length !== 0 ? pokemonTypeData : (pokemonData ?? { count: 0, results: [] });

  return (
    <>
      <p>Total count: {data.count}</p>
      <PokemonCategoryList categories={categories} />
      <section className="flex flex-col justify-center">
        <section className="grid grid-cols-6 gap-16">
          {data.results.map((item) => (
            <Pokemon key={item.name} pokemonUrl={item.url ?? ''} />
          ))}
        </section>
        <Pagination total={data.count} perPage={24}/>
      </section>
    </>
  );
}

export default PokemonCSR;
