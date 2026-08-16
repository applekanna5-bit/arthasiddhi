import Link from "next/link";

const destinations = [
  { href: "/", label: "Go to Home" },
  { href: "/calculators", label: "Explore calculators" },
  { href: "/learn", label: "Browse Learn" },
];

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">The page may have moved, or the address may be incorrect. Choose a reliable place to continue.</p>
        <nav aria-label="Not found destinations" className="mt-8">
          <ul className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            {destinations.map((destination, index) => (
              <li key={destination.href}>
                <Link href={destination.href} className={index === 0 ? "block rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-200" : "block rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-emerald-100"}>{destination.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
