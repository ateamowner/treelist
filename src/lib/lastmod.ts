import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Real sitemap <lastmod> dates, computed from git history at build time.
 *
 * A page's lastmod is the newest of:
 *  - the shared page templates (components, lib, route files), and
 *  - the lines that only feed that page: its city block in src/config/site.ts,
 *    its "city:service" entry in src/lib/local-copy.ts, and its listings in
 *    data/listings.json (via `git blame`).
 *
 * So adding three listings to /dayton-oh/plumbing/ bumps only that page and
 * the Dayton hub, not all 100+ URLs. If git history is unavailable the date is
 * omitted rather than faked with the build time.
 *
 * actions/checkout makes a shallow clone, so the first call deepens it with
 * `git fetch --unshallow` (checkout leaves the token in place for this). If the
 * history is still shallow, dates are omitted because blame would only see the
 * newest commit.
 */

const root = process.cwd();

function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

let historyChecked = false;
let historyOk = false;

/** True once full git history is available (deepens a shallow CI clone). */
function haveHistory(): boolean {
  if (historyChecked) return historyOk;
  historyChecked = true;
  const shallow = git(["rev-parse", "--is-shallow-repository"])?.trim();
  if (shallow === undefined || shallow === null) return (historyOk = false);
  if (shallow === "true") {
    try {
      execFileSync("git", ["fetch", "--unshallow", "--quiet", "--no-tags"], {
        cwd: root,
        stdio: "ignore",
        timeout: 120_000,
      });
    } catch {
      // fall through to the re-check below
    }
  }
  historyOk = git(["rev-parse", "--is-shallow-repository"])?.trim() === "false";
  return historyOk;
}

function lastCommitDate(paths: string[]): Date | undefined {
  const existing = paths.filter((p) => existsSync(path.join(root, p)));
  if (existing.length === 0 || !haveHistory()) return undefined;
  const out = git(["log", "-1", "--format=%cI", "--", ...existing])?.trim();
  return out ? new Date(out) : undefined;
}

/** Committer time for every line of a file (index 0 = line 1). */
function blameLineDates(file: string): Date[] {
  if (!existsSync(path.join(root, file)) || !haveHistory()) return [];
  const out = git(["blame", "--line-porcelain", "--", file]);
  if (!out) return [];
  const dates: Date[] = [];
  let current: Date | undefined;
  for (const line of out.split("\n")) {
    if (line.startsWith("committer-time ")) {
      current = new Date(Number(line.slice(15)) * 1000);
    } else if (line.startsWith("\t")) {
      if (current) dates.push(current);
    }
  }
  return dates;
}

function readLines(file: string): string[] {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8").split("\n") : [];
}

function bump(map: Map<string, Date>, key: string, date: Date | undefined) {
  if (!date) return;
  const prev = map.get(key);
  if (!prev || date > prev) map.set(key, date);
}

export function newest(...dates: (Date | undefined)[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (acc, d) => (d && (!acc || d > acc) ? d : acc),
    undefined
  );
}

/** Newest line date per city slug inside `export const cities = [ ... ];`. */
function cityBlockDates(file: string): {
  map: Map<string, Date>;
  outside?: Date;
} {
  const lines = readLines(file);
  const dates = blameLineDates(file);
  const map = new Map<string, Date>();
  const start = lines.findIndex((l) => /^export const cities\b/.test(l));
  if (start < 0) return { map, outside: newest(...dates) };
  let end = lines.length;
  let slug: string | undefined;
  let blockStart = start + 1;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\];/.test(line)) {
      end = i;
      break;
    }
    if (/^ {2}\{\s*$/.test(line)) {
      blockStart = i;
      slug = undefined;
      continue;
    }
    const m = line.match(/^ {4}slug: "([^"]+)"/);
    if (m) {
      slug = m[1];
      for (let j = blockStart; j < i; j++) bump(map, slug, dates[j]);
    }
    if (slug) bump(map, slug, dates[i]);
  }
  // Lines outside the cities array (services, titles, helpers) are shared.
  const outside = newest(
    ...dates.filter((_, i) => i < start || i > end)
  );
  return { map, outside };
}

/** Newest date per "city:service" key in a Record<string, string> copy file. */
function keyedCopyDates(file: string): Map<string, Date> {
  const lines = readLines(file);
  const dates = blameLineDates(file);
  const map = new Map<string, Date>();
  let key: string | undefined;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s+"([a-z0-9-]+:[a-z0-9-]+)":/);
    if (m) key = m[1];
    else if (/^\s*$/.test(lines[i]) || /^\}/.test(lines[i])) key = undefined;
    if (key) bump(map, key, dates[i]);
  }
  return map;
}

/** Newest date per "city:service" across the objects in data/listings.json. */
function listingDates(file: string): Map<string, Date> {
  const lines = readLines(file);
  const dates = blameLineDates(file);
  const map = new Map<string, Date>();
  let depth = 0;
  let objStart = -1;
  let city: string | undefined;
  let service: string | undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (depth === 0 && /^\s*\{/.test(line)) {
      objStart = i;
      city = service = undefined;
    }
    for (const ch of line) {
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
    }
    const c = line.match(/"city_slug":\s*"([^"]+)"/);
    if (c) city = c[1];
    const s = line.match(/"service_slug":\s*"([^"]+)"/);
    if (s) service = s[1];
    if (depth === 0 && objStart >= 0) {
      if (city && service) {
        for (let j = objStart; j <= i; j++) bump(map, `${city}:${service}`, dates[j]);
      }
      objStart = -1;
    }
  }
  return map;
}

const TEMPLATE_PATHS = [
  "src/app/layout.tsx",
  ":(literal)src/app/[city]",
  "src/components",
  "src/lib",
  "src/types",
  "data/listings.json",
];

const PAGE_DATA = [
  "src/config/site.ts",
  "src/lib/local-copy.ts",
  "data/listings.json",
];

let cache:
  | {
      template?: Date;
      city: Map<string, Date>;
      copy: Map<string, Date>;
      listings: Map<string, Date>;
    }
  | undefined;

function load() {
  if (cache) return cache;
  // Shared template date excludes the per-page data files (their own
  // per-line dates are applied below) so a new listing does not bump every URL.
  const templatePaths = TEMPLATE_PATHS.filter((p) => !PAGE_DATA.includes(p));
  const excludes = PAGE_DATA.map((p) => `:(exclude)${p}`);
  const existing = templatePaths.filter((p) =>
    existsSync(path.join(root, p.replace(/^:\(literal\)/, "")))
  );
  const out = existing.length && haveHistory()
    ? git(["log", "-1", "--format=%cI", "--", ...existing, ...excludes])?.trim()
    : undefined;
  const cityBlocks = cityBlockDates("src/config/site.ts");
  cache = {
    template: newest(out ? new Date(out) : undefined, cityBlocks.outside),
    city: cityBlocks.map,
    copy: keyedCopyDates("src/lib/local-copy.ts"),
    listings: listingDates("data/listings.json"),
  };
  return cache;
}

/** lastmod for a top-level static page such as "/privacy/". */
export function staticPageLastmod(pageFile: string): Date | undefined {
  return newest(
    lastCommitDate([pageFile, "src/app/layout.tsx", "src/components"])
  );
}

/** lastmod for /<city>/<service>/. */
export function servicePageLastmod(
  citySlug: string,
  serviceSlug: string
): Date | undefined {
  const d = load();
  const key = `${citySlug}:${serviceSlug}`;
  return newest(d.template, d.city.get(citySlug), d.copy.get(key), d.listings.get(key));
}

/** lastmod for the /<city>/ hub: newest of the city block and its listings. */
export function cityPageLastmod(
  citySlug: string,
  serviceSlugs: string[]
): Date | undefined {
  const d = load();
  return newest(
    d.template,
    d.city.get(citySlug),
    ...serviceSlugs.map((s) => d.listings.get(`${citySlug}:${s}`))
  );
}

/** lastmod for the home page: newest of its file, layout, and any city change. */
export function homePageLastmod(): Date | undefined {
  const d = load();
  return newest(
    staticPageLastmod("src/app/page.tsx"),
    ...d.city.values()
  );
}
