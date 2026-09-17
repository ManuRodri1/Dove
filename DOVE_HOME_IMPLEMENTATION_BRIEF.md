# DOVE YOUTH DEVELOPMENT — HOME IMPLEMENTATION BRIEF

> Scope: Home page only. Stitch-approved visual direction → Codex production implementation.
> Developer: José Manuel de Jesús Rodríguez — JMDR Digital Solutions
> Current site: https://www.doveyouthdevelopment.org/
> Hero video: https://res.cloudinary.com/vloh9uw1/video/upload/v1789135765/entrega_utiles_DOVE_OF.mp4

## 1. Primary instruction to Codex

Build the **Home page only**. Do not build the rest of the site yet.

Before editing:
- Read `DOVE_MASTER_PROJECT_CONTEXT.md`.
- Read/use the installed Hallmark skill.
- Inspect the repo and report framework, router, styling, fonts, tokens, components, dependencies and media helpers.
- State exactly which files will be created/modified.
- Do not delete production files without approval.
- Treat the Stitch Home as the primary visual reference.
- Do not fabricate copy, metrics, stories, campaigns or images.

## 2. Media strategy

Do **not** use Wix-hosted image URLs as permanent production dependencies.

Use Wix as the legacy media source:

Wix Media Manager → find original Dove asset → download original/highest-quality file → rename clearly → upload to Cloudinary → use Cloudinary URL in Next.js.

Recommended Cloudinary folders:

- `dove/home/`
- `dove/history/`
- `dove/students/`
- `dove/vocational/`
- `dove/sponsorship/`
- `dove/volunteer/`
- `dove/travel/`
- `dove/campaigns/`
- `dove/stories/`
- `dove/partners/`
- `dove/brand/`

Example names:
- `dove-home-hero-poster.jpg`
- `dove-history-youth-center-2009.jpg`
- `dove-leonela-pena.jpg`
- `dove-vocational-training-01.jpg`
- `dove-volunteer-classroom-01.jpg`

## 3. Preserve the Stitch direction

The current Stitch concept is an approved strong base. Do not redesign it from scratch.

Preserve:
- warm neutral background,
- deep teal anchor,
- warm orange CTA accent,
- editorial serif display type,
- clean sans-serif body type,
- authentic photography,
- generous white space,
- restrained cards,
- strong Donate/Sponsor hierarchy,
- warm nonprofit editorial tone.

Hallmark should refine implementation quality, not replace the design language.

## 4. Home section order

1. Header
2. Video Hero
3. Origin Story — From 15 Boys to a Future of Possibility
4. The Dove Pathway — From Childhood to Independence
5. Featured Human Story — Leonela
6. What Your Support Makes Possible
7. Impact — Rooted in Puerto Plata
8. Experience Dove
9. Corporate & Community Partnerships
10. Current Campaign
11. Stories From Dove
12. Final Sponsorship / Donation CTA
13. Footer

## 5. Header

Desktop nav:
- About
- What We Do
- Get Involved
- Our Impact
- Campaigns
- EN / ES
- DONATE

Use the real Dove logo from Wix/client assets. Do not recreate it with text.

Mobile: accessible menu, visible Donate, language switcher, keyboard/focus support.

## 6. Hero

Use the real Cloudinary video:
https://res.cloudinary.com/vloh9uw1/video/upload/v1789135765/entrega_utiles_DOVE_OF.mp4

Requirements:
- autoplay
- muted
- loop
- playsInline
- no default controls
- responsive crop
- poster fallback
- `prefers-reduced-motion`
- optimized delivery
- readable text at every breakpoint
- no layout shift

Headline:
**Creating Futures That Would Otherwise Be Impossible.**

Supporting copy direction:
**For more than 20 years, Dove Youth Development has been creating opportunities for children and young people in Puerto Plata through education, relationships, skills development and community.**

Primary CTA: **Sponsor a Child**
Secondary CTA: **Discover Our Story**
Header CTA: **Donate**

## 7. Origin Story

Heading:
**From 15 Boys to a Future of Possibility**

Do not state that Dove began in 2002 with 15 boys. Keep history copy conservative until client-confirmed.

Suggested staging copy:
**The vision for Dove began in 2002. In the years that followed, the organization grew from its earliest youth programs in Puerto Plata into a broader community focused on education, relationships, skills development and opportunity.**

Add source comment: `TODO: CLIENT CONFIRM HISTORY COPY`.

Preferred image order:
1. real original 15 boys / early Youth Center photo,
2. early Youth Center photo,
3. historical Dove Missions image,
4. historical Liz/community image,
5. temporary placeholder only if needed.

Wix search terms:
`Dove Missions`, `2009`, `15 boys`, `Youth Center`, `Liz`, `history`, `Puerto Plata`.

## 8. The Dove Pathway

Heading:
**From Childhood to Independence**

Stages:
1. Safe Place
2. Education
3. English + Computer Skills
4. Job Readiness
5. Vocational Training
6. Employment / Entrepreneurship
7. A Sustainable Future

Preserve the connected progression feel from Stitch, but avoid seven generic feature cards.

On mobile, intentionally recompose into a readable vertical/stepped journey.

Do not use unsupported claims such as guaranteed job placement, culinary training, financial literacy, carpentry, etc. unless verified.

## 9. Leonela Story

Heading: **Meet Leonela**

Leonela Peña is a real Dove story. Use only verified biographical details.

Required asset: the real Leonela image from Wix/blog/media.

Do NOT use the Stitch child image as Leonela.

Wix search terms:
`Leonela`, `Leonela Peña`, `Lela`, `Lela Surprises`, `entrepreneur`, `student success`.

CTA: **Read Leonela's Story**
Future route: `/stories/leonela-pena`

## 10. What Your Support Makes Possible

Verified main offer:
**Sponsor a Child — $50/month**

Suggested options:
- Sponsor a Child
- Support Education
- Support Vocational Training
- Support a Program
- Become a Strategic Partner

Route direction:
- Sponsor a Child → `/child-sponsorship`
- Support Vocational Training → `/vocational-training-center`
- Support a Program → `/donate` or `/campaigns`
- Strategic Partner → `/partnerships`

Do not invent additional giving amounts or unsupported benefit claims.

## 11. Impact — Rooted in Puerto Plata

Keep the Stitch editorial metric strip rather than dashboard cards.

Safe initial metric:
**20+ Years in Puerto Plata**

Pending verification:
- Young People Served
- Students Trained
- Students in Careers
- Families Supported

Use `—` or explicit dev TODOs until confirmed. Never invent numbers.

## 12. Experience Dove

Heading:
**Don't Just Visit Puerto Plata. Become Part of It.**

Paths:
- Volunteer
- Travel With Purpose
- Corporate & Community Partnerships

Use real volunteer/travel/community photography.

Wix search terms:
`volunteer`, `group travel`, `travel`, `classroom`, `Puerto Plata`, `Dove Experience`.

## 13. Partnerships

Heading direction: **Partner With Dove**

Home should show a concise invitation, not a fake logo wall.

CTA: **Partner With Dove**
Future route: `/partnerships`

Only display verified/approved partner names and logos.

## 14. Current Campaign

The campaign content shown by Stitch is not verified.

Do not publish invented campaign names, goals, progress, equipment purchases or student-seat claims.

Implement the component architecture but populate only with:
- a verified current Dove campaign, or
- clearly marked staging placeholders.

If there is no verified amount, do not show a progress bar.

Ask client: **What is Dove's current fundraising priority/campaign that should be featured on the Home?**

## 15. Stories From Dove

Do not use invented Stitch article titles in production.

Keep the section layout, but use real migrated stories.

Strong candidates:
- Leonela student/entrepreneur story
- Jodelka & Elian success story
- a real volunteer story/newsletter
- a current Dove update

Future route: `/stories/[slug]`

## 16. Final CTA

Headline:
**Every Child Deserves the Opportunity to Imagine a Bigger Future.**

Supporting copy:
**Your support helps make that future possible.**

Primary CTA: **Sponsor a Child**
Secondary CTA: **Donate**

Keep the deep teal, restrained Stitch treatment.

## 17. Footer

Use only verified information.

Include:
- logo,
- short mission,
- navigation,
- support links,
- contact,
- EN/ES,
- privacy/legal.

Do not publish `501(c)(3) Accredited` unless formally approved.
Prefer verified legal language only after confirmation.

## 18. Asset inventory

Create and maintain this map during implementation:

| Section | Asset | Source | Status | Cloudinary URL |
|---|---|---|---|---|
| Hero | delivery/supplies video | Cloudinary | READY | existing URL |
| Hero | poster frame | create | TODO | |
| Origin Story | historical Dove image | Wix | FIND | |
| Leonela | real Leonela photo | Wix/blog | FIND | |
| Support | sponsorship image if needed | Wix | FIND | |
| Experience | volunteer/travel image | Wix | FIND | |
| Campaign | current campaign media | client/Wix | CONFIRM | |
| Stories | story 1 image | Wix/blog | FIND | |
| Stories | story 2 image | Wix/blog | FIND | |
| Stories | story 3 image | Wix/blog | FIND | |
| Brand | Dove logo | Wix/client | FIND | |

Do not use AI-generated substitute portraits for real Dove people.

## 19. Image implementation

- Use Next.js image handling where appropriate.
- Configure Cloudinary remote patterns.
- Use responsive sizes.
- Avoid oversized source delivery.
- Add meaningful alt text.
- Decorative imagery gets empty alt.
- Preserve faces/focal points.
- Optimize mobile crops separately where needed.

## 20. Responsive checks

Verify at least:
- 320px
- 375px
- 414px
- 768px
- 1024px
- 1440px+

Check:
- hero video crop,
- headline wrapping,
- header behavior,
- Dove Pathway readability,
- support section scale,
- metric strip,
- story layout,
- button text wrapping,
- horizontal overflow.

## 21. Accessibility

Include:
- semantic landmarks,
- keyboard navigation,
- visible focus,
- accessible mobile menu,
- sufficient contrast,
- meaningful alt text,
- reduced-motion support,
- correct heading hierarchy,
- descriptive links.

## 22. Home SEO

Draft title:
**Dove Youth Development | Creating Futures in Puerto Plata**

Draft description:
**Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.**

Treat both as drafts until approved.

Use semantic HTML, one intentional H1, Open Graph, canonical and only verified Organization structured-data fields.

## 23. Bilingual preparation

Initial Home can be English-first, but components must be ready for Spanish.

Do not assume English-only string lengths.
Do not hardcode locale logic deep inside visual components.

## 24. Suggested component breakdown

Adapt to repo conventions:
- `Header`
- `HeroVideo`
- `OriginStory`
- `DovePathway`
- `FeaturedStory`
- `SupportWays`
- `ImpactStrip`
- `ExperienceDove`
- `PartnershipCallout`
- `FeaturedCampaign`
- `StoriesGrid`
- `FinalCTA`
- `Footer`

Do not over-componentize text fragments.

## 25. First milestone

Deliver a production-quality Home shell that matches the approved Stitch direction and uses:
- real hero video,
- real Dove branding,
- real assets where already available,
- explicit placeholders/TODOs where content remains unverified.

At the end, report:
1. files created/modified,
2. design tokens,
3. fonts,
4. components,
5. real assets connected,
6. assets still needed from Wix,
7. copy/data awaiting client confirmation,
8. responsive status,
9. accessibility issues,
10. performance issues,
11. Hallmark audit/self-critique result.

Do not declare the Home complete while fabricated or unresolved content remains.
