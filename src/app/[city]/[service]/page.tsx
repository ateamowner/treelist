import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CostGuide } from "@/components/cost-guide";
import { FaqList } from "@/components/faq-list";
import { HowToChoose } from "@/components/how-to-choose";
import { NearbyCityLinks, RelatedServiceLinks } from "@/components/internal-links";
import { JsonLd } from "@/components/json-ld";
import { ListingsBlock } from "@/components/listings-block";
import { QuoteFormLoader } from "@/components/quote-form-loader";
import {
  cities,
  getCity,
  getService,
  lockedH1,
  pageTitle,
  services,
  site,
} from "@/config/site";
import {
  costGuideCopy,
  faqs,
  howToChoose,
  introParagraphs,
  metaDescription,
} from "@/lib/content";
import { getListings } from "@/lib/listings";
import {
  faqPageSchema,
  publisherLocalBusiness,
  servicePageBreadcrumbs,
} from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.flatMap((city) =>
    services.map((service) => ({
      city: city.slug,
      service: service.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const service = getService(serviceSlug);
  if (!city || !service) return {};

  const title = pageTitle(service, city);
  const description = metaDescription(city, service);
  return {
    title,
    description,
    alternates: { canonical: `/${city.slug}/${service.slug}/` },
    openGraph: {
      title,
      description,
      url: `/${city.slug}/${service.slug}`,
      siteName: site.name,
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const service = getService(serviceSlug);
  if (!city || !service) notFound();

  const heading = lockedH1(service, city);
  const intro = introParagraphs(city, service);
  const choose = howToChoose(city, service);
  const cost = costGuideCopy(city);
  const questions = faqs(city, service);
  const listings = getListings(city.slug, service.slug);
  const isStub = city.status === "coming_soon" || service.slug !== "tree-service";

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={[
          publisherLocalBusiness(city),
          faqPageSchema(questions),
          servicePageBreadcrumbs(city, service),
        ]}
      />

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/${city.slug}`, label: `${city.name}, ${city.stateAbbr}` },
          { href: `/${city.slug}/${service.slug}`, label: service.name },
        ]}
      />

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr]">
        <header className="lg:col-start-1">
          <p className="text-sm font-medium text-primary">
            {city.name}, {city.stateAbbr}
            {city.status === "coming_soon" ? " · Coming soon" : null}
            {isStub && city.status === "live" && service.slug !== "tree-service"
              ? " · Related service"
              : null}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-3 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm">
            {site.name} is a directory, not one shop. Featured spots are paid
            and labeled.
          </p>
          {intro.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-7">
              {paragraph}
            </p>
          ))}
        </header>

        <aside className="lg:col-start-2 lg:row-span-2 lg:self-start lg:sticky lg:top-6">
          <QuoteFormLoader city={city} service={service} />
        </aside>

        <div className="lg:col-start-1">
          <HowToChoose content={choose} />
          <CostGuide content={cost} />
          <FaqList faqs={questions} />
          <ListingsBlock listings={listings} />
          <RelatedServiceLinks city={city} current={service} />
          <NearbyCityLinks city={city} />
        </div>
      </div>
    </article>
  );
}
