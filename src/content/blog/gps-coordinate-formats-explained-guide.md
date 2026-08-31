---
title: "GPS Coordinate Formats Explained: DD, DMS, UTM, MGRS and Geohash"
seoTitle: 'GPS Coordinate Formats: DD, DMS, UTM & MGRS'
description: "GPS coordinate formats explained: decimal degrees, DMS, UTM, MGRS and geohash, what each is, who uses it, and how to convert between them."
pubDate: 2026-08-02
updatedDate: 2026-08-23
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
    a: "A geohash encodes a latitude/longitude into a short text string where nearby locations share a common prefix. That prefix property makes geohashes great for databases and proximity searches (find points 'near' another). Longer geohashes are more precise, around 11 characters pins a spot to roughly a metre."
  - q: "How do I convert between coordinate formats accurately?"
    a: "For DD/DMS/DDM it's simple arithmetic. UTM and MGRS require a map projection (Transverse Mercator on the WGS-84 ellipsoid), which is where hand-conversion goes wrong. The LazyTools Coordinate Converter does all of them at once, in your browser, using the sub-millimetre Karney series for UTM/MGRS."
  - q: "Is my location private when converting coordinates?"
    a: "With the LazyTools Coordinate Converter, yes, every conversion runs in your browser and nothing is uploaded. That matters because a coordinate is a precise real-world place, often a home or field position."
draft: false
---

**One spot on Earth has many names: `51.5074, -0.1278` in decimal degrees, `51°30′26″N 0°07′40″W` in
DMS, `30U 699319 5710156` in UTM, an MGRS grid reference, or a geohash like `gcpvj0duq`.** They're not
competing standards, they're different notations for the same latitude and longitude, each suited to a
different job. Here's what each is and how to move between them with the
[Coordinate Converter](/travel/coordinate-converter/).

<aside class="key-takeaways">

**Key takeaways**

- DD, DMS and DDM are the *same* angle written differently. You convert between them with plain arithmetic, no map or software required.
- UTM and MGRS re-express the point as a flat metric grid, which needs a map projection (Transverse Mercator on WGS-84). This is where hand conversion breaks down.
- A geohash turns a location into a short text token whose defining trick is that nearby places share a leading prefix, ideal for database proximity search.
- The decimal places you keep control precision: roughly 5 decimals in DD pins a point to about a metre; more digits rarely help because civilian GPS itself is only accurate to a few metres.

</aside>

## The angle formats: DD, DMS, DDM

These three are the *same* latitude/longitude written differently:

| Format | Example | Notes |
|---|---|---|
| **Decimal Degrees (DD)** | `51.5074` | One decimal number. What software and web maps use. |
| **Degrees Minutes Seconds (DMS)** | `51°30′26″N` | 1 degree = 60 minutes, 1 minute = 60 seconds. Aviation, nautical. |
| **Degrees Decimal Minutes (DDM)** | `51°30.44′N` | Degrees + decimal minutes. Marine GPS, aviation. |

Converting is arithmetic: **DMS → DD** is `degrees + minutes/60 + seconds/3600` (negate for S/W). So
`51°30′26″` = 51 + 30/60 + 26/3600 = **51.5072°**.

Going the other way, **DD → DMS**, is just as mechanical. Take the fractional part, multiply by 60 for
minutes, then repeat on that fraction for seconds:

1. Start with `51.5074`. The whole degrees are **51**.
2. `0.5074 × 60 = 30.444`, so the whole minutes are **30**.
3. `0.444 × 60 = 26.6`, so the seconds are **≈27″**.

That gives `51°30′27″N` (small rounding differences of a second or two are normal). Longitude works the
same way, and the sign decides the hemisphere: positive longitude is **E**, negative is **W**; positive
latitude is **N**, negative is **S**. Dropping that sign is the single most common conversion mistake, `-0.1278` is west of Greenwich, and writing it as an east value would place you on the wrong side of the
Prime Meridian.

DDM (degrees decimal minutes) is the halfway house: keep the whole degrees, but leave the minutes as a
decimal instead of splitting off seconds. From step 2 above, `51.5074°` is simply `51°30.444′N`. Marine
and aviation GPS units favour DDM because it reads cleanly on a small display and avoids a second layer
of sixtieths.

## How precision maps to decimal places

A frequent question is how many digits to keep. Because one degree of latitude is roughly 111 km
everywhere on Earth, each decimal place in DD shrinks the box by a factor of ten. Longitude spacing is
similar at the equator and narrows toward the poles (it scales with the cosine of the latitude), so the
figures below are a good rule of thumb rather than an exact guarantee at every latitude.

| Decimal places (DD) | Approx. latitude precision | Practical meaning |
|---|---|---|
| 2 (`51.51`) | ~1.1 km | A neighbourhood or village |
| 3 (`51.507`) | ~110 m | A city block |
| 4 (`51.5074`) | ~11 m | A specific building |
| 5 (`51.50740`) | ~1.1 m | A doorway or tree |
| 6 (`51.507400`) | ~0.11 m | Down to roughly a hand's width |

Consumer GPS is typically accurate to only a few metres in the open, so **five decimal places is enough
for almost any real-world use**, extra digits look precise but describe accuracy the device never had.

## The grid formats: UTM and MGRS

DD/DMS describe angles on a sphere. **[UTM (Universal Transverse Mercator)](https://en.wikipedia.org/wiki/Universal_Transverse_Mercator_coordinate_system)**
instead lays a flat metric grid over the world, split into 60 north, south **zones**. A UTM coordinate is a zone plus an
**easting** and **northing** in metres, e.g. `30U 699319 5710156`. Because it's metric and
rectangular, it's natural for surveying and local mapping.

Each UTM zone is **6° of longitude wide**, so the 360° globe is covered by **60 zones** numbered 1-60,
running west to east from the 180° meridian. The letter after the zone number (the `U` in `30U`) marks a
latitude band. Within a zone, easting is measured from a false origin so the numbers stay positive, and
northing counts metres from the equator. This is why UTM feels like graph paper: the difference between
two eastings really is a distance in metres, which makes it easy to measure and lay out on the ground, as long as you stay inside one zone, since the grid resets at each boundary.

**MGRS (Military Grid Reference System)** is a lettered shorthand built on UTM: it names a 100 km grid
square with two letters, then gives the position within it. It's what the military, search-and-rescue
and many field crews use because it's compact and quick to read aloud. Its cleverness is *truncatable
precision*. You can hand over as many or as few digits as the situation needs:

| MGRS reference | Digits per axis | Precision |
|---|---|---|
| `30UXC` | 0 | 100 km square |
| `30UXC 9 1` | 1 | 10 km |
| `30UXC 99 10` | 2 | 1 km |
| `30UXC 993 101` | 3 | 100 m |
| `30UXC 99319 10156` | 5 | 1 m |

The catch: converting lat/lon ↔ UTM/MGRS needs a **map projection** (Transverse Mercator on the WGS-84
ellipsoid), not simple arithmetic, which is exactly where hand-conversions go wrong.

## The database format: geohash

A **[geohash](https://en.wikipedia.org/wiki/Geohash)** encodes a lat/lon into a short string like
`gcpvj0duq`. Under the hood it interleaves the
bits of latitude and longitude and encodes them in base-32, which produces the format's defining
property: **nearby places share a leading prefix**. `gcpvj` is central London; add characters and you
zoom in on the same area. That lets a database find points "near" a location with a simple text
`LIKE 'gcpvj%'` match instead of expensive geometry, which is why geohashes turn up in caching,
sharding and "find nearby" features.

Longer geohashes are more precise, each extra character narrows the cell by a factor of about 32, and
around **11 characters** pins a spot to roughly a metre. The one wrinkle: because the grid is built from
fixed cells, two points can be metres apart yet fall on opposite sides of a cell boundary and share *no*
prefix, so serious proximity searches check neighbouring cells too.

<figure class="my-8">
<svg viewBox="0 0 1200 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One location shown in five coordinate formats, grouped by purpose" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#0f172a">One location · five notations</text>
  <text x="600" y="80" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#475569">London, 51.5074, −0.1278</text>

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
  <text x="600" y="376" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#64748b">All the same point, convert all at once, in your browser</text>
</svg>
</figure>

## Which format should you use?

- **Decimal degrees**, software, web maps, APIs, storing in a database column.
- **DMS / DDM**, aviation, marine navigation, reading coordinates aloud.
- **UTM**, surveying, local mapping, anything where metres are easier than degrees.
- **MGRS**, military, search-and-rescue, field teams needing a compact grid ref.
- **Geohash**, proximity search and "find nearby" queries in databases.

## Common conversion pitfalls

Most conversion errors are not maths mistakes, they're small assumptions that quietly shift the point:

- **Lost signs and hemispheres.** In DD, the minus sign carries the direction; in DMS that direction is
  the `N/S/E/W` letter. Convert `-0.1278` to `0°07′40″` and forget the `W`, and you've flipped it across
  the Prime Meridian.
- **Latitude/longitude order.** Most mapping software writes **latitude first, then longitude**, but some
  APIs and [GeoJSON](/blog/wkt-vs-geojson-geometry-formats-explained-guide/) use the opposite order.
  Swapping them can drop a London coordinate into the ocean.
- **Datum mismatches.** Coordinates only mean something relative to a *datum*, a model of Earth's shape.
  Web maps and GPS use **WGS-84**; older national maps may use a local datum, and the same numbers can
  land tens of metres apart between them. When precision matters, confirm both sides use the same datum.
- **Over-stating precision.** Copying eight decimals from a calculator implies millimetre accuracy the
  original fix never had. Round to what the source actually measured.

## Convert them all at once, privately

Because these are just different encodings of one lat/lon, a converter can show all of them together.
The [Coordinate Converter](/travel/coordinate-converter/) takes a latitude/longitude in any degree
format (or a geohash to decode) and outputs DD, DMS, DDM, UTM, MGRS and geohash, using the
sub-millimetre Karney Transverse Mercator series for the grid formats. And since a coordinate pinpoints
a real place, sometimes a home or a field position. It all runs in your browser and is never
uploaded.

## The bottom line

DD, DMS and DDM are the same angle written three ways; UTM and MGRS re-express it as a metric grid via
a map projection; and a geohash turns it into a prefix-searchable token. Pick the format that fits the
job, and convert between them accurately and privately with the
[Coordinate Converter](/travel/coordinate-converter/).
