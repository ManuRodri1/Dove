# Vocational Training Center — implementation and QA

Date: 2026-09-16

## Delivery status

- Routes: `/en/vocational-training-center` and `/es/vocational-training-center`
- Production build: pass
- TypeScript: pass
- ESLint: pass
- Localized metadata, canonical, `hreflang`, Open Graph and sitemap: pass
- FAQ structured data: pass
- Shared Header, Footer and Newsletter: reused
- No production files deleted

## Link audit

The automated audit clicked each action in both locales and compared the dispatched destination with the central link registry.

| Section | Label | Destination key | Type | Final destination | Status |
| --- | --- | --- | --- | --- | --- |
| Header | Donate | `links.giving.general` | External | `https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page` | Pass — exact configured href dispatched |
| Hero | Support Vocational Training / Apoya la formación vocacional | `links.giving.vocationalTraining` | External | `https://dovemissions.networkforgood.com/projects/138886-dove-vocational-training-center` | Pass — exact configured href dispatched |
| Hero | Explore the programs / Conoce los programas | `#training-pathways` | In-page | `#training-pathways` | Pass — target exists and receives navigation |
| Origin | Read Our Story / Lee Nuestra Historia | `links.ourStory(locale)` | Internal | `/en/our-story` or `/es/our-story` | Pass — locale retained |
| Support | Support Vocational Training / Apoya la formación vocacional | `links.giving.vocationalTraining` | External | Dedicated vocational campaign | Pass — exact configured href dispatched |
| Partnership | Partner With Dove / Colabora con Dove | `links.partnerships` | Mailto | `mailto:executivedirector@doveyouthdevelopment.org` | Pass |
| Final CTA | Support Vocational Training / Apoya la formación vocacional | `links.giving.vocationalTraining` | External | Dedicated vocational campaign | Pass — exact configured href dispatched |
| Final CTA | Partner With Dove / Colabora con Dove | `links.partnerships` | Mailto | `mailto:executivedirector@doveyouthdevelopment.org` | Pass |
| Header | Logo | `links.home(locale)` | Internal | `/en` or `/es` | Pass — locale retained |
| Newsletter | Join / Únete | `submitNewsletter` | Adapter | No provider configured | Pass — unavailable state shown; no fake success |

No page link uses a bare `#`. External actions retain the shared `rel="external noopener noreferrer"` handling.

## Responsive and accessibility matrix

| Locale | 320 | 375 | 414 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- | --- |
| English | Pass | Pass | Pass | Pass | Pass | Pass |
| Spanish | Pass | Pass | Pass | Pass | Pass | Pass |

Every state reported:

- zero horizontal overflow;
- zero overflowing elements;
- zero wrapped CTA labels;
- zero broken images;
- zero Axe WCAG 2 A/AA/2.1 AA violations.

The review also confirmed one H1, semantic ordered program and outcome sequences, native keyboard-accessible FAQ disclosure controls, visible shared focus states, meaningful localized image alt text and no forced carousel or autoplay.

## Content and claims

Implemented verified program directions:

- Job Readiness;
- English as a Second Language;
- Computer Skills;
- Cosmetology;
- possible pathways toward employment, entrepreneurship and continued education;
- 2022 as the Vocational Training Center launch chapter;
- dedicated campaign support for teacher salaries, supplies and classroom materials;
- Jodelka and Elian as a carefully qualified individual pathway story;
- Liz Rooney as founder and executive director.

Excluded as current claims:

- historical youth unemployment percentages;
- old enrollment, capacity and fundraising totals;
- old campaign funding levels;
- guaranteed employment, internships, placements or outcomes.

Pending client confirmation:

- any current youth employment statistic;
- current enrollment and impact counts;
- whether historical campaign funding levels should return;
- any current internship, employer-placement or certification commitments;
- final newsletter provider;
- eventual migration of approved Wix originals to Dove's managed media account.

## Hallmark audit

- Genre: editorial
- Macrostructure: Narrative Workflow
- Theme: locked Dove design system
- Hero enrichment: H6 photographic fold using real Dove media
- Structural variation: explanatory opening → connected training pathways → enlarged Job Readiness foundation → typography-led outcomes and personal story → archive/history fold → giving and partnership close
- Pre-emit critique: `P5 H5 E5 S5 R5 V5`
- Slop test: `58/58 pass`
- Contrast gates 40–41: pass
- Honest-copy gate 46: pass
- Token gate 48: pass
- Responsive/mobile gates 34 and 49–57: pass

Full machine-readable evidence and the twelve full-page captures are stored in `artifacts/vocational-training/`.
