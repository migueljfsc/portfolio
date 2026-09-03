---
title: "football-tracks: taking the players off the broadcast"
description: "A pipeline that turns a few seconds of televised football into player positions in metres, so a play can be imported into Pitchboard instead of drawn by hand."
date: 2026-09-03
tags: ["python", "computer-vision", "football", "side-project"]
draft: false
---

Pitchboard works. I can set up two teams, move them between scenes, draw the runs and export
the thing. What I hadn't accounted for is how long the first five minutes take. Before you get
to the interesting part, why the second ball went where it did, you're dragging twenty-two dots
into roughly the shape you remember from a clip you've watched four times. That's the data
entry half of the job, and it's the half that made me close the tab some evenings.

The move I actually want is to paste in ten seconds of footage, get the players where they
really were, and then fix what's wrong. Correcting a play is a much smaller job than drawing
one.

So football-tracks is the other half. Video in, positions out.

![Ten seconds of a Rio Ave goal off the television, and the same ten seconds as dots on a pitch](https://pub-3b4bfc0114394ce680518fa92ce65e1d.r2.dev/blog/football-tracks-broadcast-to-topdown.gif)

## The one file between them

It writes `tracks.json`: every player's position, frame by frame, in metres on a 105 × 68
pitch, with a team and, where it can be read, a shirt number.

That file is the entire product, and the boundary is deliberate. Nothing downstream of it
touches video. Nothing upstream of it knows what a Pitchboard board looks like. The two repos
meet at a JSON schema I froze before any of the vision worked.

The reason for the strictness is that I expect to throw the vision half away and rewrite it.
It's the part I understand least and the part most likely to be replaced by a better model in a
year. When that happens, the TypeScript side shouldn't notice.

A second rule falls out of the same thinking: no pixels cross the boundary. Positions are in
metres, with the origin at the top-left corner of the pitch, the same space and the same origin
Pitchboard already uses. Image coordinates stay inside the stage that produced them.

## Where is the camera

This is the hard part, and it took most of the time.

A broadcast frame is a photo of a flat plane taken from an angle. Getting from a pixel to a
position on the pitch is a 3 × 3 matrix, and finding that matrix means knowing where some known
markings are in the picture. The halfway line, the edge of the box, the goal line.

![Every pitch marking the detector can see on a frame, drawn in red to trace along](https://pub-3b4bfc0114394ce680518fa92ce65e1d.r2.dev/blog/football-tracks-seed.png)

The camera pans and zooms constantly, so it gets solved per frame rather than once. Where the
solver can't see enough markings, the previous frame's matrix is carried forward by tracking
the grass texture between the two.

Almost everything I got wrong lived here, and the mistakes share a nasty shape. They produce a
fit that looks fine by every number you'd think to check.

Four lines give you exactly enough constraints, so the fit lands perfectly on its own points no
matter how bad they are, and there's no residual left to tell you anything. Two traced lines
cross somewhere, and a solution that maps the whole image onto that crossing satisfies both of
them exactly. Residual zero, and completely wrong. RANSAC's threshold is in the destination
space, which here is metres, so the default of 5 was quietly accepting five-metre errors. Then
there's the set of landmarks it's most natural to click first, both posts and both corners of a
goal, which all sit on the same line. A matrix fitted to them describes nothing at all.

None of that showed up as a number. It showed up when I drew the pitch model back onto the
frame and looked at whether the lines landed on the lines. Every stage in this project has a
picture for that reason. A stage I can't look at is a stage I can't debug.

## Finding the players

A person detector runs on each frame, and the boxes get strung into tracks with stable ids. The
detection part is solved and boring. Identity is where it goes wrong.

![Detection boxes with confidence scores on one broadcast frame](https://pub-3b4bfc0114394ce680518fa92ce65e1d.r2.dev/blog/football-tracks-detections.png)

Two fifths of what comes back is photographers, staff and people in the crowd, so anything landing off the pitch gets dropped before tracking starts. Until it is, they compete for associations like everyone else.

Two things I'd have got backwards without measuring them.

Association happens in stabilised pixels, before anything is projected onto the pitch. Raw
pixels lose a panning camera. Metres inherit every wobble in the camera fit. Stabilised pixels
have neither problem, and the tracker ends up needing no camera model at all.

And a crowd is not the same problem as a gap. On a quiet clip, players get swapped after one of
them has been hidden for a while. In a crowded box, 93 of 111 swaps were between two players
both plainly visible at the time. I spent a while trying to fix the second case with kit
colour, which sounds obvious until you notice that 18% of boxes in a crowd overlap another by
more than a third. The crop you're reading colour from contains two players. The cue is least
reliable exactly where you need it, and no weighting fixes that.

Teams get split by kit colour, which mostly works. k-means collapses on it, because two shirts
of the same kit differ more across a patch of shadow than two different kits do, so the split
runs along the first principal component instead, at the point that maximises between-class
variance. Goalkeepers come out first, by being an odd colour and standing near a goal. Either
test on its own is wrong.

## What it does and doesn't do

Give it one seeded frame, landmarks clicked once, and a seven-second clip comes out at 97%
recall, a median position error of 0.80 m, and 86% identity purity. Seven seconds is a goal, a
build-up, a press. It's the length this is for. Past that the carried camera drifts and recall
halves.

Shirt numbers don't work. A player is about 100 pixels tall on broadcast video and the number
is about 20, and a general-purpose reader gets one digit of a two-digit number and is confident
about it. Nine numbers in the test clip: one right, four wrong. That's a worse outcome than
reading none, because a wrong number silently attaches a run to the wrong player and nothing
downstream can see it happened. It reports nothing now, and nothing is the honest answer.

The ball's position isn't recoverable either. A flat-pitch camera model assumes everything sits
on the ground, so a ball in the air lands metres from where it is. What is recoverable is who
has it, right 99% of the time while the ball is on the floor. So the board gets the carrier and
draws the pass itself, which is what I wanted anyway.

## On real television

Everything above was measured on SoccerNet, which is annotated research footage. The point was
always TV.

So: a screen-captured recording of a Rio Ave goal off sport.tv. Pillarboxed, a night match with
washed-out markings, a container lying about its frame rate, no annotations of any kind. One
seeded frame.

Every detected pitch marking projects back onto the pitch with a median of 0.11 m from the line
it belongs to, and 78% inside half a metre. The top-down render puts ten players around the
penalty area with the keeper on his line, which is what the frame shows.

![The pitch model reprojected onto the broadcast frame, lines landing on lines](https://pub-3b4bfc0114394ce680518fa92ce65e1d.r2.dev/blog/football-tracks-calibration.png)

That's the camera solved on footage nobody prepared. Tracking on it is still rough, 52 tracks
for about a dozen people, and the team split is unproven there. But the part I thought would
sink it didn't.

## Where it is

It runs end to end from a terminal, one command per stage, every stage leaving an artefact and
a picture behind it. What's left is the importer on the Pitchboard side that turns `tracks.json`
into a board, and that can be built now, because ground truth already produces a real tracks
file with no vision in the loop.

[github.com/migueljfsc/football-tracks](https://github.com/migueljfsc/football-tracks)
