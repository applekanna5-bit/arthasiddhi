import type { MetadataRoute } from "next";
import { articles } from "./articles";
import { calculators } from "./calculators";
import { getArticlePath } from "./seo";
import { absoluteUrl } from "./site";
import { staticSitemapRoutes } from "./site-pages";

export function buildSitemap(): MetadataRoute.Sitemap {
  const categoryRoutes = [...new Set(articles.map((article) => `/learn/${article.category}`))];

  return [
    ...staticSitemapRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: path === "/learn" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : path === "/calculators" || path === "/learn" ? 0.9 : 0.7,
    })),
    ...Object.values(calculators).map((calculator) => ({
      url: absoluteUrl(calculator.href),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categoryRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(getArticlePath(article)),
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
