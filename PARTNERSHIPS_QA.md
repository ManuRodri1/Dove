# Corporate & Community Partnerships — implementation and QA

Date: 2026-09-17  
Routes: `/en/partnerships`, `/es/partnerships`

## Files created

- `src/app/[locale]/partnerships/page.tsx`
- `src/app/api/partnership-inquiry/route.ts`
- `src/components/PartnershipsPage.tsx`
- `src/components/PartnershipInquiryForm.tsx`
- `src/content/partnerships.ts`
- `src/content/partners.ts`
- `src/i18n/messages/partnerships.en.ts`
- `src/i18n/messages/partnerships.es.ts`
- `src/lib/partnership-inquiry.ts`
- `scripts/verify-partnerships.mjs`
- `PARTNERSHIPS_QA.md`

## Files modified

- `src/content/links.ts`
- `src/content/home.ts`
- `src/content/donate.ts`
- `src/content/vocational-training.ts`
- `src/content/dove-media.ts`
- `src/i18n/messages/en.ts`
- `src/i18n/messages/es.ts`
- `src/components/Header.tsx`
- `src/app/[locale]/travel-with-purpose/page.tsx`
- `src/app/sitemap.ts`
- `src/proxy.ts`
- `src/app/globals.css`
- `scripts/verify-donate.mjs`
- `scripts/verify-vocational-training.mjs`
- `scripts/verify-travel-with-purpose.mjs`
- `package.json`
- `design.md`
- `.hallmark/log.json`

No production file was deleted.

## Content and data governance

- Hero media: `d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`.
- Workforce media: `d88784_d7cfee1200f24009b3bc3a46f30c5fec~mv2.jpg`.
- Partnership opportunity types are separate from named partner organizations.
- `verifiedPartners` contains Lifestyle Holidays as publicly verified evidence, with `clientApproved: false`; it is not rendered.
- Rotary and Happy Dolphins are rendered only as clearly labelled historical support/collaboration.
- Amber Cove and O’Hair Salon are not presented as partners.
- No logo wall, partner logos, sponsorship tiers, current partner claims, donation amounts or corporate benefits were invented.

## Inquiry form

Fields: full name, work email, phone, organization/company, website, role/title, broad partnership interest, message and referral source.

`submitPartnershipInquiry()` validates locally, then calls `/api/partnership-inquiry`. The API validates content type, payload size, same-origin requests, locale and field limits. No provider is configured, so valid submissions receive `503 unavailable`; the UI preserves entered data and offers `links.email.partnerships` as a fallback. It never reports false success.

Recipient pending confirmation: `executivedirector@doveyouthdevelopment.org`.

## Partnerships page link audit

| Section | Label | Destination key | Type | Final destination | Status |
|---|---|---|---|---|---|
| Header | Donate | `links.giving.general` | External | Network for Good general giving | Clicked; exact href |
| Hero | Start a partnership conversation | `#partner-inquiry` | In-page | Inquiry section | Clicked; target exists |
| Hero | Explore ways to partner | `#ways-to-partner` | In-page | Ways section | Clicked; target exists |
| Program support | Explore our programs | `links.whatWeDo(locale)` | Internal | `/{locale}/what-we-do` | Clicked; exact href |
| Workforce | Explore vocational training | `links.vocationalTraining(locale)` | Internal | `/{locale}/vocational-training-center` | Clicked; exact href |
| Corporate giving | Explore giving options | `links.donate(locale)` | Internal | `/{locale}/donate` | Clicked; exact href |
| Team engagement | Travel With Purpose | `links.travel.page(locale)` | Internal | `/{locale}/travel-with-purpose` | Clicked; exact href |
| Community bridge | Explore Travel With Purpose | `links.travel.page(locale)` | Internal | `/{locale}/travel-with-purpose` | Clicked; exact href |
| Inquiry | Executive Director fallback | `links.email.partnerships` | Mailto | `executivedirector@doveyouthdevelopment.org` | Clicked; exact href |
| Employer matching | Explore Donate | `links.donate(locale)` | Internal | `/{locale}/donate` | Clicked; exact href |
| Header/Footer | Logo and partnership navigation | localized configuration | Internal | Localized routes | Clicked; exact href |
| Newsletter | Existing adapter | `submitNewsletter` | Adapter | No provider configured | Honest unavailable state |

No empty href or standalone `#` link exists.

## Site-wide partnership migration

| Page | General partnership destinations migrated | Specific email retained |
|---|---|---|
| Home | Support option, Experience Dove, partnership callout, footer | Contact only |
| Donate | Partnership pathway and institutional callout | None |
| Vocational Training | Support bridge and final CTA | None |
| What We Do | Footer partnership link | Contact only |
| Travel With Purpose | Footer partnership link | Group-planning contact remains email by intent |
| Volunteer | Footer partnership link | Volunteer operations contact remains email by intent |

All general partnership discovery now uses `links.partnerships(locale)`. The executive-director email remains centralized for explicit contact and inquiry fallback.

## SEO, accessibility, responsive and performance

- Localized metadata, canonical, `hreflang`, Open Graph image, one H1 and FAQ JSON-LD verified.
- Sitemap includes EN and ES routes. `/partnerships` enters the existing locale-detection pipeline.
- Axe WCAG A/AA/2.1 AA: 0 violations at 320, 375, 414, 768, 1024 and 1440 in both locales.
- No horizontal overflow or broken images in 12 responsive states.
- Form labels, error references, live status, keyboard focus and native FAQ disclosure semantics verified.
- Hero image is prioritized; below-fold image is lazy; no video, animation library or logo assets added.
- Spanish layout and long CTA strings verified at all required widths.

## Automated verification

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass
- Partnerships: 12 responsive states, 22 clicked actions, 2 form states, 10 site-wide migration states
- Donate regression: 12 responsive states, 28 clicked actions, 3 video states, 4 behaviors
- Vocational regression: 12 responsive states, 20 clicked actions, 3 behaviors
- Volunteer regression: 12 responsive states, 20 actions, 2 form states, 3 video states, 2 redirects
- Travel With Purpose regression: 12 responsive states, 22 actions, 2 form states, 1 redirect
- What We Do regression: 12 responsive states, 26 required actions, 4 behaviors

## Hallmark review

| Axis | Score |
|---|---:|
| Philosophy | 5/5 |
| Hierarchy | 5/5 |
| Execution | 5/5 |
| Specificity | 5/5 |
| Restraint | 5/5 |
| Variety | 5/5 |

Macrostructure: Relationship Ledger. The page varies between split photography, an asymmetric partnership ledger, a deep-teal workforce bridge, historical evidence, a community bridge, a four-step process and one primary inquiry. It avoids the generic corporate card-grid/logo-wall pattern.

## CLIENT CONFIRM

- Final partnership form provider and operational recipient.
- Approval to display Lifestyle Holidays Hotels and Resorts publicly and an approved logo/photo.
- Current status of Rotary-related support and Happy Dolphins before either is presented as current.
- Any approved current partner organizations and logos for future shared partner surfaces.
- Any approved current corporate sponsorship package before publishing tiers or benefits.
