---
title: "How Google's Encoded Polyline Algorithm Works (and How to Decode One)"
description: "That cryptic string of characters a maps API returns for a route is an encoded polyline — a compact way to store a list of coordinates. Here's how the algorithm works step by step, the precision and lat/lng gotchas, and how to decode one in your browser."
pubDate: 2026-08-04
updatedDate: 2026-08-04
archetype: explainer
heroImage: /blog/google-encoded-polyline-algorithm-explained-guide.png
heroAlt: "A list of coordinates compressed into a Google encoded polyline string through deltas, scaling and base-32 chunks"
tools: ["/file/polyline-encoder-decoder/"]
keywords:
  - google encoded polyline
  - decode polyline
  - encoded polyline algorithm
  - polyline to coordinates
  - polyline precision
  - polyline vs geojson
faqs:
  - q: "What is a Google encoded polyline?"
    a: "It's a compact ASCII string that represents a series of latitude/longitude points, defined by Google's Encoded Polyline Algorithm. Instead of a long list of coordinates, a route's path is squeezed into a short string of printable characters. The Google Maps Directions API returns routes this way, and most mapping libraries can read it."
  - q: "How do I decode an encoded polyline?"
    a: "Run it through a decoder that reverses the algorithm: it reads base-32 chunks, reassembles each number, undoes the zig-zag sign encoding, divides by the precision factor, and adds each delta to the running position. The result is the original list of latitude/longitude points. A polyline decoder does this instantly — you just need the right precision."
  - q: "What does polyline precision (5 vs 6) mean?"
    a: "Precision is how many decimal places of coordinate are preserved, set by the scaling factor (10^precision). Precision 5 (Google's default) keeps roughly 1-metre resolution; precision 6 keeps about 10 centimetres and is used by routing engines like OSRM and Valhalla. You must decode with the same precision the string was encoded at, or the points come out ten times too large or small."
  - q: "Why do my decoded coordinates look swapped?"
    a: "Encoded polylines store coordinates in latitude, longitude order. GeoJSON and many mapping APIs use the opposite — longitude, latitude. If your points land in the wrong hemisphere, the lat/lng order was probably flipped somewhere. A good decoder labels the order and outputs correctly-ordered GeoJSON."
  - q: "Why does the algorithm use deltas?"
    a: "Consecutive points on a route are close together, so storing each point as the small difference from the previous one produces small numbers, which encode to fewer characters. It's a form of delta compression: the first point is stored in full, and every point after it is just the change, which is why the format is so compact."
  - q: "Is it safe to decode a polyline online?"
    a: "A polyline encodes a path — potentially where someone went or a planned route — so prefer a client-side tool. The LazyTools Polyline Encoder / Decoder runs entirely in your browser and never uploads the string or the coordinates, so the location data stays on your device."
draft: false
---

**Ask a maps API for directions and part of the response is a string like `_p~iF~ps|U_ulLnnqC…` — not
an error, but an entire route's path compressed into a few characters.** That's a Google *encoded
polyline*, and the algorithm behind it is a neat piece of delta compression. Here's how it works and how
to decode one with the [Polyline Encoder / Decoder](/file/polyline-encoder-decoder/).

## The problem: coordinates are verbose

A route can have hundreds of points, each a latitude and longitude with several decimals. Sent as raw
JSON that's a lot of bytes. Google's Encoded Polyline Algorithm shrinks it dramatically by exploiting two
facts: consecutive points are **close together**, and coordinates only need about **five decimals** of
precision for street-level accuracy.

## The algorithm, step by step

To encode each coordinate value (done separately for latitude and longitude):

1. **Scale and round.** Multiply by 10⁵ and round to an integer — `38.5 → 3850000`.
2. **Delta.** Subtract the previous point's value, so you store only the *change*. The first point uses 0
   as the previous value.
3. **Zig-zag the sign.** Left-shift by one bit, and invert all bits if the number was negative. This maps
   small negative and positive numbers alike to small non-negative numbers.
4. **Chunk into base 32.** Break the number into 5-bit groups, least significant first.
5. **Make it printable.** Set the 0x20 continuation bit on every chunk except the last, then add 63 to
   each so it lands in the printable ASCII range, and output the characters.

Decoding just reverses all five steps. The classic worked example from Google's own docs:

```
[[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]
        ↓ encode
_p~iF~ps|U_ulLnnqC_mqNvxq`@
```

## Two gotchas that bite everyone

**Precision.** The scaling factor is `10^precision`. Google uses **precision 5** (~1 m). Some routing
engines — OSRM, Valhalla — use **precision 6** (~10 cm). Decode a precision-6 string as precision 5 and
every point is off by a factor of ten. If a route lands in the ocean, try switching precision first.

**Latitude/longitude order.** Encoded polylines are **latitude, longitude**. GeoJSON and many map SDKs
are **longitude, latitude**. Mixing them up sends your points to the wrong place. When converting a
decoded polyline to GeoJSON, the coordinates must be **swapped** — which a good converter does for you.

## Why deltas make it compact

The reason the string is so short is step 2: because nearby points differ by tiny amounts, the deltas are
small integers, and small integers encode to just one or two characters. Only the very first point is
stored in full. It's the same idea as delta-encoding a time series — store the changes, not the absolute
values.

## Decode or encode one privately

A polyline can represent where someone travelled or a planned route, so it's worth handling locally. The
[Polyline Encoder / Decoder](/file/polyline-encoder-decoder/) implements the algorithm exactly in your
browser: paste an encoded string to get back the coordinates and a correctly-ordered GeoJSON LineString,
or paste a list of lat/lng points to encode them — with a precision switch for the 5 and 6 variants, and
nothing ever uploaded.
