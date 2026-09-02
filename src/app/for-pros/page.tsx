import type { Metadata } from "next";
import Link from "next/link";
import { liveCitySlugs, servicePath, site } from "@/config/site";

export const metadata: Metadata = {
  title: `For tree companies — ${site.name}`,
  description: `How contractors buy ${site.name} listings and exclusive leads. Standard, featured, and exclusive. No credit card on this page.`,
  alternates: { canonical: "/for-pros/" },
};

export default function ForProsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        For tree companies
      </h1>
      <p className="mt-4 text-lg leading-8">
        {site.name} sells listings and exclusive lead routing on city × service
        URLs. Homeowners see a directory, not a fake contractor homepage. You
        are not buying a website. You are buying a labeled place on a page
        people already use to request a callback.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold">
        What you can buy
      </h2>
      <ul className="mt-4 space-y-4">
        <li className="rounded-lg border border-border bg-card p-4">
          <p className="font-semibold">Standard listing</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Name, areas served, phone, license ID, short blurb, and an optional
            profile URL. No star ratings. We will not invent a license number
            for you.
          </p>
        </li>
        <li className="rounded-lg border border-border bg-card p-4">
          <p className="font-semibold">Featured listing</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            A paid upgrade. It is visually labeled “Featured — paid placement”
            so homeowners can tell it is an ad. Featured sits above standard.
          </p>
        </li>
        <li className="rounded-lg border border-border bg-card p-4">
          <p className="font-semibold">Exclusive leads</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Category priority on one city × service URL (for example, Pittsburgh
            tree removal). Exclusive is labeled “Exclusive — paid placement.”
            Quote form traffic on that URL is routed to you first while the
            term is active.
          </p>
        </li>
      </ul>

      <h2 className="mt-10 font-heading text-2xl font-semibold">
        How leads work
      </h2>
      <p className="mt-3 leading-7">
        The form collects name, phone, email, ZIP, service type, timing, optional
        property type and message, SMS consent, and required privacy consent.
        Hidden fields carry page URL, city, state, service, listing id, gclid,
        and UTM tags. There is no credit-card field on {site.name}.
      </p>
      <p className="mt-3 leading-7">
        We persist every request. If a listing is live for that URL, we route
        to that company. If the URL is empty, we still take the request and
        hold or assign it — we do not invent a contractor to fill the gap.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold">Pricing</h2>
      <p className="mt-3 leading-7">
        City rates are not published on this page. Call or email and we will
        quote a market (live first: Pittsburgh, Milwaukee, Oklahoma City, Dayton, Omaha) and a
        term. Do not send card numbers to the homeowner form.
      </p>
      <p className="mt-3 leading-7">
        Phone:{" "}
        <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="underline">
          {site.phone}
        </a>
        . Email:{" "}
        <a href={`mailto:${site.email}`} className="underline">
          {site.email}
        </a>
        .
      </p>

      <h2 className="mt-10 font-heading text-2xl font-semibold">Live URLs</h2>
      <ul className="mt-3 space-y-2">
        {liveCitySlugs.map((slug) => (
          <li key={slug}>
            <Link
              href={servicePath(slug, "tree-service")}
              className="underline underline-offset-2"
            >
              {servicePath(slug, "tree-service")}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
