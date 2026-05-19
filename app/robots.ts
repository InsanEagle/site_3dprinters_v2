import type { MetadataRoute } from "next";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
  return configuredUrl.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/internal/", "/orders/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
