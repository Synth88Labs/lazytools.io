---
title: "KSeF in 2026/2027: How to Open and Read an FA(3) Invoice XML — No Software, Nothing Uploaded"
description: "Poland's KSeF makes the XML the legally binding invoice — mandatory for all VAT businesses since April 2026, with penalties from January 2027. What the FA(3) structure contains, how the clearance model works, and how to read or pre-check an FA(3) file in your browser."
pubDate: 2026-07-07
updatedDate: 2026-07-07
archetype: explainer
tools: ["/file/ksef-viewer/", "/file/ksef-validator/", "/file/e-invoice-viewer/", "/file/peppol-bis-viewer/"]
keywords:
  - ksef
  - fa(3) invoice
  - ksef xml viewer
  - open ksef invoice
  - faktura ustrukturyzowana
  - ksef 2026 deadlines
  - ksef penalties 2027
  - polish e-invoicing
heroImage: /blog/ksef-fa3-invoice-guide.png
heroAlt: "KSeF and the FA(3) invoice — Poland's e-invoicing clearance system explained"
faqs:
  - q: "What is KSeF?"
    a: "Krajowy System e-Faktur — Poland's national e-invoicing platform, operating on a clearance model: invoices are submitted as structured XML, validated by the system, and legally come into existence only when KSeF accepts them and assigns a KSeF number. The XML is the invoice; PDFs are visualisations."
  - q: "What are the KSeF deadlines?"
    a: "Issuing became mandatory for large taxpayers (over PLN 200M turnover) on 1 February 2026 and for all other VAT-registered businesses on 1 April 2026. Micro-entrepreneurs with low invoice volumes have until 1 January 2027. Receiving invoices through KSeF has been mandatory for everyone since February 2026."
  - q: "What happens from January 2027?"
    a: "The grace period ends. 2026 is penalty-free while businesses adapt; from 1 January 2027 sanctions for non-compliance become enforceable — up to 100% of the VAT amount shown on an invoice issued outside KSeF. Demand for getting this right grows into 2027; it doesn't fade."
  - q: "What is an FA(3) file?"
    a: "The current XML structure (struktura logiczna) that KSeF invoices must follow, mandatory since 1 February 2026 and replacing FA(2). Root element <Faktura>, with the header (Naglowek), seller (Podmiot1) and buyer (Podmiot2) with their NIPs, and the invoice body (Fa) holding dates, totals, VAT groups and FaWiersz line items."
  - q: "How do I read an FA(3) XML someone sent me?"
    a: "You don't need accounting software or a KSeF login just to read one: a browser-based viewer can parse the structure locally and display the parties, line items, VAT summary and payment details as a normal invoice — printable or saveable as PDF. Keep it local: the file contains counterparties, amounts and bank accounts."
  - q: "Can I validate an invoice before submitting it to KSeF?"
    a: "You can pre-check it: structure, required fields, date and currency formats, and the NIP mod-11 check digits that catch most tax-ID typos. That's an unofficial early-warning check — full XSD-schema and business-rule validation happens only inside KSeF, and only its acceptance has legal effect."
draft: false
---

**In Poland, an invoice is no longer a document you send — it's a record the state's system accepts.
Since 1 April 2026 every VAT-registered business issues invoices through KSeF as FA(3) XML, the XML
is the legally binding invoice, and from 1 January 2027 issuing outside the system carries penalties
of up to 100% of the invoice's VAT.** Reading one of these files, though, requires no software at
all: the [KSeF viewer](/file/ksef-viewer/) parses FA(3)/FA(2) XML into a normal, readable invoice —
entirely in your browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Clearance model:</strong> the invoice legally exists only once KSeF accepts it and assigns a KSeF number</li>
<li><strong>Deadlines:</strong> large taxpayers 1 Feb 2026 · all VAT businesses 1 Apr 2026 · micro-firms 1 Jan 2027</li>
<li><strong>Receiving is already universal</strong> — mandatory for everyone since February 2026</li>
<li><strong>2026 is the grace year;</strong> from Jan 2027, penalties reach 100% of the invoice's VAT</li>
<li><strong>FA(3) is readable without software</strong> — and pre-checkable (structure, fields, NIP checksums) locally</li>
</ul>
</aside>

## The model: clearance, not correspondence

Most countries' e-invoicing mandates (Germany's, France's) are about *format* — you must exchange
structured files. Poland went further: **KSeF is a clearance system**. The invoice is submitted to
the government platform as XML, validated against the FA(3) schema and business rules, and — only
if accepted — assigned a KSeF number, at which moment it legally exists. A rejected submission
isn't a late invoice; it's *no invoice*, per the
[European Commission's country profile](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108896/eInvoicing+in+Poland).

<figure>
<img src="/blog/infographic-ksef.svg" alt="Infographic: KSeF clearance flow — issue FA(3) XML, KSeF validates, acceptance assigns the KSeF number and the invoice legally exists; timeline of 1 February 2026 (large taxpayers issue, everyone receives), 1 April 2026 (all VAT businesses issue) and 1 January 2027 (micro-entrepreneurs join, penalties up to 100% of VAT); and the FA(3) anatomy with Naglowek, Podmiot1/Podmiot2 with NIP, Fa fields and FaWiersz line items" width="1200" height="640" loading="lazy" />
<figcaption>Clearance flow, deadlines, and what's inside the file.</figcaption>
</figure>

## The timeline — and why 2027 matters more than 2026

| Date | Obligation |
|---|---|
| **1 Feb 2026** | Large taxpayers (> PLN 200M turnover) must **issue** via KSeF; **everyone** must be able to **receive** |
| **1 Apr 2026** | **All** VAT-registered businesses must issue via KSeF |
| **1 Jan 2027** | Micro-entrepreneurs (small invoice volumes) join; **penalty grace period ends** |

The detail that changes behaviour: 2026 is deliberately penalty-free while the country adapts, per
the [implementation guides](https://www.vatupdate.com/2025/12/30/mandatory-e-invoicing-in-poland-ksef-a-complete-guide-to-2026-deadlines/).
From **January 2027**, sanctions become enforceable — up to **100% of the VAT amount** for invoices
issued outside the system. So KSeF competence isn't a passed deadline; it's a rising-stakes
requirement.

## Inside an FA(3) file

FA(3) is the third revision of Poland's *struktura logiczna* — the XML schema every KSeF invoice
follows, mandatory since February 2026 (per the
[Ministry of Finance's KSeF documentation](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/struktura-logiczna-fa-3/)).
The shape is stable and readable once decoded:

| Element | What it holds |
|---|---|
| `<Naglowek>` | Schema variant (FA(3)), creation timestamp, issuing system |
| `<Podmiot1>` | The seller — name, address, **NIP** |
| `<Podmiot2>` | The buyer — same structure |
| `<Fa>` | The invoice: `P_1` issue date, `P_2` number, `KodWaluty` currency, `P_15` total due, `P_13_*/P_14_*` net/VAT per rate group |
| `<FaWiersz>` (repeated) | Line items: `P_7` name, `P_8B` quantity, `P_9A` unit price, `P_11` net value, `P_12` VAT rate |

The cryptic `P_n` names come from the VAT regulation's field numbering — one reason raw FA(3) XML
is unreadable to humans and why a [viewer](/file/ksef-viewer/) that maps them back to "issue date,
line items, total due" is the practical bridge. The viewer auto-detects FA(3) vs the older FA(2)
and flags the difference.

## The NIP check digit — arithmetic before bureaucracy

Every Polish NIP's tenth digit is a checksum: multiply the first nine digits by the weights
6, 5, 7, 2, 3, 4, 5, 6, 7, sum, take modulo 11 — the result must equal the last digit. A mistyped
NIP therefore fails *arithmetic* before it fails *validation*, which is exactly the kind of error
worth catching on your own machine rather than as a KSeF rejection. The
[pre-checker](/file/ksef-validator/) runs that checksum on both parties, plus the structural
checks (required elements, date and currency formats, line items, totals consistency) — clearly
labelled as an **unofficial** early warning, because only KSeF's own acceptance has legal effect.

## Privacy: why local parsing is the whole point

An FA(3) file names your counterparties, itemizes what you sold them, and often carries a bank
account number. Pre-submission invoices are unfiled tax data. Both are precisely what should not
be pasted into a random "free online XML viewer" that processes uploads server-side. The LazyTools
[viewer](/file/ksef-viewer/) and [pre-checker](/file/ksef-validator/) parse everything with the
browser's own XML engine — they work offline, and nothing you load leaves your device.

## Elsewhere in Europe, same story

Poland is the sharpest deadline, not an outlier. **Belgium** has required structured B2B invoices
over the Peppol network since 1 January 2026 (penalties since April) — the
[Peppol BIS viewer](/file/peppol-bis-viewer/) reads those UBL files. **Germany** (XRechnung,
ZUGFeRD) and **France** (Factur-X, mandate from September 2026) are covered by the
[e-invoice viewer](/file/e-invoice-viewer/) and [Factur-X viewer](/file/facturx-viewer/). One
pattern across all of them: the XML is the invoice, and being able to *read* it locally is the
minimum literacy the mandates quietly assume.

## Quick summary

KSeF turned Polish invoicing into a clearance process: FA(3) XML in, validation, KSeF number out —
and only then does the invoice exist. All VAT-registered businesses have issued this way since
April 2026; micro-firms join by January 2027, when penalties (up to 100% of the invoice's VAT)
begin to bite. The XML structure is decodable — parties with checksummed NIPs, `P_n` fields,
`FaWiersz` lines — and both reading and pre-checking an FA(3) file are browser-local jobs: the
[KSeF viewer](/file/ksef-viewer/) renders it as a normal invoice, and the
[pre-checker](/file/ksef-validator/) catches the cheap mistakes before the system rejects them,
with your data never leaving your machine.

*Sources: [Ministry of Finance — KSeF FA(3) documentation](https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/struktura-logiczna-fa-3/) ·
[European Commission — eInvoicing in Poland](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108896/eInvoicing+in+Poland) ·
[VATupdate — KSeF 2026 deadlines guide](https://www.vatupdate.com/2025/12/30/mandatory-e-invoicing-in-poland-ksef-a-complete-guide-to-2026-deadlines/) ·
[EY — Belgium's mandatory e-invoicing from 1 January 2026](https://www.ey.com/en_gl/technical/tax-alerts/belgium-s-mandatory-e-invoicing-to-apply-from-1-january-2026)*
