# What We Do — production QA

Date: 2026-09-16  
Routes: `/en/what-we-do`, `/es/what-we-do`

## Implementation status

- Production build: pass (Next.js 16.3.5)
- TypeScript: pass
- ESLint: pass
- Responsive matrix: 320, 375, 414, 768, 1024 and 1440 px in EN and ES
- Automated states: 12 passed
- Audited actions: 26 passed (13 in each locale)
- Axe: 0 WCAG 2 A/AA/2.1 AA violations across the matrix
- Broken visible images: 0
- Horizontal overflow: 0
- Wrapped buttons or text CTAs: 0
- 1280 × 800 hero essentials: pass (eyebrow, H1, lede, primary CTA and image focal area visible)
- Localized route responses: HTTP 200 for EN and ES

Machine-readable output: `artifacts/what-we-do/qa.json`.

## Program architecture

1. Child & Youth Development — large image-led opening.
2. Education & English — editorial split with classroom archive media.
3. Job Readiness — typography-led transition without a decorative image.
4. Vocational Training — deep-teal program feature.
5. Family & Community Support — warm, place-based closing composition.

The expanded pathway maps Belong → Learn → Build Skills → Prepare → Move Forward without claiming that every participant follows a fixed route.

## Media audit

| Section | Media key | Source asset | Loading |
|---|---|---|---|
| Hero | `doveMedia.whatWeDo.hero` | `Kids_195.jpg` / `d88784_44242d83e5054c4b8c70b72f04061da1~mv2.jpg` | Prioritized |
| Child & Youth Development | `doveMedia.whatWeDo.youth` | `d88784_d9e2faf456d6418eab1ecf21ea2390d2~mv2.jpg` | Lazy |
| Education & English | `doveMedia.whatWeDo.education` | Dove classroom group / `294108_7a6539ca50ac4116838606139b596706~mv2.png` | Lazy |
| Job Readiness | None | Typography-led by design | N/A |
| Vocational Training | `doveMedia.whatWeDo.vocational` | `Kids_5.jpg` / `d88784_d7cfee1200f24009b3bc3a46f30c5fec~mv2.jpg` | Lazy |
| Family & Community Support | `doveMedia.whatWeDo.community` | `Building_25.jpg` / `d88784_985bc8e5e2e14354bcad30400568cc04~mv2.jpg` | Lazy |

All visible images use responsive `next/image` sizing and localized, descriptive alt text. No person is given an unsupported identity.

## Link audit

Every row was checked in both locales. The automated audit focused and clicked each CTA while intercepting navigation, then compared the resolved URL with its centralized destination.

| Section | CTA label | Type | Destination key | Final href | Status |
|---|---|---|---|---|---|
| Header | Donate / Dona | External | `links.giving.general` | `https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page` | Pass — clicked; live campaign verified |
| Hero | Explore our programs / Explora nuestros programas | On-page | `#program-areas` | `#program-areas` | Pass — clicked; target exists |
| Hero | See the Dove pathway / Conoce el camino con Dove | On-page | `#dove-pathway` | `#dove-pathway` | Pass — clicked; target exists |
| Child & Youth Development | Explore Child Sponsorship | Internal localized | `links.childSponsorship(locale)` | `/en/child-sponsorship`, `/es/child-sponsorship` | Pass — clicked; route HTTP 200 |
| Education & English | Support Educational Opportunities | Internal localized | `links.donate(locale)` | `/en/donate`, `/es/donate` | Pass — clicked; route HTTP 200 |
| Job Readiness | Explore Job Readiness | Internal localized | `links.vocationalTraining(locale)` | `/en/vocational-training-center`, `/es/vocational-training-center` | Pass — clicked; route HTTP 200 |
| Vocational Training | Discover Vocational Training | Internal localized | `links.vocationalTraining(locale)` | `/en/vocational-training-center`, `/es/vocational-training-center` | Pass — clicked; route HTTP 200 |
| Family & Community Support | Support Dove’s Work | Internal localized | `links.donate(locale)` | `/en/donate`, `/es/donate` | Pass — clicked; route HTTP 200 |
| Outcome | Read Stories From Dove | External | `links.stories` | `https://www.doveyouthdevelopment.org/blog` | Pass — clicked; verified live legacy page |
| Final bridge | Support Dove | Internal localized | `links.donate(locale)` | `/en/donate`, `/es/donate` | Pass — clicked; route HTTP 200 |
| Final bridge | Explore Volunteering | External | `links.volunteer` | `https://www.doveyouthdevelopment.org/the-dove-experience` | Pass — clicked; verified live legacy page |
| Header | Logo | Internal localized | `links.home(locale)` | `/en`, `/es` | Pass — clicked |
| Header/Footer | Navigation | Internal localized | `getHome(locale).navigation` | Existing localized routes and anchors | Pass — all values localized; no bare `#` |
| Newsletter | Join the Dove Community | Adapter | `submitNewsletter` | No provider configured | Pass — clicked; honest unavailable response; no fake success |

External HTTP links use the shared `externalRel()` security policy.

## SEO and localization

- One H1 and logical H2/H3 hierarchy.
- Localized title, description, canonical, `hreflang`, `x-default` and Open Graph image.
- Sitemap contains both localized routes.
- The second global navigation item now points to `links.whatWeDo(locale)` from Home and all shared layouts.
- Spanish copy is stored in `src/i18n/messages/what-we-do.es.ts`; no runtime translation is used.
- Existing locale cookie, middleware detection and language switcher are reused unchanged.

## Content governance

Intentionally excluded:

- Volunteer, Travel With Purpose and Partnerships as core programs.
- Exact 6–18 age range in prominent new copy, pending current confirmation.
- Historical counts (400 students, 80+ teens, 65 teens and cohort sizes).
- Historical funding goals and sponsorship targets.
- Guaranteed employment, internships, placement, graduation or linear progression.
- Shock or fear-based legacy language.
- Unverified family services such as housing, cash assistance, insurance, therapy or healthcare.
- Dedicated routes for Education, Job Readiness, Family Support and Get Involved; those routes do not exist yet.

Client-confirmation items:

- Current program age range.
- Current participant and family counts.
- Future dedicated Education, Family Support, Stories and Get Involved routes.

## Hallmark audit

- Philosophy: 5/5
- Hierarchy: 5/5
- Execution: 5/5
- Specificity: 5/5
- Restraint: 5/5
- Variety: 5/5

The 58-gate slop review passes for the page implementation. Gate 42 is treated as an explicit shared-chrome exception because the brief requires the already approved Header to be reused unchanged; its active state was added without rebuilding its structure. No score falls below 3.
