import type { Faq } from "@/lib/content";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" className="mt-10">
      <h2 className="font-heading text-xl font-semibold sm:text-2xl">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-3">
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {faq.question}
                <span aria-hidden="true" className="text-muted-foreground group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden text-muted-foreground group-open:inline">
                  −
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
