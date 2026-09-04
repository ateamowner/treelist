/**
 * TreeList site config — rename the brand, domain, phone, cities, and
 * services here. Theme tokens live alongside so a rebrand is one file.
 */

export const site = {
  name: "TreeList",
  legalName: "TreeList",
  domain: "treelist.ai",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://treelist.ai",
  phone: "(555) 014-8733",
  email: "hello@treelist.ai",
  leadsEmail: "treelist@agentmail.to",
  /** Native HTML POST to Web3Forms (notifies LEADS_EMAIL). No fetch/XHR. */
  formAction: "https://api.web3forms.com/submit",
  formAccessKey: "c0e21cad-ae27-426a-85d1-275daa226af2",
  formRedirect: "https://treelist.ai/request-sent/",
  tagline: "A directory of tree service companies. Not a contractor.",
  year: 2026,
  description:
    "TreeList is a lead-generation directory for tree service. We publish a unique page per city, label paid placements, and route quote requests to local companies.",
  theme: {
    background: "#f3efe4",
    foreground: "#161914",
    card: "#fffdf6",
    primary: "#1b4332",
    primaryForeground: "#f6f3ea",
    muted: "#e4ddd0",
    mutedForeground: "#3d453c",
    accent: "#f0e2b8",
    accentForeground: "#3d2e0a",
    border: "#c4bba8",
    featured: "#8a5a10",
    ring: "#1b4332",
    exclusive: "#5c2d0e",
  },
} as const;

export type ListingTier = "standard" | "featured" | "exclusive";

export type CityStatus = "live" | "coming_soon";

export type City = {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  status: CityStatus;
  /** Nearby city slugs that should appear as real internal links. */
  nearbySlugs: string[];
  /** Parent live market, if this page is a suburb stub. */
  parentSlug?: string;
  /** Public geographic context used in copy. Not pricing. */
  setting: string;
};

export type Service = {
  slug: string;
  name: string;
  /** Value posted on the quote form `service_type` field. */
  formValue: string;
  blurb: string;
};

export const services: Service[] = [
  {
    slug: "tree-service",
    name: "Tree Service",
    formValue: "tree service",
    blurb: "General tree work: assessment, pruning, removal, and cleanup.",
  },
  {
    slug: "tree-removal",
    name: "Tree Removal",
    formValue: "tree removal",
    blurb: "Taking a tree down, including rigging, haul-off, and site cleanup.",
  },
  {
    slug: "stump-grinding",
    name: "Stump Grinding",
    formValue: "stump grinding",
    blurb: "Grinding a stump below grade after a tree is already down.",
  },
  {
    slug: "tree-trimming",
    name: "Tree Trimming",
    formValue: "tree trimming",
    blurb: "Pruning for clearance, shape, storm readiness, or deadwood.",
  },
  {
    slug: "emergency-tree-service",
    name: "Emergency Tree Service",
    formValue: "emergency",
    blurb: "Storm damage, a tree on a structure, or a tree blocking a road.",
  },
];

export const formServiceTypes = [
  { value: "tree service", label: "Tree service" },
  { value: "tree removal", label: "Tree removal" },
  { value: "stump grinding", label: "Stump grinding" },
  { value: "tree trimming", label: "Tree trimming" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
] as const;

export const formTimings = [
  { value: "emergency", label: "Emergency — need someone now" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "planning", label: "Planning — no rush" },
] as const;

export const formPropertyTypes = [
  { value: "", label: "Prefer not to say" },
  { value: "house", label: "House" },
  { value: "duplex", label: "Duplex / townhome" },
  { value: "apartment", label: "Apartment / condo" },
  { value: "commercial", label: "Commercial" },
  { value: "hoa", label: "HOA / common area" },
  { value: "vacant", label: "Vacant lot" },
  { value: "other", label: "Other" },
] as const;

export const cities: City[] = [
  {
    slug: "pittsburgh-pa",
    name: "Pittsburgh",
    state: "Pennsylvania",
    stateAbbr: "PA",
    status: "live",
    nearbySlugs: [
      "bethel-park-pa",
      "mt-lebanon-pa",
      "cranberry-pa",
      "monroeville-pa",
    ],
    setting:
      "Hills, tight lots, and mixed hardwoods (oak, maple, and street trees) shape most Pittsburgh jobs. Access, overhead lines, and ice-damaged limbs come up often.",
  },
  {
    slug: "milwaukee-wi",
    name: "Milwaukee",
    state: "Wisconsin",
    stateAbbr: "WI",
    status: "live",
    nearbySlugs: [
      "wauwatosa-wi",
      "brookfield-wi",
      "west-allis-wi",
      "waukesha-wi",
    ],
    setting:
      "Lake-effect wind, older neighborhoods, and a long ash-tree story after emerald ash borer all show up in Milwaukee work. Winter timing and alley access matter.",
  },
  {
    slug: "oklahoma-city-ok",
    name: "Oklahoma City",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "live",
    nearbySlugs: ["edmond-ok", "norman-ok", "moore-ok", "yukon-ok"],
    setting:
      "Ice storms, straight-line wind, and wider lots are typical in Oklahoma City. Post oak, cedar, and storm-split forks are common reasons people request a crew.",
  },
  {
    slug: "dayton-oh",
    name: "Dayton",
    state: "Ohio",
    stateAbbr: "OH",
    status: "live",
    nearbySlugs: [
      "kettering-oh",
      "beavercreek-oh",
      "huber-heights-oh",
      "springfield-oh",
      "fairborn-oh",
    ],
    setting:
      "The Miami Valley, older city lots, and ash-tree loss after emerald ash borer shape a lot of Dayton work. Ice, wind, and street-tree clearance come up often.",
  },
  {
    slug: "omaha-ne",
    name: "Omaha",
    state: "Nebraska",
    stateAbbr: "NE",
    status: "live",
    nearbySlugs: [],
    setting:
      "The Missouri River and the Council Bluffs side of the metro, ice storms, and ash-tree loss after emerald ash borer shape a lot of Omaha work. City of Omaha Parks street trees, older Dundee and Benson lots, and newer west Omaha subdivisions come up often.",
  },
  {
    slug: "columbia-sc",
    name: "Columbia",
    state: "South Carolina",
    stateAbbr: "SC",
    status: "live",
    nearbySlugs: [],
    setting:
      "The Congaree and Broad River confluence, Midlands heat and humidity, ice storms, and tropical remnants shape a lot of Columbia, South Carolina work. Loblolly pine and live oak, older Shandon and Forest Acres lots, and the northeast corridor come up often.",
  },
  {
    slug: "kettering-oh",
    name: "Kettering",
    state: "Ohio",
    stateAbbr: "OH",
    status: "coming_soon",
    parentSlug: "dayton-oh",
    nearbySlugs: [
      "dayton-oh",
      "beavercreek-oh",
      "huber-heights-oh",
      "springfield-oh",
      "fairborn-oh",
    ],
    setting:
      "A southern suburb of Dayton with residential streets and mature shade trees. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "beavercreek-oh",
    name: "Beavercreek",
    state: "Ohio",
    stateAbbr: "OH",
    status: "coming_soon",
    parentSlug: "dayton-oh",
    nearbySlugs: [
      "dayton-oh",
      "kettering-oh",
      "huber-heights-oh",
      "springfield-oh",
      "fairborn-oh",
    ],
    setting:
      "An eastern suburb of Dayton, near Wright-Patterson Air Force Base, with a mix of subdivisions and woodlots. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "huber-heights-oh",
    name: "Huber Heights",
    state: "Ohio",
    stateAbbr: "OH",
    status: "coming_soon",
    parentSlug: "dayton-oh",
    nearbySlugs: [
      "dayton-oh",
      "kettering-oh",
      "beavercreek-oh",
      "springfield-oh",
      "fairborn-oh",
    ],
    setting:
      "A northern suburb of Dayton with residential lots and street trees. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "springfield-oh",
    name: "Springfield",
    state: "Ohio",
    stateAbbr: "OH",
    status: "coming_soon",
    parentSlug: "dayton-oh",
    nearbySlugs: [
      "dayton-oh",
      "kettering-oh",
      "beavercreek-oh",
      "huber-heights-oh",
      "fairborn-oh",
    ],
    setting:
      "A city northeast of Dayton in Clark County. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "fairborn-oh",
    name: "Fairborn",
    state: "Ohio",
    stateAbbr: "OH",
    status: "coming_soon",
    parentSlug: "dayton-oh",
    nearbySlugs: [
      "dayton-oh",
      "kettering-oh",
      "beavercreek-oh",
      "huber-heights-oh",
      "springfield-oh",
    ],
    setting:
      "A Dayton-area city next to Wright-Patterson Air Force Base. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "bethel-park-pa",
    name: "Bethel Park",
    state: "Pennsylvania",
    stateAbbr: "PA",
    status: "coming_soon",
    parentSlug: "pittsburgh-pa",
    nearbySlugs: [
      "pittsburgh-pa",
      "mt-lebanon-pa",
      "cranberry-pa",
      "monroeville-pa",
    ],
    setting:
      "A South Hills suburb of Pittsburgh with residential streets and mature shade trees. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "mt-lebanon-pa",
    name: "Mt. Lebanon",
    state: "Pennsylvania",
    stateAbbr: "PA",
    status: "coming_soon",
    parentSlug: "pittsburgh-pa",
    nearbySlugs: [
      "pittsburgh-pa",
      "bethel-park-pa",
      "cranberry-pa",
      "monroeville-pa",
    ],
    setting:
      "A South Hills community next to Pittsburgh with older lots and canopy trees along residential streets. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "cranberry-pa",
    name: "Cranberry",
    state: "Pennsylvania",
    stateAbbr: "PA",
    status: "coming_soon",
    parentSlug: "pittsburgh-pa",
    nearbySlugs: [
      "pittsburgh-pa",
      "bethel-park-pa",
      "mt-lebanon-pa",
      "monroeville-pa",
    ],
    setting:
      "A northern suburb of Pittsburgh (Cranberry Township area) with newer subdivisions mixed with older woodlots. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "monroeville-pa",
    name: "Monroeville",
    state: "Pennsylvania",
    stateAbbr: "PA",
    status: "coming_soon",
    parentSlug: "pittsburgh-pa",
    nearbySlugs: [
      "pittsburgh-pa",
      "bethel-park-pa",
      "mt-lebanon-pa",
      "cranberry-pa",
    ],
    setting:
      "An eastern suburb of Pittsburgh with commercial corridors and residential streets. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "wauwatosa-wi",
    name: "Wauwatosa",
    state: "Wisconsin",
    stateAbbr: "WI",
    status: "coming_soon",
    parentSlug: "milwaukee-wi",
    nearbySlugs: [
      "milwaukee-wi",
      "brookfield-wi",
      "west-allis-wi",
      "waukesha-wi",
    ],
    setting:
      "A Milwaukee suburb with older residential streets and a dense canopy. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "brookfield-wi",
    name: "Brookfield",
    state: "Wisconsin",
    stateAbbr: "WI",
    status: "coming_soon",
    parentSlug: "milwaukee-wi",
    nearbySlugs: [
      "milwaukee-wi",
      "wauwatosa-wi",
      "west-allis-wi",
      "waukesha-wi",
    ],
    setting:
      "A western suburb of Milwaukee with larger lots and mixed hardwoods. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "west-allis-wi",
    name: "West Allis",
    state: "Wisconsin",
    stateAbbr: "WI",
    status: "coming_soon",
    parentSlug: "milwaukee-wi",
    nearbySlugs: [
      "milwaukee-wi",
      "wauwatosa-wi",
      "brookfield-wi",
      "waukesha-wi",
    ],
    setting:
      "A Milwaukee suburb with compact lots and older street trees. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "waukesha-wi",
    name: "Waukesha",
    state: "Wisconsin",
    stateAbbr: "WI",
    status: "coming_soon",
    parentSlug: "milwaukee-wi",
    nearbySlugs: [
      "milwaukee-wi",
      "wauwatosa-wi",
      "brookfield-wi",
      "west-allis-wi",
    ],
    setting:
      "A city west of Milwaukee with a mix of older neighborhoods and newer growth. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "edmond-ok",
    name: "Edmond",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "coming_soon",
    parentSlug: "oklahoma-city-ok",
    nearbySlugs: [
      "oklahoma-city-ok",
      "norman-ok",
      "moore-ok",
      "yukon-ok",
    ],
    setting:
      "A northern suburb of Oklahoma City with residential streets and ice-storm exposure. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "norman-ok",
    name: "Norman",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "coming_soon",
    parentSlug: "oklahoma-city-ok",
    nearbySlugs: [
      "oklahoma-city-ok",
      "edmond-ok",
      "moore-ok",
      "yukon-ok",
    ],
    setting:
      "South of Oklahoma City, with a campus area and residential neighborhoods. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "moore-ok",
    name: "Moore",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "coming_soon",
    parentSlug: "oklahoma-city-ok",
    nearbySlugs: [
      "oklahoma-city-ok",
      "edmond-ok",
      "norman-ok",
      "yukon-ok",
    ],
    setting:
      "A southern suburb of Oklahoma City. Wind events are a recurring reason people look for tree crews. This URL is open so nearby-city links resolve.",
  },
  {
    slug: "yukon-ok",
    name: "Yukon",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "coming_soon",
    parentSlug: "oklahoma-city-ok",
    nearbySlugs: [
      "oklahoma-city-ok",
      "edmond-ok",
      "norman-ok",
      "moore-ok",
    ],
    setting:
      "A western suburb of Oklahoma City with residential lots and open wind fetch. This URL is open so nearby-city links resolve.",
  },
];

export const liveCitySlugs = cities
  .filter((city) => city.status === "live")
  .map((city) => city.slug);

export function getCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getNearbyCities(city: City): City[] {
  return city.nearbySlugs
    .map((slug) => getCity(slug))
    .filter((item): item is City => Boolean(item));
}

export function getParentCity(city: City): City | undefined {
  return city.parentSlug ? getCity(city.parentSlug) : undefined;
}

export function cityPath(city: City | string): string {
  const slug = typeof city === "string" ? city : city.slug;
  return `/${slug}`;
}

export function servicePath(city: City | string, service: Service | string): string {
  const citySlug = typeof city === "string" ? city : city.slug;
  const serviceSlug = typeof service === "string" ? service : service.slug;
  return `/${citySlug}/${serviceSlug}`;
}

export function lockedH1(service: Service, city: City): string {
  return `Best ${service.name} in ${city.name} — ${site.year}`;
}

/** Title tag matches the H1 when it fits in 60 characters. */
export function pageTitle(service: Service, city: City): string {
  const locked = lockedH1(service, city);
  if (locked.length <= 60) return locked;
  const withoutYear = `Best ${service.name} in ${city.name}`;
  if (withoutYear.length <= 60) return withoutYear;
  return `${service.name} in ${city.name} — ${site.year}`;
}

export const costGuide = {
  line: "Tree removal typically $200–$2,000+, average about $750.",
  sourceName: "Angi 2026",
  sourceUrl: "https://www.angi.com/articles/how-much-does-tree-removal-cost.htm",
  disclaimer:
    "This is a national published range, not a city-specific survey. TreeList does not invent city-specific dollar amounts.",
} as const;
