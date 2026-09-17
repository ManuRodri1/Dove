# Child Sponsorship — implementation and QA

Date: 2026-09-16

## Scope

Implemented Page 3 only:

- `/en/child-sponsorship`
- `/es/child-sponsorship`

No Vocational Training or other page was started.

## Source verification

- The legacy Wix Child Sponsorship CTA resolves to `https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship`.
- The destination resolves to the live Dove Missions Child Sponsorship campaign and states the current standard amount of $50 USD per month, monthly/annual recurring options, program participation, family food assistance and `childsponsorship@doveyouthdevelopment.org`.
- The current Dove Contact page also publishes `childsponsorship@doveyouthdevelopment.org`.
- The legacy sponsorship page associates the four migrated image/name pairs with Yarleni, Carlos, Darianny and Chrismason. Ages were intentionally omitted from the new page.

## Files created

- `src/app/[locale]/child-sponsorship/page.tsx`
- `src/components/ChildSponsorship.tsx`
- `src/content/child-sponsorship.ts`
- `src/i18n/messages/child-sponsorship.en.ts`
- `src/i18n/messages/child-sponsorship.es.ts`
- `scripts/verify-child-sponsorship.mjs`
- `CHILD_SPONSORSHIP_QA.md`

## Files modified

- `src/content/links.ts`
- `src/content/dove-media.ts`
- `src/app/globals.css`
- `src/app/sitemap.ts`
- `package.json`
- `design.md`
- `.hallmark/log.json`

## Media keys

- Hero: `doveMedia.sponsorship.primary` → `Kids_195.jpg`
- Program support: `doveMedia.sponsorship.support` → approved `19861c...jpg`
- Voices: `doveMedia.sponsorship.testimonials.yarleni`, `.carlos`, `.darianny`, `.chrismason`

Only the hero is prioritized. Program-support and testimonial images use lazy loading and responsive `sizes`.

## Link audit

| Section | Label | Destination key | Type | Final destination | Status |
|---|---|---|---|---|---|
| Header | Donate | `links.giving.general` | External | `https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page` | Clicked; exact href verified |
| Hero | Sponsor a Child — $50/month | `links.giving.childSponsorship` | External | `https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship` | Clicked; exact href and live campaign verified |
| Hero | See what sponsorship supports | `#sponsorship-support` | In-page | Existing support section | Clicked; target verified |
| $50 anchor | Begin Child Sponsorship | `links.giving.childSponsorship` | External | Child Sponsorship campaign | Clicked; exact href verified |
| How Sponsorship Works | Sponsor a Child | `links.giving.childSponsorship` | External | Child Sponsorship campaign | Clicked; exact href verified |
| Final CTA | Sponsor a Child — $50/month | `links.giving.childSponsorship` | External | Child Sponsorship campaign | Clicked; exact href verified |
| Final CTA | Questions about sponsorship? | `links.email.childSponsorship` | Mailto | `mailto:childsponsorship@doveyouthdevelopment.org` | Clicked; exact href verified |
| Header | Logo | `links.home(locale)` | Internal | Localized Home | Clicked; exact href verified |
| Header | Navigation | Existing localized configuration | Internal | Localized Home / Our Story / Home anchors | All hrefs locale-aware |
| Newsletter | Shared `submitNewsletter` adapter | Adapter | No provider configured | Submitted in QA; explicit unavailable response; no fake success |

There are no bare `#` placeholder links and no payment form or card-data collection on the Dove site.

## Automated verification

- Production build: pass
- TypeScript: pass
- ESLint: pass
- Responsive states: 12 passed (EN + ES at 320, 375, 414, 768, 1024 and 1440 px)
- Horizontal overflow: none
- Broken images: none
- Wrapped CTA labels: none
- Accessibility: zero axe WCAG 2 A/AA/2.1 AA violations in all 12 states
- Semantic structure: one H1, ordered three-step process, six native `details` FAQ disclosures
- SEO: localized titles/descriptions, canonical, EN/ES hreflang, Open Graph hero image, FAQPage structured data and both routes in sitemap
- Performance: one sponsorship hero preload; all five below-the-fold sponsorship images lazy-loaded; no new animation dependency

Evidence: `artifacts/child-sponsorship/qa.json` and twelve responsive screenshots in `artifacts/child-sponsorship/`.

## Hallmark review

- Philosophy: 5/5 — dignified, program-led and sponsorship-focused
- Hierarchy: 5/5 — one dominant action with clear supporting information
- Execution: 5/5 — tokenized, responsive, accessible and source-verified
- Specificity: 5/5 — Dove photography, Puerto Plata context and verified program details
- Restraint: 5/5 — no invented claims, checkout, child catalogue, carousel or decorative excess
- Variety: 5/5 — split hero, typographic pledge, asymmetric editorial benefits, unboxed steps, source-led voices and native FAQ

## Intentionally excluded

- Waiting-list totals, a claim that exactly 50 sponsors are currently needed, historic capacity figures and old annual impact totals
- Pity-driven or dramatic risk language from legacy copy
- Ages, surnames, schools, neighborhoods, family details and other added information about minors
- Guarantees about private schooling, medical care, employment, one-to-one mentoring, direct messaging or visit frequency
- Payment fields, card collection, checkout simulation and embedded donation forms

## Remaining client confirmations

- The global newsletter provider/API is still unverified and remains behind the existing honest unavailable adapter.
- Testimonial statements are concise faithful paraphrases of the public legacy statements; confirm if Dove wants approved verbatim editorial wording in a later content pass.
