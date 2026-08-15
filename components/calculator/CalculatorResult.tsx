export function CalculatorResult({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`rounded-xl border p-4 ${emphasis ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><p className="text-sm text-slate-600">{label}</p><p className={`mt-2 text-xl font-bold tracking-tight ${emphasis ? "text-emerald-900" : "text-slate-900"}`}>{value}</p></div>;
}
