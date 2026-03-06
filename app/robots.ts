import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account/", "/profile/", "/category/"],
    },
    sitemap: "https://www.algo-saju.com/sitemap.xml",
  };
}
