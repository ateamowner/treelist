import { lockedH1, site, type City, type Service } from "@/config/site";
import type { Faq } from "@/lib/content";

export function publisherLocalBusiness(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName,
    alternateName: site.name,
    description: `${site.name} is a directory that publishes city pages for tree service and routes quote requests to listed companies. ${site.name} is not a tree contractor and does not perform field work.`,
    url: site.url,
    telephone: site.phone,
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
    { name: `${city.name}, ${city.stateAbbr}`, path: `/${city.slug}` },
    { name: service.name, path: `/${city.slug}/${service.slug}` },
  ]);
}

export function hubBreadcrumbs(city: City) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `${city.name}, ${city.stateAbbr}`, path: `/${city.slug}` },
  ]);
}

export function servicePageHeadline(city: City, service: Service) {
  return lockedH1(service, city);
}
