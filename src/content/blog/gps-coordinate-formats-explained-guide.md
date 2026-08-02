---
title: "GPS Coordinate Formats Explained: DD, DMS, UTM, MGRS and Geohash"
description: "The same spot on Earth can be written as 51.5074, 51°30′26″N, UTM 30U 699319 5710156, an MGRS grid ref, or a geohash. Here's what each format is, who uses it, and how to convert between them — in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/gps-coordinate-formats-explained-guide.png
heroAlt: "One location shown as decimal degrees, DMS, UTM, MGRS and geohash"
tools: ["/travel/coordinate-converter/"]
keywords:
  - coordinate formats
  - what is dms coordinates
  - decimal degrees vs dms
  - what is utm
  - what is mgrs
  - what is a geohash
  - convert lat long to utm
faqs:
  - q: "What are the main GPS coordinate formats?"
    a: "The common ones are decimal degrees (DD, e.g. 51.5074, -0.1278), degrees-minutes-seconds (DMS, 51°30′26″N 0°07′40″W), degrees-decimal-minutes (DDM, 51°30.44′N), UTM (a metric grid: 30U 699319 5710156), MGRS (a lettered grid reference built on UTM), and geohash (a short text token like gcpvj0duq). They all describe the same point in different notations for different uses."
  - q: "What's the difference between decimal degrees and DMS?"
    a: "They're the same angle written two ways. Decimal degrees uses one number with a decimal (51.5074°); DMS breaks it into degrees, minutes (1/60°) and seconds (1/60′), so 51.5074° becomes 51°30′26″. To convert DMS to DD, add degrees + minutes/60 + seconds/3600. GPS software prefers DD; aviation and navigation traditionally use DMS."
  - q: "What is UTM and when is it used?"
    a: "Universal Transverse Mercator projects the globe onto a flat metric grid divided into 60 zones, giving an easting and northing in metres within a zone. Because it's metric and rectangular, it's convenient for surveying, mapping and distance work over local areas. MGRS is a lettered shorthand for UTM used by the military and search-and-rescue."
  - q: "What is a geohash?"
    a: "A geohash encodes a latitude/longitude into a short text string where nearby locations share a common prefix. That prefix property makes geohashes great for databases and proximity searches (find points 'near' another). Longer geohashes are more precise — around 11 characters pins a spot to roughly a metre."
  - q: "How do I convert between coordinate formats accurately?"
    a: "For DD/DMS/DDM it's simple arithmetic. UTM and MGRS require a map projection (Transverse Mercator on the WGS-84 ellipsoid), which is where hand-conversion goes wrong. The LazyTools Coordinate Converter does all of them at once, in your browser, using the sub-millimetre Karney series for UTM/MGRS."
  - q: "Is my location private when converting coordinates?"
    a: "With the LazyTools Coordinate Converter, yes — every conversion runs in your browser and nothing is uploaded. That matters because a coordinate is a precise real-world place, often a home or field position."
draft: false
---

**One spot on Earth has many names: `51.5074, -0.1278` in decimal degrees, `51°30′26″N 0°07′40″W` in
DMS, `30U 699319 5710156` in UTM, an MGRS grid reference, or a geohash like `gcpvj0duq`.** They're not
competing standards — they're different notations for the same latitude and longitude, each suited to a
different job. Here's what each is and how to move between them with the
[Coordinate Converter](/travel/coordinate-converter/).

## The angle formats: DD, DMS, DDM

These three are the *same* latitude/longitude written differently:

| Format | Example | Notes |
|---|---|---|
| **Decimal Degrees (DD)** | `51.5074` | One decimal number. What software and web maps use. |
| **Degrees Minutes Seconds (DMS)** | `51°30′26″N` | 1 degree = 60 minutes, 1 minute = 60 seconds. Aviation, nautical. |
| **Degrees Decimal Minutes (DDM)** | `51°30.44′N` | Degrees + decimal minutes. Marine GPS, aviation. |

Converting is arithmetic: **DMS → DD** is `degrees + minutes/60 + seconds/3600` (negate for S/W). So
`51°30′26″` = 51 + 30/60 + 26/3600 = **51.5072°**.

## The grid formats: UTM and MGRS

DD/DMS describe angles on a sphere. **UTM (Universal Transverse Mercator)** instead lays a flat metric
grid over the world, split into 60 north–south **zones**. A UTM coordinate is a zone plus an
**easting** and **northing** in metres — e.g. `30U 699319 5710156`. Because it's metric and
rectangular, it's natural for surveying and local mapping.

**MGRS (Military Grid Reference System)** is a lettered shorthand built on UTM: it names a 100 km grid
square with two letters, then gives the position within it. It's what the military, search-and-rescue
and many field crews use because it's compact and quick to read aloud.

The catch: converting lat/lon ↔ UTM/MGRS needs a **map projection** (Transverse Mercator on the WGS-84
ellipsoid), not simple arithmetic — which is exactly where hand-conversions go wrong.

## The database format: geohash

A **geohash** encodes a lat/lon into a short string like `gcpvj0duq`. Its superpower is that **nearby
places share a prefix**, so a database can find points "near" a location with a simple text match.
Longer geohashes are more precise — about 11 characters gets you to a metre.

<figure class="my-8">
<svg viewBox="0 0 1200 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One location shown in five coordinate formats, grouped by purpose" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#0f172a">One location · five notations</text>
  <text x="600" y="80" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#475569">London — 51.5074, −0.1278</text>

  <rect x="60" y="110" width="350" height="130" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="235" y="142" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" font-weight="700" fill="#1e40af">Angles (maps, navigation)</text>
  <text x="235" y="176" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#1e3a8a">DD  51.5074, −0.1278</text>
  <text x="235" y="202" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#1e3a8a">DMS 51°30′26″N 0°07′40″W</text>
  <text x="235" y="226" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#1e3a8a">DDM 51°30.44′N</text>

  <rect x="440" y="110" width="330" height="130" rx="14" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="605" y="142" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" font-weight="700" fill="#047857">Grids (survey, military)</text>
  <text x="605" y="180" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#065f46">UTM  30U 699319 5710156</text>
  <text x="605" y="210" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#065f46">MGRS 30UXC 99319 10156</text>

  <rect x="800" y="110" width="340" height="130" rx="14" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="970" y="142" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" font-weight="700" fill="#b45309">Token (databases)</text>
  <text x="970" y="185" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#92400e">geohash  gcpvj0duq</text>
  <text x="970" y="214" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="#c2410c">nearby points share a prefix</text>

  <text x="600" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#334155">DD ↔ DMS ↔ DDM = arithmetic</text>
  <text x="600" y="332" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#334155">↔ UTM / MGRS = map projection (Transverse Mercator)</text>
  <text x="600" y="376" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#64748b">All the same point — convert all at once, in your browser</text>
</svg>
</figure>

## Which format should you use?

- **Decimal degrees** — software, web maps, APIs, storing in a database column.
- **DMS / DDM** — aviation, marine navigation, reading coordinates aloud.
- **UTM** — surveying, local mapping, anything where metres are easier than degrees.
- **MGRS** — military, search-and-rescue, field teams needing a compact grid ref.
- **Geohash** — proximity search and "find nearby" queries in databases.

## Convert them all at once — privately

Because these are just different encodings of one lat/lon, a converter can show all of them together.
The [Coordinate Converter](/travel/coordinate-converter/) takes a latitude/longitude in any degree
format (or a geohash to decode) and outputs DD, DMS, DDM, UTM, MGRS and geohash, using the
sub-millimetre Karney Transverse Mercator series for the grid formats. And since a coordinate pinpoints
a real place — sometimes a home or a field position — it all runs in your browser and is never
uploaded.

## The bottom line

DD, DMS and DDM are the same angle written three ways; UTM and MGRS re-express it as a metric grid via
a map projection; and a geohash turns it into a prefix-searchable token. Pick the format that fits the
job, and convert between them accurately and privately with the
[Coordinate Converter](/travel/coordinate-converter/).
