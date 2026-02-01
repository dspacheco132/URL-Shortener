import { MetadataRoute } from "next";

const SITE_URL = process.env.FRONTEND_URL ?? "https://lnk.diogopacheco.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
