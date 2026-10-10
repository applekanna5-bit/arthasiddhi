import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "../../components/site/BrandLogo";

describe("BrandLogo accessible variants", () => {
  it("names the lockup with visible text and hides the decorative SVG", () => {
    const html = renderToStaticMarkup(BrandLogo({}));
    expect(html).toContain(">ArthaSiddhi</span>");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("aria-label");
  });
  it("names mark-only without duplicate visible text", () => {
    const html = renderToStaticMarkup(BrandLogo({ variant: "mark" }));
    expect(html).toContain('role="img" aria-label="ArthaSiddhi"');
    expect(html).not.toContain(">ArthaSiddhi</span>");
  });
  it("inherits the surrounding color in monochrome", () => {
    const html = renderToStaticMarkup(BrandLogo({ treatment: "monochrome" }));
    expect(html).toContain("color:currentColor");
    expect(html).not.toContain("--as-brand-");
  });
});
