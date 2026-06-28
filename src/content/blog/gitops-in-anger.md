---
title: "GitOps in anger: lessons from a year of ArgoCD"
description: "What actually bites you once GitOps moves past the demo and into production."
date: 2026-06-20
tags: ["kubernetes", "gitops", "argocd"]
---

GitOps demos beautifully and then teaches you a few hard lessons the moment real
traffic and real teams show up. Here are the ones that cost me the most time.

## Drift is a feature, not a bug

The first instinct when something's on fire is to `kubectl edit` your way out.
With GitOps that change gets reverted on the next sync — which feels hostile until
you realise that's the whole point. The fix is cultural: the cluster is a
**read-only** projection of Git. Break-glass access exists, but it's loud and rare.

## Sync waves save you

Ordering matters more than you'd think — CRDs before the controllers that use them,
namespaces before the things inside them. Sync waves turn "why is this flapping"
into a one-line annotation.

## Keep the diff small

The single best reliability lever is small, frequent, reviewable changes. A 3-line
PR that fails is trivial to roll back. A 300-line "sync everything" PR at 2am is how
you end up writing the postmortem.

More to come — this one ran long enough.
