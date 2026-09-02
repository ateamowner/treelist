import {
  costGuide,
  getNearbyCities,
  getParentCity,
  lockedH1,
  site,
  type City,
  type Service,
} from "@/config/site";

export type Faq = { question: string; answer: string };

export function introParagraphs(city: City, service: Service): string[] {
  const comingSoon =
    city.status === "coming_soon"
      ? `${city.name} is coming soon as a full ${site.name} market. This URL is live so nearby-city links do not 404. You can still send the quote form; we route the request to a company that covers this ZIP when one is available.`
      : null;

  const directory =
    `${site.name} is a directory of tree service companies — not one shop and not a contractor website. Featured and exclusive spots on this page are paid placements and are labeled as such. If the listings block is empty, use the form anyway. We route the request.`;

  const serviceLine = serviceIntro(city, service);

  if (comingSoon) {
    return [comingSoon, directory, serviceLine];
  }

  return [
    `This page is ${site.name}'s ${city.name}, ${city.stateAbbr} listing for ${service.name.toLowerCase()}. ${directory}`,
    serviceLine,
    city.setting,
  ];
}

function serviceIntro(city: City, service: Service): string {
  const shared = sharedServiceIntro(city, service);
  const omaha = omahaServiceNote(city, service);
  return omaha ? `${shared} ${omaha}` : shared;
}

function sharedServiceIntro(city: City, service: Service): string {
  switch (service.slug) {
    case "tree-service":
      return `${city.name} homeowners use this URL to request a callback from a local tree company — assessment, pruning, removal, or cleanup — without calling a random truck from a search ad. ${site.name} does not send a crew of its own.`;
    case "tree-removal":
      return `Use this ${city.name} page when a tree needs to come down: dead, leaning, too close to a roof, or in the way of a project. Ask for a written scope that covers rigging, haul-off, and whether the stump is included.`;
    case "stump-grinding":
      return `This ${city.name} page is for grinding a stump after the tree is already down. Stump grinding is a different visit than takedown. Ask how far below grade they grind and whether they haul chips.`;
    case "tree-trimming":
      return `This ${city.name} page is for pruning — clearance over a roof or walk, deadwood, or thinning a crown before storm season. A written scope should say what comes off and what stays.`;
    case "emergency-tree-service":
      return `Use this ${city.name} page for storm damage, a tree on a structure, or a tree blocking a driveway or street. Say so on the form. Emergency work is priced and scheduled differently than a planned removal.`;
    default:
      return service.blurb;
  }
}

/** Geographic context only. No contractors, ratings, or local prices. */
function omahaServiceNote(city: City, service: Service): string | null {
  if (city.slug !== "omaha-ne") return null;
  switch (service.slug) {
    case "tree-service":
      return `Work here sits on the Missouri River metro — including the Council Bluffs side — with City of Omaha Parks street trees, older Dundee and Benson lots, and newer west Omaha yards.`;
    case "tree-removal":
      return `Omaha takedowns often follow ice-storm splits or ash decline after emerald ash borer. Tight Dundee and Benson lots are a different access problem than a west Omaha subdivision.`;
    case "stump-grinding":
      return `After an ash or ice-storm removal in Omaha, the stump is still a second visit — whether the lot is an older Dundee or Benson parcel or a newer west Omaha yard.`;
    case "tree-trimming":
      return `In Omaha that often means clearance around City of Omaha Parks street trees, ice-loaded limbs, or a mature canopy on a Dundee or Benson lot versus a newer west Omaha street.`;
    case "emergency-tree-service":
      return `Omaha ice storms and wind along the Missouri River corridor are the usual reason someone needs a crew the same day. Say if a tree is on a house, a street, or a City of Omaha Parks planting.`;
    default:
      return null;
  }
}

export function howToChoose(city: City, service: Service): {
  lead: string;
  items: { title: string; body: string }[];
} {
  return {
    lead: `How to choose a ${service.name.toLowerCase()} company in ${city.name} — the same checks apply whether you found a listing here or a truck on the street.`,
    items: [
      {
        title: "License",
        body: `Ask for the license or registration the company uses to work in ${city.state}. Write down the number. ${site.name} does not invent license IDs on this page.`,
      },
      {
        title: "Local jobs",
        body: `Ask for recent addresses in ${city.name} or the surrounding towns — not a generic photo set. Local access (hills, alleys, overhead lines) changes the job.`,
      },
      {
        title: "Written scope",
        body: `Get the work in writing: what comes down, what stays, who hauls wood, whether the stump is included, and how they protect the roof, fence, and lawn.`,
      },
      {
        title: "Reviews with addresses",
        body: `Prefer reviews that mention a street or neighborhood in ${city.name}. Star averages with no job location are easy to fake. ${site.name} does not publish star ratings or review counts.`,
      },
      {
        title: "Who shows up",
        body: `Ask who is on site: employees or subcontractors, how many people, and who is the decision-maker if the plan changes mid-job.`,
      },
      {
        title: "Warranty",
        body: `Ask what is warranted (cleanup, turf, a missed hanger) and for how long. “We stand behind our work” is not a warranty.`,
      },
      {
        title: "Emergency vs planned",
        body: `${service.slug === "emergency-tree-service" ? "If a tree is on a house or blocking a road, say that first." : "If this is not an emergency, say so."} Storm work and planned ${service.name.toLowerCase()} are different queues. Do not let a salesperson treat a Saturday trim like a rescue.`,
      },
    ],
  };
}

export function costGuideCopy(city: City): {
  heading: string;
  paragraphs: string[];
  citation: { label: string; href: string };
} {
  return {
    heading: `Cost guide (national range, not a ${city.name} survey)`,
    paragraphs: [
      costGuide.line,
      costGuide.disclaimer,
      `Height, access, species, power lines, and disposal change the number. A written scope from a company that will actually stand on your lot is the only local price that matters.`,
    ],
    citation: { label: costGuide.sourceName, href: costGuide.sourceUrl },
  };
}

export function faqs(city: City, service: Service): Faq[] {
  const parent = getParentCity(city);
  const nearby = getNearbyCities(city);
  const nearbyNames = nearby.map((item) => item.name);

  return [
    {
      question: `Is ${site.name} a ${service.name.toLowerCase()} company in ${city.name}?`,
      answer: `No. ${site.name} is a directory and lead-routing site. We do not cut trees, grind stumps, or send a truck. Companies can buy a listing on this URL. Featured and exclusive spots are paid and labeled.`,
    },
    {
      question: `Why are some listings marked Featured or Exclusive?`,
      answer: `Those are paid placements. A featured spot is a paid, labeled upgrade. An exclusive spot means a company bought category priority on this URL. Standard listings, when we have them, are not marked as paid upgrades. We do not invent companies to fill empty slots.`,
    },
    {
      question: `What does ${service.name.toLowerCase()} cost in ${city.name}?`,
      answer: `${site.name} does not publish a ${city.name}-specific price. The only dollar range we cite is the national published range for tree removal: typically $200–$2,000+, average about $750 (${costGuide.sourceName}). Your job may be outside that range. Use the form and ask the company for a written number.`,
    },
    {
      question:
        city.status === "coming_soon"
          ? `This ${city.name} page says coming soon. Can I still request a quote?`
          : `What happens after I submit the form on this ${city.name} page?`,
      answer:
        city.status === "coming_soon"
          ? `Yes. ${city.name} is a stub so links from ${parent ? parent.name : "nearby cities"} keep working. Submit the form. We route it to a company that covers your ZIP when one is available. You should get a phone call, not a ${site.name} crew.`
          : `We store the request and route it to a company that covers your ZIP and service type. Expect a phone call from a local company — not from a ${site.name} climber. If no company is live on this URL yet, we still take the request.`,
    },
    {
      question:
        nearbyNames.length > 0
          ? `Do you cover ${nearbyNames[0]} and other towns near ${city.name}?`
          : `Which towns near ${city.name} have their own ${site.name} pages?`,
      answer:
        nearbyNames.length > 0
          ? `Yes — we keep a separate URL for nearby cities so you can open a real page instead of a comma list. From ${city.name} that includes ${joinAnd(nearbyNames)}. Each of those pages has its own quote form.`
          : `We publish one URL per city. If you do not see your town, send the form with your ZIP and we will route it.`,
    },
  ];
}

export function hubFaqs(city: City): Faq[] {
  return [
    {
      question: `What is the ${city.name} ${site.name} hub?`,
      answer: `This is the city index — not a contractor homepage. From here you can open ${city.name} pages for tree service, tree removal, stump grinding, tree trimming, and emergency tree service.`,
    },
    {
      question: `Does ${site.name} work on trees in ${city.name}?`,
      answer: `No. ${site.name} publishes directory pages and routes quote requests. A local company calls you.`,
    },
    {
      question: `Are featured listings ads?`,
      answer: `Featured and exclusive spots are paid placements and are labeled on the service pages. We do not invent company names to fill a page.`,
    },
    {
      question: `Where is the quote form?`,
      answer: `On this hub and on every ${city.name} service page. Same fields. We need a name, phone, email, ZIP, service type, timing, and your agreement to the privacy policy.`,
    },
    {
      question: `How do contractors get on this ${city.name} page?`,
      answer: `See the For Pros page. Companies can buy a standard listing, a labeled featured spot, or exclusive leads for a city and service. There is no credit-card form on this site.`,
    },
  ];
}

export function metaDescription(city: City, service: Service): string {
  if (city.status === "coming_soon") {
    return `${lockedH1(service, city)}. ${site.name} directory page (coming soon). Request a quote and we route it. Not a contractor.`;
  }
  return `${lockedH1(service, city)}. Compare listed companies, read a national cost range, and request a callback. ${site.name} is a directory, not a tree shop.`;
}

function joinAnd(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
