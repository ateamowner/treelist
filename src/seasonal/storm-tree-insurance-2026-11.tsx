import type { City } from "@/config/site";
import type { Faq } from "@/lib/content";

/**
 * Winter storm and fallen-tree block (emergency cost + insurance basics),
 * drafted 2026-11-15 by SEO & AEO Desk
 * (seo-tracking/refresh/2026-11-15/03-treelist-storm-tree-insurance.md).
 * National figures only. Every line keeps the source link from the draft.
 */

const src = {
  angi: {
    label: "Angi, Tree Removal Cost 2026",
    href: "https://www.angi.com/articles/how-much-does-tree-removal-cost.htm",
  },
  iii: {
    label: "Insurance Information Institute, If a tree falls on your house, are you covered?",
    href: "https://www-legacy.iii.org/article/if-a-tree-falls-on-your-house-are-you-covered",
  },
} as const;

function Cite({ label, href }: { label: string; href: string }) {
  return (
    <cite className="not-italic">
      Source:{" "}
      <a
        href={href}
        className="underline underline-offset-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        {label}
      </a>
      .
    </cite>
  );
}

export function CostLines() {
  return (
    <>
      <p className="mt-3 text-base leading-7">
        Emergency removal after a storm: demand spikes after storms and
        emergency removal can reach up to $5,000, depending on the
        circumstances. <Cite {...src.angi} />
      </p>
      <p className="mt-3 text-base leading-7">
        Tree already down (not on a structure): uprooted or fallen trees can
        cost as little as $300–$500 because the crew only cuts and hauls.{" "}
        <Cite {...src.angi} />
      </p>
    </>
  );
}

export function Section() {
  return (
    <section id="storm-tree-insurance" className="mt-10">
      <h2 className="font-heading text-xl font-semibold sm:text-2xl">
        Tree down after a storm: insurance and safety
      </h2>
      <p className="mt-3 text-base leading-7">
        <strong>Short answer:</strong> If a tree hits your house or another
        insured structure such as a detached garage, a standard homeowners
        policy generally covers the structure damage and pays for removing the
        tree, usually up to about $500–$1,000. If it falls in the yard without
        hitting anything insured, removal is generally not covered.
      </p>

      <h3 className="mt-6 font-heading text-lg font-semibold">
        What standard homeowners insurance usually covers{" "}
        <span className="font-normal">(Insurance Information Institute)</span>
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-7">
        <li>
          Damage to your home, other insured structures and contents when a
          tree falls on them, including trees felled by wind, lightning or
          hail.
        </li>
        <li>
          You can claim no matter whose tree it was; your insurer may seek
          repayment from a neighbor&apos;s insurer (subrogation).
        </li>
        <li>
          Tree removal when the tree hit an insured structure, generally up to
          about $500–$1,000 depending on insurer and policy.
        </li>
        <li>
          No debris-removal coverage, generally, if the tree hit nothing
          insured; some insurers pay if it blocks a driveway or a ramp for a
          person with a disability.
        </li>
        <li>Poor tree maintenance is not covered.</li>
      </ul>
      <p className="mt-3 text-base leading-7">
        <Cite {...src.iii} />
      </p>

      <h3 className="mt-6 font-heading text-lg font-semibold">
        Before anyone cuts
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-7">
        <li>
          Stay away from any tree touching a power line and call the electric
          utility.
        </li>
        <li>
          If the tree is on the house, take photos and call your insurer
          before removal; Angi notes the insurer may need to assess the damage
          before approving the claim. <Cite {...src.angi} />
        </li>
        <li>
          Ask the tree company for a written scope that separates &quot;get it
          off the roof&quot; from stump grinding and wood haul-away, so the
          insurer can see what the emergency part cost.
        </li>
      </ul>
      <p className="mt-3 text-base leading-7">
        TreeList is not an insurance company. Your policy&apos;s wording and
        limits decide what is covered.
      </p>
    </section>
  );
}

export function faqs(city: City, base: Faq[]): Faq[] {
  const added: Faq = {
    question: `Does homeowners insurance pay to remove a fallen tree in ${city.name}?`,
    answer:
      "Usually only if the tree hit your house or another insured structure. Then a standard policy generally covers removal up to about $500–$1,000 (Insurance Information Institute). If it fell in the yard and hit nothing insured, removal is generally not covered, though some insurers pay if it blocks a driveway or an accessibility ramp.",
  };
  const i = base.findIndex(
    (faq) => faq.question.startsWith("What does ") && faq.question.includes(" cost in ")
  );
  if (i < 0) return [...base, added];
  return [...base.slice(0, i + 1), added, ...base.slice(i + 1)];
}
