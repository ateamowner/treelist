import type { costGuideCopy } from "@/lib/content";

type Content = ReturnType<typeof costGuideCopy>;

export function CostGuide({ content }: { content: Content }) {
  return (
    <section id="cost" className="mt-10">
      <h2 className="font-heading text-xl font-semibold sm:text-2xl">
        {content.heading}
      </h2>
      <p className="mt-3 text-base leading-7">
        {content.paragraphs[0]}{" "}
        <cite className="not-italic">
          Source:{" "}
          <a
            href={content.citation.href}
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.citation.label}
          </a>
          .
        </cite>
      </p>
      {content.paragraphs.slice(1).map((paragraph) => (
        <p key={paragraph} className="mt-3 text-base leading-7">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
