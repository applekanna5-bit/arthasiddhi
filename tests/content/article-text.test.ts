import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/articles", async () => import("../../lib/content/articles"));
vi.mock("@/lib/content/calculators", async () => import("../../lib/content/calculators"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));

import { ArticleText } from "../../components/article/ArticleText";

describe("ArticleText internal links", () => {
  it("resolves calculator and article identifiers through their registries", () => {
    const html = renderToStaticMarkup(createElement(ArticleText, {
      content: [
        { text: "Compare the " },
        { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } },
        { text: " with the " },
        { text: "Home Loan Guide", link: { kind: "article", slug: "home-loan-guide" } },
        { text: "." },
      ],
    }));

    expect(html).toContain('href="/calculators/home-loan"');
    expect(html).toContain('href="/learn/loans/home-loan-guide"');
    expect(html.replace(/<[^>]+>/g, "")).toBe("Compare the Home Loan EMI Calculator with the Home Loan Guide.");
  });
});
