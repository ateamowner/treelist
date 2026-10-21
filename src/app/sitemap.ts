import type { MetadataRoute } from "next";
import { cities, cityPath, servicePath, services, site } from "@/config/site";

import {
  cityPageLastmod,
  homePageLastmod,
  servicePageLastmod,
  staticPageLastmod,
} from "@/lib/lastmod";

export const dynamic = "force-static";

/** GitHub Pages 301s no-slash URLs; locs must match trailing-slash canonicals. */
function loc(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const withLead = path.startsWith("/") ? path : `/${path}`;
  return `${base}${withLead.endsWith("/") ? withLead : `${withLead}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/privacy/", "/for-pros/"].map((path) => ({
    url: loc(path),
    lastModified:
      path === "/"
        ? homePageLastmod()
        : staticPageLastmod(`src/app${path}page.tsx`),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.4,
  }));

  const cityRoutes = cities.flatMap((city) => [
    {
      url: loc(cityPath(city)),
      lastModified: cityPageLastmod(
        city.slug,
        services.map((service) => service.slug)
      ),
      changeFrequency: "weekly" as const,
      priority: city.status === "live" ? 0.8 : 0.4,
    },
    ...services.map((service) => ({
      url: loc(servicePath(city, service)),
      lastModified: servicePageLastmod(city.slug, service.slug),
      changeFrequency: "weekly" as const,
      priority:
        city.status === "live" && service.slug === "tree-service" ? 0.9 : 0.5,
    })),
  ]);

  return [...staticRoutes, ...cityRoutes];
}
