# TreeList

A lead-generation directory for tree service companies. One niche, one unique page per city. TreeList is not a contractor and does not invent company names, phones, licenses, star ratings, or city-specific prices.

The published site is a **static export** on GitHub Pages. There is no Node server and `next start` is not used.

Working brand name: **TreeList**. Rename it in one file: `src/config/site.ts` (name, domain, phone, email, theme tokens, cities, and services).

## Run locally

```bash
npm install
npm run dev
```

Dev app: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Static preview (no Next server):

```bash
npm run build
npm start
```

`npm start` serves the `out/` folder with `serve`. The live site does not run `next start`.

## GitHub Pages

Source repo: [https://github.com/ateamowner/treelist](https://github.com/ateamowner/treelist)

Pages repo (user site, auto-enabled): [https://github.com/ateamowner/ateamowner.github.io](https://github.com/ateamowner/ateamowner.github.io)

- github.io URL: https://ateamowner.github.io/
- Custom domain: https://treelist.ai (`CNAME` committed as `treelist.ai`)
- Publish: `ateamowner.github.io` builds this source (`output: "export"`) and copies `out/` to the user-site root


## Porkbun DNS (do not change nameservers)

Keep Porkbun nameservers. Add these records for GitHub Pages ([official docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):

**Apex `treelist.ai` — add all four A and all four AAAA records**

| Type | Host | Answer |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**Alternative to A/AAAA (if Porkbun offers ALIAS):** `ALIAS` / `ANAME` `@` → `ateamowner.github.io`

**www**

| Type | Host | Answer |
| --- | --- | --- |
| CNAME | `www` | `ateamowner.github.io` |

Do not point `www` at `ateamowner.github.io/treelist`. The CNAME target is the GitHub Pages host only.

Remove any Porkbun default parking / URL-forward records on `@` and `www` first.

## City pages

- [/pittsburgh-pa/tree-service](/pittsburgh-pa/tree-service) — Best Tree Service in Pittsburgh — 2026
- [/milwaukee-wi/tree-service](/milwaukee-wi/tree-service) — Best Tree Service in Milwaukee — 2026
- [/oklahoma-city-ok/tree-service](/oklahoma-city-ok/tree-service) — Best Tree Service in Oklahoma City — 2026
- [/dayton-oh/tree-service](/dayton-oh/tree-service) — Best Tree Service in Dayton — 2026

City hubs: `/pittsburgh-pa`, `/milwaukee-wi`, `/oklahoma-city-ok`, `/dayton-oh`.

Related-service stubs (unique H1, intro, form, links back): `tree-removal`, `stump-grinding`, `tree-trimming`, `emergency-tree-service`.

Nearby-city stubs (coming soon + quote form): Bethel Park, Mt. Lebanon, Cranberry, Monroeville; Wauwatosa, Brookfield, West Allis, Waukesha; Edmond, Norman, Moore, Yukon; Kettering, Beavercreek, Huber Heights, Springfield, Fairborn.

Also: `/`, `/privacy`, `/for-pros`, and a 404.

## Add a city

1. Open `src/config/site.ts`.
2. Append a `City` to the `cities` array:
   - `slug` (URL segment, like `columbus-oh`)
   - `name`, `state`, `stateAbbr`
   - `status`: `"live"` or `"coming_soon"`
   - `nearbySlugs` (other city slugs — those pages must exist)
   - `parentSlug` if this is a suburb stub
   - `setting` (public geographic context only — no invented prices)
3. If the new city is a neighbor of an existing city, add its slug to that city’s `nearbySlugs`.
4. Rebuild. Next.js prerenders every city × service pair from this list.

Services are in the same file (`services`). The quote form `service_type` values are locked to: `tree service`, `tree removal`, `stump grinding`, `tree trimming`, `emergency`, `other`.

## Add a listing

Do not invent real contractors. When you have a real company, edit `data/listings.json` (starts as `[]`).

Each object:

| Field | Notes |
| --- | --- |
| `city_slug` | Must match a city slug |
| `service_slug` | Must match a service slug |
| `name` | Real business name only |
| `areas_served` | Array of place names |
| `phone` | Real phone, or `""` |
| `license_id` | Real license, or `""` |
| `blurb` | Short, factual |
| `tier` | `standard` \| `featured` \| `exclusive` |
| `profile_url` | Optional URL, or `""` |

`featured` and `exclusive` render a **paid placement** label. See `data/listings.example.json` for shape only — do not ship the example as a live listing. Rebuild after editing so static pages pick up the file.

## Quote form and `LEADS_EMAIL`

The quote form is a **native HTML POST** (no `fetch` / XHR). Action: `https://formsubmit.co/treelist@agentmail.to`. Formsubmit emails **LEADS_EMAIL=`treelist@agentmail.to`**. Hidden fields: `_subject`, `_template`, `_captcha=false`, `_next=https://treelist.ai/request-sent/`, plus a `_honey` honeypot.

The first submission to a new inbox sends a confirmation email to `treelist@agentmail.to`. Open that message and confirm the form before live leads arrive. The browser leaves the city page (activation page or `/request-sent/`).

There is no credit-card field. Success copy on `/request-sent/`: “Request sent. A local company will call you.”

## Cost guide

The only dollar range on the site is the national published range:

Tree removal typically $200–$2,000+, average about $750 ([Angi 2026](https://www.angi.com/articles/how-much-does-tree-removal-cost.htm)).

It is labeled as a national range, not a Pittsburgh / Milwaukee / Oklahoma City / Dayton survey.

## SEO

- `sitemap.xml` and `robots.txt` are generated from the city/service config.
- Every city and city × service page includes JSON-LD: `LocalBusiness` for TreeList the publisher (not a vendor), `FAQPage` matching the visible FAQs, and `BreadcrumbList`.
