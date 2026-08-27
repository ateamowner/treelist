import type { howToChoose } from "@/lib/content";

type Content = ReturnType<typeof howToChoose>;

export function HowToChoose({ content }: { content: Content }) {
  return (
    <section id="how-to-choose" className="mt-10">
      <h2 className="font-heading text-xl font-semibold sm:text-2xl">
        How to choose
      </h2>
      <p className="mt-2 text-base leading-7">{content.lead}</p>
      <ol className="mt-4 space-y-4">
        {content.items.map((item, index) => (
          <li key={item.title} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold">
              {index + 1}. {item.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
