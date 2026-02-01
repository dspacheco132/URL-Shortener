import { MetadataRoute } from "next";

const SITE_URL = process.env.FRONTEND_URL ?? "https://lnk.diogopacheco.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
