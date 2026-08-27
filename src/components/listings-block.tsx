import { site } from "@/config/site";
import type { Listing } from "@/types/listing";

const TIER_LABEL: Record<Listing["tier"], string> = {
  featured: "Featured — paid placement",
  exclusive: "Exclusive — paid placement",
  standard: "Listing",
};

export function ListingsBlock({ listings }: { listings: Listing[] }) {
  return (
    <section id="listings" className="mt-10">
      <h2 className="font-heading text-xl font-semibold sm:text-2xl">
        Listings on this URL
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {site.name} does not invent company names, phone numbers, or licenses.
        Featured and exclusive spots are paid and labeled.
      </p>

      {listings.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-6 text-base">
          No live listings on this URL yet. Use the form and we route the
          request.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {listings.map((listing) => (
            <li
              key={`${listing.tier}-${listing.name}`}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {listing.tier !== "standard" ? (
                  <span
                    className={
                      listing.tier === "featured"
                        ? "rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"
                        : "rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground"
                    }
                  >
                    {TIER_LABEL[listing.tier]}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {TIER_LABEL.standard}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-lg font-semibold">
                {listing.profile_url ? (
                  <a href={listing.profile_url} className="hover:underline">
                    {listing.name}
                  </a>
                ) : (
                  listing.name
                )}
              </h3>
              {listing.blurb ? (
                <p className="mt-1 text-sm text-muted-foreground">{listing.blurb}</p>
              ) : null}
              <dl className="mt-3 grid gap-1 text-sm">
                {listing.areas_served.length > 0 ? (
                  <div>
                    <dt className="inline font-medium">Areas served: </dt>
                    <dd className="inline">{listing.areas_served.join(", ")}</dd>
                  </div>
                ) : null}
                {listing.phone ? (
                  <div>
                    <dt className="inline font-medium">Phone: </dt>
                    <dd className="inline">
                      <a href={`tel:${listing.phone.replace(/\D/g, "")}`} className="underline">
                        {listing.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {listing.license_id ? (
                  <div>
                    <dt className="inline font-medium">License: </dt>
                    <dd className="inline">{listing.license_id}</dd>
                  </div>
                ) : null}
              </dl>
              {listing.name ? (
                <p className="mt-3">
                  <a
                    href={`#quote`}
                    className="text-sm font-medium underline-offset-2 hover:underline"
                  >
                    Request a quote and mention this listing
                  </a>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
