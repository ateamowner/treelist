import type { Metadata } from "next";
import Link from "next/link";
import { QuoteFormLoader } from "@/components/quote-form-loader";
import {
  cities,
  liveCitySlugs,
  servicePath,
  services,
  site,
} from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name} — tree service directory`,
  description: site.description,
  verification: {
    google: "vcnYdnF1KMLOxoxGk0uojn1SIPKQfuevoOKTrtdVg40",
  },
};

export default function HomePage() {
  const live = cities.filter((city) => liveCitySlugs.includes(city.slug));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="text-sm font-medium text-primary">{site.tagline}</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find tree service by city. Request a quote. Skip the fake shop page.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8">
            {site.name} is a lead-generation directory for tree service
            companies. We are not a contractor. We do not own a chipper, and we
            do not invent company names, star ratings, or city-specific prices.
            Each city has its own URL. Featured spots are paid and labeled.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Homeowners use the form. Companies buy a listing or exclusive leads
            on the{" "}
            <Link href="/for-pros" className="underline underline-offset-2">
              For Pros
            </Link>{" "}
            page. Until a listing goes live on a URL, we still take the request
            and route it.
          </p>
        </div>
        <QuoteFormLoader />
      </section>

      <section id="cities" className="mt-14">
        <h2 className="font-heading text-2xl font-semibold">Live cities</h2>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Live markets first. Nearby-city pages exist so internal links do not
          404.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {live.map((city) => (
            <li
              key={city.slug}
              className="flex flex-col rounded-lg border border-border bg-card p-5"
            >
              <h3 className="font-heading text-xl font-semibold">
                {city.name}, {city.stateAbbr}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {city.setting}
              </p>
              <p className="mt-4">
                <Link
                  href={servicePath(city, "tree-service")}
                  className="font-medium underline underline-offset-2"
                >
                  Best Tree Service in {city.name} — {site.year}
                </Link>
              </p>
              <p className="mt-2">
                <Link href={`/${city.slug}`} className="text-sm hover:underline">
                  All {city.name} services
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold">
          What is on a city page
        </h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "A locked H1: Best {Service} in {City} — 2026",
            "A disclosure that this is a directory and paid spots are labeled",
            "How to choose: license, local jobs, written scope, reviews with addresses, who shows up, warranty, emergency vs planned",
            "A national cost range cited to Angi — not a local survey",
            "Five FAQs that match the on-page questions in schema",
            "Listings from a data file, or an empty state with the quote form",
          ].map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm leading-6"
            >
              {item}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-semibold">Services we index</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.slug}>
              <span className="font-medium">{service.name}.</span>{" "}
              <span className="text-muted-foreground">{service.blurb}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
