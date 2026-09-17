# Travel With Purpose — implementation and QA

Date: 2026-09-16

## Scope

Page 8 only: Travel With Purpose.

- English: `/en/travel-with-purpose`
- Spanish: `/es/travel-with-purpose`

No production files were deleted. Corporate & Community Partnerships was not started.

## Files created

- `src/app/[locale]/travel-with-purpose/page.tsx`
- `src/app/api/group-experience-inquiry/route.ts`
- `src/components/TravelWithPurpose.tsx`
- `src/components/GroupExperienceInquiryForm.tsx`
- `src/content/travel-with-purpose.ts`
- `src/i18n/messages/travel-with-purpose.en.ts`
- `src/i18n/messages/travel-with-purpose.es.ts`
- `src/lib/group-experience-inquiry.ts`
- `scripts/verify-travel-with-purpose.mjs`
- `TRAVEL_WITH_PURPOSE_QA.md`

## Files modified

- `src/content/links.ts`
- `src/content/home.ts`
- `src/content/volunteer.ts`
- `src/content/dove-media.ts`
- `src/content/redirects.ts`
- `src/proxy.ts`
- `src/app/sitemap.ts`
- `src/app/globals.css`
- `scripts/verify-volunteer.mjs`
- `package.json`
- `design.md`
- `.hallmark/log.json`

## Legacy migration

`/grouptravel` now issues a permanent locale-aware 308 redirect. Verified example:

- Cookie `dove_locale=es`
- Destination `/es/travel-with-purpose`

Existing `/the-dove-experience` and `/volunteer-release` redirects remain unchanged.

## Media

Hero:

- Key: `doveMedia.travel.hero`
- URL: `https://static.wixstatic.com/media/d88784_10b87cc651b8478b964bbb90adb56a63~mv2.jpg`
- Placement: image-led split hero
- Reason: client-designated `Volunteer_5.jpg`, already associated with the legacy Group Travel experience

Additional media:

- `doveMedia.travel.facePainting`
  - `https://static.wixstatic.com/media/d88784_ed999cda183348e1861ed5940a550516~mv2.jpg`
  - Experience / creativity
- `doveMedia.travel.snackPreparation`
  - `https://static.wixstatic.com/media/d88784_83b606acf2294b8185a77b49b4a470c8~mv2.jpg`
  - Experience / daily program rhythm
- `doveMedia.travel.groupCircle`
  - `https://static.wixstatic.com/media/d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`
  - Full-width human connection transition

No stock destination image or random gallery was introduced.

## Migrated facts

The page uses the following source-supported statements:

- Groups participate with Dove staff and teachers inside current Dove programming.
- Activities may include educational support, creative activities, cultural learning, and coordinated group contributions.
- Dove describes flexible visits ranging from half day to multi-week experiences.
- Itineraries may be customized around time, group goals, strengths and current opportunities.
- Groups may discuss a special skill, talent or activity with Dove.
- The legacy program describes coordination involving lodging, transportation and excursions.
- Puerto Plata experiences may include food, culture, beach, mountains, outdoor activities, music and dance.
- An inquiry starts a planning conversation and is not a confirmed booking.

Anonymous legacy testimonials, current partner claims, prices, package costs, capacity figures and historical event prices were excluded.

## Logistics status

The copy consistently says Dove may help coordinate logistics and that final arrangements must be confirmed directly. It does not say Dove owns or directly provides hotels, transportation or excursions.

Internal flags:

- `TODO: CLIENT CONFIRM CURRENT GROUP LOGISTICS OFFERING`
- `TODO: CLIENT CONFIRM GROUP TRAVEL INQUIRIES SHOULD CONTINUE TO EXECUTIVE DIRECTOR`
- `TODO: CLIENT CONFIRM CURRENT GROUP EXPERIENCE PRICING / MINIMUM DONATION MODEL`

## Inquiry form

Fields implemented:

- Full name *
- Email *
- Phone
- Group / organization name
- Optional broad group type
- Estimated group size *
- Preferred start date *
- Alternate or flexible dates
- Approximate duration
- About the group
- Skills, interests or activities
- Interest in discussing lodging
- Interest in discussing transportation
- Interest in discussing local experiences or excursions
- Locale

The group inquiry does not contain the Volunteer Release and does not create a booking, payment, deposit or legal acceptance.

### Backend

Client and server validation are complete. The API enforces JSON, same-origin requests and a 30 KB payload limit.

No verified provider or secure storage system exists in the repository. Valid submissions therefore return HTTP 503, preserve the form fields and show an explicit unavailable message. No success state, `submittedAt` or delivery record is created.

Intended initial recipient:

- `links.email.groupTravel`
- `mailto:executivedirector@doveyouthdevelopment.org`

## Volunteer relationship

- Individual Volunteer page: localized `/volunteer`
- Participant requirements: localized `/volunteer#application`
- Volunteer Guidelines: `links.volunteer.guidelines`
- The official release remains owned by the Volunteer page and is not duplicated here.

## Link audit

| Section | Label | Type | Link key | Final destination/action | Status |
|---|---|---|---|---|---|
| Header | Donate | External | `links.giving.general` | Verified Network for Good general giving page | Clicked; exact href |
| Hero | Plan Your Group Experience | In-page | `#group-inquiry` | Group inquiry | Clicked; target exists |
| Hero | Explore the Experience | In-page | `#experience` | Experience section | Clicked; target exists |
| Planning | Volunteer Guidelines | External PDF | `links.volunteer.guidelines` | Verified Wix PDF | Clicked; exact href |
| Planning | Participant Volunteer Application | Internal | `links.volunteer.page(locale)#application` | Localized Volunteer application | Clicked; exact href |
| Inquiry | Send Group Inquiry | Adapter | `submitGroupExperienceInquiry()` | API returns 503 until provider exists | Validated; no fake success |
| Inquiry | Executive director | Mailto | `links.email.groupTravel` | `executivedirector@doveyouthdevelopment.org` | Clicked; exact href |
| Individual bridge | Explore Volunteering | Internal | `links.volunteer.page(locale)` | Localized Volunteer page | Clicked; exact href |
| Header navigation | Get Involved | Internal | Shared navigation | Localized Volunteer hub route | Active and clicked |
| Footer navigation | Travel With Purpose | Internal | `links.travel.page(locale)` | Localized Travel page | Clicked; exact href |
| Header | Logo | Internal | `links.home(locale)` | Localized Home | Clicked; exact href |
| Newsletter | Submit | Adapter | `submitNewsletter()` | Provider unavailable | No fake success |

No link uses a bare `#`.

## Localization and SEO

- Complete English and natural Spanish content
- One H1 per locale
- Localized title and meta description
- Localized canonical
- EN, ES and x-default alternates
- Localized Open Graph metadata using the verified hero
- Visible FAQ exactly matches FAQPage structured data
- Both localized routes added to sitemap
- Internal links preserve locale
- Get Involved active navigation state

## Accessibility and responsive QA

Automated Axe checks reported 0 WCAG A/AA violations at every tested viewport. The form uses fieldsets, legends, labels, native inputs, explicit required validation, focusable controls, inline errors and an aria-live status.

English and Spanish were tested at:

- 320 px
- 375 px
- 414 px
- 768 px
- 1024 px
- 1440 px

All 12 states passed with no horizontal overflow and no broken media. Mobile reading order, group durations, full-width image, logistics, Spanish copy and inquiry form were exercised.

## Performance

- No video or iframe
- Only hero image is prioritized
- Three below-fold images are lazy loaded
- Responsive Next Image delivery
- No gallery, carousel or animation library

## Hallmark audit

| Axis | Score | Finding |
|---|---:|---|
| Philosophy | 5/5 | Shared learning and local leadership replace savior framing |
| Hierarchy | 5/5 | Group intent moves clearly from experience to planning |
| Execution | 5/5 | Locked tokens, shared primitives, real imagery and complete states |
| Specificity | 5/5 | Puerto Plata, group duration, logistics and Dove safeguards are concrete |
| Restraint | 5/5 | No prices, packages, anonymous testimonials, partner logos or unsupported promises |
| Variety | 5/5 | Split hero, staggered documentary moments, duration ledger, full-bleed transition, manifesto and inquiry |

## Pending client/configuration items

- Confirm the current logistics offering, including lodging, airport/local transportation, excursions and meals.
- Confirm the executive director remains the correct recipient for group inquiries.
- Confirm the current pricing or minimum-donation model before publishing any amount.
- Select and configure a verified secure inquiry delivery/storage provider.
- Confirm any additional participant requirements before launch.
- Newsletter provider remains unconfigured in the shared site adapter.

