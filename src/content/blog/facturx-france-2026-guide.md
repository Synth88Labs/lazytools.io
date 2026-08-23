---
title: "France's 2026 E-Invoicing Mandate: How to Open a Factur-X Invoice Without Accounting Software"
description: "From 1 September 2026, every French company must be able to receive electronic invoices — most arriving as Factur-X hybrid PDFs. What the mandate requires, how a Factur-X file is structured, what the five profiles mean, and how to read one privately in your browser."
pubDate: 2026-07-07
updatedDate: 2026-07-07
archetype: explainer
tools: ["/file/facturx-viewer/", "/file/e-invoice-viewer/"]
keywords:
  - facture électronique 2026
  - factur-x
  - factur-x viewer
  - french e-invoicing mandate
  - open factur-x invoice
  - facture électronique obligatoire
  - factur-x profiles
  - e-invoicing france september 2026
heroImage: /blog/facturx-france-2026-guide.png
heroAlt: "Factur-X and France's September 2026 e-invoicing mandate — the hybrid PDF invoice explained"
faqs:
  - q: "What exactly becomes mandatory in France on 1 September 2026?"
    a: "Two things: every French company, regardless of size, must be able to receive electronic invoices for domestic B2B transactions; and large plus mid-size companies (grandes entreprises and ETI) must issue them. Small and micro-enterprises get one more year — their issuing obligation starts 1 September 2027."
  - q: "What is a Factur-X invoice?"
    a: "A hybrid e-invoice: a normal-looking PDF (technically PDF/A-3) with the structured invoice data embedded inside as an XML attachment in UN/CEFACT CII syntax. It was developed jointly by France's FNFE-MPE and Germany's FeRD — in Germany the identical standard is called ZUGFeRD. Legally, the XML is the invoice; the PDF is a human-readable courtesy."
  - q: "Do I need to buy accounting software to comply with the receive obligation?"
    a: "You need to be connected to a certified platform (plateforme agréée) to receive invoices through the official circuit — many offer free or low-cost receive-only tiers. Reading an invoice you've received requires no special software at all: a browser-based viewer can extract and display the embedded XML."
  - q: "What are the Factur-X profiles and why do they matter?"
    a: "Five levels of structured detail: MINIMUM and BASIC WL carry only header data (no line items — not complete EN 16931 invoices), BASIC carries a full invoice with lines, EN 16931 covers the complete European semantic standard, and EXTENDED adds Franco-German business fields. The profile is declared in the XML's guideline URN; a viewer that shows it tells you instantly how much of the invoice is actually machine-readable."
  - q: "I received a PDF invoice — how do I know if it's Factur-X?"
    a: "You can't tell by looking; the PDF layer is deliberately ordinary. Load it into a viewer that checks for embedded files: if there's an XML attachment (typically factur-x.xml), it's a hybrid invoice and the viewer will show the structured data. If there's no attachment, it's just a regular PDF."
  - q: "Is it safe to upload invoices to online viewers?"
    a: "An invoice names your suppliers and clients, amounts, VAT numbers and bank details (IBAN) — data worth protecting. Prefer a viewer that parses the file locally in your browser rather than uploading it to a server; the LazyTools viewer works that way and runs offline."
draft: false
---

**From 1 September 2026, every company in France — down to the smallest auto-entrepreneur — must be
able to receive electronic invoices, and most will arrive as Factur-X: a PDF that looks ordinary but
carries the real, legally authoritative invoice as XML embedded inside.** You don't need an ERP to
read one: the [Factur-X viewer](/file/facturx-viewer/) extracts and displays that XML — profile,
parties, VAT breakdown, line items, IBAN — entirely in your browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>1 Sept 2026:</strong> all French companies must <em>receive</em> e-invoices; large & mid-size must <em>issue</em></li>
<li><strong>1 Sept 2027:</strong> SMEs and micro-enterprises must issue too</li>
<li><strong>Factur-X = PDF + embedded XML</strong> — and the XML is the legal invoice</li>
<li><strong>Five profiles</strong> (MINIMUM → EXTENDED) decide how much data the XML carries — MINIMUM has no line items</li>
<li><strong>Reading one needs no software:</strong> a local, in-browser viewer shows everything — nothing uploaded</li>
</ul>
</aside>

## What the reform actually requires, and when

France's e-invoicing reform (*facturation électronique*) covers domestic B2B transactions between
VAT-registered French businesses. The
[official timeline](https://entreprendre.service-public.gouv.fr/actualites/A15683?lang=en) has two
dates that matter:

| Date | Who | Obligation |
|---|---|---|
| **1 September 2026** | **All companies**, every size | Must be able to **receive** e-invoices |
| 1 September 2026 | Large companies & ETI (mid-size) | Must **issue** e-invoices |
| **1 September 2027** | SMEs & micro-enterprises | Must **issue** e-invoices |

The receive obligation is the one that catches people: it applies to everyone on day one. Invoices
flow through certified platforms (*plateformes agréées*, the operators previously described as PDP),
not by email attachment — and the accepted structured formats are the EN 16931 trio:
**Factur-X, UBL and CII**, per the
[EU Commission's country profile](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108885/eInvoicing+in+France).
Factur-X, the format designed in France, is the one most small businesses will actually see.

Alongside the invoice flow, the reform introduces **e-reporting**: businesses transmit certain
transaction and payment data (for B2C sales and cross-border B2B, which fall outside the domestic
e-invoicing circuit) to the tax administration. E-invoicing and e-reporting are two halves of the
same anti-fraud programme — the underlying goal is to give the *Direction générale des Finances
publiques* a structured, near-real-time view of VAT. That is why the **structured data**, not the
printed page, is what the whole system is built on.

### The three accepted syntaxes

All three permitted formats express the same EN 16931 semantic model; they differ only in how the
data is serialised and packaged. Understanding which is which helps when a supplier sends something
that does not look like the Factur-X PDF you expected:

| Format | Underlying syntax | Human-readable layer? | Where you'll meet it |
|---|---|---|---|
| **Factur-X** | UN/CEFACT CII (XML) | Yes — embedded in a PDF/A-3 | Default for French SMEs; identical to German ZUGFeRD 2.x |
| **UBL** | OASIS UBL 2.1 (XML) | No — pure XML | Common via Peppol and in public-sector Chorus Pro flows |
| **CII** | UN/CEFACT CII (XML) | No — pure XML | The same syntax as Factur-X, but without the PDF wrapper |

Factur-X is the only one of the three that carries its own human-readable rendering, which is
exactly why it dominates among smaller firms: you can forward it, print it, or archive it like an
ordinary PDF, and the machine-readable invoice rides along inside.

## Anatomy of a Factur-X file: one PDF, two invoices

Factur-X was developed jointly by France's [FNFE-MPE](https://fnfe-mpe.org/factur-x/) and Germany's
FeRD (where the identical standard is named **ZUGFeRD 2.x**). The trick: a PDF/A-3 document —
readable by any PDF viewer, archivable for the legal retention period — with the full invoice
embedded inside as a structured XML attachment (typically named `factur-x.xml`) in UN/CEFACT
Cross-Industry Invoice syntax.

<figure>
<img src="/blog/infographic-facturx.svg" alt="Infographic: a Factur-X file is one PDF with two layers — the human-readable PDF image and the embedded machine-readable XML, which is the legally authoritative invoice; the French mandate timeline shows 1 September 2026 (all companies receive, large and mid-size issue) and 1 September 2027 (SMEs issue); five profiles range from MINIMUM (header only) to EXTENDED (full Franco-German detail)" width="1200" height="640" loading="lazy" />
<figcaption>The PDF is what you see; the XML is what counts.</figcaption>
</figure>

The legal hierarchy is the part worth internalizing: **the structured XML is the authoritative
invoice**. If the PDF image says one amount and the XML another, the XML governs — your accounting
software processes it, the tax administration's e-reporting is built on it, and disputes resolve
against it. Checking what the XML actually says, rather than trusting the picture, is precisely
what a viewer is for.

## The five profiles — and the trap in the small ones

Every Factur-X XML declares a **profile** in its guideline URN, fixing how much structured data it
carries:

| Profile | Line items? | What it's for |
|---|---|---|
| MINIMUM | ✗ | Header data only — parties, totals, VAT. Not a complete EN 16931 invoice |
| BASIC WL | ✗ | Header + totals "without lines" |
| BASIC | ✓ | Complete invoice with line items |
| EN 16931 (Comfort) | ✓ | The full European semantic standard |
| EXTENDED | ✓ | EN 16931 plus additional Franco-German business fields |

The trap: a MINIMUM-profile invoice looks complete on paper — the PDF layer shows every line — but
its machine-readable half contains only headline figures. If your workflow (or your accountant's)
consumes the XML, the line detail simply isn't there. The
[Factur-X viewer](/file/facturx-viewer/) reads the guideline URN, names the profile, and flags
MINIMUM/BASIC WL files explicitly, so you know what you actually received.

The profile isn't a label you have to trust blindly — it is written into the XML as a *guideline
identifier* (the `GuidelineSpecifiedDocumentContextParameter` element in CII). Each profile has its
own distinctive URN, so a viewer can read it directly rather than inferring the profile from the
data present:

| Profile | Guideline URN (identifier) fragment |
|---|---|
| MINIMUM | `…factur-x.eu:1p0:minimum` |
| BASIC WL | `…factur-x.eu:1p0:basicwl` |
| BASIC | `…en16931:2017#compliant#…factur-x.eu:1p0:basic` |
| EN 16931 (Comfort) | `urn:cen.eu:en16931:2017` |
| EXTENDED | `…en16931:2017#conformant#…factur-x.eu:1p0:extended` |

Notice that only BASIC and above reference `en16931:2017` — MINIMUM and BASIC WL sit *below* the
European norm and are, strictly, not complete EN 16931 invoices. That is the single most useful
thing a viewer tells you at a glance.

### A worked example

Say a supplier sends you a PDF that renders as a normal invoice for €1,200 plus €240 VAT. Opened in
a viewer, its embedded XML might begin like this (abridged CII):

```xml
<rsm:ExchangedDocumentContext>
  <ram:GuidelineSpecifiedDocumentContextParameter>
    <ram:ID>urn:factur-x.eu:1p0:minimum</ram:ID>
  </ram:GuidelineSpecifiedDocumentContextParameter>
</rsm:ExchangedDocumentContext>
```

The `minimum` URN is the tell: this file carries the seller, buyer, invoice number, date, the VAT
total and the grand total — but **no `IncludedSupplyChainTradeLineItem` elements at all**. The four
line items you can see printed on the PDF exist only as pixels. If your bookkeeping imports the XML,
you would need to key those lines in by hand, or ask the supplier to re-issue at BASIC or above. A
viewer that names the profile up front turns that from a nasty month-end surprise into a two-second
check on receipt.

## Reading one without accounting software

The receive obligation doesn't come with a software obligation. To read a Factur-X invoice you
need exactly one capability: extracting the XML attachment from the PDF and rendering it legibly.
That runs fine in a browser:

1. Open the [Factur-X viewer](/file/facturx-viewer/) (works offline once loaded).
2. Drop in the PDF — or a bare XML if that's what you received.
3. Read the result: profile, seller and buyer with VAT identifiers, dates, line items, VAT
   breakdown by rate, totals, IBAN and payment reference.

One deliberate design point: **the invoice never leaves your machine.** The parsing happens in
your browser's own XML engine. That matters because an invoice is a bundle of confidential data —
who your suppliers are, what you pay them, your bank coordinates — and most "free online invoice
viewers" are lead-generation funnels for ERP suites that log every upload. Local parsing makes the
privacy question moot. (The same viewer reads German XRechnung and ZUGFeRD files, and Peppol BIS
invoices — the [general e-invoice viewer](/file/e-invoice-viewer/) is the same engine with a
Germany-focused guide.)

## The same file works across the border

Because Factur-X and Germany's ZUGFeRD 2.x are the *identical* technical standard under two names,
a Factur-X invoice is already a valid German e-invoice and vice versa — a genuine convenience for
firms trading between the two countries. Germany's own B2B mandate is phasing in on a parallel
track: since 1 January 2025 every German business has had to be able to **receive** structured
e-invoices, with issuing obligations following in stages through 2027–2028. The formats overlap
almost completely:

| File type | Country of origin | Structure | Read by the same viewer? |
|---|---|---|---|
| Factur-X | France | PDF/A-3 + CII XML | Yes |
| ZUGFeRD 2.x | Germany | PDF/A-3 + CII XML (same spec) | Yes |
| XRechnung | Germany (public sector) | Pure CII or UBL XML | Yes |
| Peppol BIS Billing 3.0 | EU (Peppol network) | UBL XML | Yes |

The practical upshot: one local viewer that understands the shared EN 16931 model handles almost
everything you are likely to receive, whichever side of the Rhine it came from. The
[general e-invoice viewer](/file/e-invoice-viewer/) is the same parsing engine as the Factur-X tool,
with a Germany-oriented guide for XRechnung and ZUGFeRD files.

## What to do before September

- **Every business:** make sure you're connected to a certified platform for receiving — many offer
  free receive-only tiers. Check that whoever does your bookkeeping can consume structured
  invoices, not just PDFs.
- **Large & mid-size companies:** your issuing obligation lands the same day; that's an ERP/billing
  project with lead time, not a September task.
- **Everyone who receives a "weird PDF" from a supplier already:** it's probably Factur-X ahead of
  schedule. Load it in the [viewer](/file/facturx-viewer/) and see what the XML says — you may find
  your suppliers switched months before the deadline.

## Quick summary

France's mandate makes e-invoice reception universal on 1 September 2026, with issuing phased
through 2027, and Factur-X — a PDF with the legal invoice embedded as XML — is the format built for
the transition. The XML outranks the PDF image, the profile determines how much data it carries
(beware MINIMUM), and reading one requires no accounting software: the
[Factur-X viewer](/file/facturx-viewer/) extracts, identifies and displays everything locally, so
your suppliers' names, amounts and IBANs stay on your machine.

*Sources: [service-public.gouv.fr — generalization of e-invoicing](https://entreprendre.service-public.gouv.fr/actualites/A15683?lang=en) ·
[EU Commission — eInvoicing in France](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108885/eInvoicing+in+France) ·
[FNFE-MPE — Factur-X standard](https://fnfe-mpe.org/factur-x/)*
