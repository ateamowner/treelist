import listingsFile from "../../data/listings.json";
import type { Listing } from "@/types/listing";

const TIER_ORDER = { exclusive: 0, featured: 1, standard: 2 } as const;
const listingsData = listingsFile as unknown as Listing[];

function isListing(value: unknown): value is Listing {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Listing>;
  return (
    typeof item.name === "string" &&
    Array.isArray(item.areas_served) &&
    typeof item.phone === "string" &&
    typeof item.license_id === "string" &&
    typeof item.blurb === "string" &&
    (item.tier === "standard" ||
      item.tier === "featured" ||
      item.tier === "exclusive") &&
    typeof item.profile_url === "string" &&
    typeof item.city_slug === "string" &&
    typeof item.service_slug === "string"
  );
}

export function getListings(citySlug: string, serviceSlug: string): Listing[] {
  const rows = Array.isArray(listingsData) ? listingsData : [];
  return rows
    .filter(isListing)
    .filter(
      (listing) =>
        listing.city_slug === citySlug && listing.service_slug === serviceSlug
    )
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
}
