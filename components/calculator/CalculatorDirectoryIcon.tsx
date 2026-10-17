import * as React from "react";
import type { CalculatorSlug } from "../../lib/content/calculators";

const artwork = {
  "home-loan": { main: "M8 23 24 9 40 23M12 21v19h24V21M20 40V28h8v12", accent: "M30 12v-2h6v8" },
  "car-loan": { main: "M9 25l4-12h22l4 12v12H9ZM10 25h28M15 37v4M33 37v4", accent: "M14 30h5M29 30h5" },
  "personal-loan": { main: "M13 7h16l8 8v26H13ZM29 7v9h8M19 23h12M19 29h8", accent: "M19 35h5" },
  sip: { main: "M12 15a14 14 0 0 1 25 2M36 33a14 14 0 0 1-25-2M12 8v8h8M36 40v-8h-8", accent: "M24 19v10M19 24h10" },
  "step-up-sip": { main: "M8 39h10V29h10V19h10V9M8 33h4M20 23h4M32 13h4", accent: "M31 9h7v7" },
  lumpsum: { main: "M12 22v14c0 6 24 6 24 0V22M12 29c0 6 24 6 24 0M12 22c0 6 24 6 24 0s-24-6-24 0", accent: "M24 6v10M19 11l5 5 5-5" },
  cagr: { main: "M8 13h10v23H8ZM30 13h10v23H30M20 25h8", accent: "M23 21l4 4-4 4" },
  swp: { main: "M8 12h32v10H8ZM12 22v17h24V22M18 28h4M18 33h4", accent: "M30 27v14M26 37l4 4 4-4" },
  fd: { main: "M10 17h28v24H10ZM15 17v-6a9 9 0 0 1 18 0v6", accent: "M24 26v7M21 26h6" },
  rd: { main: "M9 12h30v28H9ZM15 7v10M33 7v10M9 22h30M15 28h3M24 28h3M15 34h3", accent: "M31 31h5M33.5 28.5v5" },
  ppf: { main: "M24 29V13M24 22C10 22 10 9 10 9s14-1 14 13M24 27c14 0 14-13 14-13s-14-1-14 13M13 32h22v9H13Z", accent: "M18 36h12" },
  "income-tax": { main: "M10 7h28v34H10ZM16 15h16M16 23h6M28 23h4M16 31h6", accent: "M28 28v7M24.5 31.5h7" },
  gst: { main: "M12 7h24v34l-6-3-6 3-6-3-6 3ZM18 14h12M18 21h12", accent: "M18 29h12M26 26l4 3-4 3" },
  epf: { main: "M10 9h10v9H10ZM28 9h10v9H28M15 18v7h18v-7M24 25v8M16 33h16v8H16Z", accent: "M21 37h6" },
  nps: { main: "M10 21h28v19H10ZM8 21 24 8l16 13M18 28v6M24 28v6M30 28v6", accent: "M21 15h6M24 12v6" },
  inflation: { main: "M8 14h13v24H8ZM27 20h13v18H27M12 20h5M31 26h5", accent: "M12 8h24M32 5l4 3-4 3" },
  gratuity: { main: "M15 8h18v9a9 9 0 0 1-18 0ZM15 11H9v5c0 6 6 7 9 7M33 11h6v5c0 6-6 7-9 7M24 26v9M16 40h16v-5H16Z", accent: "M21 14h6M24 11v6" },
} as const satisfies Record<CalculatorSlug, { main: string; accent: string }>;

export function CalculatorDirectoryIcon({ slug }: { slug: CalculatorSlug }) {
  const icon = artwork[slug];
  if (!icon) throw new Error("Unknown calculator directory icon slug");
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="52" height="52"
      aria-hidden="true" focusable="false" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0">
      <rect width="48" height="48" rx="10" fill="var(--as-surface-soft)" />
      <path d={icon.main} stroke="var(--as-brand-teal)" />
      <path d={icon.accent} stroke="var(--as-brand-copper)" />
    </svg>
  );
}
