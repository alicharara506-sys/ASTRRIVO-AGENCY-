# ASTRIVO — Ideas into orbit.

The official ASTRIVO creative technology website. This repository is isolated at `https://github.com/alicharara506-sys/ASTRRIVO-AGENCY-.git`.

## Local review

Requires Node.js 22.13+ (Node 24 recommended) and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3001
```

Open http://localhost:3001/. Use the exact URL printed by the server if that port is already occupied.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

The production server uses Wrangler and the generated `dist/server/wrangler.json`. No deployment or public hosting account is configured. Development preview listens locally; do not expose a development server publicly.

## Creative and technical architecture

- React 19, TypeScript, Vinext/Vite, Tailwind CSS, Base UI/Shadcn primitives, and Lucide icons.
- Server-rendered homepage content and isolated client components for navigation, orbit exploration, reports, contact, and motion preferences.
- Midnight navy canvas, coral actions, and five planet identities: coral Brand, violet Digital, cyan Technology, mint AI, yellow Analytics.
- One original AI-generated universe image supplies hero art, planet surfaces, and Astro portraits. Astro is a stylized human astronaut with a visible expressive face, glass helmet, padded white suit, gloves, boots, and a compact life-support pack. The optimized WebP files avoid a 3D runtime, video, or large texture download.
- The desktop orbit connects all five disciplines. Selecting a planet reveals its service satellites and four business answers. Mobile uses one prominent planet, previous/next controls, shortcuts and horizontal swipe; page scrolling remains vertical.
- Astro reacts to hover/focus and adopts a different tilt and message for each discipline. Movement pauses for offscreen scenes and hidden tabs; a footer motion control and reduced-motion support preserve all content and functionality.
- Navigation uses section tracking, anchors, a mobile disclosure, keyboard focus indicators, and a skip link. Service tabs and mission-report dialogs use accessible primitives. The content remains server-rendered, with a complete no-JavaScript service fallback.

## Content and configuration

| File | Purpose |
| --- | --- |
| `content/services.json` | Five disciplines and all 26 services: descriptions, problems, deliverables, realistic outcomes. |
| `lib/services.ts` | Planet colors, positions, image crops, Astro poses and discipline messages. |
| `content/missions.ts` | Three explicitly marked placeholder mission reports and their six required report fields. |
| `lib/site-config.ts` | Verified contact email, HTTPS form endpoint, canonical origin and social profile configuration. |
| `app/layout.tsx` | Title, description, Open Graph and Twitter metadata; canonical only when configured. |
| `app/robots.ts`, `app/sitemap.ts` | Crawling metadata. Sitemap stays empty until a real canonical origin is configured. |
| `public/favicon.svg` | Original ASTRIVO spark mark. |
| `docs/asset-prompts.md` | Original image generation prompts and provenance. |

### Required before opening inquiries

Provide a verified contact email and a real form delivery endpoint in `lib/site-config.ts`. No address, social account, client result, or endpoint is invented. The default form allows preparation and copying of a brief, explicitly reports that nothing was sent, and preserves all entered fields.

The configured HTTPS endpoint must accept JSON containing `name`, `company`, `email`, `mission`, `details`, and `interests`. It must validate and limit input on the server, apply spam/rate controls, configure allowed origins and data retention, then return:

- `{ "delivered": true }` only after delivery; or
- `{ "accepted": true }` only after durable queueing.

A successful HTTP response alone does not confirm receipt. Unknown/malformed responses, HTTP errors, and 15-second timeouts preserve the form and show an honest retry message. Do not add credentials to client configuration.

Also provide the final canonical domain, approved case studies, and any verified social links. Analytics tracking is intentionally unconfigured. Add a tracker only after selecting a provider and agreeing on any required consent behavior. The robots route does not invent a domain.

### Artwork replacement points

`public/assets/universe.webp` is the selected original illustration. `universe-mobile.webp` is its compressed responsive version. Original 3D-style artwork is raster, not a rigged model. Planet crops are centralized in `lib/services.ts`; Astro’s portrait crop is in `.astro > img` in `app/globals.css`. Replace both responsive artwork files and adjust these crop coordinates together when introducing final commissioned/rigged assets.

The earlier robot artwork and a standalone robot cutout are **not shipped**. The approved astronaut hero supplies the consistent Astro portraits instead.

## Project organization

`app/page.tsx` composes `SpaceNavigation`, `OrbitSystem`, `MissionReports`, `FlightPlan`, and `ContactMission`. `MotionController` handles reduced/paused motion and observer cleanup. `app/globals.css` centralizes tokens, layout, responsive rules and movement. `lib/contact-contract.ts` rejects unconfirmed delivery states.

Tests cover the full service contract and honest delivery semantics. Browser QA and final build results are recorded in `docs/validation.md`.
