# Where Apostrophe Software stands

Status: 26 November 2026. **Start here** in a new session. Update this page
at the end of each piece of work.

## What is live

To confirm: whether apostrophesoftware.com is serving the `apostrophe-software`
Worker. The repo is ready to deploy with `npm run deploy`.

| Route | Page | State |
|---|---|---|
| `/` | Home | Built |
| `/work` | Client builds, workshops, session photos | Built (PR #5, #6) |
| `/work/[slug]` | Case study | Built, only for projects with a `caseStudy` |
| `/about` | About | Built |
| `/events` | Events | Coming Soon (`FEATURES.eventsList`) |
| `/blog` | Blog | Coming Soon (`FEATURES.blogPosts`) |

The team grid on About is also switched off (`FEATURES.teamGrid`).

## Accounts and settings

| What | Value |
|---|---|
| Host | Cloudflare Worker `apostrophe-software`, static assets from `dist` |
| Deploy | By hand, `npm run deploy` |
| Booking link | Placeholder email in `src/site.ts` |
| Newsletter | Placeholder email in `src/site.ts` |

No secrets are stored in this repo.

## What is left

**For the owner (not code):**

- Choose a booking tool. daarongonzalez.com already uses Cal.com.
- Choose a newsletter provider.
- Confirm the domain points at the Worker.

**To build, next:**

1. Swap in the real booking and newsletter links.
2. Switch on Events, Blog and the team grid once there is content.
3. A deploy workflow on push to `main`, like daarongonzalez.com has.

## Research in this repo

- Visual copy editing tools: `reports/Visual copy editing tool research.md`.
  This research shaped the Flynn extension (`apos-flynn-extension`).
