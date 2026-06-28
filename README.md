# portfolio

[![Deploy to GitHub Pages](https://github.com/migueljfsc/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/migueljfsc/portfolio/actions/workflows/deploy.yml)

Personal site for Miguel Cardoso — DevOps / Infrastructure Engineer.
**Live: <https://migueljfsc.github.io/portfolio/>**

Built with [Astro](https://astro.build) (static output) and vanilla CSS — dark/light
themed, no JS frameworks.

## Pages

| Route | Content |
| :--- | :--- |
| `/` | Home — intro, latest posts, featured projects |
| `/blog` · `/blog/<slug>` | Blog (Markdown via content collections) |
| `/projects` | Projects |
| `/cv` | Full CV (two-column sidebar layout) |
| `/resume.pdf` | Printable A4 résumé, generated from `cv.ts` |

## Single source of truth

CV/identity content lives in [`src/data/cv.ts`](src/data/cv.ts) — `profile`, `about`,
`experience`, `education`, `skills`, `projects`. Components are presentation-only and
read from it; the website and the résumé PDF both derive from the same data.

Blog posts are Markdown files in [`src/content/blog/`](src/content/blog) — add a
`.md` with frontmatter (`title`, `description`, `date`, optional `tags`, `draft`) and
it shows up at `/blog/<filename>`.

## Commands

| Command        | Action                                          |
| :------------- | :---------------------------------------------- |
| `pnpm install` | Install dependencies                            |
| `pnpm dev`     | Start dev server (`localhost:4321/portfolio/`)  |
| `pnpm build`   | Build static site to `./dist/`                  |
| `pnpm preview` | Preview the production build locally            |
| `pnpm pdf`     | Build + regenerate `public/resume.pdf` (Playwright) |

## Deployment

Auto-deploys to GitHub Pages on every push to `main` via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (`withastro/action` +
`deploy-pages`). Served under the `/portfolio` base set in `astro.config.mjs`.

After editing `cv.ts`, run `pnpm pdf` and commit the refreshed `public/resume.pdf`
(CI does not regenerate it).
