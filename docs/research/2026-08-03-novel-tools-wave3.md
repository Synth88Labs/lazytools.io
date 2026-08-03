# Novel Client-Side Tools — Research Wave 3 — 2026-08-03

## Executive summary

Fresh wave following the 2026-08-01 (file/dev) and 2026-08-02 (parsers/validators/metadata)
scans, most of which have already shipped (coordinate converter, barcode/IMEI/Luhn, Snowflake
decoder, CRC-32/Adler-32, config converters, X.509 decoder, font/WAV/MP3/EPUB metadata,
file-type id). Those two waves consumed the obvious checksum/config/metadata veins, so this
run hunts **binary wire-format decoders with published test vectors**, **byte-exact number
representations**, **privacy-sensitive "don't paste it into a chatbot" inspectors**, and a
**geo-format cluster** that pairs with the just-shipped GPS coordinate converter.

Twelve genuinely-new, dedup-checked candidates cleared. Every one has an authoritative spec or
RFC with reference vectors we can Node-test against, and every one has a durable AI-resistance
angle (byte-exactness, binary input, or privacy). The recurring pattern holds from prior waves:
client-side incumbents already exist for all of these (client-side is the baseline, not the
edge) — so our wedge is **exact working shown + clean single-purpose ad-free SEO pages + honest
scope + bundling into coherent clusters**, not "we don't upload." No candidate depends on a
server, live feed, or CORS fetch. One important honesty constraint surfaced: an email-header
tool must parse the auth headers already present in the message and must NOT attempt live
SPF/DKIM/DMARC DNS validation (that needs a server) — scope it to parsing + hop-timeline.

Legend: **[L]** pure-logic/deterministic · **[B]** byte-verifiable binary parse/emit ·
**[M]** canvas/media. Score is an informal 0–25 read on the standing rubric (demand /
feasibility / gap / durability / fit).

## Ranked candidates

| # | Tool | Category · slug | Type | Head keyword(s) | Demand signal (observed) | How we Node-test / verify | Dedup note | Score |
|---|------|-----------------|------|-----------------|--------------------------|---------------------------|------------|-------|
| 1 | **Protobuf wire-format decoder (no .proto)** | /dev/ · `protobuf-decoder` | [B] | "protobuf decoder online", "decode protobuf without proto" | Multiple client-side incumbents (singhajit, codetidy, terrific.tools, viadreams); Google Groups + codestudy how-to threads on decoding without schema | Decode hex/base64 by the protobuf encoding spec into (field #, wire type, value) tree; cross-check every fixture against `protobufjs` and `protoc --decode_raw` | Not present — /dev/ has JWT/base64/hash but no protobuf; distinct from json-to-* codegen | 21 |
| 2 | **CBOR decoder / diagnostic-notation viewer** | /dev/ · `cbor-decoder` | [B] | "cbor decoder online", "cbor to json" | emn178, singhajit, openformatter, williamchong all client-side; explicitly aimed at WebAuthn/COSE/passkey/IoT debugging | **RFC 8949 Appendix A** ships a canonical decode test-vector table — use it verbatim as the Node fixture set | Not present; complements JWT decoder. Fold MessagePack as a second tab (or item 12b) | 21 |
| 3 | **IEEE 754 floating-point converter** | /dev/ · `ieee-754-converter` | [B] | "ieee 754 converter", "float to hex", "decimal to floating point" | Dense incumbent field (h-schmidt, ieee754calc, baseconvert, devtoollab, numeral-systems) = proven evergreen CS/embedded demand | `DataView.setFloat16/32/64` + `getUint8` round-trip in Node gives byte-exact reference for half/single/double | Not present; number-base-converter is integer-only. Distinct intent | 21 |
| 4 | **Email header analyzer (.eml / raw headers)** | /dev/ or /file/ · `email-header-analyzer` | [L] | "email header analyzer", "trace email headers", "analyze email source" | Very crowded incumbent field (whatismyip, dnschecker, mxtoolbox-style, dmarcguard, optimail) proves sustained demand; several already parse in-browser | Parse RFC 5322 headers; build Received-hop timeline with delays; read existing `Authentication-Results`/`Received-SPF`/`DKIM-Signature` strings. Node-test hop ordering + delay math against saved .eml fixtures | Not present. **Scope honesty: parse only — no live DNS SPF/DKIM/DMARC lookup (needs server).** Privacy angle strong | 20 |
| 5 | **.torrent file inspector (bencode)** | /file/ · `torrent-file-viewer` | [B] | "torrent file viewer", "view torrent contents", "torrent info hash" | AxelBase + schardev torrent-metadata (both client-side), GeeksforGeeks how-to, PicoCTF forensics writeups | Decode bencode → announce list / file tree / piece length; compute info-hash = SHA-1 of bencoded `info` dict (Web Crypto). Node-verify bencode round-trip + info-hash against a known public torrent | Not present; /file/ has ZIP create/extract but no bencode. Privacy angle | 19 |
| 6 | **WKT ⇄ GeoJSON (+WKB) converter** | /file/ · `wkt-to-geojson` (+`geojson-to-wkt`) | [L] | "wkt to geojson", "well known text converter" | atlas.co, mygeodata, 9revolution9, wkbrew, rodosto — active client-side incumbent cluster | OGC Simple Features WKT ↔ RFC 7946 GeoJSON; round-trip fixtures (Point/LineString/Polygon/Multi*) verified in Node against `wellknown`/`@terraformer/wkt` | Not present; /file/ has gpx↔geojson only. Extends the just-shipped GPS/geo vein | 19 |
| 7 | **MP4 / ISOBMFF box (atom) inspector** | /file/ or /video/ · `mp4-box-inspector` | [B] | "mp4 box inspector", "mp4 atom viewer", "isobmff structure" | peaberberian + mp4box.js client-side viewers; **HN thread** (id=33754693) explicitly asking for an open-source visual atom viewer = observed pain | Parse ISO BMFF box tree (type/size/offset, ftyp/moov/mvhd/trak fields); Node-verify box offsets/sizes against a known short MP4 | Not present; file-type-id only sniffs magic bytes. Binary + privacy | 19 |
| 8 | **PNG chunk inspector** | /image/ · `png-chunk-viewer` | [B] | "png chunk viewer", "png metadata viewer", "png text chunks" | dcode, metadataview, optimizepng, Nayuki inspector, batchpngtools — dense field; ties to hidden-metadata privacy | Walk PNG chunks (IHDR/PLTE/tEXt/zTXt/iTXt/pHYs/gAMA/IDAT), **verify each chunk CRC-32** (reuse shipped CRC-32 engine). Node-test against a crafted PNG with known chunks | Not present; /image/ has EXIF viewer/remover + DPI setter but no chunk-level PNG view. Reuses CRC-32 lib | 19 |
| 9 | **FLAC metadata (Vorbis comment) editor** | /file/ or /video/ · `flac-tag-editor` | [B] | "flac tag editor", "edit flac metadata", "flac vorbis comments" | mp3tageditor, lrcsong, soundtools, metadatafinder — all client-side; completes the audio trio | Rewrite the Vorbis-comment metadata block (STREAMINFO untouched, audio frames bit-identical); reparse output block in Node + assert audio byte-range unchanged | **Completes audio-metadata set**: MP3/ID3 (built) + WAV/AIFF (built) + FLAC (this). Distinct format (Vorbis comments ≠ ID3/RIFF) | 19 |
| 10 | **Google encoded polyline codec** | /file/ · `polyline-decoder` (+encode) | [L] | "decode polyline", "encoded polyline decoder", "polyline to coordinates" | Google's own decoder utility + js-polyline-codec + emcconville tool; Maps/Routes API developer audience | Implement the documented Google polyline algorithm; Node-verify against `@mapbox/polyline` reference strings both directions | Not present. Pairs with GPS converter + WKT/GeoJSON as a geo mini-cluster | 18 |
| 11 | **Bitwise / two's-complement calculator** | /dev/ · `bitwise-calculator` | [L] | "bitwise calculator", "two's complement calculator" | Large incumbent field (dcode, miniwebtool, coderstool, devtoollab) = strong evergreen demand | BigInt-based AND/OR/XOR/NOT/NAND/NOR/XNOR + shifts/rotates + signed 8/16/32/64-bit two's-complement view; Node reference table | Not present; number-base-converter converts but does not operate. gap is only ~2 (crowded) → carries on demand+fit | 17 |
| 12 | **JWK thumbprint calculator (RFC 7638)** | /dev/ · `jwk-thumbprint` | [L] | "jwk thumbprint", "rfc 7638 thumbprint" | jsrsasign, encrypt-online, gizza all client-side; JOSE/passkey developer niche | Build required-members canonical JSON per RFC 7638 §3, SHA-256 (Web Crypto), base64url. **RFC 7638 §3.1 gives a worked example** = exact fixture | Not present; distinct from JWT decoder. **Public-key only; ignore/flag private members** (security-honesty) | 17 |

## TOP 6 build-next shortlist

1. **Protobuf wire-format decoder** [B] — highest dev demand + strong AI-resistance (a chatbot
   can't reliably unpack arbitrary protobuf bytes) + privacy (API/COSE/WebAuthn payloads). Ship
   the honest-scope note: without a `.proto` we recover field numbers/wire types/best-effort
   values, not field names. Verifiable against `protoc --decode_raw`.
2. **CBOR decoder** [B] — the cleanest verification story in the wave: RFC 8949 Appendix A is a
   ready-made fixture table. **Named strengthening driver: passkeys/WebAuthn + COSE adoption**
   (attestation objects and COSE keys are CBOR) is rising across the web platform, so
   CBOR-debugging demand grows, not shrinks. Diagnostic-notation output is the wedge.
3. **IEEE 754 converter** [B] — byte-exact, evergreen CS/embedded demand, trivially Node-verified
   via `DataView`. Add half/single/double + the sign/exponent/mantissa breakdown and the
   "nearest representable value / rounding error" line that most incumbents show.
4. **Email header analyzer** [L] — strongest privacy angle in the wave (people paste full email
   headers, which leak internal IPs/routing, into random sites) plus a **named driver: sender
   authentication enforcement** (Gmail/Yahoo bulk-sender requirements pushed SPF/DKIM/DMARC into
   the mainstream). Ship parse-only with a loud "no data leaves your browser / no DNS lookups"
   scope note — that honesty is itself the differentiator vs server-side incumbents.
5. **.torrent inspector** [B] — privacy-sensitive, spec-clean bencode + SHA-1 info-hash, clear
   head keyword, thin/ad-heavy incumbents. Good AI-resistance (binary input + info-hash the LLM
   can't compute).
6. **WKT ⇄ GeoJSON + polyline codec** [L] — build as a **geo cluster** that extends the freshly
   shipped GPS coordinate converter and gpx/geojson tools. Both are pure spec math with public
   reference libraries for fixtures; strong dev demand; coherent internal linking for SEO.

## Watchlist / risky

- **MessagePack decoder** [B] — fold as a second tab on the CBOR tool (near-identical audience
  and self-describing binary), or ship standalone only if keyword pull justifies a page.
- **Quoted-printable encoder/decoder** (RFC 2045) [L] — cheap satellite that pairs with the
  email-header tool; verify against Node `Buffer`/reference. Low standalone demand — build as a
  companion, not a bet.
- **Base45 (RFC 9285)** [L] — spec-exact, but demand is narrow (EU Digital COVID Certificate /
  QR payloads). Park unless a QR-adjacent long-tail proves out.
- **BLAKE2b / BLAKE3 hash** [B] — published reference vectors and growing adoption, but needs a
  wasm/lib dependency and the hash-generator niche is crowded; promote only with keyword-gap
  proof. Would extend the existing hash-generator rather than a new page.
- **TAR archive inspector** [B] — pairs with the shipped ZIP tools and is spec-clean (USTAR
  header), but demand is thinner than ZIP; watchlist.
- **Risk — Email header tool overreach:** do NOT advertise SPF/DKIM/DMARC *validation*. Live
  policy validation requires DNS TXT lookups = server/CORS = off-charter. We parse and display
  the `Authentication-Results` the receiving server already stamped, plus the hop timeline. Keep
  the scope statement prominent or the tool becomes a support/accuracy liability.
- **Risk — Protobuf/MP4 scope:** both are best-effort structural views (no `.proto`; no full
  codec parse). State the boundary on-page so users don't expect semantic field names / full
  media validation.

## Lane notes

- **Platform & API signals:** No net-new browser API unlock this run beyond prior findings; the
  durable driver here is the **passkeys/WebAuthn + COSE** rollout raising CBOR-debugging demand,
  and **email sender-auth enforcement** raising header-analysis demand. Both are ecosystem
  drivers, not new APIs. All twelve tools run on stable JS + Web Crypto + File API today.
- **Format & ecosystem shifts:** Binary wire formats (protobuf, CBOR, MessagePack) and container
  formats (ISOBMFF/MP4, FLAC, .torrent/bencode, PNG chunks) are the open vein — the 08-01/08-02
  waves took the text/config/checksum formats. Geo formats (WKT/WKB/GeoJSON/polyline) are a
  coherent cluster extending the just-shipped GPS converter.
- **Demand & pain signals:** Observed recurring how-to/forum demand — HN atom-viewer request
  (id=33754693), Google Groups "decode protobuf without proto", PicoCTF/GeeksforGeeks torrent
  inspection, dense incumbent fields for IEEE-754 / bitwise / email-header (incumbent density =
  proven demand). Signals qualitative, not fabricated volumes.
- **Competitor & gap scan:** Every niche already has client-side incumbents (baseline). Gaps are
  ad-heavy/thin pages and the absence of exact-working-shown + honest-scope single-purpose pages.
  Our edge is packaging + verification + clusters, consistent with the 2026-07-11 strategic note.
- **Regulatory & institutional drivers:** No new e-invoicing/accessibility item this run beyond
  those already tracked in INDEX (KSeF/Factur-X/PINT/MyInvois/EAA). The email sender-auth trend
  is quasi-regulatory (platform policy) and supports the header analyzer.

## Sources

- https://ieee754calc.com/ · https://www.h-schmidt.net/FloatConverter/IEEE754.html · https://baseconvert.com/ieee-754-floating-point · https://devtoollab.com/tools/ieee-754-converter
- https://emn178.github.io/online-tools/cbor/decode/ · https://openformatter.com/cbor-decode · https://singhajit.com/tools/cbor-decoder/ · https://www.rfc-editor.org/rfc/rfc8949.html
- https://singhajit.com/tools/protobuf-decoder/ · https://codetidy.dev/protobuf-decoder · https://terrific.tools/data/protobuf-decoder · https://groups.google.com/g/protobuf/c/nrdjugOVvW8
- https://vpntesting.com/tools/email-header-analyzer/ · https://www.optimail.ai/tools/email-header-analyzer · https://dmarcguard.io/tools/email-header-analyzer/ · https://www.whatismyip.com/email-header-analyzer/
- https://axelbase.github.io/torrent-tracker-analyzer/ · https://github.com/schardev/torrent-metadata · https://www.geeksforgeeks.org/blogs/how-to-examine-torrent-file/ · https://en.wikipedia.org/wiki/Torrent_file
- https://atlas.co/tools/wkt-to-geojson/ · https://mygeodata.cloud/converter/wkt-to-geojson · https://wkbrew.tszheichoi.com/ · https://9revolution9.com/tools/geo/wkt-geojson
- https://peaberberian.github.io/AISOBMFFWVDFBUTFAII/ · https://gpac.github.io/mp4box.js/test/filereader.html · https://news.ycombinator.com/item?id=33754693
- https://www.dcode.fr/png-chunks · https://metadataview.com/view/png · https://optimizepng.com/png-metadata-viewer/
- https://mp3tageditor.vercel.app/flac-tag-editor · https://lrcsong.com/tools/audio/flac-tag-editor · https://en.wikipedia.org/wiki/Vorbis_comment
- https://developers.google.com/maps/documentation/utilities/polylinealgorithm · https://github.com/googlemaps/js-polyline-codec
- https://www.dcode.fr/bitwise-calculator · https://miniwebtool.com/bitwise-calculator/ · https://devtoollab.com/tools/bitwise-calculator
- https://www.rfc-editor.org/rfc/rfc7638.html · https://kjur.github.io/jsrsasign/sample/tool_jwktp.html · https://encrypt-online.com/tools/jwk-thumbprint-calculator
