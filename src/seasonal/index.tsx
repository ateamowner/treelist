import type { ReactNode } from "react";
import type { City, Service } from "@/config/site";
import type { Faq } from "@/lib/content";
import * as stormTreeInsurance202611 from "./storm-tree-insurance-2026-11";
import { seasonalRegistry } from "./registry";

/** A seasonal block: optional extra cost-guide lines, section, and FAQ edits. */
export type SeasonalBlock = {
  CostLines?: (props: { city: City }) => ReactNode;
  Section?: (props: { city: City }) => ReactNode;
  faqs?: (city: City, base: Faq[]) => Faq[];
};

const blocks: Record<string, SeasonalBlock> = {
  "storm-tree-insurance-2026-11": stormTreeInsurance202611,
};

function blockFor(city: City, service: Service): SeasonalBlock | undefined {
  const id = seasonalRegistry[`${city.slug}:${service.slug}`];
  return id ? blocks[id] : undefined;
}

/** FAQ list for the page (visible list and FAQPage JSON-LD use the same array). */
export function seasonalFaqs(city: City, service: Service, base: Faq[]): Faq[] {
  const block = blockFor(city, service);
  return block?.faqs ? block.faqs(city, base) : base;
}

/** Extra sourced lines rendered inside the cost guide, after its main line. */
export function SeasonalCostLines({ city, service }: { city: City; service: Service }) {
  const CostLines = blockFor(city, service)?.CostLines;
  return CostLines ? <CostLines city={city} /> : null;
}

export function SeasonalSection({ city, service }: { city: City; service: Service }) {
  const Section = blockFor(city, service)?.Section;
  return Section ? <Section city={city} /> : null;
}
