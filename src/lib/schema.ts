import {
  cityPath,
  lockedH1,
  servicePath,
  site,
  type City,
  type Service,
} from "@/config/site";
import type { Faq } from "@/lib/content";
import type { Listing } from "@/types/listing";

function siteOrigin() {
  return site.url.replace(/\/$/, "");
}

export function organizationId() {
  return `${siteOrigin()}/#organization`;
}

/**
 * City/service publisher. Organization, not LocalBusiness: TreeList is a
 * directory, not a tree company in this city (audit D5, 2026-10-16).
 * No invented address, phone, or ratings.
 */
export function publisherOrganization(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: site.legalName,
    alternateName: site.name,
    description: `${site.name} is a directory that publishes city pages for tree service and routes quote requests to listed companies. ${site.name} is not a tree contractor and does not perform field work.`,
    url: `${siteOrigin()}/`,
    email: site.email,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "State",
        name: city.state,
      },
    },
    knowsAbout: "Tree service directory",
  };
}

/** ItemList of real listed tree companies only. Empty list → no schema. Never AggregateRating. */
export function listingsItemListSchema(
  city: City,
  service: Service,
  listings: Listing[]
) {
  if (!listings.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${service.name} companies in ${city.name}, ${city.stateAbbr}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: listing.name,
        telephone: listing.phone,
        description: listing.blurb,
        ...(listing.profile_url ? { url: listing.profile_url } : {}),
        ...(listing.license_id ? { identifier: listing.license_id } : {}),
        ...(listing.bbb_url ? { sameAs: [listing.bbb_url] } : {}),
        ...(listing.in_business_since
          ? { foundingDate: String(listing.in_business_since) }
          : {}),
        areaServed: listing.areas_served.map((area) => ({
          "@type": "City",
          name: area,
        })),
      },
    })),
  };
}

export function faqPageSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function breadcrumbItemUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const withLead = path.startsWith("/") ? path : `/${path}`;
  return `${base}${withLead.endsWith("/") ? withLead : `${withLead}/`}`;
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: breadcrumbItemUrl(item.path),
    })),
  };
}

export function servicePageBreadcrumbs(city: City, service: Service) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `${city.name}, ${city.stateAbbr}`, path: cityPath(city) },
    { name: service.name, path: servicePath(city, service) },
  ]);
}

export function hubBreadcrumbs(city: City) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `${city.name}, ${city.stateAbbr}`, path: cityPath(city) },
  ]);
}

export function servicePageHeadline(city: City, service: Service) {
  return lockedH1(service, city);
}

/** Homepage only. Directory publisher: no phone, address, reviews, or AggregateRating. */
export function homeOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: site.legalName,
    alternateName: site.name,
    url: `${siteOrigin()}/`,
    email: site.email,
    description: `${site.name} is a tree service directory. It publishes city pages and routes quote requests to listed companies. It is not a tree contractor. Paid placements are labeled.`,
  };
}

/** Homepage only. No SearchAction: the site has no site search. */
export function homeWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin()}/#website`,
    name: site.name,
    url: `${siteOrigin()}/`,
    description: site.description,
    publisher: { "@id": organizationId() },
  };
}

/** Homepage only. ItemList of live city tree-service pages (pages, not companies). */
export function liveCitiesItemListSchema(
  liveCities: City[],
  servicePathFor: (city: City) => string
) {
  if (!liveCities.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} live cities`,
    numberOfItems: liveCities.length,
    itemListElement: liveCities.map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Tree service in ${city.name}, ${city.stateAbbr}`,
      url: `${siteOrigin()}${servicePathFor(city)}`,
    })),
  };
}

/**
 * WebPage with dateModified taken from the newest listing verify date on the
 * page (never the build time). No date -> no dateModified.
 */
export function webPageSchema(
  path: string,
  name: string,
  dateModified?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${breadcrumbItemUrl(path)}#webpage`,
    url: breadcrumbItemUrl(path),
    name,
    isPartOf: { "@id": `${siteOrigin()}/#website` },
    publisher: { "@id": organizationId() },
    ...(dateModified ? { dateModified } : {}),
  };
}
