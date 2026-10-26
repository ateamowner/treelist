import type { ListingTier } from "@/config/site";

export type Listing = {
  name: string;
  areas_served: string[];
  phone: string;
  license_id: string;
  blurb: string;
  tier: ListingTier;
  profile_url: string;
  city_slug: string;
  service_slug: string;
  /** Services the company's own site or BBB profile lists. Omitted when not cited. */
  services?: string[];
  /** true only when the company's site or BBB says it offers emergency / 24-hour work. Omitted otherwise. */
  emergency?: boolean;
  /** Year the company's site or BBB profile says it started. Omitted when not cited or when sources disagree. */
  in_business_since?: number;
  /** BBB profile verified to be this exact company (name + phone or address match). No rating is shown. */
  bbb_url?: string;
  /** ISO date (YYYY-MM-DD) we last checked this listing against its sources. */
  last_verified?: string;
  /** Source URL per added field (services, emergency, areas_served, in_business_since). */
  field_sources?: Record<string, string>;
};
