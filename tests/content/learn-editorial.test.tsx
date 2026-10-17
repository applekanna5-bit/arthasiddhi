import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LearnPage, { metadata } from "../../app/learn/page";
import { categoryDescriptions, categoryLabels, publishedCategories } from "../../lib/content/articles";
import { getFeaturedArticles, learnCategoryHubs } from "../../lib/content/discovery";
import { getArticlePath } from "../../lib/content/seo";

vi.mock("@/lib/content/articles", async () => import("../../lib/content/articles"));
vi.mock("@/lib/content/discovery", async () => import("../../lib/content/discovery"));
vi.mock("@/lib/content/seo", async () => import("../../lib/content/seo"));
vi.stubGlobal("React", React);
const html = renderToStaticMarkup(<LearnPage />);
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;");

describe("Premium Learn discovery", () => {
  it("preserves category order, descriptions, previews and full-card destinations", () => {
    const destinations = [...html.matchAll(/href="(\/learn\/[^"/]+)"/g)].map((match) => match[1]);
    expect(destinations).toEqual(publishedCategories.map((category) => `/learn/${category}`));
    for (const category of publishedCategories) {
      expect(html).toContain(escape(categoryLabels[category]));
      expect(html).toContain(escape(categoryDescriptions[category]));
      expect(html).toContain(escape(learnCategoryHubs[category].topicPreview.join(" · ")));
    }
    expect(html).not.toContain("<button");
    expect(html).not.toContain('type="search"');
  });

  it("uses six decorative local illustrations with reserved dimensions and lazy loading", () => {
    expect(html.match(/<img\b/g)).toHaveLength(6);
    expect(html.match(/alt=""/g)).toHaveLength(6);
    expect(html.match(/width="1200" height="800"/g)).toHaveLength(6);
    expect(html.match(/loading="lazy"/g)).toHaveLength(6);
    expect(html.match(/sizes="/g)).toHaveLength(6);
    for (const category of publishedCategories) expect(html).toContain(`learn-${category}.webp`);
    expect(html).not.toContain('rel="preload"');
  });

  it("preserves foundational reading, canonical and metadata", () => {
    for (const article of getFeaturedArticles()) {
      expect(html).toContain(`href="${getArticlePath(article)}"`);
      expect(html).toContain(escape(article.title));
      expect(html).toContain(escape(article.description));
      expect(html).toContain(article.readingTime);
    }
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(metadata.title).toBe("Learn Personal Finance | ArthaSiddhi");
    expect(metadata.description).toBe("Practical guides to personal finance, loans, investing, savings, tax and retirement in India.");
    expect(metadata.alternates?.canonical).toBe("https://arthasiddhi.com/learn");
  });
});
