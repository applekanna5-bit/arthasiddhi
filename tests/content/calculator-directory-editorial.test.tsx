import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CalculatorsPage, { metadata } from "../../app/calculators/page";
import { CalculatorDirectoryIcon } from "../../components/calculator/CalculatorDirectoryIcon";
import { calculatorCategories, calculators, getCalculatorsByCategory, type CalculatorSlug } from "../../lib/content/calculators";

vi.mock("@/components/calculator/CalculatorDirectoryIcon", async () => import("../../components/calculator/CalculatorDirectoryIcon"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.stubGlobal("React", React);
const html = renderToStaticMarkup(<CalculatorsPage />);
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;");

describe("Premium calculator directory", () => {
  it("renders exactly 17 unique card links in existing category and calculator order", () => {
    const hrefs = [...html.matchAll(/href="(\/calculators\/[^"/]+)"/g)].map((match) => match[1]);
    expect(hrefs).toEqual(calculatorCategories.flatMap((category) => getCalculatorsByCategory(category).map(({ href }) => href)));
    expect(new Set(hrefs).size).toBe(17);
    for (const calculator of Object.values(calculators)) {
      expect(html).toContain(escape(calculator.name));
      expect(html).toContain(escape(calculator.description));
    }
    expect(html.match(/Open calculator/g)).toHaveLength(17);
    expect(html.match(/<a\b/g)).toHaveLength(22);
    expect(html).not.toMatch(/<button|<input|<select|aria-hidden="true"[^>]*class="directory-card/);
  });

  it("preserves all five category introductions, anchors and heading order", () => {
    expect(calculatorCategories).toEqual(["Loans", "Investments", "Savings", "Tax", "Retirement & Planning"]);
    for (const category of calculatorCategories) {
      const id = `${category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}-calculators`;
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}" tabindex="-1"`);
    }
    for (const text of [
      "See what a loan costs each month and how much interest it adds over the full tenure.",
      "Compare regular and one-time investing, check annualised growth, or see how long a withdrawal plan may last.",
      "See how a fixed deposit, monthly RD or annual PPF contribution builds towards maturity.",
      "Calculate supported income-tax or GST amounts from your inputs. The tools do not decide which tax treatment or GST classification applies.",
      "Work out retirement savings, gratuity and how inflation can change the value of money over time.",
    ]) expect(html).toContain(text);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.match(/<h2\b/g)).toHaveLength(5);
    expect(html.match(/<h3\b/g)).toHaveLength(17);
  });

  it("preserves metadata and canonical exactly", () => {
    expect(metadata.title).toBe("Indian Financial Calculators | ArthaSiddhi");
    expect(metadata.description).toBe("Seventeen calculators for loan EMIs, investments, savings, income tax, GST, EPF, NPS, gratuity and inflation.");
    expect(metadata.alternates?.canonical).toBe("https://arthasiddhi.com/calculators");
  });

  it("provides distinct, decorative SVG coverage without a fallback for unknown slugs", () => {
    const icons = Object.keys(calculators).map((slug) => renderToStaticMarkup(<CalculatorDirectoryIcon slug={slug as CalculatorSlug} />));
    expect(new Set(icons).size).toBe(17);
    for (const icon of icons) {
      expect(icon).toContain('aria-hidden="true" focusable="false"');
      expect(icon).toContain('width="52" height="52"');
      expect(icon).not.toMatch(/<text|<image/);
    }
    expect(() => CalculatorDirectoryIcon({ slug: "unknown" as CalculatorSlug })).toThrow("Unknown calculator directory icon slug");
  });
});
