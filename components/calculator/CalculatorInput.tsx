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
  return <div><label htmlFor={id} className="block text-sm font-medium text-slate-800">{label}</label><div className="relative mt-2">{prefix && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">{prefix}</span>}<input id={id} name={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={`w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 text-base shadow-xs outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 ${prefix ? "pl-7" : "px-3"}`} /></div>{hint && <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>}</div>;
}
