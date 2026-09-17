# DOVE YOUTH DEVELOPMENT — MASTER PROJECT CONTEXT

> **Purpose of this file:** Persistent project brief for Codex and future AI-assisted implementation.
> Read this file before making any design, architecture, content, or implementation decision for this project.
>
> **Project owner / developer:** José Manuel de Jesús Rodríguez — JMDR Digital Solutions
> **Client:** Dove Youth Development
> **Current website:** https://www.doveyouthdevelopment.org/
> **Current primary donation platform:** Network for Good / Bonterra
> **Current website platform:** Wix (access/ownership still to be confirmed)
> **Domain management:** GoDaddy is expected/being verified with the client
> **Primary public language:** English
> **Required secondary language:** Spanish

---

# 1. NON-NEGOTIABLE AI / DESIGN INSTRUCTION

## Hallmark is mandatory for UI work

The Hallmark skill is already installed for Codex:

https://github.com/nutlope/hallmark

Before designing or implementing a new page, major page section, or visual redesign:

1. Read this project brief.
2. Invoke/use the installed **Hallmark** skill.
3. Inspect the existing codebase before changing files.
4. Preserve any established design tokens and project conventions once created.
5. Run Hallmark's anti-slop/self-critique rules before considering the page complete.

This project MUST NOT look like a generic AI-generated nonprofit landing page.

Hallmark principles that are especially important here:

- Structural variety, not only color/style variation.
- Do not fall into a repetitive hero → 3 cards → CTA → footer template.
- Do not invent metrics, testimonials, donor counts, success rates, partners, awards, addresses, or results.
- Once design tokens are established, use them consistently rather than improvising colors/fonts inside components.
- Responsive behavior must be deliberately verified at small mobile widths.
- Do not use fake browser/device chrome.
- Do not use italic display headings as a generic AI aesthetic.
- Avoid excessive rounded cards, glassmorphism, gradients, decorative blobs, and generic startup UI.
- Every design pass should be specific to Dove's story, people, Puerto Plata, fundraising goals, and real content.

When the visual system is approved, create/maintain a root-level `design.md` so future pages inherit one coherent Dove system rather than being independently restyled.

---

# 2. PROJECT VISION

This is NOT simply a redesign of the existing Dove website.

The client wants the new site to become a:

- fundraising tool,
- storytelling platform,
- engagement platform,
- program discovery experience,
- volunteer/travel entry point,
- partnership acquisition tool,
- campaign platform,
- bilingual resource,
- and SEO/content engine.

The redesign must help a new visitor quickly understand:

1. Who Dove Youth Development is.
2. Who Dove serves.
3. How Dove changes a young person's future.
4. Why Dove is credible.
5. How someone can help.
6. What their support can make possible.
7. What action they should take next.

The experience should connect Dove's programs into one cohesive life-development story instead of presenting unrelated offerings.

---

# 3. CORE BRAND / EMOTIONAL DIRECTION

The client explicitly wants the site to feel:

- Warm
- Joyful
- Authentic
- Dominican
- Human
- Hopeful
- Relationship-based
- Community-centered
- Professional enough for major donors and institutional partners

The site must NOT feel:

- overly corporate,
- like a cold international NGO,
- like a generic charity template,
- like a SaaS/startup landing page,
- visually sterile,
- pity-driven,
- or over-designed.

## Photography direction

Prefer REAL Dove photography and video wherever possible.

Prioritize imagery of:

- children and young people participating in Dove programs,
- teachers,
- volunteers,
- families,
- education,
- vocational training,
- community events,
- Puerto Plata,
- authentic interaction,
- success and growth,
- real moments rather than generic stock imagery.

People must be represented with dignity, agency, personality, optimism, and humanity.

Avoid stereotypical poverty imagery.

---

# 4. PRIMARY BUSINESS / UX OBJECTIVES

The redesigned site must:

- Improve navigation and the overall user journey.
- Reduce and better organize CTAs.
- Reorganize and simplify content.
- Improve the overall visual design.
- Optimize the donation journey.
- Add a Spanish version.
- Create a stronger blog/content structure for SEO.
- Make Child Sponsorship highly visible.
- Elevate the Vocational Training Center as a flagship/future-focused initiative.
- Elevate volunteer experiences.
- Reframe "Group Travel" as **Travel With Purpose**.
- Add a dedicated **Corporate & Community Partnerships** path.
- Communicate real impact through stories and verified numbers.
- Support current and future fundraising campaigns.
- Make campaign creation reusable rather than one-off.
- Preserve full administrative ownership for Dove after project completion.

---

# 5. APPROVED HIGH-LEVEL INFORMATION ARCHITECTURE

The project scope remains organized around approximately 14 core page structures.

## Main navigation

### ABOUT
- Our Story
- Our Team
- Our Partners

### WHAT WE DO
- Child & Youth Development
- Education & English
- Job Readiness
- Vocational Training
- Family & Community Support

### GET INVOLVED
- Sponsor a Child
- Volunteer
- Travel With Purpose
- Corporate & Community Partnerships

### OUR IMPACT
- Stories of Change
- Impact by the Numbers
- Where They Are Now
- News & Updates
- Financial Transparency

### CAMPAIGNS
- Current Campaign
- Climb With Purpose
- Future Campaigns

### DONATE
Prominent persistent CTA.

### LANGUAGE
English | Español

---

# 6. CORE PAGE STRUCTURES

1. **Home**
2. **Our Story**
3. **Our Team & Partners**
4. **What We Do**
5. **Child Sponsorship**
6. **Vocational Training Center**
7. **Volunteer**
8. **Travel With Purpose**
9. **Corporate & Community Partnerships**
10. **Our Impact**
11. **Campaigns**
12. **Donate**
13. **Stories & News**
14. **Contact**

Do not interpret every subsection as a mandatory separate route. Use strong internal architecture, anchors, reusable content models, and subpages only when content volume justifies them.

---

# 7. THE CENTRAL STORY: "THE DOVE PATHWAY"

This should become one of the strongest organizing concepts in the website.

The client's preferred concept is:

**FROM CHILDHOOD TO INDEPENDENCE**

Safe Place  
↓  
Education  
↓  
English + Computer Skills  
↓  
Job Readiness  
↓  
Vocational Training  
↓  
Employment / Entrepreneurship  
↓  
A Sustainable Future

This concept explains how Dove changes a life more clearly than presenting isolated programs.

Use it visually and narratively throughout the site where appropriate.

Do NOT claim every participant necessarily completes the exact same linear journey unless the client confirms that. It is a storytelling framework, not a fabricated outcome guarantee.

---

# 8. DEVELOPMENT PHASE 1 — HOME PAGE FIRST

The Home page is the first page to be designed and implemented.

## Workflow

### Step A — Visual exploration in Google Stitch
Before committing to production code:

- Create/refine the Home concept in Google Stitch.
- Use the approved strategy in this document.
- Test hierarchy, section rhythm, photography/video usage, CTAs, and storytelling.
- Refine until the visual direction feels distinctive and aligned with Dove.

### Step B — Lock the design direction
After approval:

- Translate the accepted visual DNA into a reusable system.
- Establish typography, palette, spacing, grid, imagery rules, button behavior, motion, and responsive rules.
- Create/maintain `design.md` in the project root.
- Use the same system across future pages.

### Step C — Implement in Codex
Only after the design direction is sufficiently clear:

- Build production-ready components.
- Preserve accessibility, SEO, performance, responsive behavior, and future CMS/data needs.
- Use Hallmark during implementation and final audit.

---

# 9. HOME PAGE — APPROVED STORY ARCHITECTURE

The Home page is a fundraising/storytelling hub, not a directory of every page.

The page should have deliberate rhythm and should NOT make every section look like the same card component.

The exact visual macrostructure should be chosen with Hallmark after inspecting the final Stitch direction.

## Section 1 — Header / Navigation

Simple navigation with:

- About
- What We Do
- Get Involved
- Our Impact
- Campaigns
- English / Español
- Donate

Use dropdowns where useful.

**Donate** remains the strongest persistent CTA.

Keep the header clear and compact.

---

## Section 2 — HERO WITH VIDEO

### Hero media

Use this Cloudinary video as the first hero candidate:

https://res.cloudinary.com/vloh9uw1/video/upload/v1789135765/entrega_utiles_DOVE_OF.mp4

The video should support emotion and authenticity, not behave as decoration.

### Hero messaging direction

The client prefers moving away from the generic:

> "Changing Lives, One Child at a Time."

Preferred direction:

> **Creating Futures That Would Otherwise Be Impossible.**

Supporting copy direction:

> For more than 20 years, Dove Youth Development has been creating opportunities for children and young people in Puerto Plata through education, relationships, skills training and community.

Potential CTA hierarchy:

Primary:
- **Sponsor a Child** OR **Make a Difference**

Secondary:
- **Our Story** / **Discover Dove**

Do not use three or four equal hero CTAs.

### Hero video behavior requirements

Codex must implement the video carefully:

- autoplay,
- muted by default,
- loop,
- playsInline,
- no intrusive controls in the default hero state,
- accessible fallback/poster image,
- readable text at all breakpoints,
- overlay only as strong as needed for contrast,
- preserve meaningful focal points when cropping,
- desktop and mobile may require different object-position/crop strategy,
- respect `prefers-reduced-motion`,
- do not autoplay motion for users who prefer reduced motion,
- avoid loading unnecessary video bytes before they are useful,
- optimize Cloudinary delivery/transformation if possible,
- use responsive/source strategies if appropriate,
- do not sacrifice Core Web Vitals for the hero video.

If the video crop is weak on a breakpoint, prefer a deliberate alternate crop/poster rather than forcing `object-fit: cover` everywhere.

---

## Section 3 — Origin Story

Heading direction:

> **From 15 Boys to a Future of Possibility**

Story direction:

Dove began in 2002 with an original group of 15 boys in Puerto Plata and evolved over more than two decades into a broader youth-development organization.

The client considers Dove's history a core credibility story.

Keep copy concise on Home.

CTA:
- **Our Story →**

IMPORTANT:
All historical claims and exact numbers must be validated with the client/current source content before launch.

---

## Section 4 — The Dove Pathway

Heading direction:

> **From Childhood to Independence**

Show the life-development pathway visually:

Safe Place → Education → English + Computer Skills → Job Readiness → Vocational Training → Employment / Entrepreneurship → A Sustainable Future

This should be a signature section.

Avoid turning every step into an identical generic card.

Explore a visual progression, timeline, editorial sequence, or another Hallmark-approved structure.

---

## Section 5 — Real Student Story

Signature storytelling section.

Client example:

> **Meet Leonela**

Direction:
- large authentic photograph,
- concise story,
- clear transformation/outcome,
- human language,
- no exaggerated claims.

Potential treatment:

> Dove Student → Entrepreneur

CTA:
- **Read Leonela's Story**

Use real source content only.
Do not invent biography details.

---

## Section 6 — What Your Support Makes Possible

This is a key fundraising section.

Potential categories:

- Sponsor a Child
- Support education
- Support vocational training
- Support a classroom/program
- Become a strategic partner

The client suggested possible example giving levels such as:

- $50/month — Sponsor a Child
- $600 — Support a Child for One Year
- $1,000 — Support Vocational Training
- $5,000 — Support a Classroom / Program
- $10,000+ — Become a Strategic Partner

**CRITICAL:** Only the $50/month sponsorship concept is known from existing/client context. ALL other amounts must remain placeholders until the client verifies actual costs and approved giving levels.

Never publish unverified amounts as facts.

---

## Section 7 — Impact by the Numbers

Use large, human, editorial numbers rather than dashboard KPI cards.

Possible metrics to confirm:

- Years serving Puerto Plata
- Young people served
- Students trained
- Students placed in jobs
- Families supported
- Volunteers welcomed

Do not invent values.

Until verified, use explicit placeholders such as:

`—`
`Metric to confirm`

or omit the metric entirely.

---

## Section 8 — Experience Dove / Get Involved

Direction:

> **Don't Just Visit Puerto Plata. Become Part of It.**

Possible paths:

- Volunteer
- Travel With Purpose
- Corporate Groups
- Community Groups
- Schools / Churches / Organizations, where confirmed

Give the section a strong experiential identity.

This section can also introduce strategic partnerships such as **Lifestyles × Dove Youth Development**, but only after exact naming/permissions/content are verified with the client.

---

## Section 9 — Current Campaign

The Home page should support a featured active fundraising campaign.

Concept:

> **Help Us Build the Future**

Potential content:
- campaign name,
- short story,
- target,
- amount raised,
- progress indicator,
- CTA.

All campaign amounts/progress must come from real campaign data.

Do not show a fake progress bar.

If no active campaign or verified progress data is available, design a non-numeric campaign treatment.

---

## Section 10 — Stories from Dove

Editorial preview, not generic testimonial cards.

Possible content categories:

- Student Success
- Volunteer Experience
- Program Story
- What’s Happening Now

Show approximately three featured stories.

Each item may include:
- authentic image,
- category,
- title,
- date,
- short excerpt,
- read story link.

This area is important for ongoing SEO.

---

## Section 11 — Final Donation / Sponsorship Appeal

Strong emotional close.

Client-approved direction:

> **Every Child Deserves the Opportunity to Imagine a Bigger Future.**

Supporting direction:

> Your support helps make that future possible.

CTA hierarchy:
- **Sponsor a Child**
- **Donate**

Do not overload the footer with another large set of equal CTAs.

---

## Section 12 — Footer

Professional but warm.

Include:
- Dove logo
- short mission statement
- simplified navigation
- programs
- get involved
- contact
- social channels
- English / Español
- legal/privacy links
- verified nonprofit/organizational information
- newsletter if approved

Never fabricate organization numbers, addresses, certifications, or legal information.

---

# 10. DONATION EXPERIENCE

The website must improve the experience BEFORE the external checkout.

The intended flow is:

Awareness  
→ Emotional connection  
→ Understand impact  
→ Choose how to help  
→ Campaign / donation CTA  
→ Network for Good / Bonterra  
→ Checkout

The website may host rich campaign landing pages with:

- story,
- images/video,
- goal,
- verified impact information,
- updates,
- CTA.

The final payment flow remains on Network for Good / Bonterra unless a later technical decision changes this.

## Network for Good / Bonterra rules

- Do not pretend we control the external checkout UI.
- Determine exact customization options only after reviewing the client's account/access.
- Campaign-specific CTAs should link to campaign-specific giving/fundraising pages when the client's account supports them.
- The website should make the external transition feel intentional and trustworthy.
- Never store payment details in our custom application unless the architecture is explicitly changed and properly scoped.

---

# 11. REUSABLE CAMPAIGN SYSTEM

Do not hardcode Climb With Purpose as a one-off design.

Build a reusable campaign model/template capable of supporting:

- Climb With Purpose
- Rooftop Project
- Summer Program
- Vocational Training Equipment
- community/emergency campaigns
- future fundraising initiatives

Potential campaign fields:

- slug
- title
- eyebrow/category
- hero media
- short summary
- long story/content blocks
- campaign status
- start/end dates
- fundraising goal (optional)
- amount raised (optional / external source)
- impact statement
- gallery
- related stories
- Network for Good URL
- SEO title
- SEO description
- social image
- locale
- published/draft state

Do not finalize the data model until the chosen CMS/content architecture is confirmed.

---

# 12. BILINGUAL EXPERIENCE — ENGLISH / SPANISH

The entire site must support English and Spanish.

Requirements:

- visible but elegant language switcher,
- equivalent navigation,
- localized URLs or locale-aware routing,
- translated metadata,
- translated alt text where appropriate,
- translated structured content,
- `hreflang` where appropriate,
- correct canonical strategy,
- language persistence between navigation when possible,
- no mixed-language pages,
- no automatic low-quality translation presented as approved final copy.

English is the initial design/content source unless the client provides otherwise.

Spanish content must be reviewed/approved before production publication.

---

# 13. SEO STRATEGY

SEO is part of the redesign, not an afterthought.

## Technical SEO requirements

- semantic HTML,
- clean heading hierarchy,
- metadata per page,
- Open Graph/social metadata,
- canonical URLs,
- XML sitemap,
- robots configuration,
- structured data where genuinely applicable,
- redirects from important legacy Wix URLs,
- optimized image/video delivery,
- descriptive alt text,
- internal linking,
- bilingual/hreflang strategy,
- fast pages/Core Web Vitals,
- accessible navigation.

## Content SEO

Stories & News should become a durable content system.

Content themes may include:

- student success,
- vocational training,
- youth development in Puerto Plata,
- education,
- volunteering,
- Travel With Purpose,
- community partnerships,
- fundraising campaigns,
- Dove updates.

Do not keyword-stuff.
Write for humans first.

The original commercial proposal includes up to four initial SEO-focused articles; confirm topics with client before drafting/publishing.

---

# 14. COPY / CONTENT RULES

## Never invent content

Do NOT fabricate:

- statistics,
- dates,
- donor numbers,
- outcomes,
- employment placement rates,
- participant counts,
- testimonials,
- student names,
- partner names,
- sponsorship amounts,
- donation impact amounts,
- campaign progress,
- awards,
- legal/nonprofit IDs,
- addresses,
- certifications,
- financial figures.

If a fact has not been verified:

- mark it as `TODO: CLIENT CONFIRM`,
- use a neutral placeholder,
- or design the section without relying on it.

## Tone

Copy should be:

- warm,
- clear,
- human,
- hopeful,
- concise,
- donor-friendly,
- respectful,
- specific,
- active.

Avoid:
- savior language,
- pity-based fundraising,
- exaggerated promises,
- generic nonprofit clichés,
- excessive corporate jargon.

---

# 15. ACCESSIBILITY

Target WCAG-conscious implementation from the beginning.

At minimum:

- keyboard-accessible navigation,
- visible focus states,
- semantic landmarks,
- proper labels,
- alt text,
- sufficient color contrast,
- accessible menu/dropdowns,
- accessible language switcher,
- reduced motion support,
- captions/transcript strategy for meaningful video content if audio/content is essential,
- no essential information only conveyed via video or color,
- touch targets suitable for mobile.

---

# 16. PERFORMANCE

This project will use significant real photography/video, so performance must be intentional.

Requirements:

- optimized images,
- responsive image sizes,
- modern formats where appropriate,
- lazy loading below the fold,
- hero/LCP optimization,
- font optimization,
- avoid heavy client-side JS for purely visual sections,
- avoid excessive animation libraries unless justified,
- monitor CLS,
- avoid blocking resources,
- Cloudinary transforms/CDN delivery where useful,
- preserve high visual quality without shipping oversized assets.

The hero video should not become a performance liability.

---

# 17. DESIGN SYSTEM DIRECTION

Do not invent a new Dove brand unless the client requests a rebrand.

The website redesign can refine the digital system while preserving brand recognition.

Create explicit tokens for:

- color,
- typography,
- spacing,
- border radius,
- container widths,
- shadows if any,
- motion duration/easing,
- buttons,
- links,
- focus states.

## Visual restraint

Avoid:

- excessive gradients,
- glass cards,
- rounded rectangles everywhere,
- generic icon-feature grids,
- floating abstract blobs,
- stock "nonprofit" illustrations,
- unnecessary decorative lines,
- auto-generated looking section symmetry.

Prefer:

- strong photography,
- editorial composition,
- meaningful whitespace,
- clear typography,
- contrast,
- occasional full-bleed moments,
- asymmetry where it supports story,
- visual rhythm,
- intentional section transitions.

---

# 18. MOTION

Motion should feel polished and emotional, never performative.

Potential motion:

- soft reveals,
- restrained image scale,
- subtle text entrances,
- gentle section transitions,
- navigation underline/state,
- campaign progress animation only with real data,
- video hero.

Rules:

- respect `prefers-reduced-motion`,
- no animation on every element,
- no scroll-jacking,
- no gratuitous parallax,
- no motion that slows comprehension,
- no layout shift.

---

# 19. TECHNICAL IMPLEMENTATION GUIDANCE

The exact stack should be confirmed from the repository before implementation.

If this is a new custom build and no conflicting decision exists, a suitable default is:

- Next.js
- TypeScript
- Tailwind CSS or project-approved tokenized CSS approach
- Cloudinary for video/image delivery where appropriate
- CMS/content layer selected based on client administration needs
- Vercel or equivalent deployment

However:

**DO NOT replace an established stack just because this file mentions a preferred default.**
Inspect the repository first.

## Content administration

The client must be able to manage ongoing content such as:

- stories/news,
- campaigns,
- team/partners where appropriate,
- program copy,
- campaign links,
- media,
- SEO metadata.

Do not hardcode frequently changing content if a manageable CMS/data model is available.

---

# 20. OWNERSHIP / HANDOFF REQUIREMENT

After completion, Dove Youth Development should retain full administrative ownership/access to:

- domain,
- website/deployment platform,
- CMS/content,
- analytics,
- Search Console,
- SEO configuration,
- forms,
- integrations,
- final website content,
- final digital assets created specifically for Dove as part of the project.

Do not architect the project in a way that unnecessarily locks the client to a developer-owned account.

Third-party proprietary tools, reusable developer libraries, licensed assets, and external services remain subject to their own ownership/license terms.

---

# 21. ACCESS / DEPENDENCIES STILL TO CONFIRM

Before launch and before certain integration work, confirm who owns/manages:

- GoDaddy/domain
- Wix/current website
- Network for Good / Bonterra
- Google Analytics
- Google Search Console
- newsletter/email marketing platform
- current forms/form destinations
- social accounts/links
- Cloudinary/media ownership if used in production
- existing DNS records
- existing email/domain services
- any third-party integrations

Do not request or store passwords in source files.

Prefer official admin/collaborator invitations.

---

# 22. CURRENT KEY ASSET

## Home hero video candidate

Cloudinary:

https://res.cloudinary.com/vloh9uw1/video/upload/v1789135765/entrega_utiles_DOVE_OF.mp4

Treat it as a core storytelling asset for the first Home exploration.

If it does not crop/work well at specific breakpoints, create a graceful media strategy rather than degrading the composition.

---

# 23. HOME SEO — INITIAL DIRECTION

Final metadata must be reviewed with the client, but the Home should target the organization's real identity and mission rather than generic charity language.

Potential title direction:

**Dove Youth Development | Creating Futures in Puerto Plata**

Potential description direction:

**Dove Youth Development supports children and young people in Puerto Plata through education, mentorship, skills development, vocational training, sponsorship, volunteering and community partnerships.**

Do not publish until wording is validated against the final content and target keyword strategy.

---

# 24. HOME PAGE ACCEPTANCE CRITERIA

The Home is not complete until all of the following are true:

- [ ] Hallmark was used for the design/implementation pass.
- [ ] The page feels specifically Dove, not generic nonprofit.
- [ ] The hero uses the approved media strategy and remains readable.
- [ ] Primary CTA hierarchy is clear.
- [ ] Navigation is simplified.
- [ ] The Dove origin story is communicated.
- [ ] The Dove Pathway is visually understandable.
- [ ] At least one real human story is featured or clearly scaffolded pending verified content.
- [ ] Sponsorship/fundraising is prominent but not aggressive.
- [ ] Impact numbers are verified or explicitly marked as pending.
- [ ] Get Involved / Travel With Purpose is visible.
- [ ] Current Campaign supports real campaign data or a non-fabricated fallback.
- [ ] Stories & News supports future SEO content.
- [ ] English/Spanish architecture is considered.
- [ ] Mobile behavior is intentionally designed.
- [ ] Keyboard/focus behavior is correct.
- [ ] Reduced-motion behavior is supported.
- [ ] No horizontal overflow at 320 / 375 / 414 / 768 px.
- [ ] Images/video are optimized.
- [ ] No fabricated copy/data.
- [ ] Metadata/semantic structure is implemented.
- [ ] Page passes a final visual anti-slop review.
- [ ] Client can clearly understand what Dove does and what to do next.

---

# 25. CODEX — FIRST SESSION INSTRUCTIONS

When beginning this project in Codex:

1. Read this file fully.
2. Read the Hallmark skill before designing.
3. Inspect the repository and report:
   - framework,
   - routing,
   - styling system,
   - existing fonts,
   - existing tokens,
   - existing CMS/data layer,
   - package dependencies,
   - current page/component structure.
4. Do not delete existing production files without explicit approval.
5. Before editing, state exactly which files will be created/modified.
6. Start with the **Home page only**.
7. Use the approved Stitch concept/screenshots as the strongest visual reference once available.
8. Treat this brief as the product/brand/UX source of truth.
9. Treat verified client content as the factual source of truth.
10. Keep all unverified data clearly marked as TODO.
11. Build reusable primitives only when they genuinely support future pages.
12. Do not prematurely build all 14 pages.
13. After the first Home implementation, run:
    - Hallmark audit/self-critique,
    - responsive review,
    - accessibility review,
    - performance review,
    - copy/data fabrication check.
14. Do not declare the Home complete while obvious placeholder/fabricated content remains.

---

# 26. PROJECT NORTH STAR

At every design or development decision, ask:

> **Does this help someone understand Dove, feel the humanity of the organization, see how a young person's future can change, and know how to participate?**

If the answer is no, the element probably does not belong.

The finished website should feel like:

**Dove Youth Development — Puerto Plata, relationships, opportunity, growth, and real futures — expressed through a warm, modern, highly credible digital experience.**
