import Link from "next/link";
import {
  getNearbyCities,
  servicePath,
  services,
  type City,
  type Service,
} from "@/config/site";

export function NearbyCityLinks({
  city,
  serviceSlug = "tree-service",
}: {
  city: City;
  serviceSlug?: string;
}) {
  const nearby = getNearbyCities(city);
  if (nearby.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-semibold">Nearby cities</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each link is a real page with its own quote form.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {nearby.map((item) => (
          <li key={item.slug}>
            <Link
              href={servicePath(item, serviceSlug)}
              className="inline-flex min-h-10 items-center underline-offset-2 hover:underline"
            >
              Best Tree Service in {item.name} — {item.stateAbbr}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedServiceLinks({
  city,
  current,
}: {
  city: City;
  current?: Service;
}) {
  const related = services.filter((service) => service.slug !== current?.slug);

  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-semibold">
        Related services in {city.name}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {related.map((service) => (
          <li key={service.slug}>
            <Link
              href={servicePath(city, service)}
              className="inline-flex min-h-10 items-center underline-offset-2 hover:underline"
            >
              {service.name} in {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
