export interface IPokemonCategory {
  name: string;
  url: string;
}

export interface IPokemonCategoryDetail {
  id: string;
  name: string;
  pokemon: Array<{ pokemon: IPokemonMetadata; slot: number; }>;
}

export interface IPokemonMetadata {
  name: string;
  url: string;
}

export interface IPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      showdown: {
        front_default: string | null;
      },
    }
  },
}