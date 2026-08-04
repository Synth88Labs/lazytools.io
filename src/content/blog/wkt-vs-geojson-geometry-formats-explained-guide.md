---
title: "WKT vs GeoJSON: Two Ways to Write a Geometry (and How to Convert)"
description: "WKT and GeoJSON both describe points, lines and polygons, but one is compact text for databases and the other is JSON for web maps. Here's how each works, the coordinate-order gotcha, and how to convert between them in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/wkt-vs-geojson-geometry-formats-explained-guide.png
heroAlt: "The same polygon written as WKT text and as a GeoJSON object side by side, both in X Y order"
tools: ["/file/wkt-to-geojson/", "/file/geojson-to-wkt/"]
keywords:
  - wkt vs geojson
  - convert wkt to geojson
  - geojson to wkt
  - well known text
  - geojson coordinate order
  - geometry formats
faqs:
  - q: "What is the difference between WKT and GeoJSON?"
    a: "They describe the same geometries but in different syntaxes for different homes. WKT (Well-Known Text) is a compact, single-line text format from the OGC used by spatial databases like PostGIS — e.g. POINT (30 10). GeoJSON (RFC 7946) is a JSON format used across web mapping (Leaflet, Mapbox, OpenLayers) — e.g. {\"type\":\"Point\",\"coordinates\":[30,10]}. WKT is terser; GeoJSON slots into JSON tooling and can carry feature properties."
  - q: "Do WKT and GeoJSON use the same coordinate order?"
    a: "Yes — both use X Y order, meaning longitude first then latitude. So a WKT POINT (30 10) and a GeoJSON [30, 10] both mean longitude 30, latitude 10. This is a common source of bugs because some other formats and mapping APIs (and everyday speech) put latitude first; WKT and GeoJSON agree on longitude-first."
  - q: "How do I convert WKT to GeoJSON?"
    a: "Parse the WKT geometry and emit the equivalent GeoJSON object: POINT becomes a Point, POLYGON becomes a Polygon with its rings, and so on, keeping the coordinates in the same X Y order. A converter does this instantly; because both formats share coordinate order, no axis swapping is involved."
  - q: "Does WKT support polygon holes and multi-geometries?"
    a: "Yes. A WKT polygon can have an outer ring plus inner rings (holes), written as POLYGON ((outer…), (hole…)), and there are MULTIPOINT, MULTILINESTRING, MULTIPOLYGON and GEOMETRYCOLLECTION types — all of which map directly to the corresponding GeoJSON geometry types."
  - q: "Can WKT store feature attributes like GeoJSON?"
    a: "No — WKT encodes geometry only. GeoJSON can wrap a geometry in a Feature with a properties object, so it carries attributes too. When you convert GeoJSON to WKT the geometry is preserved but any properties are dropped; keep them separately (for example in the database row alongside the WKT)."
  - q: "Which format should I use?"
    a: "Use WKT when talking to spatial databases and SQL functions (PostGIS ST_GeomFromText, spatial indexes). Use GeoJSON for web maps and anything JSON-based. Many workflows move between them — a query returns WKT, and you convert it to GeoJSON to display on a Leaflet map — which is exactly what a converter is for."
draft: false
---

**WKT and GeoJSON both describe the same shapes — points, lines, polygons — but they live in different
worlds: WKT in spatial databases, GeoJSON on web maps.** Knowing how each works (and the one coordinate
gotcha they *don't* disagree on) makes moving geometry between a database and a map painless. Here's the
comparison, with converters for [WKT → GeoJSON](/file/wkt-to-geojson/) and
[GeoJSON → WKT](/file/geojson-to-wkt/).

## The same polygon, two ways

Here's one square written in each format:

**WKT:**
```
POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))
```

**GeoJSON:**
```json
{ "type": "Polygon",
  "coordinates": [[[30,10],[40,40],[20,40],[10,20],[30,10]]] }
```

Same geometry — WKT is a compact line, GeoJSON is structured JSON. That difference is the whole story of
when to use which.

## WKT: compact text for databases

**Well-Known Text** is an OGC standard: a geometry type keyword followed by parenthesised coordinates.

```
POINT (30 10)
LINESTRING (30 10, 10 30, 40 40)
POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))   ← with a hole
MULTIPOLYGON (((…)), ((…)))
GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20))
```

It's what **PostGIS** and other spatial SQL expect: `ST_GeomFromText('POINT(30 10)')`. Compact, easy to
paste into a query — but it's geometry only, with no place for attributes.

## GeoJSON: JSON for the web

**GeoJSON** (RFC 7946) expresses the same geometries as JSON objects, which is why every web-mapping
library speaks it. It also adds a layer WKT lacks: a **Feature** wraps a geometry with a `properties`
object, and a **FeatureCollection** groups many Features — so GeoJSON can carry both the shape *and* its
data.

```json
{ "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [30, 10] },
  "properties": { "name": "Depot" } }
```

## The coordinate-order gotcha (that isn't one, here)

The classic mapping bug is **latitude/longitude order** — many APIs and humans say "lat, lon," but these
two formats do **not**. Both WKT and GeoJSON use **X Y = longitude, latitude**:

- WKT `POINT (30 10)` → longitude 30, latitude 10.
- GeoJSON `[30, 10]` → longitude 30, latitude 10.

Because they agree, converting between WKT and GeoJSON needs **no axis swapping** — a relief compared with
formats like GPS/GPX that put latitude first. (If a map shows your points in the ocean off Africa, it's
usually because something *else* swapped the order.)

## Converting between them

Moving geometry around is routine: a spatial query hands you WKT, and you convert it to GeoJSON to render
on a Leaflet or Mapbox map — or you draw a shape on a web map, get GeoJSON, and convert it to WKT to store
in PostGIS. Two things to remember:

- **Coordinate order is preserved** (both are X Y), so the shape stays put.
- **Properties don't survive the trip to WKT** — WKT holds geometry only, so keep attributes separately.

Both [WKT → GeoJSON](/file/wkt-to-geojson/) and [GeoJSON → WKT](/file/geojson-to-wkt/) run entirely in
your browser: paste a geometry and copy the result, with points, lines, polygons (including holes), the
multi-variants and geometry collections all handled — and your location data never leaving your device.
