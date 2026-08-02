---
title: "How to Read an X.509 SSL Certificate: Every Field Explained (PEM, DER and ASN.1)"
description: "An X.509 certificate looks like a wall of Base64, but it decodes into a handful of readable fields: subject, issuer, validity dates, public key and SAN domains. Here's what each one means and how to decode a PEM certificate in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/how-to-read-an-x509-ssl-certificate-guide.png
heroAlt: "A PEM certificate decoding through Base64 and DER into ASN.1 fields: subject, issuer, validity, public key and SAN"
tools: ["/security/certificate-decoder/"]
keywords:
  - how to read an x509 certificate
  - decode pem certificate
  - x509 certificate fields
  - subject alternative name
  - what is pem der asn1
  - ssl certificate decoder
faqs:
  - q: "What is the difference between PEM, DER and X.509?"
    a: "X.509 is the standard that defines what fields a certificate contains. DER is the binary encoding of those fields (a specific set of ASN.1 encoding rules). PEM is DER that has been Base64-encoded and wrapped in -----BEGIN CERTIFICATE----- / -----END CERTIFICATE----- lines so it can be pasted as text. So a PEM file is just a text-friendly envelope around the DER bytes of an X.509 certificate."
  - q: "How do I decode a PEM certificate?"
    a: "Paste the block between -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- into a decoder. It Base64-decodes the block to DER bytes, walks the ASN.1 structure, and shows the readable fields: subject, issuer, validity dates, public key and extensions like Subject Alternative Names. The LazyTools X.509 Certificate Decoder does this entirely in your browser."
  - q: "What are the most important fields in a certificate?"
    a: "Subject (who the certificate is for), Issuer (which CA signed it), the notBefore/notAfter validity window (when it's trusted), the public key (algorithm and size), and the Subject Alternative Name extension (the list of hostnames it's valid for). For a website certificate, the SAN list and the expiry date are usually what you're checking."
  - q: "Why does the browser use the SAN and not the Common Name?"
    a: "Historically the hostname went in the subject's Common Name (CN), but that was ambiguous and is now deprecated for host matching. Modern browsers only trust a certificate for a hostname if that exact name appears in the Subject Alternative Name (SAN) extension. A certificate with the right CN but a missing SAN entry will be rejected for that domain."
  - q: "Does decoding a certificate verify that it's trusted?"
    a: "No. Decoding shows you what a certificate says about itself. Verifying trust is separate: it means checking the issuer's signature, confirming the certificate chains to a trusted root CA, and checking it hasn't been revoked (via CRL or OCSP). Those steps need the issuer's public key and network access — decoding alone only reads the fields."
  - q: "Is it safe to paste a certificate into an online decoder?"
    a: "A public TLS certificate is sent in the clear during every connection, so it isn't secret — but a private key is, and you should never paste a key (the -----BEGIN PRIVATE KEY----- block) into any tool. For certificates you'd still rather keep local (internal or not-yet-deployed ones), use a decoder that runs in your browser, like this one, so nothing is uploaded."
draft: false
---

**An X.509 certificate looks like an intimidating wall of Base64, but underneath it's just a
structured record with a handful of readable fields** — who it's for, who signed it, when it expires,
what key it carries and which domains it covers. Here's how to read every field, and how to decode one
with the [X.509 Certificate Decoder](/security/certificate-decoder/).

## PEM, DER, ASN.1: three words for the same certificate

These three terms confuse everyone at first, but they're just layers of packaging:

- **X.509** — the *standard* that says a certificate has a subject, an issuer, validity dates, a key and
  extensions.
- **ASN.1** — the abstract way those fields are described (a `SEQUENCE` of values).
- **DER** — the *binary* encoding of that ASN.1 structure: the actual bytes.
- **PEM** — those DER bytes **Base64-encoded** and wrapped in `-----BEGIN CERTIFICATE-----` lines so you
  can copy-paste them as text.

Decoding is simply unwrapping those layers: strip the PEM header, Base64-decode to DER, then walk the
ASN.1 tree. That's exactly what a decoder does for you.

## The fields, one by one

Here's what you'll see when you decode a typical website certificate, and what each field is for:

| Field | What it tells you |
|---|---|
| **Subject** | Who the certificate identifies — for a site, the CN is a domain |
| **Issuer** | The CA that signed it (for a self-signed cert, same as Subject) |
| **Serial number** | A unique ID the issuer assigned to this certificate |
| **Validity (notBefore / notAfter)** | The UTC window during which it's trusted |
| **Public key** | The algorithm (RSA / EC) and size (e.g. 2048-bit, P-256) |
| **Signature algorithm** | How the issuer signed it, e.g. SHA-256 with RSA |
| **Subject Alternative Name** | The list of hostnames (and IPs) the cert is valid for |
| **Key usage / EKU** | What the key may be used for (e.g. TLS server authentication) |
| **Basic constraints** | Whether this is a CA certificate |

### Validity: the field people actually check

`notBefore` and `notAfter` bound when the certificate is valid. Most certificate "outages" are simply an
expired `notAfter` nobody was watching. A decoder compares those dates to now and tells you *valid*,
*not yet valid*, or *expired*, plus how many days remain — which is why running one on your production
certs before they lapse is worth the thirty seconds.

### Subject Alternative Name: why the CN no longer matters

You'll often see the domain in the Subject's **Common Name** — but browsers ignore it now. Host matching
is done **only** against the **Subject Alternative Name (SAN)** extension, which lists every hostname the
certificate covers:

```
X509v3 Subject Alternative Name:
    DNS:example.com, DNS:www.example.com
```

If you're debugging a "certificate is not valid for this domain" error, the SAN list is the first thing
to check — the name you're visiting has to be in it.

## Decode vs. verify — an important distinction

Reading a certificate is **not** the same as trusting it. A decoder shows you what the certificate
*claims*. **Verification** is a separate process:

1. Check the **signature** using the issuer's public key.
2. Build a **chain** from the certificate up to a trusted root CA.
3. Check **revocation** (CRL or OCSP) to be sure it wasn't cancelled early.

Those steps need the issuer's key and a network connection. A self-signed certificate, for instance,
decodes perfectly but chains to nothing — readable, but not trusted. Keep the two ideas separate.

## Decode a certificate privately

A public TLS certificate isn't secret — it's transmitted in plaintext on every connection — so decoding
one is low-risk. But never paste a **private key** (`-----BEGIN PRIVATE KEY-----`) into any online tool,
and for internal or pre-deployment certificates you may still prefer to keep everything local. The
[X.509 Certificate Decoder](/security/certificate-decoder/) parses the ASN.1/DER entirely in your
browser — paste the PEM block (or load a `.pem`/`.crt` file) and it never leaves your device.
