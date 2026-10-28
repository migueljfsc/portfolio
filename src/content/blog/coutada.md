---
title: "Coutada: the hunt on a map"
description: "A phone map for hunting on foot, built because \"go until the Roman bridge\" means nothing when you don't know the property."
date: 2026-10-27
tags: ["react", "maplibre", "cloudflare", "durable-objects", "side-project"]
draft: false
---

I hunt, and a lot of the time it's on a property I don't know well. We go on foot, spread out in
a line, and each of us sweeps a strip of ground. For that to work everyone has to know where
to turn and where to stop and wait for the others. Nobody plans the whole day. We stop every so
often and decide the next bit from what people have to say. Someone saw something move up on the
left. That side of the hill is already done.

Then the plan gets said out loud. Follow the track past the olive grove, go down to the stream,
keep going until the Roman bridge and wait there for the rest. Whoever's saying it has walked that
ground for years. I haven't, and I have no idea which bridge they mean.

What I need isn't complicated. If someone who knows the place draws it on a map, or just drops a
pin on the bridge, and I can see myself on that same map, I'll find it. Once we're moving I also
want to see everyone else, to know if I'm ahead of the line or the one holding it up, and to see
what we've already covered, because that's most of what we talk about at each stop.

Coutada is that map. It's a web app you open on your phone, and you don't need an account to join
a hunt.

## Drawing the property

The host draws over satellite imagery. Pins mark the reference points, like landmarks, gates, the
meeting point, parking, water for the dogs and anything dangerous. Routes are paths to walk.
Areas are the ground to cover, the no-shoot zones and the property boundary. The Roman bridge is a
landmark pin.

The imagery is DGT's OrtoSat 2023, 30 cm satellite imagery of the whole country, served over WMS.
MapLibre asks for it in 512 px tiles, and at that resolution you can pick out single holm oaks and
the tracks between them. The map itself is one GeoJSON FeatureCollection, so it goes in and out as
GeoJSON, GPX or KML, and a walk recorded on a watch can come in as a route.

The property in these recordings is made up. I drew it over the real imagery south of Salvaterra
do Extremo, near the Erges.

![A drawn property, and someone marking the Roman bridge on it](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/map.gif)

## Getting to the bridge

Tap a pin and press Go here. The panel shows how far it is and an arrow pointing at it. On a phone
with a compass the arrow turns with you. Without one it points on the map with north up, and
that's what the recording shows, because it's a desktop browser pretending to be a phone. Routes
work the same way, and you get a warning if you wander off one.

## With no signal

Half the properties around here have no signal, which is a problem for a map that loads its
imagery from the internet. So before the hunt each phone downloads the imagery for the map's area,
meaning everything drawn plus 500 metres, from zoom 9 down to 17. A property of a thousand
hectares comes to a few hundred tiles and some tens of megabytes. The dialog tells you the
estimate before it starts.

The obvious way to do this would be a tile pack in R2 that every phone pulls from me. I didn't do
that. OrtoSat is public for viewing but its downloads are restricted, so a pack of it in my bucket
would be redistributing it. A phone fetching the tiles for one property for its own use is no
different from panning over it, so that's how it works. Each phone goes to DGT directly, and a
service worker answers from the cache after that.

The cache doesn't match tiles by URL. MapLibre and my prefetch code write the same bounding box
with different decimals, so a cached tile is looked up by a key made from the host, the layer and
the box rounded to a tenth of a metre.

![Going to the Roman bridge, and downloading the area for no signal](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/to-the-bridge.gif)

## The hunt

The host starts a hunt on the map and gets a four-character code to read out at the meeting
point. Everyone who types it in sees everyone else. Each person leaves a trail as they walk, so
you can see the ground that's been covered and where there's a gap. If the plan is to wait at the
bridge, you can see who's still coming and how far back they are. The host can keep drawing
during the hunt and every phone gets it straight away, so at a stop whoever knows the place can
drop a pin where we're going next. Anyone can mark a sighting (a covey flushed, a hare that got
away), and the host can keep one as a pin on the map.

Each hunt is a Durable Object in the EU jurisdiction. The phones talk to it over WebSockets with
hibernation, so the object sleeps between messages and doesn't run for the whole hunt.

The code is the part I spent the most time on. Four characters are easy to shout across a car
bonnet, and they're also easy to guess. Get one right and you see where a group of armed people
is standing on a property, with the map drawn for you. The alphabet leaves out vowels and anything
that looks like another character, so no code spells a word or reads two ways. A code only exists
while its hunt does, 18 hours at most. Joins are rate limited and every one goes through
Turnstile, so a script pays the same for each guess as a person does. The host sees each join as
it happens and can lock the hunt, kick someone or rotate the code. A locked hunt and a code that
doesn't exist give the same answer, so a guess can't tell them apart.

![Six of us walking the ground with our trails behind us, and the list of who's in](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/on-foot.gif)

The other hunters in that recording are a script. It joins the hunt through the same API a phone
uses and walks everyone across the ground over real WebSockets.

## Positions are never stored

Most of the hunt code is shaped by this rule. A position goes from a phone to the hunt object and
on to the other phones. It isn't written to the object's storage, to D1, or to a log.

With hibernation the object's memory can be wiped in the middle of a hunt, so I had to work around
that. The last position of each member rides on their socket's attachment, which the runtime keeps
with the connection. Each phone owns its own trail and keeps it locally. When the object wakes up
without trails, it asks every phone to send its own back. When the hunt ends, the phones delete
theirs and there's nothing left anywhere. The function that saves the object's state lists the
fields it keeps one by one, because spreading the whole state would write positions to disk
without anyone noticing.

The hunt screen also says, the whole time, that this isn't a safety system. Positions come from
the phones themselves and arrive late, and they stop when a phone goes to sleep. A no-shoot zone
is a drawing. Confirm by sight and by radio.

## Where it is

It runs on the same base as Pitchboard. One Cloudflare Worker serves the app and the API, D1 holds
maps and accounts, OpenTofu manages the durable infrastructure, and all of it fits in the free
tier. You can use it without an account, and signing in keeps your maps across phones. It's in
Portuguese and English, Portuguese first, because the people I hunt with are Portuguese.

Drawing, imagery, navigation, offline, live hunts, sightings and import and export all work. The
code is on [GitHub](https://github.com/migueljfsc/coutada).

[coutada.migueljfsc.dev](https://coutada.migueljfsc.dev)
