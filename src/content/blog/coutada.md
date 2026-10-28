---
title: "Coutada: the hunt on a map"
description: "A phone map for hunting on foot, for when the plan is to meet at a Roman bridge on a property you don't know."
date: 2026-10-27
tags: ["react", "maplibre", "cloudflare", "durable-objects", "side-project"]
draft: false
---

I hunt, and a lot of the time it's on a property I don't know well. We go on foot and spread out
in a line, each of us covering a strip of ground, which only works if everyone knows where to turn
and where to stop and wait for the others. We don't plan the whole day before we start. Every so
often we stop, and the next stretch gets decided from what people have seen along the way, whether
someone saw something move up on the left or one side of the hill has already been covered.

The plan is then said out loud, something like follow the track past the olive grove, go down to
the stream and keep going until the Roman bridge, where we wait for the rest. Whoever is
explaining it has walked that ground for years, but I haven't, and most of the time I have no idea
which bridge they mean.

What would help me is fairly simple. If someone who knows the place draws it on a map, or just
drops a pin on the bridge, and I can see where I am on that same map, I can find my way there.
Once we're moving I'd also like to see everyone else, to know whether I'm ahead of the line or
holding it up, and to see the ground we've already covered, because that is most of what gets
discussed at each stop. Coutada is a web app that does this on your phone, and you don't need an
account to join a hunt.

## Drawing the property

The host draws over satellite imagery. Pins mark the reference points, such as landmarks, gates,
the meeting point, parking, water for the dogs and anything dangerous, routes are paths to walk,
and areas mark the ground to cover as well as the no-shoot zones and the property boundary. In the
recordings below the Roman bridge is a landmark pin.

The imagery is DGT's OrtoSat 2023, which covers the whole country at 30 cm and is served over WMS.
MapLibre requests it in 512 px tiles, and at that resolution you can make out individual holm oaks
and the tracks between them. The map itself is a single GeoJSON FeatureCollection, so it can be
imported and exported as GeoJSON, GPX or KML, and a walk recorded on a watch can be brought in as
a route.

The property in these recordings is one I made up and drew over the real imagery south of
Salvaterra do Extremo, near the Erges.

![A drawn property, and someone marking the Roman bridge on it](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/map.gif)

## Getting to the bridge

Tapping a pin and pressing Go here opens a panel with the distance and an arrow pointing towards
it. On a phone with a compass the arrow turns as you do, and without one it points on the map with
north up, which is what you see in the recording because it was made in a desktop browser
pretending to be a phone. Routes work the same way, with a warning if you wander off one.

## With no signal

Half the properties around here have no signal, and a map that loads its imagery from the internet
isn't much use there. Before the hunt each phone downloads the imagery for the map's area, which
is everything drawn plus 500 metres around it, from zoom 9 down to 17. For a property of a
thousand hectares that comes to a few hundred tiles and some tens of megabytes, and the dialog
shows the estimate before the download starts.

The simplest way to do this would have been to build a tile pack, put it in R2 and have every
phone pull it from me, but OrtoSat is public for viewing and restricted for download, so hosting a
pack of it in my bucket would mean redistributing it. A phone fetching the tiles for one property
for its own use is the same as panning over that property, so each phone goes to DGT directly and
a service worker serves the tiles from the cache from then on.

Tiles aren't matched in the cache by URL, because MapLibre and my prefetch code write the same
bounding box with a different number of decimals. Instead each tile is stored under a key built
from the host, the layer and the bounding box rounded to a tenth of a metre.

![Going to the Roman bridge, and downloading the area for no signal](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/to-the-bridge.gif)

## The hunt

The host starts a hunt from the map and gets a four-character code to read out at the meeting
point, and everyone who types it in can see everyone else. Each person leaves a trail as they
walk, so the ground that has been covered shows up on the map along with any gaps, and if the plan
is to wait at the bridge you can see who is still on the way and how far back they are. The host
can keep drawing during the hunt and the changes reach every phone straight away, so at a stop
whoever knows the place can drop a pin on where we're heading next. Anyone can also mark a
sighting, like a covey that got up or a hare that got away, and the host can keep it on the map as
a pin.

Each hunt is a Durable Object in the EU jurisdiction. The phones connect to it over WebSockets
with hibernation, which lets the object sleep between messages instead of staying up for the whole
hunt.

Most of the time I spent on this part went into the code. Four characters are easy to read out
across a car bonnet, but they're also easy to guess, and guessing one right would show you where a
group of armed people is standing on a property, with the map already drawn for you. The alphabet
leaves out vowels and any characters that could be mistaken for each other, so a code never spells
a word or reads two ways. A code only exists while its hunt does, which is 18 hours at most. Joins
are rate limited and each one has to pass Turnstile, which makes guessing from a script about as
slow as guessing by hand. The host sees every join as it happens and can lock the hunt, remove
someone or change the code, and a locked hunt gives the same answer as a code that doesn't exist.

![Six of us walking the ground with our trails behind us, and the list of who's in](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/on-foot.gif)

The other hunters in that recording are a script that joins the hunt through the same API a phone
uses and walks everyone across the ground over real WebSockets.

## Positions are never stored

A lot of the hunt code follows from one rule, which is that a position goes from a phone to the
hunt object and on to the other phones without ever being written to the object's storage, to D1
or to a log.

Hibernation makes this a bit awkward, since the object's memory can be wiped in the middle of a
hunt. To deal with that, each member's last position is kept on their socket's attachment, which
the runtime holds on to along with the connection, and each phone keeps its own trail locally.
When the object wakes up without any trails, it asks every phone to send its own back, and when
the hunt ends the phones delete theirs as well. The function that saves the object's state lists
the fields it keeps one at a time, because spreading the whole state into it would end up writing
positions to disk.

For as long as the hunt runs, the hunt screen also says that this isn't a safety system. Positions
are reported by the phones themselves, they arrive with some delay and they stop updating when a
phone goes to sleep, and a no-shoot zone on the map is only a drawing, so everything still has to
be confirmed by sight and by radio.

## Where it is

It runs on the same setup as Pitchboard, with one Cloudflare Worker serving the app and the API,
D1 holding maps and accounts and OpenTofu managing the durable infrastructure, all within the free
tier. You can use it without an account, and signing in keeps your maps across phones. It's
available in Portuguese and English, with Portuguese as the default since the people I hunt with
are Portuguese.

Drawing, imagery, navigation, offline use, live hunts, sightings, and import and export are all
working, and the code is on [GitHub](https://github.com/migueljfsc/coutada).

[coutada.migueljfsc.dev](https://coutada.migueljfsc.dev)
