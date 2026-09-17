# Dove Youth Development

Production website build for Dove Youth Development, a bilingual nonprofit site for Puerto Plata programs, sponsorship, giving, volunteering, travel, vocational training and partnerships.

The project uses Next.js App Router with locale-aware routes:

- `/en`
- `/es`
- `/en/our-story`
- `/es/our-story`
- `/en/child-sponsorship`
- `/es/child-sponsorship`
- `/en/what-we-do`
- `/es/what-we-do`
- `/en/donate`
- `/es/donate`
- `/en/vocational-training`
- `/es/vocational-training`
- `/en/volunteer`
- `/es/volunteer`
- `/en/travel-with-purpose`
- `/es/travel-with-purpose`
- `/en/partnerships`
- `/es/partnerships`

## Run

Use Node 22.13+ (or Node 24 LTS) and npm:

```sh
npm ci
npm run dev
```

Default: http://127.0.0.1:3000. A port override is supported: `npm run dev -- --port 3001`.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

The server needs outbound HTTPS to the approved Wix and Cloudinary hosts for image optimization. Do not disable image optimization just to conceal a local sandbox networking failure.

## Environment

Copy `.env.example` to `.env.local` for local development and fill in real provider values only where needed. Do not commit `.env.local`.

- `SITE_URL` controls canonical and Open Graph URLs.
- `SITE_INDEXABLE=false` keeps local and preview deployments out of search results.
- Supabase, Cloudinary and Wix variables are only needed for CMS/media administration and migration workflows.

## Content and media

- `src/content`: structured content, verified links, media references and page data.
- `src/content/dove-media.ts`: all approved media URLs. Wix sources stay remote; no copied legacy photographs.
- `tokens.css` and `design.md`: locked Stitch-derived visual system.
- `src/components`: shared layout, page sections, forms, media and navigation components.
- `.env.example`: canonical domain and indexing switches. `SITE_INDEXABLE` defaults to false; set true only on the approved public deployment. `SITE_URL` enables canonical/OG URL metadata and must be set at build time.

Donation, sponsorship and contact destinations are centralized in `src/content/links.ts`. Do not paste donation URLs directly into components.

## Browser verification

Verification scripts run Playwright + axe against a local server. Set `BASE_URL` when the server is not on the script default.

Common checks:

```sh
npm run lint
npm run typecheck
npm run build
npm run verify:donate
npm run verify:sponsorship
npm run verify:vocational
npm run verify:what-we-do
npm run verify:volunteer
npm run verify:travel
npm run verify:partnerships
```

Screenshots and JSON results go to ignored `artifacts/`. Page-specific QA notes live in the `*_QA.md` files.

Next.js generated `AGENTS.md` and `CLAUDE.md` during development; these document version-specific framework guidance.
