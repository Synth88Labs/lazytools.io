---
title: "How Google's Encoded Polyline Algorithm Works (and How to Decode One)"
seoTitle: 'Google Encoded Polyline: How to Decode It'
description: "A Google encoded polyline is a compact string of coordinates. How the algorithm works step by step, the precision and lat/lng gotchas, and how to decode one."
pubDate: 2026-08-04
updatedDate: 2026-08-23
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
    a: "Run it through a decoder that reverses the algorithm: it reads base-32 chunks, reassembles each number, undoes the zig-zag sign encoding, divides by the precision factor, and adds each delta to the running position. The result is the original list of latitude/longitude points. A polyline decoder does this instantly. You just need the right precision."
  - q: "What does polyline precision (5 vs 6) mean?"
    a: "Precision is how many decimal places of coordinate are preserved, set by the scaling factor (10^precision). Precision 5 (Google's default) keeps roughly 1-metre resolution; precision 6 keeps about 10 centimetres and is used by routing engines like OSRM and Valhalla. You must decode with the same precision the string was encoded at, or the points come out ten times too large or small."
  - q: "Why do my decoded coordinates look swapped?"
    a: "Encoded polylines store coordinates in latitude, longitude order. GeoJSON and many mapping APIs use the opposite, longitude, latitude. If your points land in the wrong hemisphere, the lat/lng order was probably flipped somewhere. A good decoder labels the order and outputs correctly-ordered GeoJSON."
  - q: "Why does the algorithm use deltas?"
    a: "Consecutive points on a route are close together, so storing each point as the small difference from the previous one produces small numbers, which encode to fewer characters. It's a form of delta compression: the first point is stored in full, and every point after it is just the change, which is why the format is so compact."
  - q: "Is it safe to decode a polyline online?"
    a: "A polyline encodes a path, potentially where someone went or a planned route, so prefer a client-side tool. The LazyTools Polyline Encoder / Decoder runs entirely in your browser and never uploads the string or the coordinates, so the location data stays on your device."
draft: false
---

**Ask a maps API for directions and part of the response is a string like `_p~iF~ps|U_ulLnnqC…`, not
an error, but an entire route's path compressed into a few characters.** That's a Google *encoded
polyline*, and the algorithm behind it is a neat piece of delta compression: it turns a long list of
latitude/longitude points into a short run of printable ASCII. Here's how it works, the two gotchas that
trip people up, and how to decode one privately with the
[Polyline Encoder / Decoder](/file/polyline-encoder-decoder/).

<aside class="key-takeaways">

**Key takeaways**

- An encoded polyline is a compact ASCII string that stores a whole list of coordinates using delta compression, base-32 chunks, and a printable-character offset.
- Decoding reverses five steps: read base-32 chunks, undo the zig-zag sign, unscale by 10^precision, and add each delta to the running position.
- The two things that break decoding are wrong **precision** (5 vs 6, a factor-of-ten error) and swapped **latitude/longitude order** (polyline is lat,lng; GeoJSON is lng,lat).
- Because the format is essentially a travel path, decode it client-side rather than pasting it into a server you don't control.

</aside>

<figure>
<img src="/blog/infographic-google-encoded-polyline-algorithm-explained-guide.svg" alt="A five-step pipeline showing how latitude 38.5 becomes the string underscore p tilde i F: scale by ten to the fifth to get 3,850,000, take the delta from the previous point, zig-zag the sign to 7,700,000, split into five-bit base-32 chunks, then add continuation bits and 63 to make printable ASCII. A bar at the bottom shows three points encoding to a single compact polyline string, stored latitude then longitude at precision 5." width="1200" height="700" loading="lazy" />
<figcaption>The encoding pipeline: each coordinate is scaled, delta-compressed, zig-zag encoded, chunked into base 32, and shifted into printable ASCII.</figcaption>
</figure>

## The problem: coordinates are verbose

A route can have hundreds of points, each a latitude and longitude carried to several decimal places. Sent
as raw JSON, `[[38.50000, -120.20000], …]`, that adds up to a lot of bytes, and every byte counts when a
mobile app is redrawing a route or a tile server is shipping thousands of geometries. Google's Encoded
Polyline Algorithm shrinks the payload dramatically by exploiting two facts about map data: consecutive
points on a path are **close together**, and coordinates only need about **five decimal places** of
precision for street-level accuracy. Everything the format does follows from those two observations.

## The algorithm, step by step

Encoding is done on each coordinate value independently, latitude and longitude are run through the same
pipeline, latitude first for each point. For a single value:

1. **Scale and round.** Multiply by 10⁵ and round to the nearest integer, `38.5 → 3850000`. This is where
   precision is fixed: five decimals survive, the rest are discarded.
2. **Delta.** Subtract the previous point's value so you store only the *change*. The first point is
   measured against 0, so it is stored in full; every later point is a small difference.
3. **Zig-zag the sign.** Left-shift the integer by one bit, and if the original number was negative, invert
   all the bits. This maps small negatives and small positives alike onto small non-negative integers, so a
   delta of −1 and +1 both encode compactly instead of −1 becoming a huge two's-complement number.
4. **Chunk into base 32.** Split the number into 5-bit groups, least-significant group first.
5. **Make it printable.** On every chunk except the last, set the `0x20` continuation bit to say "more
   chunks follow." Then add 63 to each chunk so the value lands in the printable-ASCII range (roughly `?`
   onward), and emit the characters.

Decoding simply runs the five steps backwards: read characters until one lacks the continuation bit,
subtract 63 from each, strip the continuation bit, reassemble the 5-bit groups, undo the zig-zag shift,
divide by 10⁵, and add the delta to the running total.

### A worked value

Take the very first latitude in Google's canonical example, `38.5`:

| Step | Operation | Result |
| --- | --- | --- |
| Scale | `38.5 × 10⁵`, rounded | `3850000` |
| Delta | first point, minus 0 | `3850000` |
| Zig-zag | `3850000 << 1` (positive, no invert) | `7700000` |
| Base 32 | split into 5-bit groups, low first | `00000 10001 11111 01010 00111` |
| Printable | add continuation bits, `+63`, to ASCII | `_p~iF` |

The classic worked example from Google's own documentation strings three points together:

```
[[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]
        ↓ encode
_p~iF~ps|U_ulLnnqC_mqNvxq`@
```

Notice how each point after the first contributes only a few characters, that is the delta compression
paying off.

## Two gotchas that bite everyone

**Precision.** The scaling factor in step 1 is `10^precision`. Google's Maps APIs use **precision 5**
(~1 m at the equator). Several open routing engines, OSRM and Valhalla among them, default to
**precision 6** (~10 cm). Decode a precision-6 string as precision 5 and every coordinate comes out ten
times too large; the route jumps off the map or lands in the ocean. If a decoded path looks wildly wrong,
switching precision is the first thing to try.

**Latitude/longitude order.** Encoded polylines store each point as **latitude, then longitude**. GeoJSON,
Leaflet's GeoJSON layer, and many SDKs expect the opposite, **longitude, latitude**. Mix them up and your
points land in the wrong hemisphere. When you convert a decoded polyline into GeoJSON, the pair must be
**swapped**; a good converter does this and labels which order it is emitting.

Here is how the common variants line up:

| Variant | Precision | Approx. resolution | Coordinate order | Typical source |
| --- | --- | --- | --- | --- |
| Google polyline | 5 | ~1 m | lat, lng | Maps Directions API |
| High-precision polyline | 6 | ~10 cm | lat, lng | OSRM, Valhalla, Mapbox |
| GeoJSON `LineString` | full float | exact | lng, lat | Web maps, GIS tooling |

## Polyline vs GeoJSON: when to use which

The two formats answer different needs. A polyline is a **transport** format, small, opaque, ideal for
squeezing a route into an API response or a URL. GeoJSON is a **working** format, verbose but
human-readable, self-describing, and understood natively by nearly every mapping library and GIS tool. A
common workflow is to receive a polyline from a routing API, decode it once, and keep working in GeoJSON
from there, see [WKT vs GeoJSON geometry formats](/blog/wkt-vs-geojson-geometry-formats-explained-guide/) for how that representation is structured. Because the polyline throws away everything past the chosen number of decimals, re-encoding
GeoJSON back to a polyline is lossy, expect coordinates to be rounded to the precision you pick.

## Why deltas make it compact

The reason the output string is so short is step 2. Because neighbouring points on a route differ by tiny
amounts, their deltas are small integers, and small integers encode to just one or two characters after
the zig-zag and base-32 stages. Only the very first point of each coordinate pair is stored at full
magnitude. It is the same principle as [delta encoding](https://en.wikipedia.org/wiki/Delta_encoding) a time series or a changelog: record the changes,
not the absolute values, and let the small numbers keep the payload tiny.

## Decode or encode one privately

A polyline can represent where someone travelled or a route they plan to take, so it is worth handling
locally rather than pasting into an unknown server. The
[Polyline Encoder / Decoder](/file/polyline-encoder-decoder/) implements the algorithm exactly in your
browser: paste an encoded string to get back the coordinate list and a correctly-ordered GeoJSON
`LineString`, or paste a list of lat/lng points to encode them, with a precision switch for the 5 and 6
variants, and nothing ever uploaded. The location data never leaves your device.
