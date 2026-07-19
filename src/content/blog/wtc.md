---
title: "wtc: git log for production"
description: "A self-hosted change ledger that answers what changed, where a commit ended up, and how two environments differ."
date: 2026-07-12
tags: ["go", "devops", "side-project"]
---

When something breaks in production, working out what changed takes longer than it should.
The build is in CI, the merge is in GitHub, the reconcile is in Flux, and the config tweak
somebody made by hand is in a Slack thread. Reassembling all of that into a timeline is
manual work, and you're usually doing it while the incident is still open.

wtc collects those events as they happen. It reads change events from each source,
normalizes them into one schema, and answers three questions:

```bash
wtc log --env prod --since 2h     # what changed?
wtc where 4f2a91c                 # where is this commit? build, merge, deploy per env
wtc diff staging prod             # how do these two differ right now?
```

## Why not buy one

New Relic, Datadog and Harness all sell change tracking. The products are fine. They're
also tied to the platform you bought them from, and they only know about what that platform
observes. I wanted something I could run myself and point at whatever sources I have.

It's a single Go binary with SQLite behind it, and no CGO, so cross-compiling stays simple.
`wtc serve` is the daemon and it's the only process that opens the database. Every other
subcommand talks to it over HTTP. Keeping that boundary strict is what makes the
single-writer model hold up, and it also means the CLI can run from anywhere.

## Deduplication

Ingestion is at-least-once, since the alternative is dropping events. GitHub reports the
same workflow run at requested, in progress and completed. Flux re-emits on every
reconcile, which on a busy cluster is more or less constant.

Every event carries a dedup key built from identifiers on the source side, never from
arrival time, and writes upsert on that key. That gives one row per logical change no
matter how many times it arrives. A redelivered webhook or a poller re-reading old data
rewrites the row with the same content.

## Environment inference

This is the part I've reworked most. Image tags encode the git sha under more than one
convention, manifest paths vary between repos, and cluster names match environment names
only some of the time. Events go through an ordered set of rules, and if none of them
match, the event is stored with an empty env and listed by `wtc doctor` for me to deal
with. Nothing gets guessed, because a prod deploy filed under staging would be much harder
to notice than a missing value.

## Fixtures

Normalizers are written against payloads captured from real systems. Running serve with
`--capture-dir` writes raw ingest bodies to disk, curated ones get frozen under `testdata/`,
and the parser tests run from those.

Payload documentation tends to be incomplete or out of date, so a parser written from the
docs can pass its own tests and still mishandle real traffic.

## Current state

Ingest works for GitHub, Flux, wrapped helm and terraform runs, and manual records. The
query commands are done. There's a timeline UI embedded in the binary, plus a Helm chart,
a container image and prebuilt binaries. A larger React portal is partly built.

Still in progress, and I've been running it against my own clusters as I go.

[github.com/migueljfsc/wtc](https://github.com/migueljfsc/wtc)
