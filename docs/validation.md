# Validation record

Validated on 2026-09-09 before the initial production push.

## Automated checks

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — 3 of 3 tests passed, including all 26 required services and truthful contact-form delivery states.
- `npm run build` — passed and prerendered the static homepage to `dist/client`.
- `npm audit --audit-level=high` — 0 vulnerabilities.
- An intentional invalid-build probe confirmed that build failures still return a non-zero exit code.

## Browser checks

- Verified at 320, 375, 414, 768, 1024, 1280, 1440, and 1920 CSS-pixel widths.
- No horizontal overflow or broken images appeared at the tested widths.
- Exercised every one of the 26 service selections and confirmed that each opens its four required business answers.
- Verified mouse, keyboard, arrow-key, touch/swipe, mobile menu, Escape, and reduced/pause-motion behavior.
- Verified mission-report fields and the required `PROJECT PLACEHOLDER — REPLACE WITH REAL CASE STUDY` label.
- Verified contact-service preselection, native required-field validation, the explicit unsent state, and project-brief copy behavior.
- Rechecked the final desktop hero after the artwork update. Astro reads as a human astronaut with a visible face, clear helmet, padded suit, gloves, boots, and life-support pack.

## Launch configuration still required

The site does not invent business contact or social data. Before opening inquiries, replace the placeholder email and configure a real form endpoint in `lib/site-config.ts`. Add a canonical production URL and verified social profiles when those values are available.
