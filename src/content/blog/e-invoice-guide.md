---
title: "Received an Invoice as an XML File? XRechnung and ZUGFeRD Explained"
description: "Germany's B2B e-invoicing mandate means invoices now arrive as XRechnung XML or ZUGFeRD hybrid PDFs. What the formats are, why you're getting them, the 2025–2028 timeline, and how to actually read one."
pubDate: 2026-07-06
updatedDate: 2026-07-06
archetype: explainer
tools: ["/file/e-invoice-viewer/", "/file/json-formatter/", "/file/xml-to-json/"]
keywords:
  - xrechnung
  - zugferd
  - what is an e-invoice
  - open xml invoice
  - e-invoice germany
  - factur-x
  - read xrechnung file
  - en 16931
heroImage: /blog/e-invoice-guide.png
heroAlt: "XRechnung and ZUGFeRD explained — how to read the XML e-invoices Germany's mandate requires"
faqs:
  - q: "Why did I receive an invoice as an XML file?"
    a: "Germany's Growth Opportunities Act makes structured e-invoices the B2B norm. Since 1 January 2025 every domestic business must be able to receive them, and issuing becomes mandatory in phases (2027 for larger firms, 2028 for all). The XML is the legally authoritative invoice — a viewer makes it human-readable."
  - q: "What's the difference between XRechnung and ZUGFeRD?"
    a: "Both implement the European standard EN 16931. XRechnung is Germany's pure-XML profile — a structured file with no visual layer, required for invoicing public authorities. ZUGFeRD (called Factur-X in France) is a hybrid: a normal-looking PDF with the same structured XML embedded inside, so humans and software both read it."
  - q: "My ZUGFeRD PDF opens normally — why would I need a viewer?"
    a: "The PDF page is a human-friendly rendering, but the embedded XML is the authoritative data your accounting software processes. If the two ever disagree, the XML governs — so it's worth seeing exactly what the XML says, which the visual PDF doesn't show you directly."
  - q: "Is it safe to open an e-invoice in an online viewer?"
    a: "Only a client-side one. An invoice names your clients or suppliers, itemized prices, VAT IDs and bank details — sensitive commercial data. Many online viewers are lead-generation for accounting software and upload your file. A browser-based viewer parses it on your device with nothing transmitted."
  - q: "What are UBL and CII?"
    a: "The two XML syntaxes EN 16931 allows. UBL (Universal Business Language) and UN/CEFACT CII (Cross Industry Invoice) express the same invoice data with different tag structures. XRechnung supports both; ZUGFeRD uses CII. A good viewer reads either without you needing to know which you have."
  - q: "Does the mandate apply to small businesses and freelancers?"
    a: "The receiving obligation (since January 2025) applies to all domestic B2B businesses regardless of size — including freelancers and small firms. The issuing obligation phases in later, but you may already receive e-invoices you need to read and archive today."
  - q: "Is a PDF invoice the same as an e-invoice now?"
    a: "No — and this is the key change. A plain PDF (even a nicely formatted one) is just an image of an invoice; it isn't a structured e-invoice under EN 16931. A compliant e-invoice must carry machine-readable structured data, which is why XRechnung XML and ZUGFeRD's embedded XML exist."
draft: false
---

**If a supplier sent you an invoice as an `.xml` file or a PDF that your accounting software treats
differently than a normal one, you've met Germany's e-invoicing mandate: since January 2025 every
B2B business must be able to receive structured e-invoices, and formats like XRechnung and ZUGFeRD
are how they arrive.** The [e-invoice viewer](/file/e-invoice-viewer/) turns that XML into a
readable summary — on your device, because an invoice is confidential commercial data.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>A real e-invoice is structured data</strong> (XML), not a PDF image of an invoice</li>
<li><strong>XRechnung = pure XML</strong> · <strong>ZUGFeRD/Factur-X = PDF with XML embedded inside</strong></li>
<li><strong>Both follow EN 16931</strong>, the European e-invoice standard, in one of two syntaxes (UBL or CII)</li>
<li><strong>Germany timeline:</strong> receive since Jan 2025 (all businesses) · issue 2027 (larger) → 2028 (all)</li>
<li><strong>Read them locally</strong> — invoices carry clients, prices, VAT IDs and bank details</li>
</ul>
</aside>

## Why invoices suddenly look different

For decades a "digital invoice" meant a PDF — essentially a picture of a paper invoice. A human
reads it easily; software has to guess where the numbers are. The European Union decided that isn't
good enough for automated processing, and defined **EN 16931**, a standard for invoices as
**structured data**: every field — seller, VAT ID, each line item, the tax breakdown, the amount
due — tagged in machine-readable XML.

Germany implemented this through the **Growth Opportunities Act**
([*Wachstumschancengesetz*](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany)),
and the timeline is why you're encountering it now:

| Date | Obligation | Who |
|---|---|---|
| **1 Jan 2025** | Must be able to **receive** EN 16931 e-invoices | All domestic B2B businesses — including freelancers |
| **1 Jan 2027** | Must **issue** e-invoices | Businesses with prior-year turnover over €800,000 |
| **1 Jan 2028** | Must **issue** e-invoices | All remaining domestic B2B businesses |

The receiving obligation is the one that catches people: since the start of 2025, a supplier can
send you a structured e-invoice and you're expected to accept and archive it — even if you're a
one-person business that has never issued one. Similar mandates are rolling out across other EU
countries, so this isn't only a German concern.

## XRechnung vs ZUGFeRD vs Factur-X

All three implement the same EN 16931 standard; they differ in packaging:

- **XRechnung** — Germany's **pure-XML** profile. There's no picture, just the structured file. It's
  the required format for invoicing German public authorities, and common in B2B too. Opening it in
  a text editor shows a wall of XML tags.
- **ZUGFeRD** — a **hybrid**: an ordinary-looking PDF you can open and read like any invoice, with
  the EN 16931 XML **embedded inside the PDF file**. Humans read the PDF layer; software reads the
  embedded XML. Best of both.
- **Factur-X** — the French name for the same hybrid format; ZUGFeRD 2.x and Factur-X are technically
  aligned, so a tool that reads one reads the other.

Under the hood, EN 16931 allows two XML **syntaxes** — **UBL** (Universal Business Language) and
**UN/CEFACT CII** (Cross Industry Invoice). They encode the same information with different tag
names. XRechnung permits both; ZUGFeRD uses CII. You generally don't need to care which you have —
a viewer that handles both just shows you the invoice.

<figure>
<img src="/blog/infographic-einvoice.svg" alt="Infographic: three e-invoice formats — XRechnung as pure XML, ZUGFeRD and Factur-X as a PDF with XML embedded inside, all implementing the EN 16931 standard in either UBL or CII syntax; a timeline shows Germany's mandate with receiving required since January 2025 for all businesses, issuing from 2027 for firms over 800000 euro turnover and all businesses by 2028" width="1200" height="640" loading="lazy" />
<figcaption>Same standard, three packagings — and the mandate timeline driving them.</figcaption>
</figure>

## The trap: a PDF is no longer "an invoice"

The conceptual shift that trips people up: **a plain PDF is not a compliant e-invoice**, no matter
how professional it looks. Under EN 16931 an e-invoice must carry structured, machine-readable data.
A PDF image of an invoice has none — which is exactly why ZUGFeRD embeds XML *inside* the PDF, and
why XRechnung dispenses with the visual layer altogether.

For a ZUGFeRD file this has a practical consequence: the pretty PDF page and the embedded XML are
supposed to match, but **the XML is the authoritative version**. If a supplier's system rendered the
PDF from stale data, or the two diverge for any reason, your accounting software processes the XML —
so it's worth actually seeing what the XML says, not just trusting the picture.

## Reading one without uploading it

An invoice is about as sensitive as routine business documents get: it names your clients or
suppliers, lists itemized prices (your margins), and often includes VAT identification and **bank
account (IBAN) details**. Many "free XRechnung viewer" sites are lead-generation for ERP and
accounting suites, and they want you to upload the file.

The [e-invoice viewer](/file/e-invoice-viewer/) reads it in your browser instead:

1. Choose the file — XRechnung `.xml`, or a ZUGFeRD/Factur-X `.pdf` (the embedded XML is extracted
   automatically).
2. It parses the structure — UBL or CII — with your browser's own XML engine.
3. You get a clean summary: invoice number, parties, dates, line items, VAT breakdown, totals and
   payment details.

Nothing is transmitted; it works offline. For the raw structure, the
[XML to JSON converter](/file/xml-to-json/) and [JSON formatter](/file/json-formatter/) — also
local — let you inspect the underlying data directly.

One boundary worth stating: a viewer *displays* the invoice faithfully but doesn't run formal
**EN 16931 / XRechnung validation** (the compliance rules an authority checks before accepting a
submission). For "what does this invoice say," use the viewer; for "is this invoice formally
compliant before I submit it," use an official validator.

## Common e-invoice mistakes

1. **Treating a received XML as junk** — it's the legally authoritative invoice; you're obliged to
   accept and archive it.
2. **Assuming a nice PDF is a compliant e-invoice** — without embedded structured data it isn't,
   under EN 16931.
3. **Trusting the ZUGFeRD PDF layer over its XML** — in a conflict, the embedded XML governs.
4. **Uploading invoices to read them** — client names, prices and IBANs are exactly what to keep
   off unknown servers.
5. **Confusing viewing with validating** — a viewer shows content; formal compliance needs an
   official validator.

## Quick summary

Germany's mandate makes structured e-invoices the B2B norm — receive since January 2025, issue from
2027–2028 — so invoices now arrive as **XRechnung** (pure XML) or **ZUGFeRD/Factur-X** (PDF with XML
embedded), both implementing **EN 16931** in UBL or CII syntax. A compliant e-invoice is structured
data, not a PDF picture, and for ZUGFeRD the embedded XML is authoritative. Read either in the
[e-invoice viewer](/file/e-invoice-viewer/) — locally, because an invoice's clients, prices and bank
details shouldn't be uploaded to a stranger.

*Related tools: [XML to JSON](/file/xml-to-json/) · [JSON formatter](/file/json-formatter/) ·
[CSV to JSON](/file/csv-to-json/). Germany's rules are documented by the
[European Commission's eInvoicing pages](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany).*
