import listingsFile from "../../data/listings.json";
import type { City, Service } from "@/config/site";
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

/** Every valid listing row across all cities and services (for homepage counts). */
export function getAllListings(): Listing[] {
  const rows = Array.isArray(listingsData) ? listingsData : [];
  return rows.filter(isListing);
}

/**
 * Thin-page rule (2026-10-26): a city/service page with fewer than this many
 * verified listings is noindex and left out of the sitemap.
 */
export const MIN_INDEXABLE_LISTINGS = 3;

export function isServicePageIndexable(city: City, service: Service | string): boolean {
  const slug = typeof service === "string" ? service : service.slug;
  return getListings(city.slug, slug).length >= MIN_INDEXABLE_LISTINGS;
}

/** A city hub is indexable only when its main tree-service page is. */
export function isHubIndexable(city: City): boolean {
  return isServicePageIndexable(city, "tree-service");
}

/** Newest last_verified date across these listings (real verify dates only, never the build time). */
export function newestVerifiedDate(listings: Listing[]): string | undefined {
  const dates = listings
    .map((listing) => listing.last_verified)
    .filter((d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  return dates.length ? dates[dates.length - 1] : undefined;
}

/** "2026-10-26" -> "October 26, 2026" (UTC, so the date never shifts). */
export function formatVerifiedDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
