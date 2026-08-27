import Link from "next/link";
import { cities, liveCitySlugs, servicePath, site } from "@/config/site";

export function SiteFooter() {
  const live = cities.filter((city) => liveCitySlugs.includes(city.slug));

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {site.tagline} Featured spots are paid and labeled. We do not invent
            companies or city-specific prices.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Live cities</p>
          <ul className="mt-2 space-y-1 text-sm">
            {live.map((city) => (
              <li key={city.slug}>
                <Link
                  href={servicePath(city, "tree-service")}
                  className="underline-offset-2 hover:underline"
                >
                  {city.name}, {city.stateAbbr} tree service
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Site</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/for-pros" className="hover:underline">
                For tree companies
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="hover:underline">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {site.year} {site.legalName}. A directory, not a contractor.
      </div>
    </footer>
  );
}
