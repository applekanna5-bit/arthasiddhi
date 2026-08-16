import type { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-14 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
        </header>
        <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">{children}</div>
      </article>
    </main>
  );
}
