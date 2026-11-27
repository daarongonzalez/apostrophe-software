## What this project is
- The marketing site for Apostrophe Software, at apostrophesoftware.com.
- Readers are learning and development managers looking to hire help with AI curriculum and tooling.
- Astro static site with plain CSS. No CMS. Content lives in code.

## Where the project stands
- Read `docs/status.md` first in a new session. It lists what is live, the accounts and what is left.
- Update it at the end of each piece of work.

## Voice
- Approachable, not casual. Readers are hiring a professional.
- Plain words, no jargon. Keep bullets short.
- Never use the word "implement".

## Design rules
- Tokens sit at the top of `src/styles/global.css`. Use them. Do not write raw hex colours in components.
- Fonts: Geist for body, Space Mono for eyebrows and headings, Anton for display.
- The brand gradient (`--gradient`, blue to teal) is part of this brand. It belongs only to this project.
- Work cards: the dark Prism card by default, and the Rare Frame card for items marked `spotlight: true`. Styles are in `src/styles/cards.css`.
- Brand marks are in `public/brand`. Work images are in `public/images/work`.
- If a rule is missing, ask before inventing one.

## Where to change things
- Site settings, links and launch switches: `src/site.ts`. The `FEATURES` flags turn Coming Soon sections on.
- Work page content: `src/data/work.ts`.
- Research notes: `research_notes/`. Finished reports: `reports/`.

## Checks and deploy
- `npm run build` must pass before a push.
- Deploy is by hand: `npm run deploy` builds and runs `wrangler deploy` to the `apostrophe-software` Worker. There is no deploy workflow yet.

## Scope for this project
- Use only this repo's tokens, fonts and assets. Never pull in Nativo or daarongonzalez.com styles.
- Connectors: GitHub only. No Sanity, Neon or Figma unless the owner asks.
- Some Work images are also used on daarongonzalez.com. Change them here only. Copy across only when asked.
