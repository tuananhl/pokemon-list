import { getPokemonDetail } from "@/apis/pokemon.api";
import PokemonItem from "@/modules/Pokemon/parts/PokemonItem";

interface Props {
  pokemonUrl: string;
}

async function Pokemon({
  pokemonUrl,
}: Props) {
  const pokemon = await getPokemonDetail(pokemonUrl);

  return <PokemonItem pokemon={pokemon} />;
}

export default Pokemon;
