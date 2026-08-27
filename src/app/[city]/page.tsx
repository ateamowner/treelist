import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { NearbyCityLinks } from "@/components/internal-links";
import { JsonLd } from "@/components/json-ld";
import { QuoteFormLoader } from "@/components/quote-form-loader";
import {
  cities,
  getCity,
  getParentCity,
  getService,
  servicePath,
  services,
  site,
} from "@/config/site";
import { hubFaqs } from "@/lib/content";
import {
  faqPageSchema,
  hubBreadcrumbs,
  publisherLocalBusiness,
} from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};

  const title = `Tree service in ${city.name}, ${city.stateAbbr}`;
  const description = `${site.name} directory hub for ${city.name}. Open tree service, removal, trimming, stump grinding, and emergency pages. Not a contractor.`;
  return {
    title,
    description,
    alternates: { canonical: `/${city.slug}` },
  };
}

export default async function CityHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const treeService = getService("tree-service");
  const parent = getParentCity(city);
  const questions = hubFaqs(city);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={[
          publisherLocalBusiness(city),
          faqPageSchema(questions),
          hubBreadcrumbs(city),
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/${city.slug}`, label: `${city.name}, ${city.stateAbbr}` },
        ]}
      />

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="text-sm font-medium text-primary">
            {city.state}
            {city.status === "coming_soon" ? " · Coming soon" : null}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Tree service in {city.name}, {city.stateAbbr}
          </h1>
          {city.status === "coming_soon" ? (
            <p className="mt-4 text-base leading-7">
              The {city.name} hub is coming soon. {site.name} opened this URL so
              nearby-city links stay valid. You can still request a quote.{" "}
              {parent ? (
                <>
                  The live market page is{" "}
                  <Link href={`/${parent.slug}`} className="underline underline-offset-2">
                    {parent.name}
                  </Link>
                  .
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-4 text-base leading-7">
              This is the {city.name} index on {site.name} — a directory, not a
              contractor website. Open a service page for listings (when we have
              them) and a quote form. Featured spots are paid and labeled.
            </p>
          )}
          <p className="mt-3 text-base leading-7">{city.setting}</p>

          <h2 className="mt-8 font-heading text-xl font-semibold">
            Services in {city.name}
          </h2>
          <ul className="mt-3 grid gap-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={servicePath(city, service)}
                  className="block rounded-lg border border-border bg-card px-4 py-3 hover:border-primary"
                >
                  <span className="font-medium">
                    Best {service.name} in {city.name} — {site.year}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {service.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <FaqList faqs={questions} />
          <NearbyCityLinks city={city} />
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {treeService ? (
            <QuoteFormLoader city={city} service={treeService} />
          ) : null}
        </aside>
      </div>
    </article>
  );
}
