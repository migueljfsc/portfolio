---
title: "Pitchboard, a month later"
description: "Accounts, passes you can bend, a 3D view you can actually work in, a proper drawing toolkit, and a guided tour for anyone opening it for the first time."
date: 2026-09-27
tags: ["react", "canvas", "football", "side-project"]
draft: false
---

The [first post](/blog/pitchboard/) ended with the board, the animation, the share links and
export working, and with somewhere to keep boards as the obvious gap. A month on, that gap is
closed and a lot else has changed around it. This is the list.

## It has a home now

Pitchboard lives at [pitchboard.migueljfsc.dev](https://pitchboard.migueljfsc.dev). Everything
still works without an account: you open it, draw, and the board autosaves in your browser.

Signing in is optional, with Google or with an email and password. Once you do, boards are kept
on the server and reachable from any browser, filed into folders that can sit inside other
folders, so a season's work can be organised instead of scrolled through. Squad presets follow
the account too. A saved board can be published to a short link that follows it as you keep
editing, which sits alongside the original share link that carries the whole board inside the
URL. That one hasn't changed and still needs nothing on a server.

It all runs on Cloudflare's free tier, which shaped one decision in a way I didn't expect. The
server gets ten milliseconds of CPU per request, and a proper password hash takes several times
that, so the expensive part of hashing a password happens in your browser before anything is
sent. Deleting your account is one button, and it takes everything with it.

## Passes and runs

A pass can now be bent around a defender or lofted over one, and the ball keeps its own timing
instead of simply following the players, so a pass can leave early or arrive late. Runs choose
how they start and finish: set off from a standstill, or arrive already moving and carry on
through the next scene. Resetting a player's movement is a single action, for one scene or for
the whole board.

There's also a present mode, which strips the editor away and leaves the board and the play
controls, for going through a move with a team.

## The 3D view

The tilted view used to be something you looked at. Now it edits everything the flat board
does: selecting and dragging players, drawing runs, and all of the drawing tools. Goals have
nets and depth, the ball is a ball, keepers wear their own kit, and the grass can be given a
natural, uneven shade instead of perfect stripes.

## Drawing on the board

The drawing tools moved into a rail of their own and grew considerably: outline zones, polygons
whose corners move one at a time, a drawn ball that isn't the match ball, and link lines in
different styles. Text labels snap and align to each other and fit their words exactly. Moving
any drawing brings up a ruler showing the distance it covers in metres.

The part I use most is the spotlight. Highlight a few players, drawings or links, and the rest
of the pitch darkens around them, scene by scene. It's the quickest way I've found to say
"watch these three" without adding an arrow for everything.

A command palette sits behind a keyboard shortcut for anyone who'd rather type than go looking
for a button.

## Smaller things

Each scene can be zoomed and framed on its own. Boards can start from a template instead of a
blank pitch. Exports render in the background while you keep working. The Selection panel is
split by what it affects, and pass timing shows up in the scene bar.

## From video

Boards can now be imported from match footage. A separate project turns a broadcast clip into
player positions, and Pitchboard turns those into a board you correct, which beats drawing
one from nothing: who had the ball scene by scene, the passes, the shot, and the kits measured from the
clip. That side has [its own post](/blog/football-tracks/).

## A tour for the first visit

That's a lot of features for one screen, and most of them don't explain themselves. So I added a
guided tour, built specifically for people opening Pitchboard for the first time. It plays on a
demo board of its own, so it never touches your work, and walks through scenes, runs, passes,
the drawing tools, the 3D view, sharing and export, one step at a time. It opens by itself on a
first visit, and the Tour button in the top bar brings it back whenever you want.

The quickest way to see all of the above is to let the tour show you:
[pitchboard.migueljfsc.dev](https://pitchboard.migueljfsc.dev).
