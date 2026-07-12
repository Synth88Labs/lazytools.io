---
title: "Why Flight Paths Curve on the Map: Great-Circle Distance"
description: "A flight from New York to London arcs north on a flat map instead of running straight across — not to avoid anything, but because the shortest path over a round Earth is a great circle. Here's what that means, why the map lies, and how the distance is actually calculated."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/travel/flight-distance-calculator/", "/travel/flight-time-calculator/", "/travel/jet-lag-calculator/"]
keywords:
  - great circle distance
  - why do flight paths curve
  - flight distance between cities
  - haversine formula
  - shortest distance between two points on earth
  - as the crow flies distance
heroImage: /blog/great-circle-distance-guide.png
heroAlt: "A flat world map showing the curved great-circle route between New York and London arcing north, versus the longer straight line drawn on the map"
faqs:
  - q: "Why do flights take a curved path instead of a straight line?"
    a: "They actually take the straightest possible path over the round Earth — a great circle. It only looks curved because a flat map stretches the globe, especially near the poles. The straight line you'd draw on the map is really a longer route."
  - q: "What is a great-circle distance?"
    a: "The shortest distance between two points on a sphere, measured along the circle whose centre is the centre of the Earth. The equator and any line of longitude are great circles; lines of latitude (except the equator) are not."
  - q: "How is flight distance between two cities calculated?"
    a: "From the two cities' latitude and longitude using the haversine formula, which gives the great-circle distance on a sphere of mean radius 6,371 km. It's the standard method for straight-line ('as the crow flies') distance."
  - q: "Why is the actual flight longer than the great-circle distance?"
    a: "Because aircraft follow published airways, detour around restricted or stormy airspace, and route to catch tailwinds or dodge headwinds. The great-circle distance is the theoretical shortest path, so real routes are a bit longer."
  - q: "Is 'as the crow flies' the same as great-circle distance?"
    a: "Essentially yes — both mean the shortest straight-line path between two points, ignoring roads or air routes. Over long distances 'straight' has to follow the curve of the Earth, which is exactly the great circle."
  - q: "Why do some flights fly over the Arctic?"
    a: "Because for cities at high northern latitudes the great circle passes near the pole. A route like Chicago to Beijing is genuinely shortest going almost over the North Pole, even though on a flat map that looks like a wild detour."
  - q: "How accurate is the haversine formula?"
    a: "It assumes a perfect sphere, so it's within about 0.5% of the true distance on the slightly-flattened Earth — more than accurate enough for travel. Survey-grade work uses the Vincenty or Karney method on the WGS-84 ellipsoid instead."
draft: false
---

**A flight from New York to London arcs north over Canada and the Atlantic instead of running straight across — and it's not avoiding anything.** That curve *is* the shortest route. The straight line you'd draw between the two cities on a flat map is actually longer. The map is what's misleading, not the flight path.

<aside class="key-takeaways">

**Key takeaways**

- **The shortest path over a sphere is a great circle** — the circle whose centre is the centre of the Earth.
- **Flat maps distort it into a curve**, bending toward the nearer pole, because you can't flatten a globe without stretching it.
- **Distance comes from the haversine formula** on the two points' latitude and longitude, using a mean Earth radius of 6,371 km.
- **New York → London is ≈ 5,540 km** along the great circle, on an initial bearing of about 51° (northeast).
- **Real flights run a little longer** than the great circle — airways, restricted airspace and winds all add to it.

</aside>

<figure>
<img src="/blog/infographic-great-circle-distance.svg" alt="A flat map with New York and London joined by two lines: a green great-circle arc that bends north and is labelled 'shortest', and a red dashed straight line labelled 'longer'. Beside it, the haversine formula with Earth radius 6,371 km, and the result: New York to London about 5,540 km at an initial bearing of 51 degrees." width="1200" height="640" loading="lazy" />
<figcaption>On a flat map the shortest route looks like a detour — because the map, not the route, is bent.</figcaption>
</figure>

## The globe problem

You cannot flatten a sphere onto a rectangle without stretching it somewhere — a fact of geometry, not a flaw in any particular map. The familiar Mercator-style world map keeps compass directions tidy but pays for it by stretching everything toward the poles: Greenland looks as big as Africa, though Africa is about fourteen times larger.

That same stretching is why a flight path looks curved. The route hasn't changed — the map has pulled the high-latitude middle of the journey sideways, so the genuinely-shortest path ends up drawn as an arc bending toward the pole.

## What a great circle actually is

A **great circle** is any circle drawn on the globe whose centre coincides with the centre of the Earth — the largest circle you can draw on the surface. Slice an orange exactly through its middle and the cut edge is a great circle; slice it off-centre and you get a smaller circle.

The equator is a great circle, and so is every line of longitude (each pairs with the one on the far side of the planet to make a full circle through both poles). Lines of latitude, though — apart from the equator — are *not* great circles, which is exactly why flying "straight east" along a latitude line isn't the shortest way east.

For any two points on the globe, there's one great circle passing through them, and the shorter arc of it is the shortest possible path between them. That's the route aircraft aim to fly.

## How the distance is calculated

Given each place's latitude (φ) and longitude (λ), the standard tool is the **haversine formula**, which handles the spherical geometry cleanly:

```
a = sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)
d = R · 2 · atan2(√a, √(1−a))
```

Here `Δφ` and `Δλ` are the differences in latitude and longitude, and `R` is the Earth's mean radius, **6,371 km**. The result `d` is the great-circle distance. For New York (JFK) to London (LHR) it comes out at about **5,540 km (3,442 miles)**, on an initial bearing of roughly 51° — northeast, which is why the route heads up over the Atlantic.

The haversine assumes a perfectly round Earth. The real planet is very slightly flattened, so the answer is within about half a percent of the true figure — irrelevant for planning a trip, though survey work uses more elaborate ellipsoidal methods.

## Why the real flight is a bit longer

The great-circle distance is the *theoretical* shortest path. Actual flights are a little longer for practical reasons:

- **Airways and air-traffic control** — planes follow published corridors and are sequenced by controllers, not sent along a mathematical ideal.
- **Restricted airspace** — conflict zones, military areas and closed regions force detours.
- **Winds** — riding a tailwind (or dodging a headwind, like the jet stream) can be worth flying some extra distance, because it saves time and fuel overall.

So the great-circle figure is the floor: the shortest it could possibly be, with reality adding a modest amount on top.

## See it for your own route

The [flight distance calculator](/travel/flight-distance-calculator/) draws the great-circle line between any two cities on a world map and reads off the distance in kilometres, miles and nautical miles, along with the bearing and a rough flight time. From there the [flight time calculator](/travel/flight-time-calculator/) turns a distance into an estimated duration, and the [jet lag calculator](/travel/jet-lag-calculator/) tells you how long the time-zone shift is likely to take to shake off. Like every LazyTools tool, they run entirely in your browser — no location access, nothing uploaded.

---

*Distances use the haversine great-circle formula on a mean Earth radius of 6,371 km (the IUGG mean). Great-circle distance is the shortest path over a spherical Earth; actual flight routes are longer because of airways, airspace restrictions and winds. Sources: [Great-circle distance (Wikipedia)](https://en.wikipedia.org/wiki/Great-circle_distance), [Movable Type — distance & bearing between lat/long points](https://www.movable-type.co.uk/scripts/latlong.html).*
