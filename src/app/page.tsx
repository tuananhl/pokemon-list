import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-svh flex items-center justify-center gap-5">
      <Link href="/pokemon"><button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white">Client Side Rendering</button></Link>
      <Link href="/pokemon-ssr"><button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white">Server Side Rendering</button></Link>
    </div>
  );
}
