import type { MetadataRoute } from "next";

// This is a private, single-recipient site — never index it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
