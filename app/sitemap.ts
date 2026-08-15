import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { getArticlePath } from "@/lib/content/seo";
import { absoluteUrl } from "@/lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap { return [{ url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 }, { url: absoluteUrl("/calculators"), changeFrequency: "monthly", priority: 0.9 }, { url: absoluteUrl("/learn"), changeFrequency: "weekly", priority: 0.9 }, ...articles.map((article) => ({ url: absoluteUrl(`/learn/${article.category}`), lastModified: article.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })), ...articles.map((article) => ({ url: absoluteUrl(getArticlePath(article)), lastModified: article.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }))]; }
