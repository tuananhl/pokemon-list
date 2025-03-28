import { getListPokemon, getListPokemonByType, getListPokemonCategories } from "@/apis/pokemon.api";
import PokemonCategoryList from "@/modules/Pokemon/parts/PokemonCategoryList";
import { IPokemonCategoryDetail, IPokemonMetadata } from "@/types/pokemon.types";
import Pagination from "../../components/common/Pagination";
import { replaceWithValidNumber } from "@/utils/number.util";
import Pokemon from "@/modules/Pokemon/srr/PokemonItem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokemon SSR",
  description: "The app to display and filter the Pokemon",
};

async function PokemonSSRPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | null>> }) {
  const params = await searchParams;
  const page = replaceWithValidNumber(Number(params['page'] ?? 1), 1);

  function fetchListPokemon() {
    if (params.type) {
      const listTypes = params.type.split(',').filter(Boolean);
      return Promise.all(listTypes.map((type) => (
        getListPokemonByType(type).then((result) => result.pokemon).catch(() => [])
      )))
        .then((result) => result.flat())
        .then((listPokemon: IPokemonCategoryDetail['pokemon']) => {
          if (listTypes.length === 1) {
            return { count: listPokemon.length, results: listPokemon.map((item) => item.pokemon).slice((page - 1) * 24, (page - 1) * 24 + 24) }
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
            count: visiblePokemon.length,
            results: visiblePokemon.slice((page - 1) * 24, (page - 1) * 24 + 24)
          };
        });
    }
    return getListPokemon((page - 1) * 24, 24);
  }

  const [pokemonData, categories] = await Promise.all([
    fetchListPokemon(),
    getListPokemonCategories(),
  ]);

  return (
    <>
      <p>Total count: {pokemonData.count}</p>
      <PokemonCategoryList categories={categories} />
      <section className="flex flex-col justify-center">
        <section className="grid grid-cols-6 gap-16">
          {pokemonData.results.map((item) => (
            <Pokemon key={item.name} pokemonUrl={item.url ?? ''} />
          ))}
        </section>
        <Pagination total={pokemonData.count} perPage={24}/>
      </section>
    </>
  );
}

export default PokemonSSRPage;
