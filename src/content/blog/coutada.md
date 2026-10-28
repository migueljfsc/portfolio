---
title: "Coutada: the hunt on a map"
description: "A phone map for hunting on foot, built because \"go until the Roman bridge\" means nothing when you don't know the property."
date: 2026-10-27
tags: ["react", "maplibre", "cloudflare", "durable-objects", "side-project"]
draft: false
---

I hunt, and often on a property I don't know well. We go on foot. We spread out and bater
terreno, as we say, each of us working our own strip of ground, and that only works if everyone
knows where to turn, where to keep going and where to stop and wait for the others. Those points
get handed out in the morning, out loud. Follow the track past the olive grove, go down to the
stream, keep going until the Roman bridge and wait there for the rest. The people giving the
directions have walked that ground for years. I haven't, and I have no idea which bridge they
mean.

The fix is small. If someone who knows the place draws it on a map, or just drops a pin on the
bridge, and I can see where I am on that same map, I'll get there. Once we're walking it helps to
see everyone else too, so I know if I'm ahead of the others or the one holding them up.

Coutada is that map. It's a web app you open on your phone, with no account needed to join a
hunt.

## Drawing the property

The host draws the hunt over satellite imagery. Pins are the reference points: landmarks, gates,
the meeting point, parking, water for the dogs, anything dangerous. Routes are paths to walk.
Areas are the ground to cover, and also the no-shoot zones and the property boundary. The Roman
bridge is a landmark.

The imagery is DGT's OrtoSat 2023, 30 cm satellite imagery of the whole country, served over WMS.
MapLibre asks for it as 512 px tiles, which at that resolution is enough to pick out single holm
oaks and the tracks between them. The map itself is one GeoJSON FeatureCollection, so it goes in
and out as GeoJSON, GPX or KML, and a walk recorded on a watch can come in as a route.

The property in these recordings is made up. I drew it over the real imagery south of Salvaterra
do Extremo, near the Erges.

![A drawn property, and someone marking the Roman bridge on it](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/map.gif)

## Getting to the bridge

Tap a pin and press Go here. The panel shows how far it is and an arrow pointing at it. On a phone
with a compass the arrow turns with you. Without one it points on the map with north up, which is
why the recording says so, since it's a desktop browser pretending to be a phone. Routes work the
same way, with a warning when you wander off one.

## With no signal

Half the properties around here have no signal, and the place you most need the map is the place
it can't load. So before the hunt each phone downloads the imagery for the map's area: everything
drawn plus 500 metres, from zoom 9 down to 17. A property of a thousand hectares comes to a few
hundred tiles and some tens of megabytes, and the dialog gives the estimate before it starts.

The obvious way would be a tile pack in R2 that every phone pulls from me. I didn't do that.
OrtoSat is public for viewing and its downloads are restricted, so a pack of it in my bucket would
be redistributing it. A phone fetching the tiles of one property for its own use is
the same thing panning over it does, so that's what happens. Each phone goes to DGT directly, and
a service worker answers from the cache from then on.

The cache doesn't match tiles by URL. MapLibre and my prefetch code write the same bounding box
with different decimals, so a cached tile is found by a key made from the host, the layer and the
box rounded to a tenth of a metre.

![Going to the Roman bridge, and downloading the area for no signal](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/to-the-bridge.gif)

## The hunt

The host starts a hunt on the map and gets a four-character code to read out at the meeting
point. Everyone who types it in sees everyone else, and everyone leaves a trail as they walk, so
you can see the ground that's been covered and where there's a gap. When the plan is to wait at
the bridge, you can see who's still coming and how far back they are. The host can keep drawing
during the hunt and every phone sees it straight away. Anyone can mark a sighting (a covey
flushed, a hare that got away), and the host can keep one as a pin on the map.

Each hunt is a Durable Object in the EU jurisdiction, and the phones talk to it over WebSockets
with hibernation, so the object sleeps between messages instead of running for the whole hunt.

The code needed the most care. Four characters are short enough to shout across a car bonnet,
which also makes them short enough to guess. And behind the code are the live
positions of armed people on a property the map lays out for you. The alphabet leaves out vowels
and anything that looks like something else, so no code spells a word or reads two ways. A code
only exists while its hunt does, 18 hours at most. Joins are rate limited and every one goes
through Turnstile, so a script's guesses cost what a person's do. The host sees each join as it
happens and can lock the hunt, kick someone or rotate the code. A locked hunt and a code that
doesn't exist give the same answer, so a guess can't tell them apart.

![Six of us walking the ground with our trails behind us, and the list of who's in](https://pub-74b2ee807c464b14b538673b026716c3.r2.dev/blog/coutada/on-foot.gif)

The other hunters in that recording are a script. It joins the hunt with the same API a phone
uses and walks everyone across the ground over real WebSockets.

## Positions are never stored

This is the rule the rest of the app is built around. A position goes from a phone to the hunt
object and on to the other phones. It isn't written to the object's storage, to D1, or to a log.

Hibernation makes that harder than it sounds, because the object's memory can disappear in the
middle of a hunt. So the last position of each member rides on their socket's attachment, which
the runtime keeps with the connection. Each phone is the authority for its own trail and keeps it
locally. When the object wakes up without trails, it asks every phone to send its own back. When
the hunt ends, the phones delete theirs and nothing is left anywhere. The function that saves the
object's state names the fields it keeps one by one, because spreading the state would quietly
write positions to disk.

It also says, on the hunt screen, all the time, that it isn't a safety system. Positions are
reported by the phones themselves, they arrive late, and they stop when a phone goes to sleep.
A no-shoot zone is a drawing. Confirm by sight and by radio.

## Where it is

It runs on the same base as Pitchboard: one Cloudflare Worker for the app and the API, D1 for maps
and accounts, OpenTofu for the durable infrastructure, and the free tier for all of it. You can
use it without an account, and signing in keeps your maps across phones. It's in Portuguese and
English, Portuguese first, because the people I hunt with are Portuguese.

Drawing, imagery, navigation, offline, live hunts, sightings and import and export all work. The
code is on [GitHub](https://github.com/migueljfsc/coutada).

[coutada.migueljfsc.dev](https://coutada.migueljfsc.dev)
