interface CalculatorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorId?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  hint?: string;
}

export function CalculatorInput({ id, label, value, onChange, error, errorId, min, max, step, prefix, hint }: CalculatorInputProps) {
  return <div><label htmlFor={id} className="block text-sm font-medium text-[var(--as-text-primary)]">{label}</label><div className="relative mt-2">{prefix && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--as-text-secondary)]">{prefix}</span>}<input id={id} name={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={[hint ? `${id}-hint` : null, error && errorId ? errorId : null].filter(Boolean).join(" ") || undefined} className={`w-full rounded-lg border border-[var(--as-border-control)] bg-[var(--as-surface-card)] py-2.5 pr-3 text-base shadow-xs outline-none transition focus:border-[var(--as-brand-teal)] focus:ring-3 focus:ring-[var(--as-brand-teal)] focus:ring-offset-2 ${prefix ? "pl-7" : "px-3"}`} /></div>{hint && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-[var(--as-text-secondary)]">{hint}</p>}</div>;
}
