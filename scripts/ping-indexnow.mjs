#!/usr/bin/env node
/**
 * Post-build IndexNow ping for treelist.ai.
 * The key is public by design (hosted at /{key}.txt). No secret env var.
 *
 * Usage:
 *   node scripts/ping-indexnow.mjs           # POST sitemap locs (CI on main)
 *   node scripts/ping-indexnow.mjs --dry-run # parse + validate only
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HOST = "treelist.ai";
const ORIGIN = "https://treelist.ai";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_RE = /^[a-f0-9]{8,128}\.txt$/i;
const dryRun = process.argv.includes("--dry-run");

function findKeyFile() {
  const dirs = ["out", "public"].filter((dir) => existsSync(dir));
  for (const dir of dirs) {
    const matches = readdirSync(dir).filter((name) => KEY_RE.test(name));
    if (matches.length === 0) continue;
    if (matches.length > 1) {
      throw new Error(
        `Expected one IndexNow key file in ${dir}, found: ${matches.join(", ")}`
      );
    }
    const filename = matches[0];
    const key = filename.replace(/\.txt$/i, "");
    const body = readFileSync(join(dir, filename), "utf8").replace(/\r?\n$/, "");
    if (body !== key) {
      throw new Error(
        `${dir}/${filename} must contain only the key (got ${JSON.stringify(body)})`
      );
    }
    return { key, filename, dir };
  }
  throw new Error("No IndexNow {key}.txt file found in out/ or public/");
}

function readSitemapXml() {
  const candidates = [
    "out/sitemap.xml",
    "out/sitemap.xml/index.xml",
    "out/sitemap.xml/index.html",
  ];
  for (const path of candidates) {
    if (existsSync(path)) return { path, xml: readFileSync(path, "utf8") };
  }
  throw new Error(
    `No sitemap found. Run npm run build first. Looked for: ${candidates.join(", ")}`
  );
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) =>
    match[1].trim()
  );
}

function assertSlashCanonicals(urlList) {
  if (urlList.length === 0) {
    throw new Error("Sitemap has no <loc> URLs");
  }
  for (const url of urlList) {
    if (url.includes("treelists.com")) {
      throw new Error(`Refusing treelists.com URL: ${url}`);
    }
    if (!url.startsWith(`${ORIGIN}/`)) {
      throw new Error(`Unexpected sitemap host (want ${ORIGIN}/): ${url}`);
    }
    if (!url.endsWith("/")) {
      throw new Error(`Sitemap loc must keep trailing slash: ${url}`);
    }
  }
  if (!urlList.includes(`${ORIGIN}/`)) {
    throw new Error("Sitemap must include the slash homepage https://treelist.ai/");
  }
}

async function main() {
  const { key, filename } = findKeyFile();
  const { path, xml } = readSitemapXml();
  const urlList = extractLocs(xml);
  assertSlashCanonicals(urlList);

  const payload = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${filename}`,
    urlList,
  };

  console.log(
    `IndexNow: ${urlList.length} slash-canonical locs from ${path}; key ${filename}`
  );

  if (dryRun) {
    console.log("Dry run — not POSTing to IndexNow.");
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  console.log(`IndexNow ${response.status} ${response.statusText}: ${text}`);

  // 200 OK and 202 Accepted are success. Do not treat the public key as a secret.
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow ping failed with HTTP ${response.status}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
