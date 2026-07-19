---
title: "A site for my motorcycle trips"
description: "A small bilingual Astro site holding trip write-ups, a bike catalog, and service logs."
date: 2026-07-05
tags: ["astro", "side-project"]
---

I ride, and the record of it was scattered. Photos sat in one folder. Maintenance dates I
mostly half-remembered. Tips I'd read somewhere and then couldn't find again when they
were relevant. I wanted one place for the trips, the bikes, and what's been done to them.

The site runs on Astro and Tailwind, builds to static files, and deploys to GitHub Pages.
Most of the thought went into how content gets stored rather than any of that.

## Everything is a file

I didn't want adding a trip to involve editing a page. Content goes in as Markdown and the
site picks it up from there.

Trips and tips are one file each under `src/content/`. Each bike gets a file too, with
specs, mods and photos in the frontmatter. Service records work differently. They're short
and there are a lot of them, so they all live in a single `services.yaml`, keyed by bike
slug. Adding one is about two lines.

Setting `draft: true` on anything keeps it out of the lists and routes until I'm ready for
it to be there.

## Two languages

English at the root, Portuguese under `/pt/`, using Astro's i18n routing. UI strings are
defined per locale in one file.

How content splits depends on the type. Trips and tips are one file per language. When I
write up a trip in Portuguese it tends to come out different from the English version,
different details, different length, so keeping them as separate documents is easier than
maintaining a translation. Bikes are a single file with localized fields instead, since a
spec sheet reads the same in both languages and two copies would drift. Service records
follow the bikes: one entry, with the description of the work localized.

## Deploying

Push to main and Actions builds and publishes to Pages. The site sits on a subpath, so
`base` has to be set in the Astro config. Dependabot opens dependency PRs weekly.

[migueljfsc.github.io/motorcycle-journey](https://migueljfsc.github.io/motorcycle-journey/)
