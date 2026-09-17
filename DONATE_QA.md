# Donate — implementation and QA

Date: 2026-09-16

## Delivery status

- Routes: `/en/donate` and `/es/donate`
- Production build, TypeScript and ESLint: pass
- Localized metadata, canonical, `hreflang`, Open Graph and sitemap: pass
- Visible FAQ and matching FAQ structured data: pass
- Shared Header, Footer, locale preference and Newsletter: reused
- No production files deleted

## YouTube Hero

- Video ID: `rjFUSW-1xmA`
- Embed host: `youtube-nocookie.com`
- Poster: official YouTube `maxresdefault.jpg`, verified HTTP 200
- Default behavior: poster first; the iframe is activated after the window load event
- Playback: autoplay, muted, looped, inline and without standard controls
- Loop configuration: `playlist=rjFUSW-1xmA`
- User control: external pause/play button with localized accessible labels
- Reduced motion: poster-only initial state; video loads only after the visitor explicitly presses Play
- Data Saver: poster-only initial state
- Layout: fixed Hero dimensions prevent iframe-induced CLS
- The 1280 × 800 fold contains the eyebrow, H1, lede, primary CTA and media focal area

## Giving pathways

Rendered and active:

- General Giving
- Child Sponsorship — US$50/month
- Vocational Training
- Corporate & Community Partnerships

`getActiveCampaigns(locale)` exists, but returns no campaign because none has been verified as active for this milestone. No campaign title, progress or fundraising amount is fabricated.

## Link audit

The automated audit clicked each required action in both locales and compared the dispatched URL with the centralized link registry.

| Page | Section | CTA | Link key | Type | Final destination | Status |
| --- | --- | --- | --- | --- | --- | --- |
| EN/ES Donate | Header | Donate / Dona | `links.giving.general` | External | `https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page` | Pass |
| EN/ES Donate | Hero | Donate now / Dona ahora | `links.giving.general` | External | General Giving page | Pass |
| EN/ES Donate | Hero | Explore ways to give / Explora las formas de apoyar | `#giving-pathways` | In-page | Existing giving-hub anchor | Pass |
| EN/ES Donate | Giving hub | General Giving | `links.giving.general` | External | General Giving page | Pass |
| EN/ES Donate | Giving hub | Sponsor a Child | `links.giving.childSponsorship` | External | `https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship` | Pass |
| EN/ES Donate | Giving hub | Vocational Training | `links.giving.vocationalTraining` | External | `https://dovemissions.networkforgood.com/projects/138886-dove-vocational-training-center` | Pass |
| EN/ES Donate | Giving hub | Partnership | `links.partnerships` | Mailto | `mailto:executivedirector@doveyouthdevelopment.org` | Pass |
| EN/ES Donate | Recurring giving | Start recurring gift | `links.giving.general` | External | General Giving page | Pass |
| EN/ES Donate | Tribute giving | Make tribute gift | `links.giving.general` | External | General Giving page | Pass |
| EN/ES Donate | Partnership | Start a conversation | `links.partnerships` | Mailto | Executive Director email | Pass |
| EN/ES Donate | Final CTA | Donate where needed most | `links.giving.general` | External | General Giving page | Pass |
| EN/ES Donate | Final CTA | Sponsor a Child | `links.giving.childSponsorship` | External | Child Sponsorship page | Pass |
| EN/ES Donate | Header | Logo | `links.home(locale)` | Internal | `/en` or `/es` | Pass |
| EN/ES Donate | Newsletter | Submit | `submitNewsletter` | Adapter | No provider configured | Pass — unavailable response, no fake success |

No action uses a bare `#`, no dedicated donation is routed to the generic giving page and external links retain the shared security `rel` behavior.

## Responsive and accessibility matrix

| Locale | 320 | 375 | 414 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- | --- |
| English | Pass | Pass | Pass | Pass | Pass | Pass |
| Spanish | Pass | Pass | Pass | Pass | Pass | Pass |

All twelve states reported:

- zero horizontal overflow;
- zero overflowing elements;
- zero wrapped CTA labels;
- zero broken images;
- zero Axe WCAG 2 A/AA/2.1 AA violations.

The page uses one H1, logical headings, keyboard-accessible native FAQ controls, visible focus states, 44 px minimum interactive targets and HTML copy independent of the video.

## Content intentionally withheld

- Private School Sponsors
- Supporter's Circle
- Sustainer's Circle
- historical recurring-dollar ranges
- Climb With Purpose 2026 as a current campaign
- current donor counts, donor names and donation amounts
- historical check mailing address
- current in-kind Wish List
- Vicky Mowl as a currently confirmed contact
- Candid Platinum 2025 seal
- unapproved U.S. charity and tax-receipt wording

The in-kind contact, mail donation address, legal wording and legacy giving levels exist only as internal `client-confirm` migration data and are not rendered.

## Pending client confirmation

- current in-kind donation contact;
- current Wish List;
- current check payee and mailing address;
- final U.S. charity and tax-receipt wording;
- current Candid status and 2026 asset;
- whether any legacy giving circle remains active;
- next verified active campaign;
- final Newsletter provider.

## Hallmark audit

- Genre: editorial
- Macrostructure: Feature Stack
- Theme: locked Dove design system
- Enrichment: E2 full-bleed muted video with poster-first loading
- Structural variation: cinematic opening → sticky General Giving anchor → ruled giving pathways → support areas → asymmetric recurring/tribute pair → institutional band → payment trust sequence
- Pre-emit critique: `P5 H5 E5 S5 R5 V5`
- Slop test: `58/58 pass`
- Contrast gates 40–41: pass
- Hero fold gate 44: pass at 1280 × 800
- Honest-copy gate 46: pass
- Token gate 48: pass
- Mobile gates 34 and 49–57: pass

Machine-readable evidence and twelve full-page captures are stored in `artifacts/donate/`.
