import { IPagination } from "@/types/pagination.types";
import { IPokemon, IPokemonCategory, IPokemonCategoryDetail, IPokemonMetadata } from "@/types/pokemon.types";

async function getListPokemonCategories(): Promise<IPokemonCategory[]> {
  return fetch('https://pokeapi.co/api/v2/type', { cache: 'force-cache' })
    .then((result) => result.json())
    .then((result: IPagination<IPokemonCategory>) => result.results);
}

async function getListPokemon(offset: number, limit: number): Promise<IPagination<IPokemonMetadata>> {
  const queryParams = new URLSearchParams({ offset: offset.toString(), limit: limit.toString() });
  return fetch(`https://pokeapi.co/api/v2/pokemon?${queryParams}`, { cache: 'force-cache' })
    .then((result) => result.json())
}

async function getListPokemonByType(type: string): Promise<IPokemonCategoryDetail> {
  return fetch(`https://pokeapi.co/api/v2/type/${type}`, { cache: 'force-cache' })
    .then((res) => res.json())
}

async function getPokemonDetail(pokemonUrl: string): Promise<IPokemon> {
  return fetch(pokemonUrl, { cache: 'force-cache' })
    .then((res) => res.json());
}

export { getListPokemon, getListPokemonCategories, getListPokemonByType, getPokemonDetail };
