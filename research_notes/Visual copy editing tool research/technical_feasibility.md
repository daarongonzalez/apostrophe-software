# Technical feasibility: open-source "click-to-edit copy, then open a GitHub PR" tool

Research date: 2026-11-09. Network note: this session could not reach docs.github.com, webcontainers.io, www.sanity.io or docs.onlook.com directly, so some primary-doc facts come from search-result summaries of those pages (URLs still cited) rather than full-page reads. github.com repo pages were fetched directly.

## 1. Mapping a clicked element back to the exact source line

### Takeaway
Build-time instrumentation (a compiler/bundler plugin that stamps `data-*` file:line:col attributes on DOM elements) is the most reliable and best-proven approach and has a mature MIT-licensed, multi-framework implementation (code-inspector-plugin). Runtime tricks that relied on React internals broke in React 19. Plain text search works for a large share of simple marketing-site copy but fails predictably on duplicates, split/templated text and i18n; an AST rewrite step is needed to apply the edit safely, and an LLM agent is a sensible fallback for unmatched edits.

### Cited Findings
**(a) Build-time plugins / data attributes**
- code-inspector-plugin (zh-lx/code-inspector): click an element (Option+Shift / Alt+Shift) to jump to its source in the IDE; supports webpack, Vite, rspack/rsbuild, farm, esbuild, turbopack and mako; frameworks Vue 2/3 and Nuxt, React, Next.js, UmiJS, Preact, Solid, Qwik, Svelte and Astro; MIT license; ~1,067 commits. README does not document the mechanism or release dates. — [GitHub: zh-lx/code-inspector](https://github.com/zh-lx/code-inspector)
- Onlook (open-source visual editor for Next.js + Tailwind) says it "instrument[s] the code in order to map elements to their place in code"; uses CodeSandbox SDK as the dev sandbox and renders the preview in an iframe; Apache 2.0; claims some support for non-Next.js and non-Tailwind projects; component detection "previously in Onlook Desktop" (separate repo), so the project moved from a desktop app to a web app. Hosted product in early access/waitlist. Page footer 2026. — [GitHub: onlook-dev/onlook](https://github.com/onlook-dev/onlook)
- Astro dev mode stamps `data-astro-source-file` and `data-astro-source-loc` (line:col) on elements; Astro's own dev toolbar reads them. Third-party tools (Frontman, astro-click-to-source) use these for Alt+Click-to-source. Frontman's docs claim the attributes depend on the dev toolbar being enabled, and that in Astro 7 the Rust compiler no longer emits the legacy source attributes so Frontman injects its own `data-frontman-source-*` — NOT verified against Astro release notes. — [Frontman Astro docs](https://frontman.sh/docs/integrations/astro/); [Astro repo mirror: dev toolbar](https://repos.supermodeltools.com/astro/file-packages-astro-src-runtime-client-dev-toolbar-apps-audit-annotations-ts.html); [astro-click-to-source](https://github-users.yhajoa.workers.dev/invisible1988/astro-click-to-source)
- React 19 removed compiled-in JSX source location (`__source`/`__self`, `fiber._debugSource`) in PR #28265; DevTools moved to lazily deriving source from component stacks (PR #28351). Issue #29092 asking to restore it was closed "not planned". — [facebook/react issue #29092](https://www.GitHub.com/facebook/react/issues/29092); [react PR #28351](https://github.com/facebook/react/pull/28351)
- A third-party SWC plugin README states the removal "broke all click-to-source tools (react-dev-inspector, LocatorJS, click-to-component, etc.)" and works around it by injecting `data-source` attributes (file, line, column) on JSX DOM elements at build time. — [swc-plugin-source-tracker (pkgstats)](https://www.pkgstats.com/pkg:swc-plugin-source-tracker)
- vite-plugin-react-click-to-component 3.1.0 adapted by reading `fiber._debugInfo` instead of `_debugSource`. LocatorJS-specific React 19 fix not confirmed. — [Socket diff, vite-plugin-react-click-to-component 3.1.0](https://socket.dev/npm/package/vite-plugin-react-click-to-component/diff/3.1.0)
- unplugin-jsx-source exists as a generic unplugin for injecting JSX source attributes. — [unplugin-jsx-source README](https://cdn.jsdelivr.net/npm/unplugin-jsx-source@0.2.2/README.md)

**CMS analog: stega / content source maps**
- Sanity stega encodes Content Source Maps JSON as invisible zero-width UTF-8 characters appended to string values; overlays scan the DOM, decode them and draw click-to-edit targets with no manual mapping. Only works on strings (images/numbers need `data-sanity` attributes); invisible chars can break string comparisons, URLs, date parsing and length checks (use `stegaClean()`); payload ~hundreds of chars per string; non-UTF-8 pages break detection. — [Sanity: client setup and stega](https://www.sanity.io/docs/visual-editing/visual-editing-client-stega); [Sanity overlays](https://www.sanity.io/docs/visual-editing-overlays)
- Vercel Content Link / Edit Mode does the same for CMS fields on Vercel preview deployments (Pro/Enterprise plans), with CMS integrations (Payload, DatoCMS, Contentful, Sanity) embedding invisible encoded JSON in API responses. — [Vercel Edit Mode docs](https://vercel.com/docs/edit-mode); [Payload: Vercel Content Link](https://payloadcms.com/docs/integrations/vercel-content-link)

**(d) AST rewrite while preserving formatting**
- recast stores metadata on the AST to reprint only changed nodes and preserve formatting; it's the printer under jscodeshift; Babel AST cloning must be disabled (`cloneInputAst: false`) to keep that info. — [egghead: codemods with Babel plugins](https://egghead.io/blog/codemods-with-babel-plugins); [pkgpulse: recast vs jscodeshift vs ts-morph (2026)](https://www.pkgpulse.com/guides/recast-vs-jscodeshift-vs-ts-morph-codemods-code-2026)
- Replacing JsxText/StringLiteral nodes via TS compiler API: apply replacements in reverse source order to avoid offset shifts, preserving surrounding text/comments. — [codegenes: TS Compiler API preserving formatting](https://www.codegenes.net/blog/typescript-compiler-api-loses-formatting-during-transformation/)
- magic-string does offset-based overwrite/insert/remove on the original string (with sourcemaps) — pairs with any parser that gives node start/end offsets. — [magic-string skill notes](https://claudskills.com/skills/magic-string-sourcemap/SKILL.md)
- JSX text has whitespace subtleties (codemods fall back to `{"..."}` expression containers when leading/trailing whitespace matters). — [react-codemod PR #95 mirror](https://scriptagc.wasmer.app/https_github_com/reactjs/react-codemod/pull/95)

**(e) LLM-assisted fallback**
- anthropics/claude-code-action (v1.0, MIT, ~9.9k stars, 2026) activates on @claude mentions, issue assignments, or automation workflows with an explicit `prompt`; can implement fixes/features; supports Anthropic API, Bedrock, Vertex AI, Microsoft Foundry; quick setup via `/install-github-app` requires repo admin. Exact PR-opening behaviour is in docs/capabilities-and-limitations.md (not read). — [GitHub: anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- Builder.io Fusion connects to existing GitHub/GitLab/Azure/Bitbucket repos, lets users visually edit and "Send PR"; admins can restrict editable file paths; reviewers can tag @builder-bot in the PR for follow-ups. (Vendor marketing; a Product Hunt user said an earlier version only edited Builder-created pages.) — [Builder.io Fusion docs](https://www.builder.io/c/docs/fusion-toolbar); [Builder Fusion projects overview](https://www.builder.io/c/docs/fusion-projects-overview)

### Inferences
- Reliability ranking (my assessment): build-time attributes (high, for static JSX/template text; points to the element's *tag*, not necessarily where the string literal lives) > AST locate-and-rewrite given a file hint (high for literals in the same file) > exact-string repo search (medium; good when unique) > source maps (low-medium: they map compiled JS positions, not DOM text nodes, and need extra work to get from a text node to a JSX expression) > LLM (good recall, needs human PR review).
- Recommended pipeline: (1) attributes give file:line:col of the element; (2) parse that file, find text/literal nodes inside the element and match the old string; (3) if no match (text came via props/arrays/imports), run repo-wide literal search constrained to string-literal/JSX-text/Markdown nodes; (4) if 0 or >1 candidates, write the edit into the committed change file and let an agent (Claude Code Action) resolve it, flagging it in the PR.
- The data-attribute approach requires running the repo's dev build with an injected plugin — i.e. it couples mapping to the preview strategy (section 2). Without a build (live-site mode), only search + LLM are available.
- Text search failure cases: duplicate strings (nav labels, "Learn more"); text split across JSX expressions (`Hello {name}!`, `<b>` inside a sentence); template literals / string concatenation; whitespace/entity differences (`&nbsp;`, smart quotes, CSS `text-transform: uppercase`); i18n keys where the rendered string lives in JSON; minified/CMS-sourced text not in the repo at all. Normalizing whitespace and HTML entities before matching fixes some of these.

### Gaps
- Could not read Onlook's engineering docs/blog (docs.onlook.com blocked); its exact mechanism (reported elsewhere as injected `data-oid` IDs + Babel AST) is unverified here.
- Did not verify current Svelte inspector / Vue DevTools "open in editor" internals or LocatorJS's React 19 status.
- Astro 7 source-attribute claim is from a single third-party doc.

## 2. Running a preview of a repo

### Takeaway
Options in increasing cost/complexity: reuse existing preview deployments (cheapest, but no injected mapping plugin unless the repo opts in) < local desktop app running the dev server (free compute, install friction) < cloud sandboxes (~$0.05/vCPU-hour, operational cost scales with usage) — with WebContainers attractive technically but requiring a paid commercial licence for for-profit production use.

### Cited Findings
- WebContainers: licence required for production use in a for-profit setting; prototyping free; price is custom/contact sales (no public rate). Aggregators say free for open-source and non-commercial use. — [WebContainers enterprise page](https://webcontainers.io/enterprise) (via search summary); [eesel: StackBlitz pricing 2026](https://www.eesel.ai/blog/stackblitz-pricing)
- E2B: ~$0.0504 per vCPU-hour + $0.0162 per GiB-hour; Pro tier $150/month extends sessions to 24h. Daytona: similar CPU rates, no plan fee. Vercel Sandbox: bills active CPU only (~$0.128/CPU-hour) plus memory and snapshot charges; sandbox creation billable. CodeSandbox SDK: tiered (one source lists $170/mo "Scale"), no per-vCPU rate found. Sources dated Apr–Oct 2026 and partially conflicting. — [Fly.io: AI sandbox pricing compared](https://fly.io/learn/ai-sandbox-pricing/); [Northflank: AI sandbox pricing](https://northflank.com/blog/ai-sandbox-pricing); [Superagent sandbox benchmark 2026](https://www.superagent.sh/blog/ai-code-sandbox-benchmark-2026)
- Onlook chose CodeSandbox SDK as its dev sandbox with an iframe preview. — [GitHub: onlook-dev/onlook](https://github.com/onlook-dev/onlook)
- Vercel preview deployments already host the Vercel Toolbar; Edit Mode only appears when page elements are matched to CMS fields (Pro/Enterprise). — [Vercel Edit Mode docs](https://vercel.com/docs/edit-mode)

### Inferences
- A Next.js dev server typically needs 1–2 vCPU and 2–4 GB RAM; at E2B-like rates a 30-minute editing session would cost on the order of a few cents (≈$0.05–0.15), plus cold-start time for `npm install` (often 30s–several minutes) — snapshotting/caching node_modules is the main engineering effort. (Estimate, not from a source.)
- WebContainers' licensing makes it fine for a non-commercial open-source project but a risk if a hosted commercial tier is planned; it also only runs Node-based toolchains in Chromium-class browsers (general knowledge; could not fetch the browser-support page).
- Desktop (Electron/Tauri) running `npm run dev` locally fits developer/agency users with Node installed but is a poor fit for non-technical copy editors; it does avoid hosting costs and secrets issues (private env vars needed by builds).
- Preview-deployment reuse: works for viewing, but click-to-source needs the repo to include the attribute plugin in preview builds (a one-time opt-in PR the tool could open itself). Otherwise fall back to live-site text matching.
- Many real repos fail to build in a fresh sandbox (missing env vars, private packages, databases); expect a meaningful fraction of "load any public repo" attempts to fail.

### Gaps
- No authoritative per-hour CodeSandbox SDK, Daytona, Cloudflare Containers pricing fetched from vendor pages.
- WebContainer browser support and cross-origin-isolation requirements not verified (site blocked).

## 3. Live-site mode (no repo build)

### Takeaway
Loading a live URL and overlaying editors is easy for the UI part but the mapping back to source is weak (search + LLM only). Framing a third-party site requires a reverse proxy that strips X-Frame-Options/CSP frame-ancestors, which has security implications; a browser extension avoids framing restrictions entirely and is the more robust "live-site" option.

### Cited Findings
- CSP `frame-ancestors` supersedes X-Frame-Options in modern browsers; a proxy can strip/rewrite both (e.g. Traefik middleware setting `frame-ancestors *`). — [BrowserStack: frame-ancestors guide](https://www.browserstack.com/guide/frame-ancestors); [Traefik community thread](https://community.traefik.io/t/unable-to-overwrite-x-frame-options/19076.md)
- Stripping framing headers removes clickjacking protection; proxy-based bypasses have enabled clickjacking on whole domains; scope to sites you control and set frame-ancestors to the editor origin rather than `*`. — [remarpro report on X-Frame-Options bypass](https://remarpro.com/support/topic/click-jacking-bypass-x-frame-options); [CISPA framing-control-proxy](https://github.com/cispa/framing-control-proxy)

### Inferences
- A proxy must also rewrite absolute URLs, cookies, CSP `script-src` (to allow the injected overlay), and handle client-side routing/hydration; SPAs that hydrate can overwrite contentEditable changes. Expect breakage on sites with strict CSP, auth, or bot protection.
- A browser extension (content script) runs on the real page, bypasses framing headers and CSP for its own scripts, and can capture element path + text + page URL; it is the simplest robust live-site capture. It can then call the web app/API to create the PR.
- contentEditable is fine for plain text; for rich text (inline links/bold) capture the edited innerHTML/text segments and compute a diff of text runs rather than raw HTML.
- Live mode should probably always produce a change list and rely on search+AST, then LLM fallback.

### Gaps
- No primary sources found on how existing products (e.g. Builder.io, Webflow-style editors) handle live-site proxying; no measured success rates for text-search matching.

## 4. Hard cases

### Takeaway
Static JSX/HTML/Astro/Markdown text is tractable; i18n files and Markdown are actually easier (strings live in data files); CMS/API text is out of scope unless the tool detects and reports it (or integrates via stega/Content Source Maps); props/arrays/conditional/templated text needs AST tracing or an LLM.

### Cited Findings
- CMS-driven text can be mapped only if the CMS emits source metadata (Sanity stega, Vercel Content Link); stega only covers strings and has side effects. — [Sanity stega docs](https://www.sanity.io/docs/visual-editing/visual-editing-client-stega); [Vercel Edit Mode docs](https://vercel.com/docs/edit-mode)
- Build-time attributes point at element locations; React 19 removed runtime source info, so component-level (props) tracing must come from build-time instrumentation or component stacks. — [facebook/react #29092](https://www.GitHub.com/facebook/react/issues/29092)

### Inferences
- i18n (next-intl, i18next): rendered text matches a value in `messages/*.json`; edit the locale file for the current locale. Duplicate values across keys are common; disambiguate via the key used at the call site (`t('hero.title')`), found by AST from the attributed element. Fairly reliable.
- Markdown/MDX: text search works well; paragraphs map cleanly; inline formatting (`**bold**`, links) means rendered text ≠ source text — match on a markdown-stripped version then apply via a Markdown AST (remark/mdast) to preserve syntax.
- Props/arrays/config (e.g. `features = [{title: "..."}]`, `<Hero title="..." />`): the attribute points at the component's internal `<h1>`, not the call site; need to search for the literal across the repo or follow props up via component stack — good LLM fallback territory.
- Rich text with inline elements: one sentence spans several JSX text nodes and elements; restrict MVP to editing text runs while keeping tags, or let the agent handle structural changes.
- Dynamic/conditional/templated text (`{count} items`, ternaries): flag as "needs developer" or LLM; don't auto-rewrite.
- SSR vs CSR doesn't matter much for attribute-based mapping (attributes exist in both if the plugin runs at compile time) but matters for live-site text extraction (CSR content only after hydration — need a real browser, not HTML fetch).
- Meta title/description and alt text: not clickable in the page; present as a side panel populated from `<head>`/attributes; source usually in `metadata` exports (Next.js), frontmatter or layout props — literal search + AST works.

### Gaps
- No empirical data found on what share of typical marketing-site copy is static vs CMS vs i18n.

## 5. GitHub integration

### Takeaway
Use a GitHub App (fine-grained Contents R/W + Pull requests R/W, user access tokens so commits/PRs are attributed to the user). Batch all edits into one commit via the Git Data API (blobs → tree → commit → update ref), then open one PR. Rate limits are not a constraint for this workload; for repos the user can't push to, fork-then-PR is required.

### Cited Findings
- GitHub recommends GitHub Apps over OAuth apps: fine-grained permissions, per-repository installation, short-lived tokens; OAuth apps must request the broad `repo` scope to touch contents/PRs. GitHub Apps can act on a user's behalf via user access tokens (same OAuth flow), which expire and refresh. — [GitHub docs: About GitHub Apps and OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps)
- Typical least-privilege for code-changing apps: Contents Read & Write (file ops, branch creation) + Pull requests Read & Write. — [Moderne: GitHub permissions](https://docs.moderne.io/administrator-documentation/moderne-platform/references/github-permissions)
- Multi-file single commit: create blobs, create a tree (base_tree = current), create a commit with parent SHA, then PATCH the branch ref. — [GitHub docs: Git trees](https://developer.github.com/v3/git/trees); [Medium: push multiple files in a single commit](https://siddharthav.medium.com/push-multiple-files-under-a-single-commit-through-github-api-f1a5b0b283ae)
- Rate limits: GitHub App installation token min 5,000 req/hour (15,000 on Enterprise Cloud orgs); secondary limits ~80 content-generating requests/min and 500/hour; 900 points/min (writes cost 5 points); exceeding returns 403/429 and abuse can get the integration banned. — [GitHub docs: REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)

### Inferences
- One PR with N file edits ≈ N blob creates (or inline content in the tree) + 1 tree + 1 commit + 1 ref create + 1 PR ≈ ~5–20 write requests — far under limits. Inline `content` in tree entries can avoid separate blob calls.
- Forks: for repos where the user lacks write access, create a fork under the user (requires a user token), push the branch there, open a cross-repo PR with `head: user:branch`. A GitHub App installed only on the upstream repo can't write to the user's fork unless also installed there — OAuth user tokens are simpler for the "edit any public repo" case. Not verified against docs (docs.github.com blocked).
- Lightweight change file: commit e.g. `.copy-edits/2026-11-09-<id>.json` alongside the actual source edits (audit trail), or alone, as the trigger for a Claude Code Action workflow that resolves unmatched edits and pushes to the same PR branch.
- Octokit (JS) covers all calls; client-side-only apps can't keep an App private key, so a small backend (or GitHub device flow for desktop) is needed.

### Gaps
- Fork + GitHub App user-token interplay and exact fine-grained permission for creating forks not verified from primary docs.

## 6. Effort estimate and framework priority

### Takeaway
An MVP (one framework family, Vite/Next.js React + Astro + plain HTML, build-time attributes + AST rewrite + search fallback + single-PR GitHub flow + optional Claude Code Action fallback) is roughly a 1–3 engineer-month effort for a small team by leveraging code-inspector-plugin, recast/Babel and Octokit; a mature product (cloud sandbox orchestration, many frameworks, i18n/MDX/CMS handling, live-site extension, rich text) is plausibly 12+ engineer-months. These are my estimates, not sourced figures.

### Cited Findings
- Existing building blocks: code-inspector-plugin (MIT, multi-bundler/framework) — [GitHub](https://github.com/zh-lx/code-inspector); Onlook (Apache 2.0, Next.js+Tailwind focus, CodeSandbox SDK) — [GitHub](https://github.com/onlook-dev/onlook); claude-code-action (MIT) — [GitHub](https://github.com/anthropics/claude-code-action); Builder.io Fusion as a commercial comparable that ships "visual edit → PR" — [Builder docs](https://www.builder.io/c/docs/fusion-toolbar).

### Inferences
- Framework order: (1) plain HTML / static sites (text search + parse5/HTML AST, no build needed — trivially reliable); (2) Astro (marketing-site heavy, .astro + Markdown content, dev attributes exist though Astro 7 status uncertain); (3) Next.js/React via Vite or Next plugin (largest market, but React 19 means you must rely on build-time injection; Next.js App Router + Turbopack plugin support is a risk area); then Vue/Nuxt, Svelte.
- Lowest-risk MVP architecture: web app + GitHub App; "preview" = existing preview URL or local dev (desktop/CLI companion) with the inspector plugin; edits captured as JSON change list `{file?, line?, selector, oldText, newText, pageUrl}`; deterministic resolver (attribute → AST → search) commits what it can; unresolved items go to the committed change file and a Claude Code Action workflow. This avoids building sandbox infra in v1.
- Main fragility points: repos that don't build in sandbox; React 19/Turbopack plugin compatibility churn; duplicate/templated text; CMS content (detect and tell the user).

### Gaps
- No public data on engineering effort for comparable tools (Onlook, Builder Fusion); estimates above are judgement only.
