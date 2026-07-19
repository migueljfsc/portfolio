---
title: "wtc: git log for production"
description: "A self-hosted change ledger that answers what changed, where a commit ended up, and how two environments differ."
date: 2026-07-12
tags: ["go", "devops", "side-project"]
---

Something breaks in prod and the first question is always the same. What changed?

Answering it usually means opening five tabs. CI for the build, GitHub for the merge, Flux
for the reconcile, a Slack thread where someone mentions the config tweak they made at 4pm.
The information exists. It's just spread across systems that don't talk to each other, and
you're reassembling the timeline by hand while the incident is still running.

wtc puts it in one place. It ingests change events from wherever they come from, normalizes
them into a single schema, and answers three questions fast:

```bash
wtc log --env prod --since 2h     # what changed?
wtc where 4f2a91c                 # where is this commit? build, merge, deploy per env
wtc diff staging prod             # how do these two differ right now?
```

## Why build it

New Relic, Datadog and Harness all sell change tracking. It works well, and it's locked
inside their platform, which means it sees what their agents see and it lasts as long as
your contract does. I wanted something neutral that runs on infrastructure I control and
reads from whatever sources I point it at.

So: one Go binary, SQLite underneath, no CGO so it cross compiles without drama.
`wtc serve` is the daemon that owns the database. Every other subcommand is a thin HTTP
client of it, and the CLI never opens the database file directly. That constraint sounds
fussy but it's what keeps single-writer SQLite honest and makes the remote case work for
free.

## The parts that were actually hard

Deduplication, first. Ingestion is at-least-once by design, because the alternative is
losing events. GitHub reports the same workflow run three separate times as it moves
through requested, in progress and completed. Flux re-emits on every reconcile, and a busy
cluster will bury you in identical notifications. So every event carries a dedup key
derived from source-side identifiers, never from arrival time, and writes upsert in place.
One row per logical change no matter how many times it shows up. A lost webhook, a poller
re-read and a Flux re-emit are all harmless replays of the same thing.

Then figuring out which environment an event belongs to. This is the actual product
problem, and it's messier than it sounds: image tags encode the git sha in more than one
convention, manifest paths vary per repo, and cluster names only sometimes match env names.
Everything goes through an ordered rules engine, and when nothing matches, the event lands
with a blank env and gets surfaced by `wtc doctor`. It never guesses. A tool that quietly
files a prod deploy under staging is worse than one that admits it doesn't know.

## Fixtures before code

Every normalizer is written against real payloads captured from real infrastructure.
Running serve with `--capture-dir` dumps raw ingest bodies to disk, curated ones get frozen
under `testdata/`, and the parser tests run against those. No normalizer merges without
golden fixtures.

This one's a discipline thing. Documentation drifts from what services actually send, so a
parser written from memory of the docs passes its own tests and then falls over on real
traffic. Capturing first means the tests encode reality.

## Where it's at

Ingest from GitHub, Flux, wrapped helm and terraform runs, and manual entries. The query
commands work. There's an embedded timeline UI in the binary, a Helm chart, a container
image and static builds. A richer React portal is partway done.

Still a work in progress, but I run it against real clusters, which is the only test that
counts.

[github.com/migueljfsc/wtc](https://github.com/migueljfsc/wtc)
