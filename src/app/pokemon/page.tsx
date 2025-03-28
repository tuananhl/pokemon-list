import { Metadata } from 'next';
import PokemonCSR from './PokemonCSR';

export const metadata: Metadata = {
  title: "Pokemon CSR",
  description: "The app to display and filter the Pokemon",
};

function PokemonClientSide() {
  return <PokemonCSR />;
}

export default PokemonClientSide;
