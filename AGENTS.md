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
- **Fonts**: IBM Plex Mono (headings/labels/mono), Inter (body) via Google Fonts
- **Package manager**: pnpm

## Project structure
```
src/
  data/cv.ts               — CANONICAL content (profile, about, experience, education, skills, projects)
  pages/index.astro        — single-page entry; .layout = sticky .sidebar + .content
  pages/resume.astro       — print-only A4 résumé (PDF source); self-contained styles
  components/
    Hero.astro             — sidebar: name + SocialLinks
    SocialLinks.astro      — 4 icon buttons (GitHub/LinkedIn/Email/Résumé), hrefs from profile
    ThemeToggle.astro      — fixed top-right dark/light toggle
    About.astro            — intro paragraphs
    Projects.astro         — project card grid
    Experience.astro       — work history timeline + Education sub-block
    Skills.astro           — grouped skill tags
    Footer.astro           — copyright + small text links (same 4 destinations)
  styles/global.css        — design tokens (CSS vars), resets, layout, shared utilities
public/
  favicon.svg
```
All components are presentation-only; they import their content from `src/data/cv.ts`.

## Layout
Two-column on desktop: a `position: sticky` `.sidebar` (Hero + Skills, `--sidebar-w`
300px, internal scroll if it exceeds viewport) beside a scrolling `.content`
(About → Projects → Experience → Footer). Stacks to one column below 860px.
Skills uses a stacked group layout to fit the narrow sidebar. Order set in `index.astro`.

## Design tokens (global.css)
| Token          | Value      | Use                       |
|----------------|------------|---------------------------|
| `--bg`         | `#0d0d0d`  | Page background           |
| `--bg-card`    | `#141414`  | Card / section surfaces   |
| `--border`     | `#222`     | Borders, dividers         |
| `--text`       | `#e8e8e8`  | Primary text              |
| `--text-muted` | `#888`     | Secondary / meta text     |
| `--accent`     | `#5eead4`  | Links, highlights, labels |
| `--mono`       | IBM Plex Mono | Headings, labels, tags |
| `--sans`       | Inter      | Body copy                 |
| `--max-w`      | `720px`    | Content column width      |

## Content editing
All content lives in `src/data/cv.ts` — no CMS, no inline arrays in components.
- **Identity / links / email**: `profile`
- **About**: `about` (array of paragraphs)
- **Experience**: `experience`  •  **Education**: `education`
- **Skills**: `skills`  •  **Projects**: `projects`

## Commands
```
pnpm dev        # dev server at localhost:4321
pnpm build      # static output to dist/
pnpm preview    # preview built output
pnpm pdf        # build + render /resume to public/resume.pdf
```

## Deployment target
GitHub Pages (static). `astro.config.mjs` will need `site` and `base` set
for GH Pages subdirectory hosting when the repo is created.

## Constraints
- No JS frameworks (React, Vue, Svelte) — Astro components only
- No additional npm packages without discussion
- Styles scoped to components; only resets and tokens in global.css

## Theming
- Dark (default) + light themes, toggled via `ThemeToggle.astro` (fixed top-right).
- Theme set by `data-theme` on `<html>`; persisted to `localStorage`, falls back to
  `prefers-color-scheme`. Anti-FOUC inline script in `index.astro` `<head>`.
- All colors are CSS vars in `global.css`: dark values in `:root`, light overrides
  in `:root[data-theme="light"]`. Palette: cream `#ECE3CE`, sage `#739072`,
  green `#4F6F52`, forest `#3A4D39` — cream-on-forest (dark) / forest-on-cream (light).

## Astro docs
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
