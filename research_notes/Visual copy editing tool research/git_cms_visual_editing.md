# Git-based and headless CMS tools with visual / on-page editing (state as of Nov 2026)

Research note: the work was done on 2026-11-09. Network limits meant vendor sites could not be fetched directly: tina.io, docs.netlify.com and decapcms.org all failed DNS in this sandbox. Most findings below come from search-result summaries of vendor docs, from vendor pages that showed up in search, and from 2026 third-party comparison articles. Wherever a claim rests only on a third-party listicle, it is flagged. Statements labelled "prior knowledge" in the Inferences sections were not verified in this session.

## Q1. Which tools offer click-to-edit inline on a live preview, and which are form or sidebar based?

### Takeaway
True click-on-the-preview editing exists in three groups. The first is Git-based tools that need the content modelled for them (TinaCMS, CloudCannon, and Netlify Visual Editor, which is now closed to new users). The second is API-based headless CMSs that use overlays (Sanity, Storyblok, Contentful, DatoCMS, Hygraph, Directus). The third is page builders (Builder.io, Makeswift, Plasmic). Decap, Pages CMS, Keystatic, Outstatic, Sveltia and Front Matter are form-based. They have at most a side-by-side preview and no clicking on the live page.

### Cited Findings
**Git-based with visual editing**
- **TinaCMS.** The editor is a live preview of the page, and editors click any editable field to change it. Visual editing is included on the free TinaCloud tier, which allows 2 users. — [staticmania review 2026](https://staticmania.com/blog/discover-the-power-of-tina-cms); [tina.io/pricing (search snippet)](https://tina.io/pricing)
- **TinaCMS.** A recent commit adds "@tinacms/astro: vanilla-JS visual editing bridge for non-React" frameworks, so Astro support goes beyond React islands. — [tinacms GitHub commit](https://github.com/tinacms/tinacms/commit/95758a0ad31ec96aa652f247211a769e82a37cbb)
- **CloudCannon.** Its Visual Editor works on regions marked with `data-editable` attributes. A reviewer reports that adding a few data attributes to existing HTML elements is enough to make them visually editable, with no React rewrite. Visual editing works on a static build. Astro components go through the `@cloudcannon/editable-regions` package, and Bookshop handles component-based live editing. — [vikboyechko review](https://vikboyechko.com/blog/cloudcannon-visual-cms-static-sites/); [CloudCannon blog: Astro + Bookshop](https://cloudcannon.com/blog/how-cloudcannons-live-editing-works-with-astro-and-bookshop/); [bitdoze Astro CMS 2026](https://www.bitdoze.com/best-headless-cms-for-astro/)
- **Netlify Visual Editor (formerly Stackbit).** Netlify's docs (last updated Sep 11, 2026) say the Visual Editor is only available to teams that already have it enabled through Netlify Support. For every other team the dashboard link and the config section are hidden, so a new project or team cannot enable visual editing. — [Netlify docs: Manage visual editing](https://docs.netlify.com/manage/visual-editor/get-started/manage-visual-editing/) (via search snippet; page not fetchable here)
- **Netlify.** Support says the legacy `stackbit.yaml` format is no longer supported, and very old projects reportedly cannot be migrated. create.netlify.com no longer accepts new projects. — [Netlify forum](https://answers.netlify.com/t/netlify-create-not-editable-old-site-stackbit-root-cause/113621); [Netlify blog: streamlined setup](https://www.netlify.com/blog/announcing-streamlined-visual-editing-setup-in-netlify/); acquisition background: [Netlify acquires Stackbit](https://www.netlify.com/blog/netlify-acquires-stackbit-to-bring-no-code-creation-to-its-platform/)

**API-based headless CMSs with click-to-edit overlays (content lives in a vendor database, not in Git)**
- **Sanity.** Stega encoding embeds invisible source maps in strings. `@sanity/visual-editing` scans the DOM for them and draws click-to-edit overlays. Drafts render through draft mode or the `previewDrafts` perspective. — [headless-cms-integration.com guide](https://www.headless-cms-integration.com/preview-draft-workflow-patterns/live-editing-integration-patterns/sanity-visual-editing-with-stega-encoded-source-maps/)
- **Storyblok.** The live preview sits on the right and a structured component panel on the left. Clicking an element in the preview selects it. Developers must add `storyblokEditable` attributes and the preview bridge, and the preview must be served over HTTPS. It is the most turnkey option for marketers. — [headlesscms.guide](https://headlesscms.guide/guides/sanity-vs-storyblok-visual-editing-compared); [staticmania comparison](https://staticmania.com/blog/sanity-vs-contentful-vs-storyblok)
- **Contentful.** Live Preview offers a side-by-side preview, live updates, and an inspector mode that jumps to the matching field. Both features need the Live Preview SDK, and the overlay has to be wired up in code. — [headlesscms.guide: visual editing vs live preview](https://headlesscms.guide/guides/visual-editing-vs-live-preview-what-headless-cmses-really-offer)
- **DatoCMS.** "Content Link" provides click-to-edit overlays. It is enabled with the `contentLink` and `baseEditingUrl` options when fetching drafts, plus a `<ContentLink />` component for React, Vue, Svelte or Astro. It uses stega, and non-text fields need `data-datocms-content-link-url`. Pressing Alt/Option toggles the overlays. — [DatoCMS docs: Visual Editing](https://www.datocms.com/docs/visual-editing); [datocms/content-link GitHub](https://github.com/datocms/content-link); [DatoCMS Astro guide](https://www.datocms.com/docs/astro/visual-editing)
- **Hygraph.** "Click to Edit" is in Public Beta. `@hygraph/preview-sdk` (version 1.1.0 or later) scans for `data-hygraph-*` attributes and adds hover overlays and Edit buttons. It requires a configured Live Preview. — [Hygraph docs: Click to Edit](https://hygraph.com/docs/developer-guides/schema/click-to-edit); [Hygraph blog](https://hygraph.com/blog/introducing-click-to-edit)
- **Directus.** The Visual Editor Studio module works with `@directus/visual-editing`. `setAttr()` generates `data-directus` attributes and `apply()` connects them. Clicking an element opens a drawer, modal or popover, and permissions are respected. The library has moved into the main directus monorepo. — [Directus docs: Visual Editor](https://directus.com/docs/guides/content/visual-editor); [Directus Next.js tutorial](https://directus.io/docs/tutorials/getting-started/integrating-the-directus-visual-editor-with-nextjs); [directus/visual-editing GitHub (archived)](https://github.com/directus/visual-editing)
- **Prismic.** Live preview runs through a slice-simulator route, and Prismic has a page builder. **Payload** is code-first and open source, and one comparison rates its visual editing as "basic". Both claims come only from listicles. — [prismic.io blog](https://prismic.io/blog/best-vue-headless-cms); [naturaily Next.js CMS 2026](https://naturaily.com/blog/next-js-cms); [thewpclan landscape 2026](https://thewpclan.com/headless-cms-comparison-2026/)

**Vercel layer**
- **Vercel Visual Editing.** Click-to-edit runs from Vercel previews and the toolbar using content source maps. Sanity was the launch partner and Builder.io was added later for Enterprise. Vercel claims "zero code changes" on the site, but the content still has to come from a supported CMS. I found no 2026 update. — [Vercel blog: Visual Editing](https://vercel.com/blog/visual-editing); [Vercel changelog: Builder.io](https://vercel.com/changelog/visual-editing-can-now-be-used-with-builder-io)

**Page builders**
- **Builder.io visual CMS.** A drag-and-drop page builder where developers register components and install an SDK. Publishing does not go through a PR. **Makeswift** is a visual builder for Next.js and integrates React components. **Plasmic** is a builder that works with registered components or generated code. — [pkgpulse 2026](https://www.pkgpulse.com/blog/builder-io-vs-plasmic-vs-makeswift-visual-page-builders-2026); [Vercel Marketplace: Makeswift](https://vercel.com/marketplace/makeswift); [subframe 2026](https://www.subframe.com/tips/best-visual-editors-react-tailwind)

**Form-based Git CMSs (no click-on-preview)**
- **Pages CMS.** A form-based editor over GitHub that commits to Git. It is MIT-licensed, can be hosted or self-hosted with PostgreSQL, works only with GitHub, and lets non-GitHub users join by email invite. — [bitdoze 2026](https://www.bitdoze.com/best-headless-cms-for-astro/); [kahuk Pages vs Decap](https://kahuk.com/pages-cms-vs-decap-cms/)
- **Decap CMS.** Mature and configurable. Every "Publish" is a git commit, and it supports GitHub, GitLab, Bitbucket, Gitea and Azure. — [kahuk](https://kahuk.com/pages-cms-vs-decap-cms/); [Decap compare page](https://decapcms.org/compare/git-based-cms/) (not fetchable)
- **Keystatic.** Edits Markdown, JSON and YAML in a Git repo or on the local filesystem. **Outstatic** is a Git-based Markdown/MDX dashboard that runs inside Next.js or as a hosted PRO dashboard. Its license is reported as FSL-1.1, which is source-available rather than OSI open source. No search result showed visual or live editing for Pages CMS, Keystatic or Outstatic. — [toolradar Keystatic](https://toolradar.com/tools/keystatic); [alpina-tech 2026](https://alpina-tech.com/cms-platforms/best-git-based-headless-cms-platforms/); [dev.to static CMS 2026](https://dev.to/lightcms5/best-cms-for-static-sites-in-2026-8-options-compared-53ng)
- **Sveltia CMS.** A drop-in Decap successor that is still in beta (around v0.128). Sources disagree on when 1.0 ships: one says late 2026, another early 2026. Its Editorial Workflow (branches and PRs) is "not yet supported" and is planned before 1.0. — [Sveltia docs](https://sveltiacms.app/en/docs/intro); [sitepins compare](https://sitepins.com/compare/sveltiacms-vs-tinacms)

**Discontinued**
- **Forestry.io** shut down on April 21, 2023. TinaCMS is its successor and is now owned by SSW. Siteleaf offered free migration. — [Siteleaf blog](https://www.siteleaf.com/blog/forestryio-cms-alternatives/); [dasroot 2026 comparison](https://dasroot.net/posts/2026/03/decap-cms-vs-tina-cms-vs-forestry-2026-comparison/)

**Docs-site tools**
- **Mintlify.** The web editor commits back to the repo and opens a PR when working on a feature branch. A "push to main" option exists for some changes. — [context7 comparison](https://context7.com/mintlify-vs-gitbook-vs-fern); [GitBook vs Mintlify](https://www.gitbook.com/blog/gitbook-vs-mintlify)
- **GitBook.** A browser-first WYSIWYG editor. Git Sync is an optional two-way sync with GitHub or GitLab: editor changes are written back to the repo, and rendered previews are posted on PRs. — [GitBook blog](https://www.gitbook.com/blog/gitbook-vs-mintlify); [mintlify.com comparison](https://www.mintlify.com/library/mintlify-vs-gitbook)

### Inferences
- From prior knowledge, unverified in this session: Sanity's **Presentation tool** is the Studio pane that hosts the iframe preview with stega overlays. Payload's Live Preview is an iframe beside the admin form, so it is form-plus-preview rather than true inline editing. Front Matter CMS is a VS Code extension with a form panel and a local preview, so it is for developers and not suited to non-developers in a browser. Statamic is a PHP/Laravel flat-file CMS with "Git Automation" that commits content changes, but it uses a control panel rather than inline editing.
- Inline, contenteditable-style typing directly on the page (rather than clicking to open a field form) seems limited to TinaCMS, which can edit rich text in place in some setups; CloudCannon editable regions; Netlify Visual Editor; and the page builders. Overlay CMSs (Sanity, DatoCMS, Hygraph, Directus, Contentful) usually click through to a field form rather than letting the editor type on the page. This inference comes from the drawer/modal descriptions cited above.

### Gaps
- Primary docs and changelogs for TinaCMS, Netlify and Decap could not be fetched (DNS blocked in the sandbox).
- No dated 2026 source was found for Siteleaf, Statamic or Front Matter CMS status, or for Prismic, Payload or Contentful visual-editing changes in 2026.
- Whether Vercel Edit Mode still exists or was renamed in 2026 was not confirmed. The latest Vercel material found is older.

## Q2. Do they save to Git, and as direct commits or as branch + PR? Are edits batched?

### Takeaway
Only the Git-based tools (Tina, CloudCannon, Netlify VE, Decap/Sveltia, Pages CMS, Keystatic, Outstatic, Front Matter, Statamic with Git Automation, Mintlify, GitBook) write to GitHub. Branch + PR review is usually a paid tier or an opt-in mode: Tina's Editorial Workflow, CloudCannon's branching, and Decap's `editorial_workflow`. Sanity, Storyblok, Contentful, DatoCMS, Hygraph, Directus, Builder.io and Makeswift store content in their own database or API and never touch Git. Builder Code (formerly Fusion) is the exception: it edits code and opens PRs.

### Cited Findings
- **TinaCMS.** The editorial workflow, which makes edits reviewable through branches and PRs, starts at the Team Plus tier. Pricing sources conflict: Team is listed at $24/project/month in one snapshot and $29 in another, Team Plus at $41 or $49, and Business at $249/project/month. The free tier covers 2 users and includes visual editing. Snapshots date up to Oct 2026. — [bestgitbasedcms Tina](https://bestgitbasedcms.com/tools/tinacms); [busyless Tina](https://busyless.space/headless-cms/tinacms); [makerstack 2026](https://makerstack.co/reviews/tinacms-review/); [tina.io/pricing](https://tina.io/pricing)
- **CloudCannon.** Branch-based approval workflows and custom permissions need the Team plan. One source puts it at $350/month for 15 users, another says branching starts at $300/month. Standard is about $49/month billed yearly or $55/month monthly, with 3 users, unlimited sites and visual editing. One source lists Standard at $125, which conflicts with the others. A Partner Program Lite plan costs about $10/month per client. — [vikboyechko](https://vikboyechko.com/blog/cloudcannon-visual-cms-static-sites/); [staticmania Astro CMS](https://staticmania.com/blog/best-cms-for-astro); [khod.io 2026](https://www.khod.io/resource-center/articles/astro-cms)
- **Decap.** Each publish is a plain git commit. Decap is described as a natural fit for Git review (PR) workflows. — [kahuk](https://kahuk.com/pages-cms-vs-decap-cms/)
- **Sveltia.** It has no editorial workflow (branches and PRs) yet. — [Sveltia docs](https://sveltiacms.app/en/docs/intro)
- **Pages CMS.** Commits to Git on GitHub. — [kahuk](https://kahuk.com/pages-cms-vs-decap-cms/)
- **Builder Code (formerly Fusion; the rename is reported for Sep 2026).** A visual editor for existing codebases that packages edits as branches and pull requests. It is reported to support React, Next.js, Vue, Svelte and Angular. — [subframe 2026](https://www.subframe.com/tips/best-visual-editors-react-tailwind); [modeinspect React visual editor](https://modeinspect.com/blog/react-visual-editor)
- **Onlook.** An open-source visual editor that writes changes directly into React files. Sources disagree on how changes are delivered: one says it edits a local checkout, another says it uses per-designer branches and PRs. — [modeinspect](https://modeinspect.com/blog/react-visual-editor); [brightcoding write-up](https://prompts.brightcoding.dev/blog/onlook-the-revolutionary-visual-react-editor)
- **Builder visual CMS, Plasmic and Makeswift.** Pages are stored in the vendor's system and publishing does not need a PR. — [pkgpulse 2026](https://www.pkgpulse.com/blog/builder-io-vs-plasmic-vs-makeswift-visual-page-builders-2026)
- **Mintlify.** Commits and opens PRs on feature branches. **GitBook** Git Sync writes changes back to the repo. — [context7](https://context7.com/mintlify-vs-gitbook-vs-fern); [GitBook blog](https://www.gitbook.com/blog/gitbook-vs-mintlify)

### Inferences
- From prior knowledge, unverified here:
  - **Batching.** In Tina's editorial workflow, an editor works on one branch, each save is a commit on that branch, and one PR collects them. Without that workflow, each save commits straight to the default branch.
  - **CloudCannon.** Edits batch on the site's branch until the editor clicks Save, which makes a commit. Its "Publish to" branch flow then merges into main.
  - **Decap.** `editorial_workflow` mode creates one branch and PR per entry ("cms/..." branches) with Draft, In Review and Ready columns. `open_authoring` lets contributors without write access submit PRs through forks.
  - **Keystatic.** GitHub mode can save to non-default branches and create PRs from the UI.
  - **Edit links.** GitHub's "edit this page" flow (Docusaurus, VitePress and others) opens GitHub's web editor and forks plus proposes a PR for users without write access. It needs a GitHub account and has no live preview.
- For "one PR per batch of copy edits", Tina's Editorial Workflow and CloudCannon branching are the most mature visual options. Builder Code is the only tool found that does this for code rather than for content files.

### Gaps
- Exact current (Nov 2026) Tina and CloudCannon prices could not be confirmed from vendor pages, and the sources conflict.
- No primary source was found on whether Netlify Visual Editor commits directly or via PR for existing customers in 2026.
- The GitHub "edit this page" and fork-PR flow was not covered by search results.

## Q3. What codebase setup is required (schemas, attributes, content extraction, SDK), and does the tool need the site restructured around a CMS?

### Takeaway
Every tool except code-editing tools such as Builder Code and Onlook requires copy to live in a content store the tool understands (Markdown, JSON or YAML files, or a CMS database) plus some wiring. Hard-coded strings in JSX or Astro must be extracted first. CloudCannon editable regions are the lightest Git-based retrofit for plain HTML, though content still has to sit in front matter or data files for text edits to round-trip. Tina needs a schema and `useTina` (or an equivalent bridge) on every page. Overlay CMSs need SDKs and stega or data attributes, and they move content out of Git entirely.

### Cited Findings
- **CloudCannon.** Developers mark regions with `data-editable` attributes in Astro components, and on HTML sites only a few attributes are needed. Visual editing requires a static build. — [bitdoze](https://www.bitdoze.com/best-headless-cms-for-astro/); [vikboyechko](https://vikboyechko.com/blog/cloudcannon-visual-cms-static-sites/); [aerolaunch: make Astro theme editable](https://aerolaunch.app/blog/make-an-astro-theme-editable/)
- **TinaCMS.** Works on content fields rather than arbitrary code. The search found no evidence that it edits hard-coded component text. — [subframe](https://www.subframe.com/tips/best-visual-editors-react-tailwind); [naturaily React CMS 2026](https://naturaily.com/blog/best-headless-cms-react)
- **Overlay CMSs.**
  - Sanity: stega plus `@sanity/visual-editing`. — [headless-cms-integration.com](https://www.headless-cms-integration.com/preview-draft-workflow-patterns/live-editing-integration-patterns/sanity-visual-editing-with-stega-encoded-source-maps/)
  - Storyblok: `storyblokEditable` plus the bridge. — [headlesscms.guide](https://headlesscms.guide/guides/sanity-vs-storyblok-visual-editing-compared)
  - DatoCMS: `contentLink` options plus the `<ContentLink/>` component. — [DatoCMS docs](https://www.datocms.com/docs/next-js/visual-editing)
  - Hygraph: `HygraphPreview` wrapper plus `data-hygraph-*`; without the wrapper, Click to Edit does not work. — [Hygraph Next.js guide](https://hygraph.com/docs/developer-guides/schema/click-to-edit-next-js)
  - Directus: `data-directus` attributes via `setAttr()`. — [Directus frontend library](https://directus.com/docs/guides/content/visual-editor/frontend-library)
  - Contentful: Live Preview SDK. — [headlesscms.guide](https://headlesscms.guide/guides/visual-editing-vs-live-preview-what-headless-cmses-really-offer)
- **Page builders.** Builder.io, Plasmic and Makeswift require developers to register components and install an SDK, and pages are served from the vendor. — [pkgpulse](https://www.pkgpulse.com/blog/builder-io-vs-plasmic-vs-makeswift-visual-page-builders-2026); [Builder.io Next.js guide](https://www.builder.io/blog/visual-next-js)
- **Vercel Visual Editing.** Claims "zero code changes", but only for content already sourced from Sanity or Builder through content source maps. — [Vercel blog](https://vercel.com/blog/visual-editing)
- **Puck.** An open-source (MIT) React visual editor positioned as an alternative to Builder.io and Storyblok. It needs component config and stores page data as JSON. — [opensourcealternatives.to: Puck](https://www.opensourcealternatives.to/item/puck)

### Inferences
- **Restructure needed (content moved into files or a database, plus schema and SDK):** TinaCMS, Netlify VE, Decap/Sveltia, Pages CMS, Keystatic, Outstatic, Front Matter, Sanity, Storyblok, Contentful, Payload, Prismic (Slice Machine models each section as a "slice"), Hygraph, DatoCMS, Directus, Builder.io CMS, Makeswift, Plasmic, Statamic and Siteleaf.
- **Lighter retrofit:** CloudCannon editable regions on HTML or Astro output. Fully hard-coded JSX copy probably still needs to be moved into front matter or data files to persist edits. That is an inference: the cited review mentions HTML elements, not JSX string literals.
- **Works on arbitrary code:** Builder Code (formerly Fusion) and Onlook, according to 2026 comparisons. Both are developer or design oriented and AI-assisted rather than classic CMSs.

### Gaps
- No source confirmed whether CloudCannon's editable regions can write edits back into `.astro` or `.jsx` source text, as opposed to data or front matter.
- Builder Code's pricing and non-developer UX for plain copy edits were not verified.

## Q4. Open source, license and small-team pricing; suitability for an AI-generated site with hard-coded copy in React, Astro or HTML

### Takeaway
The open-source Git options are TinaCMS (Apache-2.0 core, with paid TinaCloud for hosted Git and auth), Decap, Sveltia, Pages CMS (MIT), Keystatic and Payload. Outstatic is source-available under FSL. CloudCannon, Storyblok, Contentful, DatoCMS, Hygraph, Builder and Makeswift are commercial SaaS. For an AI-generated site with copy baked into components, no classic CMS works without first extracting the copy. The practical choices are: (a) a one-time refactor into JSON or Markdown, then Tina, CloudCannon or Pages CMS for PR-based edits; or (b) a code-level visual editor (Builder Code, Onlook) that opens PRs against the source.

### Cited Findings
- Pages CMS is MIT-licensed and free. — [bitdoze](https://www.bitdoze.com/best-headless-cms-for-astro/); [dev.to 2026](https://dev.to/lightcms5/best-cms-for-static-sites-in-2026-8-options-compared-53ng)
- Outstatic is under FSL-1.1, which is not OSI open source. — [alpina-tech](https://alpina-tech.com/cms-platforms/best-git-based-headless-cms-platforms/)
- Keystatic's license is listed as MIT. The toolradar source and an alpina-tech note differ on how mature it is. — [toolradar](https://toolradar.com/tools/keystatic)
- TinaCMS is open-source at its core with a hosted TinaCloud. The free tier allows 2 users with visual editing, and the latest stable release cited in a 2026 comparison is v2.7.0. — [tina.io/pricing](https://tina.io/pricing); [dasroot 2026](https://dasroot.net/posts/2026/03/decap-cms-vs-tina-cms-vs-forestry-2026-comparison/)
- CloudCannon Standard costs about $49–55/month for 3 users, and branch workflows cost about $300–350/month. — [vikboyechko](https://vikboyechko.com/blog/cloudcannon-visual-cms-static-sites/)
- Prismic has a free plan for personal sites. — [prismic.io blog](https://prismic.io/blog/best-vue-headless-cms)
- Comparison of headless CMS pricing (2026). — [Lucky Media](https://www.luckymedia.dev/blog/a-strategic-comparison-of-headless-cms-options)
- For existing React apps, guides recommend tools that write to your code, such as Builder Code. Plasmic and Builder's visual CMS are for building new pages from registered components. — [modeinspect](https://modeinspect.com/blog/react-visual-editor); [subframe](https://www.subframe.com/tips/best-visual-editors-react-tailwind)

### Inferences
- Licenses from prior knowledge, unverified in this session: TinaCMS Apache-2.0; Decap MIT; Sveltia MIT; Keystatic MIT; Payload MIT; Directus BSL-1.1 (free under a revenue threshold); Statamic has a free Core with paid Pro; Front Matter CMS MIT.
- **Best fit for an AI-generated site where non-developers need PR-based copy edits:**
  1. A low-cost Git pattern. Have the AI move all copy into `content/*.json` or Markdown, then wire up TinaCMS (free tier for visual editing, Team Plus for PRs) or CloudCannon (`data-editable` regions, branch workflow on Team). This yields click-to-edit plus commits or PRs.
  2. A cheap, form-based option: Pages CMS, Decap, Sveltia or Keystatic over the same JSON or Markdown files. They are free and commit to Git, but there is no click-on-preview. Decap's editorial workflow gives PRs.
  3. No refactor: Builder Code or Onlook editing the JSX directly and opening PRs. This is newer and less proven for non-developers.
- Avoid for this use case:
  - Netlify Visual Editor: closed to new teams.
  - Forestry: shut down in 2023.
  - Sanity, Storyblok, Contentful, Hygraph, DatoCMS and Directus, unless the team is willing to move content out of Git into a hosted database.

### Gaps
- Small-team pricing for Builder Code, Makeswift, Plasmic, Storyblok, Sanity, Contentful, Hygraph and DatoCMS was not gathered in this session.
- No hands-on 2026 source was found comparing these tools specifically on AI-generated codebases with hard-coded strings.
