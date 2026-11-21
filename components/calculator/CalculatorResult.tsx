export function CalculatorResult({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`rounded-xl border p-4 ${emphasis ? "border-[var(--as-brand-teal)] bg-[var(--as-surface-soft)]" : "border-[var(--as-border-subtle)] bg-[var(--as-surface-soft)]"}`}><p className="text-sm text-[var(--as-text-secondary)]">{label}</p><p className="mt-2 text-xl font-bold tracking-tight text-[var(--as-text-primary)]">{value}</p></div>;
}
