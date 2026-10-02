# CV — Interactive Portfolio Site

## Project goal — single source of truth
This repo is the **canonical source** for Miguel's professional info. The intent: edit
the content **once**, here, and have every downstream representation derive from it:

1. **CV website** — this Astro site (already the primary artifact).
2. **PDF résumé** — a print/PDF version generated from the same content (drives `public/resume.pdf`).
3. **LinkedIn profile** — kept in sync with the site's content.

**`src/data/cv.ts` is the canonical content store.** All components read from it; edit
content there, never inline in components. Exports: `profile`, `about`, `experience`,
`education`, `skills`, `projects` (typed via `Role`, `SkillGroup`, `Project`, `Profile`).

**Outputs:**
- **Website** — components consume `cv.ts` directly. ✅ done.
- **PDF**: ✅ `pnpm pdf` builds the site then renders the print-only `/resume` route
  (`src/pages/resume.astro`, A4, self-contained styles from `cv.ts`) to
  `public/resume.pdf` via headless Chromium (`scripts/generate-pdf.mjs`, Playwright dev dep).
  The Résumé button links to `/resume.pdf`. Regenerate after any `cv.ts` content change.
- **LinkedIn**: ⚠️ no public write API for personal profiles — this leg is **assisted, not
  automated**. Generate updated headline/about/experience text from `cv.ts` for Miguel
  to paste in. Do not claim it auto-syncs.

## Stack
- **Framework**: Astro 7 (static output)
- **Styles**: Vanilla CSS with custom properties — no Tailwind, no UI lib
- **Fonts**: Bricolage Grotesque (display + body, variable wdth/opsz), JetBrains Mono (dates, tags,
  data only) via Google Fonts
- **Package manager**: pnpm

## Project structure
Multi-page site (top nav). Every page wraps in `layouts/Layout.astro`.
```
src/
  data/cv.ts               — CANONICAL content (profile, about, experience, education, skills, projects)
  content.config.ts        — blog collection (glob loader, src/content/blog/*.md)
  content/blog/*.md        — blog posts (frontmatter: title, description, date, tags, draft)
  layouts/Layout.astro     — shared shell: head, theme anti-FOUC, .shell, Nav, <slot>, Footer
  pages/
    index.astro            — HOME: headline hero + CareerGraph + featured projects + latest posts
    blog/index.astro       — blog post list
    blog/[...slug].astro   — single post (renders Markdown into .prose)
    projects.astro         — all projects
    cv.astro               — full CV (.layout = sticky .sidebar + .content)
    resume.astro           — print-only A4 résumé (PDF source); self-contained styles
  components/
    Nav.astro              — top nav: brand + tabs (Writing/Projects/CV) + ThemeToggle; active-tab via path
    CareerGraph.astro      — home signature: experience as a rollout track, animated once on load
    PostList.astro         — shared post rows (home + blog index)
    Hero.astro             — CV sidebar: name + SocialLinks
    SocialLinks.astro      — CTA row: Email (primary), Résumé, GitHub/LinkedIn icons
    ThemeToggle.astro      — inline dark/light toggle (lives in Nav)
    About / Projects / Experience / Skills / Footer.astro
  lib/url.ts, lib/slug.ts  — base-aware URLs; anchor ids (CareerGraph links to /cv#<company>)
  styles/global.css        — design tokens (CSS vars), resets, .shell/.wrap/.prose, .status chips
public/
  favicon.svg, resume.pdf
```
Components are presentation-only; CV content comes from `src/data/cv.ts`, blog content from Markdown.

## Layout
- **Shell**: `Layout.astro` renders `.shell` (`--max-w` 1120px) → `<Nav>` → `<main class="page">` slot
  → `<Footer>` (contact prompt + links). Reading pages use `.wrap` (680px); Markdown uses `.prose`.
- **CV page only**: grid — sticky sidebar (Hero + Skills, `--sidebar-w` 300px) beside content
  (About → Experience/Education ledger). Stacks below 900px.
- **Motion**: one orchestrated load sequence on home (hero rise + CareerGraph pulse). No scroll-reveal,
  no ambient animation (NodeField only redraws on pointer move). Reduced motion collapses all of it.

## Adding a blog post
Create `src/content/blog/<slug>.md` with frontmatter (`title`, `description`, `date`,
optional `tags`, `draft`). URL is `/blog/<slug>`. `draft: true` hides it from lists and routes.

## Design tokens (global.css)
Concept: "control plane" — blue-slate base; colour is semantic, not decorative. Backdrop is
`NodeField.astro`: an always-on faint triangular mesh (opacity via `--mesh-alpha`) whose points and
edges glow amber near the pointer (static on touch / reduced motion).
| Token          | Dark       | Light      | Use                                   |
|----------------|------------|------------|---------------------------------------|
| `--bg`         | `#1a2027`  | `#e6e8e5`  | Page background                       |
| `--bg-card`    | `#212833`  | `#f3f4f2`  | Surfaces, chips                       |
| `--border`     | `#303a47`  | `#c6cbc8`  | Rules, dividers                       |
| `--text`       | `#e7e4dc`  | `#1a2027`  | Primary text                          |
| `--text-muted` | `#a3acb6`  | `#46505b`  | Secondary text                        |
| `--accent`     | `#f0a63a`  | `#a35f00`  | Amber: current / in progress, primary CTA, focus |
| `--ok`         | `#6fc28b`  | `#2f7d4b`  | Green: live / shipped                 |
Type scale `--step--1`…`--step-4` (4:3 ratio). Status chips: `.status.wip` / `.status.live`.

## Content editing
All content lives in `src/data/cv.ts` — no CMS, no inline arrays in components.
- **Identity / links / email / hero headline + summary**: `profile`
- **About**: `about` (array of paragraphs)
- **Experience**: `experience` (optional `highlight` = one-liner on the home CareerGraph)  •  **Education**: `education`
- **Skills**: `skills`  •  **Projects**: `projects`

## Commands
```
pnpm dev        # dev server at localhost:4321
pnpm build      # static output to dist/
pnpm preview    # preview built output
pnpm pdf        # build + render /resume to public/resume.pdf
```

## Deployment target
Cloudflare, at **https://migueljfsc.dev**. Two halves, never mixed:
- **The site** — a static-assets Worker with no code (`wrangler.jsonc`), deployed by
  `.github/workflows/deploy.yml` on push to `main`. The apex custom domain lives in
  `wrangler.jsonc` because wrangler reconciles a Worker's routes on every deploy. Never
  `wrangler deploy` by hand.
- **The zone around it** — OpenTofu in `infrastructure/terraform/cloudflare` (the `www` record
  and the www → apex redirect rule, which is the zone's ONE dynamic-redirect ruleset), applied by
  `.github/workflows/terraform.yml`. State in the shared `terraform-tfstate` R2 bucket, key
  `portfolio/cloudflare/`.

Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`. The old GitHub Pages site is retired.

## Constraints
- No JS frameworks (React, Vue, Svelte) — Astro components only
- No additional npm packages without discussion
- Styles scoped to components; only resets and tokens in global.css

## Theming
- Dark + light themes, toggled via `ThemeToggle.astro` (in Nav).
- Theme set by `data-theme` on `<html>`; persisted to `localStorage`, falls back to
  `prefers-color-scheme`. Anti-FOUC inline script in `Layout.astro` `<head>`.
- All colors are CSS vars in `global.css`: dark values in `:root`, light overrides
  in `:root[data-theme="light"]`.

## Astro docs
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
