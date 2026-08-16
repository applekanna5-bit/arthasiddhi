import type { MetadataRoute } from "next";
import { robotsSitemapUrl } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: robotsSitemapUrl }; }
