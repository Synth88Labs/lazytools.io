---
title: "What Is CBOR? Binary JSON for Passkeys, COSE and IoT — Explained"
description: "CBOR is a compact binary format like JSON, and it's what passkeys, WebAuthn and many IoT protocols use under the hood. Here's how CBOR encoding works, what diagnostic notation is, and how to decode a CBOR message in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/what-is-cbor-binary-json-explained-guide.png
heroAlt: "A CBOR byte decoded into major type and additional info, then rendered as JSON-like diagnostic notation"
tools: ["/dev/cbor-decoder/"]
keywords:
  - what is cbor
  - cbor vs json
  - cbor diagnostic notation
  - decode cbor
  - webauthn cbor
  - rfc 8949
faqs:
  - q: "What is CBOR?"
    a: "CBOR (Concise Binary Object Representation) is a compact binary data format defined in RFC 8949. It represents the same kinds of data as JSON — numbers, strings, arrays, objects, booleans, null — but in a smaller, faster-to-parse binary form, and it adds a few things JSON lacks, like native byte strings, tags and exact 64-bit integers. It's designed for situations where size and parsing speed matter."
  - q: "How is CBOR different from JSON?"
    a: "CBOR is binary where JSON is text, so it's smaller and quicker to parse but not human-readable directly. CBOR also natively supports byte strings (JSON has to base64-encode binary), semantic tags (e.g. marking a value as a date), exact big integers, and non-text map keys. JSON's advantage is readability and universal tooling; CBOR's is efficiency and richer types."
  - q: "Where is CBOR used?"
    a: "Most visibly in WebAuthn and passkeys: the attestation objects and COSE (CBOR Object Signing and Encryption) keys exchanged during registration are CBOR. It's also common in IoT and constrained-device protocols where every byte counts, in some blockchain and messaging systems, and anywhere a compact self-describing binary format is useful."
  - q: "What is CBOR diagnostic notation?"
    a: "A human-readable text representation of a CBOR value, defined in the RFC. It looks a lot like JSON — arrays in [brackets], maps in {braces} — but writes byte strings as h'0102', tags as N(value), and floats with a decimal point (1.0, 1.5) so they're distinguishable from integers. Decoders print it so you can read a binary CBOR message at a glance."
  - q: "How do I decode a CBOR message?"
    a: "Take the raw bytes (often shown as hex or base64) and run them through a CBOR decoder, which reads each item's major type and value and reconstructs the structure. The LazyTools CBOR Decoder does this in your browser and shows both the diagnostic notation and a typed tree — no schema needed, because CBOR is self-describing."
  - q: "Is CBOR the same as MessagePack?"
    a: "No, though they're similar in spirit — both are compact binary alternatives to JSON. They use different byte encodings and type systems, so a MessagePack blob won't decode as CBOR or vice versa. CBOR is standardized as RFC 8949 and is the one used by WebAuthn/COSE."
draft: false
---

**When you create a passkey, your browser and the site exchange a blob of binary data — and that blob is
CBOR.** It's a compact, JSON-like binary format that shows up in WebAuthn, COSE-signed tokens and a lot of
IoT, yet most developers never see inside it. Here's how CBOR works and how to read one with the
[CBOR Decoder](/dev/cbor-decoder/).

## CBOR in one sentence

**CBOR (Concise Binary Object Representation, RFC 8949) is binary JSON with extra types.** It encodes the
same data model as JSON — numbers, strings, arrays, maps, booleans, null — but in a smaller binary form,
and it adds native **byte strings**, **tags**, and **exact 64-bit integers**. The trade-off versus JSON is
readability for efficiency.

## How a CBOR item is encoded

The elegant part: **every data item starts with a single "initial byte"** that splits into two pieces:

> initial byte = (major type × 32) + additional info

The **major type** (top 3 bits) says what kind of thing it is; the **additional info** (low 5 bits) gives
a small value directly, or says how many following bytes hold the value or length.

| Major type | Meaning |
|---|---|
| 0 | Unsigned integer |
| 1 | Negative integer |
| 2 | Byte string |
| 3 | Text string (UTF-8) |
| 4 | Array |
| 5 | Map (key/value pairs) |
| 6 | Tag (semantic label on the next item) |
| 7 | Floats and simple values (true/false/null) |

For example, the byte `0x01` is major type 0, value 1 → the integer **1**. The byte `0x1903e8` is major
type 0 with additional info 25 ("two bytes follow"), and those two bytes `03e8` are **1000**. Strings and
arrays work the same way: a length, then the contents.

## Diagnostic notation: CBOR you can read

Because raw CBOR is binary, the RFC defines **diagnostic notation** — a text form that looks like JSON but
is precise about CBOR's extra types:

```
{"age": 1000, "name": "Chloe"}     ← a map
[1, 2, 3]                          ← an array
h'01020304'                        ← a byte string
0("2013-03-21T20:04:00Z")          ← tag 0 (a date-time string)
1.5   Infinity   NaN               ← floats (always with a point)
```

Byte strings become `h'…'`, tags become `N(value)`, and floats always carry a decimal point so you can
tell `1.0` (a float) from `1` (an integer). A decoder prints this so a binary message becomes legible.

## Why you'll meet CBOR: passkeys and COSE

The reason CBOR matters to web developers today is **WebAuthn / passkeys**. When a passkey is created, the
authenticator returns an **attestation object** — a CBOR map containing the format, the authenticator data
and a statement. The public keys inside use **COSE** (CBOR Object Signing and Encryption), which is also
CBOR. If you're debugging a registration flow, decoding that CBOR is how you see what the authenticator
actually sent. It's equally common in IoT, where its small size suits constrained devices.

## Decode a CBOR message privately

CBOR is self-describing, so you don't need a schema to read it — just the bytes. The
[CBOR Decoder](/dev/cbor-decoder/) takes hex or base64, decodes every major type (including tags,
indefinite-length items and half/single/double floats, with 64-bit integers kept exact), and shows both
the diagnostic notation and a typed tree — entirely in your browser, so a passkey response or signed token
never leaves your device. (It decodes the structure; it doesn't verify signatures.)
