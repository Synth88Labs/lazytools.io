---
title: "GPX Files Explained: Distance, Elevation and Converting to GeoJSON"
description: "A GPX file is just XML listing GPS track points — but it reveals exactly where you live and train. Here's how distance and elevation are calculated from it, the lat/lon trap when converting to GeoJSON, and why to do it in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-01
archetype: explainer
heroImage: /blog/gpx-files-explained-distance-elevation-geojson-guide.png
heroAlt: "How a GPX track's points become distance and elevation stats, and how coordinates flip when converting to GeoJSON"
tools: ["/file/gpx-analyzer/", "/file/gpx-to-geojson/", "/file/geojson-to-gpx/"]
keywords:
  - what is a gpx file
  - gpx distance calculation
  - gpx elevation gain
  - gpx to geojson
  - gpx lat lon order
  - open gpx file
  - gpx privacy
faqs:
  - q: "What is a GPX file?"
    a: "GPX (GPS Exchange Format) is a plain-text XML file that stores GPS data: a track is a list of points (<trkpt>), each with a latitude, longitude, and usually an elevation and timestamp. It's the standard export from Strava, Garmin, Komoot, phone apps and GPS watches, and any of them can read another's GPX. Because it's just text, you can open and analyse it entirely in a browser."
  - q: "How is distance calculated from a GPX file?"
    a: "By adding up the great-circle (haversine) distance between each pair of consecutive track points. The more densely your device logged points, the more accurate the total; sparse logging cuts corners and reads short. This is how most GPS platforms compute route distance. The LazyTools GPX Analyzer does it in your browser."
  - q: "Why does elevation gain differ between apps?"
    a: "GPS elevation is noisy, and every platform smooths it differently before summing the ups and downs — so two tools can report different elevation gain for the same GPX. Barometric altimeters (in many watches) are more accurate than GPS elevation. A tool that sums the raw points without smoothing tends to read higher than one that filters the data first."
  - q: "How do I convert a GPX file to GeoJSON?"
    a: "Read the track points into a GeoJSON LineString and waypoints into Points, and — critically — write coordinates in [longitude, latitude] order, which is the reverse of GPX. The LazyTools GPX to GeoJSON converter handles that swap and outputs a standard FeatureCollection ready for Mapbox, Leaflet, Turf.js or PostGIS."
  - q: "Why do my coordinates end up in the wrong place after converting GPX to GeoJSON?"
    a: "Because GPX lists latitude then longitude, but GeoJSON (RFC 7946) requires [longitude, latitude] — the opposite order. If you copy the numbers across without swapping them, every point lands in the wrong place (often the wrong hemisphere). A proper converter does the swap automatically."
  - q: "Is it safe to upload a GPX file to an online tool?"
    a: "Be careful — a GPX track records exactly where you started and finished, so it can reveal your home, workplace or gym. Prefer a tool that processes the file in your browser without uploading it. The LazyTools GPX tools all run client-side, so your locations never leave your device."
draft: false
---

**A GPX file is just XML listing GPS track points — latitude, longitude, elevation, time — and from
that you can compute a route's distance (sum the haversine gaps between points) and elevation gain
(sum the ups). But two things trip people up: converting to GeoJSON flips the coordinate order, and a
GPX track quietly reveals exactly where you live.** Here's how it all works, done in your browser with
the [GPX Analyzer](/file/gpx-analyzer/), [GPX→GeoJSON](/file/gpx-to-geojson/) and
[GeoJSON→GPX](/file/geojson-to-gpx/) tools.

## What's inside a GPX file

Open one in a text editor and you'll see plain XML:

```xml
<trkpt lat="51.5090" lon="-0.1000">
  <ele>25</ele>
  <time>2024-05-01T07:08:00Z</time>
</trkpt>
```

A **track** is an ordered list of these `<trkpt>` points; a **waypoint** (`<wpt>`) is a standalone
marked location. Each point carries a latitude and longitude, usually an elevation in metres, and
often a timestamp. That's the whole format — which is why every GPS app can read every other app's
export.

## How distance and elevation are computed

**Distance** is the sum of the straight-line (great-circle) distance between each consecutive pair of
points, using the **haversine formula** on the Earth's radius. No single point has a "distance"; the
route length emerges from adding thousands of tiny hops.

**Elevation gain** sums only the *upward* changes between consecutive points (and loss sums the
downward ones). So a rolling route can have hundreds of metres of gain even if start and finish are at
the same height.

**Speed and pace** need the timestamps: divide total distance by the time from the first to the last
point.

<figure class="my-8">
<svg viewBox="0 0 1200 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GPX points sum into distance and elevation; converting to GeoJSON swaps lat/lon order" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="50" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#0f172a">From track points to stats — and the lat/lon flip</text>

  <!-- points summing -->
  <rect x="60" y="90" width="520" height="150" rx="14" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="320" y="128" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#047857">Sum the gaps between points</text>
  <circle cx="110" cy="185" r="7" fill="#047857"/><circle cx="200" cy="170" r="7" fill="#047857"/><circle cx="300" cy="195" r="7" fill="#047857"/><circle cx="410" cy="160" r="7" fill="#047857"/><circle cx="520" cy="180" r="7" fill="#047857"/>
  <path d="M110 185 L200 170 L300 195 L410 160 L520 180" fill="none" stroke="#10b981" stroke-width="3"/>
  <text x="320" y="228" text-anchor="middle" font-family="ui-monospace,monospace" font-size="17" fill="#065f46">haversine(p₁,p₂) + haversine(p₂,p₃) + …</text>

  <!-- arrow -->
  <text x="610" y="175" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#94a3b8">→</text>

  <!-- stats -->
  <rect x="650" y="90" width="490" height="150" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="895" y="128" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#1e40af">Route stats</text>
  <text x="895" y="165" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">distance · elevation ↑↓</text>
  <text x="895" y="196" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">moving time · speed · pace</text>
  <text x="895" y="224" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="#3b82f6">(speed/pace need timestamps)</text>

  <!-- lat/lon flip -->
  <rect x="60" y="290" width="1080" height="140" rx="14" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="600" y="328" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="800" fill="#b45309">Converting to GeoJSON flips the coordinate order</text>
  <text x="330" y="378" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" fill="#92400e">GPX:  lat="51.5" lon="-0.1"</text>
  <text x="600" y="378" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" fill="#b45309">→</text>
  <text x="880" y="378" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" fill="#92400e">GeoJSON: [-0.1, 51.5]</text>
  <text x="600" y="412" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#c2410c">lat, lon  →  [lon, lat]  ·  forget the swap and every point lands in the wrong place</text>
</svg>
</figure>

## Accuracy caveats (why your numbers won't perfectly match Strava)

- **Distance depends on point density.** Sparse logging "cuts corners," reading a bit short. Different
  apps also smooth GPS jitter differently.
- **Elevation is the noisy one.** GPS altitude is imprecise; each platform filters it before summing,
  so elevation gain legitimately varies between tools. Barometric altimeters beat GPS here.

The [GPX Analyzer](/file/gpx-analyzer/) sums the raw points without smoothing, so treat its numbers as
a faithful reading of *your file*, not a claim that every app should agree to the metre.

## The GeoJSON coordinate trap

If you take one thing away: **GPX writes latitude then longitude; GeoJSON (RFC 7946) requires
`[longitude, latitude]` — the opposite order.** Copy the numbers across without swapping and every
point plots in the wrong place, frequently the wrong hemisphere. It's the single most common
GPX↔GeoJSON bug.

Convert cleanly in both directions — [GPX→GeoJSON](/file/gpx-to-geojson/) for web maps (Mapbox,
Leaflet, Turf.js, PostGIS) and [GeoJSON→GPX](/file/geojson-to-gpx/) to load a web-designed route onto a
Garmin or phone — and the swap is handled for you.

## Why GPX privacy matters

A GPX track is not anonymous data: its first and last points are, very often, **your home**. Uploading
your rides to a random "GPX viewer" hands a stranger your address, your routine, and where you'll
predictably be at 7am. That's why every LazyTools GPX tool reads the file **in your browser** and never
uploads it — the analysis and conversions happen on your device and work offline.

## The bottom line

A GPX file is a list of GPS points; distance is the summed haversine gaps, elevation gain is the summed
ups, and speed/pace come from the timestamps. Converting to GeoJSON means swapping to `[lon, lat]`
order. And because that list of points maps your life, do it privately — with the
[GPX Analyzer](/file/gpx-analyzer/) and the [GPX↔GeoJSON](/file/gpx-to-geojson/) converters that keep
your track on your own machine.
