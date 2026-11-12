import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/config/site";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/how-we-list/";
const title = `How ${site.name} Lists Tree Service Companies`;
const description =
  `${site.name} is a directory, not a tree service company. This page explains what a listing shows, how order works, how quote requests are routed, and how to request a correction.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PATH },
};

function pageUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const withLead = path.startsWith("/") ? path : `/${path}`;
  return `${base}${withLead.endsWith("/") ? withLead : `${withLead}/`}`;
}

export default function HowWeListPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: title,
            description,
            url: pageUrl(PATH),
            publisher: {
              "@type": "Organization",
              name: site.legalName,
              url: pageUrl("/"),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How we list companies", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: PATH, label: "How we list companies" },
        ]}
      />
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
        How TreeList lists tree service companies
      </h1>
      <p className="mt-4 leading-7">
        TreeList is a directory, not a tree service company. We don&apos;t
        employ crews, own equipment or do tree work.
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        What a listing shows
      </h2>
      <p className="mt-3 leading-7">
        Company name, the city and services it covers, and how to reach it.
        [Criteria TBD: e.g. state/municipal license or registration where one
        exists, proof of insurance, a working phone and website from the
        company&apos;s own source.]
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        How order works
      </h2>
      <p className="mt-3 leading-7">
        Standard listings are free. Featured and Exclusive spots are paid
        placements and are labeled on the page so you can tell they are ads.
        Featured sits above standard.
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        How quote requests work
      </h2>
      <p className="mt-3 leading-7">
        The form collects your name, phone, email, ZIP, service type and
        timing. TreeList sends it to a company that serves your ZIP.
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        What we won&apos;t do
      </h2>
      <p className="mt-3 leading-7">
        Invent company names, star ratings or city prices. Cost guidance on
        city pages is a published national range (Angi 2026), labeled as such.
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        Before you hire
      </h2>
      <p className="mt-3 leading-7">
        Ask for proof of insurance, a written estimate, who handles cleanup
        and haul-off, and whether a certified arborist will assess the tree.
      </p>

      <h2 className="mt-8 font-heading text-2xl font-semibold">Corrections</h2>
      <p className="mt-3 leading-7">
        Email{" "}
        <a href={`mailto:${site.email}`} className="underline">
          {site.email}
        </a>
        . [confirm]
      </p>

    </article>
  );
}
