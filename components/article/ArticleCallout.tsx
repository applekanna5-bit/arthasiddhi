export function ArticleCallout({ title, text }: { title: string; text: string }) {
  return <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><h3 className="font-semibold">{title}</h3><p className="mt-1">{text}</p></aside>;
}
