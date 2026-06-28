# portfolio

Personal portfolio / CV site for Miguel Cardoso — DevOps / Infrastructure Engineer.

Built with [Astro](https://astro.build) (static output) and vanilla CSS. Dark/light
themed, single-page, no JS frameworks.

## Single source of truth

All content lives in [`src/data/cv.ts`](src/data/cv.ts) — `profile`, `about`,
`experience`, `education`, `skills`, `projects`. Components are presentation-only and
read from it. Edit content there once; downstream outputs (site, and later PDF +
LinkedIn text) derive from the same data.

## Commands

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Install dependencies                        |
| `pnpm dev`     | Start dev server at `localhost:4321`        |
| `pnpm build`   | Build static site to `./dist/`              |
| `pnpm preview` | Preview the production build locally        |

## Deployment

Targets GitHub Pages under `/portfolio/`. When deploying, set `site` and
`base: '/portfolio'` in `astro.config.mjs`.
