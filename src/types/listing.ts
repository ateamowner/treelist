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
};
