---
title: "PDF Accessibility After the EAA: What a Screen Reader Actually Needs From Your PDF"
description: "The European Accessibility Act has applied since June 2025, and PDFs inside e-commerce, banking and e-book services are in scope. What makes a PDF readable to assistive technology — tags, language, title, text layer, alt text — which checks a machine can run, and how to triage a document in your browser."
pubDate: 2026-07-08
updatedDate: 2026-07-08
archetype: explainer
tools: ["/pdf/accessibility-checker/"]
keywords:
  - pdf accessibility
  - pdf accessibility checker
  - tagged pdf
  - pdf ua
  - european accessibility act pdf
  - eaa compliance pdf
  - pdf alt text
  - screen reader pdf
heroImage: /blog/pdf-accessibility-guide.png
heroAlt: "PDF accessibility after the European Accessibility Act — what screen readers need"
faqs:
  - q: "Does the European Accessibility Act really cover PDFs?"
    a: "Indirectly but effectively, yes. The EAA (applying since 28 June 2025) covers services — e-commerce, consumer banking, e-books, transport — and documents that form part of those services, like statements, invoices, tickets and manuals, inherit the accessibility requirement. Some arrangements have transition periods running to 2030. Public-sector documents were already covered by the Web Accessibility Directive."
  - q: "What is a tagged PDF?"
    a: "A PDF with an internal structure tree that labels content as headings, paragraphs, lists, tables and figures, in reading order. Tags are what a screen reader navigates — an untagged PDF forces assistive technology to guess structure from visual layout, which fails for anything non-trivial."
  - q: "What are the most common PDF accessibility failures?"
    a: "In rough order of frequency: not tagged at all; scanned image-only pages with no text layer; missing document language; missing or filename-like titles; images without alt text; and content tagged as plain paragraphs with no headings. All six are machine-detectable in seconds."
  - q: "What is PDF/UA and the Matterhorn Protocol?"
    a: "PDF/UA (ISO 14289) is the ISO standard for universally accessible PDF. The Matterhorn Protocol is its testing model — 31 checkpoints broken into failure conditions, some machine-checkable and some requiring human judgment. That split is why no automated tool can 'certify' a PDF alone."
  - q: "Can a browser really check PDF accessibility without uploading the file?"
    a: "The machine-checkable foundations, yes — a browser PDF engine can read the tagged flag, language, title, text layer, structure tags and alt text entirely locally. Judgment checks (reading order logic, alt-text quality, table semantics) still need a human, and certification-grade validation needs dedicated tools like PAC."
  - q: "My PDF fails the checks — where do I fix it?"
    a: "At the source, not in the PDF: re-export from Word/LibreOffice/InDesign with accessibility options enabled (they generate tags, headings and alt text from the document's own structure). For scans, run OCR first. Retrofitting tags by hand in a PDF editor is the slow last resort."
draft: false
---

**A PDF is accessible when a screen reader can actually read it — and whether it can is mostly
determined by six machine-checkable foundations: tags, language, title, a real text layer, alt
text, and headings.** Since 28 June 2025 the European Accessibility Act has made this a legal
question for documents inside e-commerce, banking, e-book and transport services, not just a
courtesy. Triage any document in seconds with the
[PDF accessibility checker](/pdf/accessibility-checker/) — analysed locally in your browser,
nothing uploaded.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>EAA applies since 28 June 2025</strong> — documents inside covered services are in scope; transitions run to 2030</li>
<li><strong>Tags are the foundation</strong> — an untagged PDF has no structure a screen reader can trust</li>
<li><strong>Six failures dominate:</strong> untagged, scanned-only, no language, no title, no alt text, no headings — all machine-detectable</li>
<li><strong>Machine checks are triage, not certification</strong> — reading order, alt-text quality and tables need human judgment</li>
<li><strong>Fix at the source:</strong> re-export with accessibility on beats retrofitting tags by hand</li>
</ul>
</aside>

## Why this stopped being optional

Accessibility law in Europe used to stop at the public sector (the Web Accessibility Directive).
The **European Accessibility Act** changed the perimeter: since
[28 June 2025](https://accessible-eu-centre.ec.europa.eu/content-corner/news/eaa-comes-effect-june-2025-are-you-ready-2025-01-31_en)
it covers private-sector *services* — e-commerce, consumer banking, e-books, passenger transport —
and the documents those services produce. A bank statement, an online-shop invoice, an e-book, a
ticket confirmation: if the service is in scope, its PDFs effectively are too, with some
transition arrangements running to 2030.

Which raises the practical question this guide answers: *what does "accessible" mean for a PDF,
concretely, and how do you check?*

## What a screen reader actually needs

<figure>
<img src="/blog/infographic-pdf-accessibility.svg" alt="Infographic: six foundations of an accessible PDF — tags for structure, a language declaration, a real title with DisplayDocTitle, a genuine text layer rather than a scan, alt text on figures, and headings plus bookmarks for navigation; machine-checkable foundations can be automated while judgment checks like reading order and alt-text quality need a human; the European Accessibility Act applies since 28 June 2025 with transitions to 2030" width="1200" height="640" loading="lazy" />
<figcaption>Six foundations — and the machine/human split that decides what a tool can check.</figcaption>
</figure>

**Tags** are the big one. A tagged PDF carries a structure tree labelling every piece of content —
heading, paragraph, list, table, figure — in reading order. That tree *is* what assistive
technology navigates. Untagged, a screen reader has to reverse-engineer meaning from coordinates
on the page; anything beyond a simple linear letter comes out scrambled.

**Language** (`/Lang` in the document catalog) tells the screen reader which voice and
pronunciation rules to load — a German document read with English phonetics is technically
"spoken" and practically useless. **Title** metadata (plus the `DisplayDocTitle` preference)
replaces `final_v3_FINAL.pdf` in what gets announced. **A real text layer** separates a document
from a photograph of one: scanned pages are silent until OCR. **Alt text** on figures is the most
commonly missed item in otherwise-tagged documents. **Headings and bookmarks** are how non-visual
readers skim — a 40-page report with no H1–H6 tags is a wall of undifferentiated prose.

## The machine/human split

The PDF accessibility standard — **PDF/UA** (ISO 14289), tested via the
[Matterhorn Protocol](https://pdfa.org/resource/the-matterhorn-protocol-1-1/)'s 31 checkpoints —
divides cleanly into conditions software can verify and conditions requiring judgment:

| Machine-checkable (automate) | Judgment (human review) |
|---|---|
| Is the document tagged? | Is the reading order *logical*? |
| Language declared? | Is the alt text *meaningful*? |
| Title present + displayed? | Are tables semantically correct? |
| Text layer or scan? | Are decorative images correctly ignored? |
| Alt text present on figures? | Do headings reflect real hierarchy? |

The left column is triage — fast, deterministic, and catches the majority of real-world failures.
The [browser checker](/pdf/accessibility-checker/) runs exactly that column, locally: pdf.js reads
the tagged flag, catalog entries, text content and structure tree without the document ever
leaving your machine. The right column is why "this tool certifies your PDF" claims should make
you suspicious — no automated tool can.

## Why check in a browser at all?

The established tooling has awkward gaps: **PAC**, the de-facto standard checker, is
[Windows-only](https://pac.pdf-accessibility.org/en) (Mac users on Adobe's forums have been
[asking for years](https://acrobat.uservoice.com/forums/590923-acrobat-for-windows-and-mac/suggestions/40593796));
commercial checkers are desktop installs; and the web-based options upload your document to a
server to analyse it. The documents that need accessibility checks — bank statements, contracts,
internal reports — are usually the ones that shouldn't be uploaded anywhere. A browser-local
checker covers the triage column on any OS, offline, with the file staying in memory on your
device.

## Fixing what the checks find

The efficient fix is almost always **upstream, at the source document**:

1. **Untagged / no headings / no alt text:** re-export from the authoring tool with accessibility
   enabled — Word, LibreOffice and InDesign all generate tags, heading structure and alt text
   from the document's own styles. Retrofit-tagging in a PDF editor is the slow path.
2. **Scanned pages:** OCR first (many scanners and PDF tools include it), then tag.
3. **No language / no title:** two fields in the export dialog or document properties — the
   cheapest wins available.
4. **Then re-check**, and for certification-grade conformance, finish with PAC plus a human pass
   over reading order, alt-text quality and tables.

## Quick summary

The EAA moved PDF accessibility from good practice to legal requirement for documents inside
covered services, and the failures that matter most are boring and detectable: no tags, no text
layer, no language, no title, no alt text, no headings. A browser can verify all of those locally
in seconds — the [PDF accessibility checker](/pdf/accessibility-checker/) does exactly that, with
honest scope (triage, not certification) and zero upload. Fix findings at the source document,
re-check, and reserve the heavy tooling and human review for the judgment calls no machine can
make.

*Sources: [AccessibleEU — EAA in effect June 2025](https://accessible-eu-centre.ec.europa.eu/content-corner/news/eaa-comes-effect-june-2025-are-you-ready-2025-01-31_en) ·
[PDF Association — Matterhorn Protocol](https://pdfa.org/resource/the-matterhorn-protocol-1-1/) ·
[PAC — PDF Accessibility Checker](https://pac.pdf-accessibility.org/en) ·
[ISO 14289 (PDF/UA)](https://www.iso.org/standard/64599.html)*
