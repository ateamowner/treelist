import { QuoteForm } from "@/components/quote-form";
import type { City, Service } from "@/config/site";

export function QuoteFormLoader(props: {
  city?: City;
  service?: Service;
  listingId?: string;
  compact?: boolean;
}) {
  return <QuoteForm {...props} />;
}
