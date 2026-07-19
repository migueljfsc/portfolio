---
title: "A site for my motorcycle trips"
description: "A small bilingual Astro site holding trip write-ups, a bike catalog, and service logs. Everything is a file."
date: 2026-07-05
tags: ["astro", "side-project"]
---

I've been riding for a while and my notes kept scattering. Photos in one folder, a rough
mental list of what I'd fixed and when, tips I'd picked up and then forgotten by the time
they actually mattered, a bookmarks folder I never opened again. So I built somewhere to
put all of it.

It's Astro and Tailwind, static output, deployed to GitHub Pages. Nothing exotic under the
hood. The interesting decisions were about content, not stack.

## Everything is a file

The rule I set going in: adding content should never mean editing a page. Drop a Markdown
file in the right folder and it shows up in the right places.

Trips and tips are one file each under `src/content/`. Bikes are a file per bike, with
specs, mods and photos in frontmatter. Service records break the pattern, because they're
short, repetitive and there are a lot of them, so they live in a single `services.yaml`
keyed by bike slug. Appending a row is a two-line diff, which is about the amount of
friction a chain lube entry deserves.

Anything with `draft: true` drops out of lists and routes. That's what I use when a trip
write-up is half finished and I want to stop thinking about it for a week.

## Bilingual without building the site twice

The site is English and Portuguese. English at the root, Portuguese under `/pt/`, using
Astro's i18n routing. UI strings sit per locale in one file.

Content splits differently depending on what it is, and that's deliberate. Trips and tips
get one file per language, because a trip write-up in Portuguese isn't a translation of
the English one. Different phrasing, sometimes different details, occasionally a joke that
only works in one of them. Bikes are a single file with localized fields, because a spec
sheet is a spec sheet in both languages and keeping two copies in sync would be a chore
I'd quietly abandon. Service records work the same way: one entry, localized description
of the work.

The split follows how much the content actually differs between languages, rather than
applying one rule everywhere.

## Shipping it

Push to main, Actions builds, Pages serves. The site lives on a subpath so `base` is set
in the Astro config, which is the one thing that bites you if you forget it. Dependabot
opens update PRs weekly and I merge them when CI is green.

It's a small site and it stays small. That's mostly the point.

[migueljfsc.github.io/motorcycle-journey](https://migueljfsc.github.io/motorcycle-journey/)
