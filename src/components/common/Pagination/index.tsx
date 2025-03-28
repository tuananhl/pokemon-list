'use client';

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  total: number;
  perPage: number;
}

function Pagination({
  total,
  perPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPage = Math.ceil(total / perPage);
  const page = Number(searchParams.get('page') || 1);

  function handleNext() {
    if (page < totalPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (page + 1).toString());
      router.push(`?${params.toString()}`);
    }
  }

  function handlePrevious() {
    if (page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (page - 1).toString());
      router.push(`?${params.toString()}`);
    }
  }

  return (
    <div className="flex justify-center gap-4 py-4">
      {page > 1 && (
        <button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white" onClick={handlePrevious}>Previous</button>
      )}
      {page < totalPage && (
        <button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white" onClick={handleNext}>Next</button>
      )}
    </div>
  );
}

export default Pagination;
