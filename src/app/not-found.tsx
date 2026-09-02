import Link from "next/link";
import { cities, liveCitySlugs, servicePath, site } from "@/config/site";

export default function NotFound() {
  const live = cities.filter((city) => liveCitySlugs.includes(city.slug));

  return (
    <article className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
      <title>{`Page not found | ${site.name}`}</title>
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        That URL is not in the directory
      </h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        {site.name} publishes one page per city and service. If you followed an
        old link, use a live city below or go home.
      </p>
      <ul className="mt-6 space-y-2">
        {live.map((city) => (
          <li key={city.slug}>
            <Link
              href={servicePath(city, "tree-service")}
              className="underline underline-offset-2"
            >
              Best Tree Service in {city.name} — {site.year}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Link href="/" className="font-medium underline underline-offset-2">
          Home
        </Link>
      </p>
    </article>
  );
}
