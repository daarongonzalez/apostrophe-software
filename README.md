# Apostrophe Software

Marketing site for [apostrophesoftware.com](https://apostrophesoftware.com). Built with [Astro](https://astro.build) as a static site with plain CSS.

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/events` | Events |
| `/work` | Work: client builds, workshops, session photos |
| `/work/[slug]` | Case study (only for projects with one) |
| `/about` | About |
| `/blog` | Blog |

## Run it

```sh
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # static files in dist/
```

## Where to change things

- **Booking, contact and newsletter links:** `src/site.ts`. These are email placeholders for now.
- **Coming Soon sections:** the event list, team grid and blog posts are built but switched off. Set the matching flag in `FEATURES` in `src/site.ts` to `true` to show them.
- **Colors, fonts and spacing:** tokens at the top of `src/styles/global.css`.
- **Work page content:** `src/data/work.ts`. Add a `caseStudy` to a project to give it its own page. Set `spotlight: true` on any item to call it out with the Rare Frame card; everything else uses the dark Prism card.
- **Images:** `public/images` (work images in `public/images/work`) and `public/brand`.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build command `npm run build`, output folder `dist`. Then point the `apostrophesoftware.com` DNS at the host.
