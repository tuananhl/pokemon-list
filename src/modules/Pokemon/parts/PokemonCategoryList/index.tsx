'use client';

import { IPokemonCategory } from "@/types/pokemon.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface Props {
  categories: IPokemonCategory[];
}

function PokemonCategoryList({
  categories,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const types = searchParams.get('type') ?? '';
  const selectedTypes = useMemo<Record<string, boolean>>(() => (
    types.split(',').reduce((acc, type) => ({
      ...acc, [type]: true,
    }), {})
  ), [types]);

  function handleUpdateQuery(categoryName: string) {
    const params = new URLSearchParams(searchParams.toString());
    const listTypes = types.split(',').filter(Boolean);
    if (!selectedTypes[categoryName]) {
      params.set('type', [...listTypes, categoryName].join(','));
      params.delete('page');
      return router.push(`?${params.toString()}`);
    }
    if (listTypes.length === 1) {
      params.delete('type');
      params.delete('page');
      return router.push(`?${params.toString()}`);
    }
    params.set('type', listTypes.filter((item) => item !== categoryName).join(','));
    params.delete('page');
    return router.push(`?${params.toString()}`);
  }

  return (
    <section className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span>Types:</span>
      {categories.map((category) => (
        <button
          key={category.name}
          className={`cursor-pointer border p-4 ${selectedTypes[category.name] ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleUpdateQuery(category.name)}
        >
          {category.name}
        </button>
      ))}
    </section>
  );
}

export default PokemonCategoryList;
