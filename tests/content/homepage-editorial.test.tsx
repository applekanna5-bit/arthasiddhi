import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage, { metadata } from "../../app/page";
import { publishedCategories } from "../../lib/content/articles";
import { getHomeGuides } from "../../lib/content/discovery";
import { getArticlePath } from "../../lib/content/seo";

vi.mock("@/lib/content/articles", async () => import("../../lib/content/articles"));
vi.mock("@/lib/content/discovery", async () => import("../../lib/content/discovery"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.stubGlobal("React", React);
const html = renderToStaticMarkup(<HomePage />);

describe("Editorial homepage preserves decision pathways", () => {
  it("keeps the headline, metadata and all curated destinations", () => {
    expect(html).toContain("Make smarter money decisions.");
    expect(metadata.alternates?.canonical).toBe("https://arthasiddhi.com/");
    expect(metadata.title).toBe("ArthaSiddhi | Indian Financial Calculators & Guides");
    for (const category of publishedCategories) expect(html).toContain(`href="/learn/${category}"`);
    for (const slug of ["home-loan", "sip", "fd", "ppf", "inflation", "income-tax"]) expect(html).toContain(`href="/calculators/${slug}"`);
    for (const article of getHomeGuides()) expect(html).toContain(`href="${getArticlePath(article)}"`);
    for (const route of ["/calculators", "/learn", "/methodology", "/editorial-policy", "/about"]) expect(html).toContain(`href="${route}"`);
  });

  it("places the actions before a dimensioned, locally sourced illustration", () => {
    expect(html.indexOf('href="#decisions"')).toBeLessThan(html.indexOf("<figure"));
    expect(html).toContain('width="1774" height="887"');
    expect(html).toContain('alt=""');
    expect(html).toContain("home-planning.webp");
    expect(html).toContain('loading="eager"');
    expect(html).toContain("sizes=");
    expect(html).toContain("AI-generated image.");
    // React may emit one automatic resource hint for the single eager image.
    expect((html.match(/rel="preload" as="image"/g) ?? []).length).toBeLessThanOrEqual(1);
  });

  it("retains the four-step explanation, trust copy and meaningful heading order", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.indexOf("</figure>")).toBeLessThan(html.indexOf('id="process-heading"'));
    for (const step of ["Understand", "Calculate", "Compare", "Decide"]) expect(html).toContain(`<h3 class="font-semibold">${step}</h3>`);
    expect(html).toContain('id="decisions" tabindex="-1"');
    expect(html).toContain("Not personalized financial advice.");
    expect(html).toContain("focus-visible:outline-2");
  });
});
