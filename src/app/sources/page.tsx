import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/config/site";
import { shareMeta } from "@/lib/share-meta";

const PATH = "/sources/";
const title = `Sources, ${site.name}`;
const description =
  "Named sources TreeList cites for national tree-removal cost ranges and homeowners insurance basics. We do not invent city-specific prices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PATH },
  ...shareMeta(title, description, PATH),
};

const sources = [
  {
    name: "Angi, Tree Removal Cost 2026",
    href: "https://www.angi.com/articles/how-much-does-tree-removal-cost.htm",
    usedFor:
      "National tree-removal range already cited in the cost guide, plus emergency storm-removal and already-down tree figures, and the note to call the insurer before removing a tree from a house.",
  },
  {
    name: "Insurance Information Institute, If a tree falls on your house, are you covered?",
    href: "https://www-legacy.iii.org/article/if-a-tree-falls-on-your-house-are-you-covered",
    usedFor:
      "Standard homeowners insurance basics for fallen trees, including the typical $500–$1,000 removal limit when a tree hits an insured structure.",
  },
];

export default function SourcesPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: PATH, label: "Sources" },
        ]}
      />
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
        Sources
      </h1>
      <p className="mt-4 text-base leading-7">
        {site.name} cites national published ranges and official guidance. We
        do not invent city-specific prices or star ratings. If a page is wrong,
        email{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-2">
          {site.email}
        </a>
        .
      </p>
      <ul className="mt-8 space-y-4">
        {sources.map((source) => (
          <li
            key={source.href + source.name}
            className="rounded-md border border-border bg-card p-5"
          >
            <a
              href={source.href}
              className="font-medium underline underline-offset-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              {source.name}
            </a>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {source.usedFor}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
