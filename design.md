# Dove Youth Development — locked design system

This system translates the client-approved Google Stitch homepage. Future pages must inherit it; do not rotate to a new Hallmark theme. `tokens.css` is canonical.

## Provenance

Client-supplied Stitch screenshots and the September 2026 Home implementation request. Font identities cannot be established from screenshots alone; the chosen pairing matches their visual roles. The latest user request overrides older media-migration instructions in the repository briefs.

## System

- Genre: warm editorial nonprofit; real people, Puerto Plata, dignity and opportunity.
- Macrostructure: left-aligned video marquee, alternating editorial splits, connected pathway, sponsorship panel, typographic metrics, image-led involvement, restrained partnership invitation, editorial stories and centered final appeal.
- Palette: deep teal anchor; warm off-white paper; burnt-orange actions. Approximate Stitch teal `#194f4f`; headings `#005463`. Orange is slightly deepened for readable white button labels. Small orange text uses a separate darker token.
- Typography: locally served variable Playfair Display, weight 600 for display; variable Manrope, weights 400–800 for body/navigation. Roman headings only. Two families; no third decorative face.
- Display: fluid 37.6–64px; section headings 32–48px; body 16px; lead copy 18–20px. Display line-height 1.08, section 1.12, body 1.65.
- Layout: 1176px maximum container, fluid 20–48px gutters, 4px-based named spacing. Preserve generous whitespace without fixed full-screen sections.
- Radius: 24px major media/panels; 16px secondary surfaces; fully rounded action buttons. No generic card treatment for every section.
- Borders: subtle warm 1px rules. Soft shadow for history media; no floating/glass treatment.

## Components and responsive rules

- Header: real logo, desktop navigation at 1152px+, persistent Donate; disclosure menu below. Language control inside mobile navigation and footer. Spanish displays an honest unavailable notice until translations exist.
- Hero: actual Cloudinary video; bounded layout; directional teal contrast overlay. Still poster loads first. No video request with reduced motion or data saver; explicit play remains available. Pause is always available when playing.
- Pathway: ordered vertical progression below 1280px; connected seven-stage sequence above; wider employment stage and distinct teal future stage. Never a horizontal carousel.
- Origin and Leonela: text/media splits at 768px+; stacked below. Never identify a substitute portrait as Leonela.
- Support: teal primary offer, $50/month only; four compact support paths. Keep the mobile panel content-sized.
- Metrics: typographic strip; 20+ plus four em dashes. No fabricated values.
- Experience: two image-led entries plus typographic partnership entry. Keep the institutional callout distinct.
- Campaigns/stories: development placeholders gated by NODE_ENV. Production requires verified campaign/published stories.
- Final appeal: centered serif statement, teal background, Sponsor primary, Donate secondary.
- Child Sponsorship: split editorial hero, oversized monthly anchor, asymmetric support groups, unboxed three-step sequence, source-verified voices, native-details FAQ and sponsorship-first closing appeal. Keep the payment handoff external and never present children as a selectable catalogue.
- Vocational Training Center: photographic editorial hero, narrative workflow from transition to training to possible pathways, an enlarged Job Readiness foundation, typography-led outcomes and testimonial, documentary archive moments, native-details FAQ and a dedicated vocational-giving close. Do not turn pathways or support categories into equal card grids.
- Donate: cinematic poster-first video hero followed by a Feature Stack giving index. General giving is the dominant sticky anchor; child sponsorship, vocational training and partnerships use a ruled typographic stack. Keep payment processing external, omit unverified campaigns and legacy giving tiers, and vary the remaining sections through editorial lists, paired callouts and a clear trust sequence.
- What We Do: editorial Program Journey that connects five program areas without treating them as identical services. Use a photographic index hero, narrative bridge, image-led youth and education sections, a typography-led Job Readiness transition, a deep-teal vocational feature, a community-centered close and a distinct five-stage conceptual pathway. Route program exploration through existing internal pages before external giving destinations.
- Volunteer: cinematic, poster-first invitation followed by a ruled dayline, full-bleed community interlude, practical preparation, and one integrated application/release flow. Keep local staff leadership explicit, use the official English release until legal approves Spanish, and never report an application as received without a configured provider.
- Travel With Purpose: image-led Mosaic Journey for organized groups. Use a split photographic hero, duration ledger, full-bleed human connection, coordinated-skills and logistics narratives, responsible-travel principles, and a dedicated planning inquiry. Keep it distinct from individual Volunteer, describe logistics as coordination subject to confirmation, and never imply an inquiry is a booking.
- Corporate & Community Partnerships: institutional Relationship Ledger anchored in real Dove community imagery. Use an asymmetric ways-to-partner system, a deep-teal workforce bridge, clearly labelled historical support, community participation, a four-step relationship process and one dedicated inquiry. Keep named current partners behind client approval, avoid logo walls and sponsorship tiers, and route general partnership discovery to the localized page before the executive-director fallback.

## Interaction and accessibility

Touch controls are at least 44px. Focus rings are instant and high contrast; light on dark surfaces. Underlines for links, restrained button press, no animated section reveals or parallax. Respect reduced motion. Menus close on Escape and outside click; Escape restores trigger focus. Heading text can wrap; CTA labels remain on one line.

## Content governance

Home copy lives in `src/content/home.ts`; page copy uses typed dictionaries under `src/i18n/messages`. Approved media URLs live in `src/content/dove-media.ts`, and destinations live in `src/content/links.ts`. Do not scatter either in components. Keep client-confirmation TODOs. No stock/AI replacement people, fabricated legal claims, story details, amounts, outcomes or campaign progress.

## Exports

### CSS (canonical)
Import `tokens.css` once in the root layout. It contains colors, fonts, type, spacing, container, radius, border, shadow, duration and easing tokens.

### Tailwind v4 adapter (only if adopted later)
```css
@theme inline {
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --font-sans: var(--font-body);
  --font-serif: var(--font-display);
  --color-primary: var(--color-teal);
  --color-action: var(--color-accent);
  --spacing-section: var(--space-section);
  --radius-panel: var(--radius-card);
}
```

### DTCG seed
```json
{
  "color": {
    "teal": { "$type": "color", "$value": { "colorSpace": "oklch", "components": [0.3927, 0.0556, 195.13], "alpha": 1 } },
    "action": { "$type": "color", "$value": { "colorSpace": "oklch", "components": [0.572, 0.1457, 46.7], "alpha": 1 } },
    "paper": { "$type": "color", "$value": { "colorSpace": "oklch", "components": [0.975, 0.008, 85], "alpha": 1 } }
  },
  "font": {
    "display": { "$type": "fontFamily", "$value": ["Playfair Display", "Georgia", "serif"] },
    "body": { "$type": "fontFamily", "$value": ["Manrope", "Arial", "sans-serif"] }
  }
}
```

### shadcn/ui adapter (only if adopted later)
```css
:root {
  --background: var(--color-white);
  --foreground: var(--color-body);
  --primary: var(--color-teal);
  --primary-foreground: var(--color-white);
  --secondary: var(--color-paper);
  --secondary-foreground: var(--color-ink);
  --muted: var(--color-paper-deep);
  --muted-foreground: var(--color-muted);
  --border: var(--color-rule);
  --ring: var(--color-focus);
  --radius: var(--radius-small);
}
```

