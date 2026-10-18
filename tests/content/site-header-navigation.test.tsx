import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "../../components/site/SiteHeader";
import { SiteNav } from "../../components/site/SiteNav";

const route = vi.hoisted(() => ({ pathname: "/" as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@/lib/content/site-pages", async () => import("../../lib/content/site-pages"));
vi.stubGlobal("React", React);

describe("Shared header navigation", () => {
  it.each([
    ["/", "Home", true],
    ["/learn", "Learn", true],
    ["/learn/loans", "Learn", false],
    ["/learn/loans/how-much-house-can-i-afford", "Learn", false],
    ["/calculators", "Calculators", true],
    ["/calculators/home-loan", "Calculators", false],
  ])("identifies the exact page or parent section on %s", (pathname, label, exact) => {
    route.pathname = pathname;
    const html = renderToStaticMarkup(<SiteNav />);
    const links = [...html.matchAll(/<a\b([^>]*)>(.*?)<\/a>/g)];
    expect(links.map((link) => link[2])).toEqual(["Home", "Calculators", "Learn"]);
    const selected = links.filter((link) => link[1].includes('data-section-active="true"'));
    expect(selected).toHaveLength(1);
    expect(selected[0][2]).toBe(label);
    expect(selected[0][1].includes('aria-current="page"')).toBe(exact);
    expect(html.match(/aria-current="page"/g) ?? []).toHaveLength(exact ? 1 : 0);
  });

  it.each(["/about", "/learning", "/calculators-extra", null])("does not falsely match %s", (pathname) => {
    route.pathname = pathname;
    const html = renderToStaticMarkup(<SiteNav />);
    expect(html).not.toContain('aria-current="page"');
    expect(html).not.toContain('data-section-active="true"');
    expect(html.match(/<a\b/g)).toHaveLength(3);
  });

  it("keeps the existing logo, link semantics, focus styles and touch targets", () => {
    route.pathname = "/";
    const html = renderToStaticMarkup(<SiteHeader />);
    expect(html).toContain('aria-label="Primary navigation"');
    expect(html.match(/<nav\b/g)).toHaveLength(1);
    expect(html.match(/<a\b/g)).toHaveLength(4);
    for (const href of ["/", "/learn", "/calculators"]) expect(html).toContain(`href="${href}"`);
    expect(html).toContain("ArthaSiddhi</span>");
    expect(html).toContain('aria-hidden="true" focusable="false"');
    expect(html).toContain("min-h-11");
    expect(html).toContain("focus-visible:outline-2");
    expect(html).toContain("sm:flex-row");
    expect(html).not.toMatch(/<button|role="menu|aria-expanded/);
  });
});
