# Dove Home — implementation report

Home-only review milestone. The application shell is implemented; client content dependencies remain before public launch. No other site pages, checkout, CMS or Spanish version were built or deployed.

## 1. Repository findings and implementation

The initial workspace contained only `DOVE_MASTER_PROJECT_CONTEXT.md`, `DOVE_HOME_IMPLEMENTATION_BRIEF.md`, and `REPO DE IMAGENES.xlsx`. No application framework, routing, styling, fonts, tokens, components, media helper, i18n, dependencies, `next/image`, design system or `design.md` existed.

Introduced Next.js **16.3.5**, React/React DOM **19.3.0**, TypeScript and App Router. `/` is the only implemented content route. Styling uses plain tokenized CSS; no Tailwind, UI kit, animation package, CMS or full i18n system. English strings are grouped for future localization.

The latest user request takes precedence over older instructions in the repository brief: legacy images stay at their public Wix URLs; no Wix photos were downloaded into the repository or uploaded elsewhere.

## 2. Files created

- Setup: `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `eslint.config.mjs`, `.gitignore`, `.env.example`.
- Design and handoff: `tokens.css`, `design.md`, `README.md`, `IMPLEMENTATION_REPORT.md`, `.hallmark/preflight.json`, `.hallmark/log.json`.
- App: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.
- Content: `src/content/home.ts`, `src/content/dove-media.ts`.
- Components: `src/components/Header.tsx`, `HeroVideo.tsx`, `HomeSections.tsx`, `FeaturedCampaign.tsx`, `StoriesFromDove.tsx`, `Footer.tsx`, `ui.tsx`.
- QA: `scripts/verify-home.mjs`; generated screenshots and JSON results under ignored `artifacts/`.
- Framework-generated: `AGENTS.md`, `CLAUDE.md`. Next.js generated these version-specific guidance files during development.

**Original files modified: none. Files deleted: none.** Build/cache files (`.next`, `node_modules`, TypeScript cache) are ignored. Newly created implementation files were refined during QA.

## 3. Components created

Header, LanguageSwitch, HeroVideo, OriginStory, DovePathway, FeaturedStory, SupportWays, ImpactStrip, ExperienceDove, PartnershipCallout, FeaturedCampaign, StoriesFromDove, FinalCTA, Footer. Shared Home primitives: Action, TextLink, SectionHeading, Photo, Icon.

The page assembles these components rather than embedding all sections into a monolithic component. Most sections render on the server. Interactive client components are the header/language controls and video.

## 4. Fonts and tokens

**Playfair Display Variable** for editorial headings; **Manrope Variable** for body/navigation. Both are open-font packages, served locally through `next/font/local`; no runtime Google Fonts request. Only Latin normal variable files are shipped: **63,240 bytes total** before transfer compression.

`tokens.css` defines deep teal, darker teal, teal-soft, heading ink, warm orange actions, darker orange text, off-white paper, white, deeper paper, body/muted text, border/focus colors, contrast overlays, named spacing, type scale, font roles, line heights, tracking, container width, radii, borders, shadows, easing, duration and header layering.

Primary anchors: teal `oklch(39.27% 0.0556 195.13)`, heading ink `oklch(41.04% 0.0725 215.11)`, action orange `oklch(57.2% 0.1457 46.7)`, paper `oklch(97.5% 0.008 85)`. Container max: 1176px. Major radii: 24px/16px. The source of truth and migration adapters are in `design.md`.

## 5. Exact media used

All source URLs are centralized in `src/content/dove-media.ts`. `next/image` remote patterns allow the supplied Wix media path and this Cloudinary account; below-fold photos lazy-load with responsive sizes and reserved dimensions.

| Section | Approved remote source | Treatment |
|---|---|---|
| Header/footer logo | https://static.wixstatic.com/media/294108_5540425cbe8648ff94b4acce95758bf1~mv2.png | Actual supplied logo; no text recreation |
| Hero original | https://res.cloudinary.com/vloh9uw1/video/upload/v1789135765/entrega_utiles_DOVE_OF.mp4 | Actual approved video |
| Hero desktop delivery | https://res.cloudinary.com/vloh9uw1/video/upload/w_1440,q_auto,f_mp4/v1789135765/entrega_utiles_DOVE_OF.mp4 | 1440px optimized rendition of the same source |
| Hero mobile delivery | https://res.cloudinary.com/vloh9uw1/video/upload/w_720,q_auto,f_mp4/v1789135765/entrega_utiles_DOVE_OF.mp4 | 720px rendition |
| Hero poster | https://res.cloudinary.com/vloh9uw1/video/upload/so_1,w_1600,q_auto,f_jpg/v1789135765/entrega_utiles_DOVE_OF.jpg | Frame at one second from the same video |
| Origin/history | https://static.wixstatic.com/media/d88784_c623d3c93caa478dada0b6bfbe9c25c1~mv2.jpeg | `Dove Missions.jpeg`; primary retained after crop review |
| Experience: Volunteer | https://static.wixstatic.com/media/d88784_10b87cc651b8478b964bbb90adb56a63~mv2.jpg | `Volunteer_5.jpg` |
| Experience: Travel With Purpose | https://static.wixstatic.com/media/d88784_ad2f24185b9343c0977bcf0f61c12795~mv2.jpg | `Elon_30.jpg` |
| Campaign development preview only | https://static.wixstatic.com/media/d88784_f8c3172be1074bfb8d851ab7451d9dfe~mv2.jpg | `Kids_42.jpg`; explicitly not evidence of a campaign |

Leonela has **no photograph** until a verified portrait is supplied. Stories use neutral development media slots. Pathway, support, impact, partnership and final CTA are typographic. The sponsorship primary (`Kids_195.jpg`: https://static.wixstatic.com/media/d88784_44242d83e5054c4b8c70b72f04061da1~mv2.jpg) is centralized but not rendered because the approved support composition does not need an additional photo. The alternate logos, history fallbacks and primary vocational asset are also available in the registry without being unnecessarily loaded.

## 6. Pending content and production visibility

| Item | Current treatment | Source marker/config |
|---|---|---|
| History | User-supplied conservative staging paragraph | `TODO: CLIENT CONFIRM FINAL HISTORY COPY` |
| Leonela | Name and approved student-to-entrepreneur framing only; neutral portrait slot | `TODO: REPLACE WITH VERIFIED LEONELA PHOTO` |
| Impact | 20+ years; all four remaining values are em dashes | `TODO: CLIENT CONFIRM IMPACT METRICS` |
| Active campaign | `featuredCampaign = null`; marked layout preview in development | `TODO: CLIENT CONFIRM CURRENT CAMPAIGN` |
| Stories | Three candidates with `pendingMigration` status; no fabricated articles | `stories` content objects |
| Legal wording | Omitted; no tax or accreditation claim | `TODO: CLIENT CONFIRM LEGAL NONPROFIT WORDING` |
| Contact data | Contact route only; no unverified phone/email copied from screenshots | `TODO: CLIENT CONFIRM CONTACT DETAILS` |

**Hidden in production:** unverified campaign section and all pending Stories From Dove entries (the whole section when none are published). Development previews are controlled by `NODE_ENV === "development"`; they cannot be switched on through a production preview flag.

**Intentionally still visible:** neutral Leonela portrait treatment and the pending impact dashes, both allowed by the brief. History remains conservative staging copy and requires approval. These dependencies prevent treating this milestone as launch-ready content.

## 7. Responsive and accessibility verification

Browser automation uses Playwright with installed Microsoft Edge and axe-core. Development and production were checked independently.

| Width | Overflow | Broken images | Automated WCAG A/AA findings |
|---:|---|---|---:|
| 320px | None | None | 0 |
| 375px | None | None | 0 |
| 414px | None | None | 0 |
| 768px | None | None | 0 |
| 1024px | None | None | 0 |
| 1440px | None | None | 0 |

Tests inspect actual descendant bounds in addition to root scroll width, so `overflow-x: clip` does not conceal failing layout. Visual review found and corrected narrow media-slot expansion and overly tight 1024px pathway columns. The pathway now stays vertical below 1280px; desktop uses a connected row with extra space for Employment / Entrepreneurship. Photos/text stack on small screens. Sponsorship remains content-sized on mobile.

Verified interactions: menu open/close, Escape returning focus to the trigger, honest Spanish notice, desktop hero CTA fitting at 1280×800, actual muted/looping/inline video playback, pause/resume, no initial video source under reduced motion, and poster fallback when video requests are deliberately blocked.

Semantic landmarks, a skip link, one H1, ordered pathway, definition-list metrics, descriptive link labels, meaningful photo alt text, visible focus, 44px main touch controls and reduced-motion styling are implemented. No audio-only information is required. Automated tests are not a full assistive-technology certification; a screen-reader and physical-device review remain appropriate before launch.

## 8. SEO

Draft title/description match the request. `lang="en"`, one H1, semantic sections, Open Graph title/description/image and canonical groundwork exist. Canonical/OG URL uses `SITE_URL`; indexing is off by default until `SITE_INDEXABLE=true` is explicitly set for the approved deployment. No fabricated Organization schema, Spanish hreflang, unbuilt-page sitemap or legal identity is emitted.

## 9. Performance observations

- Production build statically prerenders `/`; no content database or runtime CMS request.
- Two locally hosted variable WOFF2 font files, 63,240 bytes combined; `next/font` fallback adjustment and font swap.
- Optimized responsive Next Image output and lazy loading below the fold. Reserved media geometry; only header logo/hero still receive preload treatment.
- Hero video starts after critical page load and uses 720px/1440px Cloudinary delivery. Reduced motion/data saver leaves the source unset. Hidden-tab video pauses. Poster survives blocked video.
- No animation library, carousel, parallax, remote font stylesheet or analytics payload introduced.
- Verified production build and lint. Install audit reported no vulnerabilities at implementation time.
- No Lighthouse score or field Core Web Vitals result is claimed. CDN cold caches, video bytes, deployment hardware and real network conditions still need measurement after hosting is chosen.

## 10. Hallmark final self-critique

| Axis | Score / 5 | Reason |
|---|---:|---|
| Philosophy | 5 | Rooted, dignity-centered fundraising and participation hierarchy |
| Hierarchy | 5 | Clear hero, primary sponsorship, quiet secondary paths |
| Execution | 4 | Responsive/axe checks pass; physical-device/assistive-technology review remains |
| Specificity | 4 | Actual Dove logo/media and Puerto Plata story; verified portrait/story assets still pending |
| Restraint | 5 | No invented figures, legal badges, partner wall, decorative blobs or excessive animation |
| Variety | 5 | Alternating splits, linear pathway, asymmetric support, metric strip, image-led involvement, editorial previews |

The Hallmark checklist was reviewed against the locked system. No unresolved critical or major implementation/design findings. Approved-reference exceptions are documented rather than disguising them as a blanket raw “58/58”: the Stitch navigation shape, repeated small section eyebrows and centered final appeal are deliberately retained per the user’s explicit instruction. Small pathway/card text has shorter measure than long-form prose by design. Theme diversification is suspended because this is the approved client system.

Audit summary: **0 critical · 0 major · 0 unresolved minor implementation findings**. Pending content is tracked separately above and below, not treated as a design-audit pass for public launch.

## 11. Differences from Stitch and why

1. Actual video and Dove archive/volunteer/travel imagery replace generated concept imagery.
2. Conservative history copy avoids conflating the 2002 vision with the earliest 15-boy program date.
3. Leonela’s neutral slot replaces the unverified child portrait; invented quote/biography removed.
4. Pathway uses connected open columns instead of seven identical cards; becomes a vertical sequence earlier to protect legibility.
5. Support copy omits unverified tuition, meals, checkups and receipt guarantees. Only $50/month remains.
6. Impact retains em dashes, without public “Metric to confirm” labels.
7. Experience uses two real images plus a typographic partnership entry, as explicitly recommended in the latest request.
8. Campaign and story sections are layout previews only in development and omitted from production until verified.
9. Footer omits unverified phone/email and tax/accreditation block; keeps confirmed location and navigation. Copyright uses the current year.
10. Orange is slightly darkened for button contrast, and small orange text has its own darker token. Fonts are close visual candidates, not claimed exact Stitch font identification.
11. Pause/play control and accessible mobile/language controls are added for usability. Spanish explains availability rather than navigating to a nonexistent translated page.

## CONTENT NEEDED FROM CLIENT

- Final history chronology and approval of the “15 Boys” heading and staging paragraph.
- Approved short Leonela story and any exact quote permitted for Home.
- Verified totals, definitions and reporting period for young people served, students trained, students in careers and families supported.
- Current campaign title, description, status, destination and any genuinely tracked funding numbers.
- Migrated/approved story copy, titles, categories, slugs and publication status.
- Approved nonprofit/legal wording, contact details and privacy-policy destination/content.
- Approval of sponsorship/program copy, SEO title/description and final canonical domain.
- Spanish translations in a later milestone; donation/payment destinations when those pages are authorized.

## ASSETS STILL NEEDED

- Verified Leonela portrait with approved usage and crop.
- Verified story photographs for Leonela, Jodelka & Elian and any selected volunteer/news item, accurately associated with their subjects.
- Approved active-campaign image; the development archive photo is not a verified campaign asset.

No additional stock photography or invented partner logos are needed.

## Review and continuation

Use the development preview to review the full section architecture, including explicit editorial placeholders. Use the production preview to inspect publication safeguards. Planned external page routes intentionally return Next.js 404 until future work is authorized. This is documented behavior, not a completed donation/navigation journey. Review Home before implementing other pages.
