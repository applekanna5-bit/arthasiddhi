import * as React from "react";

export type BrandLogoProps = {
  variant?: "lockup" | "mark";
  treatment?: "navy" | "teal" | "monochrome";
  className?: string;
};

/** Isolated prototype. Monochrome inherits currentColor.
 * Visible wordmark names the lockup; mark-only has an explicit accessible name.
 */
export function BrandLogo({ variant = "lockup", treatment = "navy", className }: BrandLogoProps) {
  const color = treatment === "monochrome" ? "currentColor"
    : treatment === "teal" ? "var(--as-brand-teal, #17645d)"
      : "var(--as-brand-navy, #142a38)";

  return (
    <span className={className}
      role={variant === "mark" ? "img" : undefined}
      aria-label={variant === "mark" ? "ArthaSiddhi" : undefined}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5em", color, verticalAlign: "middle" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
        width="1.5em" height="1.5em" aria-hidden="true" focusable="false"
        style={{ flexShrink: 0 }}>
        {/* Stable A silhouette with a gently rising crossbar. */}
        <path fill="currentColor" d="M4 42 20 6h8l16 36h-9L24 16 13 42Z" />
        <path fill="currentColor" d="m14 31 18-5 3 7-24 6Z" />
      </svg>
      {variant === "lockup" && <span style={{ fontFamily: "var(--font-geist-sans, system-ui), sans-serif", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.2 }}>ArthaSiddhi</span>}
    </span>
  );
}
