# Volunteer — implementation and QA

Date: 2026-09-16

## Scope

Page 7 only: Volunteer. Routes:

- `/en/volunteer`
- `/es/volunteer`

No production files were deleted. Travel With Purpose was not implemented.

## Files created

- `src/app/[locale]/volunteer/page.tsx`
- `src/app/api/volunteer-application/route.ts`
- `src/components/VolunteerPage.tsx`
- `src/components/VolunteerHeroVideo.tsx`
- `src/components/VolunteerApplicationForm.tsx`
- `src/content/volunteer.ts`
- `src/content/volunteer-release.ts`
- `src/content/redirects.ts`
- `src/i18n/messages/volunteer.en.ts`
- `src/i18n/messages/volunteer.es.ts`
- `src/lib/volunteer-application.ts`
- `scripts/verify-volunteer.mjs`
- `VOLUNTEER_QA.md`

## Files modified

- `src/content/links.ts`
- `src/content/home.ts`
- `src/content/what-we-do.ts`
- `src/content/dove-media.ts`
- `src/proxy.ts`
- `src/app/sitemap.ts`
- `src/app/globals.css`
- `scripts/verify-what-we-do.mjs`
- `package.json`
- `design.md`
- `.hallmark/log.json`

## Media

- Hero video: YouTube `aCY1225xEWc`, starting at 18 seconds through `youtube-nocookie.com`
- Hero poster: `https://i.ytimg.com/vi/aCY1225xEWc/maxresdefault.jpg`
- Dayline face painting: `d88784_ed999cda183348e1861ed5940a550516~mv2.jpg`
- Dayline snack preparation: `d88784_83b606acf2294b8185a77b49b4a470c8~mv2.jpg`
- Full-width community circle: `d88784_f01b04e0f24e47b09cfaedcc44f31160~mv2.jpg`

The video is poster-first, muted, looping, lazy after window load, manually controllable, and remains poster-only under reduced motion or data saver until activated.

## Application and legal release

The UI and validation are complete in both locales. Validation runs on the client and the API route. The API checks same-origin JSON and payload size. No provider or storage system exists in the repository, so valid submissions return HTTP 503 with a clear message. Fields remain populated and no success state is shown.

No `submittedAt` or acceptance record is created until a verified provider accepts the application.

Release metadata:

- version: `2026-migration-v1`
- source: `legacy-wix`
- effective date: pending
- client approved: false
- official language rendered: English

On the Spanish route, the surrounding interface is natural Spanish and a visible notice explains that the official legal agreement remains English pending an approved translation.

## Link audit

| Page | Section | Label | Destination key | Type | Final destination | Status |
|---|---|---|---|---|---|---|
| EN/ES | Header | Donate | `links.giving.general` | External | Network for Good general giving page | Clicked; exact href |
| EN/ES | Hero | Apply to Volunteer | `#application` | In-page | Volunteer application | Clicked; target exists |
| EN/ES | Hero | See a Day with Dove | `#day-with-dove` | In-page | Day with Dove | Clicked; target exists |
| EN/ES | Preparation | Volunteer Guidelines | `links.volunteer.guidelines` | External PDF | Verified Wix PDF URL | Clicked; exact href |
| EN/ES | Preparation | Operations team | `links.email.volunteer` | Mailto | `operations@doveyouthdevelopment.org` | Clicked; exact href |
| EN/ES | How to Start | Start the Application | `#application` | In-page | Volunteer application | Clicked; target exists |
| EN/ES | Application | Operations team | `links.email.volunteer` | Mailto | `operations@doveyouthdevelopment.org` | Clicked; exact href |
| EN/ES | Group bridge | Explore Group Travel | `links.travel` | External | Legacy Group Travel page | Clicked; exact href |
| EN/ES | Newsletter | Submit | `submitNewsletter` | Adapter | No provider configured | Unavailable; no fake success |
| EN/ES | Header | Logo | `links.home(locale)` | Internal | Localized Home | Clicked; exact href |
| EN/ES | Navigation | Get Involved | `links.volunteer.page(locale)` | Internal | Localized Volunteer page | Active and localized |

No link uses a bare `#`.

## Redirect audit

| Legacy route | Locale signal | Destination | Status |
|---|---|---|---|
| `/the-dove-experience` | `dove_locale=es` | `/es/volunteer` | 308 |
| `/volunteer-release` | `dove_locale=en` | `/en/volunteer#application` | 308 |

`/grouptravel` remains unchanged.

## SEO

- One localized H1 per route
- Localized title and description
- Canonical per locale
- EN, ES and x-default alternates
- Localized Open Graph metadata and verified poster image
- Both routes added to the sitemap
- Active Get Involved navigation state

## Accessibility and responsive QA

Automated Axe checks reported 0 WCAG A/AA violations at every tested viewport. Keyboard-focusable native controls, visible focus, explicit labels, inline errors, an accessible scroll region for the complete release, semantic sections and an unchecked release checkbox are present.

Tested in English and Spanish at:

- 320 px
- 375 px
- 414 px
- 768 px
- 1024 px
- 1440 px

All 12 states passed with no horizontal overflow and no broken media. The 1280 × 800 hero fold also passed.

## Hallmark audit

| Axis | Score | Finding |
|---|---:|---|
| Philosophy | 5/5 | Human participation and local leadership remain central; no savior framing |
| Hierarchy | 5/5 | Video invitation leads into dayline, preparation, process and application |
| Execution | 5/5 | Shared tokens/components, verified media, responsive and accessible states |
| Specificity | 5/5 | Puerto Plata, Dove operations, official guidelines and release are concrete |
| Restraint | 5/5 | No invented statistics, decorative card grid, autoplay coercion or fake success |
| Variety | 5/5 | Cinematic hero, editorial split, ruled timeline, full-bleed image, process and form |

## Pending confirmation/configuration

- TODO: CLIENT/LEGAL CONFIRM CURRENT VOLUNTEER RELEASE LANGUAGE
- Approve or replace the official English release version and provide an approved Spanish legal version if desired.
- Select and configure a verified secure volunteer-application delivery/storage provider.
- Confirm whether any fields beyond the current public baseline are required.
- Replace the legacy Group Travel destination when that new page is built.
- Newsletter provider remains unconfigured in the existing shared adapter.

