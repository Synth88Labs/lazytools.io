/** PDF tools registry. */

export interface PdfToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'merge' | 'split' | 'images-to-pdf' | 'rotate' | 'unlock' | 'protect' | 'accessibility' | 'redact' | 'redact-check' | 'to-images';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const PDF_TOOLS: PdfToolDef[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDF Files',
    icon: '🧷',
    description:
      'Combine multiple PDFs into one file, in the order you choose — merged entirely in your browser, so contracts and records are never uploaded.',
    lead: 'Combine PDFs into a single file, in your order — locally, which matters, because the documents people merge are contracts, IDs and medical records.',
    widget: 'merge',
    how: 'Each source PDF is parsed in browser memory and its pages are copied, in your chosen order, into a fresh document that you download. Every file you add shows a live first-page thumbnail and its page count, so you can see at a glance what you\'re combining and in what order before you merge. This is a structural operation — pages are transplanted intact, so text stays selectable, links keep working and quality is untouched, because nothing is rasterized or re-compressed.',
    note: 'Why local processing is the whole point here: PDF merging is the classic "free online tool" that receives people\'s leases, tax forms, passports and signed contracts onto someone else\'s server. Here the files stay in your browser\'s memory — disconnect from the internet and the merge works identically.',
    faqs: [
      { q: 'Does merging reduce quality?', a: 'No — pages are copied structurally, not re-rendered. Text remains selectable and sharp at any zoom, images keep their original compression, and internal links continue to work.' },
      { q: 'How do I control the page order?', a: 'Files are merged in list order, and you can move each file up or down before merging. Pages within each file keep their original sequence.' },
      { q: 'Is there a file count or size limit?', a: 'No fixed limit — the constraint is your device\'s memory, since everything happens locally. Dozens of files and hundreds of pages are routine; multi-hundred-megabyte scans depend on your machine.' },
      { q: 'Can I merge password-protected PDFs?', a: 'Encrypted PDFs can\'t be read without their password, so they fail to load. Remove the protection in your PDF viewer first (open with password → save a copy), then merge.' },
      { q: 'Are my PDFs uploaded?', a: 'No — parsing and merging run in your browser via the pdf-lib library. The files never leave your device; the tool works with networking disabled.' },
    ],
    keywords: ['merge pdf', 'combine pdf files', 'merge pdf without uploading', 'join pdf files', 'pdf merger online free'],
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF / Extract Pages',
    icon: '✂️',
    description:
      'Extract a page range from a PDF into a new file — pages 5–12 of a 200-page report in seconds, processed locally with nothing uploaded.',
    lead: 'Pull exactly the pages you need — "5 to 12", "3", "1-4" — into a new PDF, without the document ever leaving your browser.',
    widget: 'split',
    how: 'The PDF is parsed in browser memory and every page renders as a live thumbnail — click pages to select or deselect them visually, or type a range (single pages like 7, spans like 3-9, combinations like 1-4, 7, 12-15); the preview and the range field stay in sync both ways. The selected pages are then copied structurally into a new document you download. As with merging, pages are transplanted rather than re-rendered, so the extract is pixel-identical to the source pages.',
    note: 'The common real-world uses: sending one signed page instead of the whole contract, splitting a scanned batch into separate documents, and extracting the relevant pages of a statement for an application — exactly the document types that shouldn\'t transit a stranger\'s server, which is why this runs locally.',
    faqs: [
      { q: 'How do I specify which pages to extract?', a: 'Two ways, kept in sync: click pages in the live thumbnail preview to toggle them, or type a range like 3-9, a list like 1, 4, 7, or a mix like 1-4, 8, 11-13. Pages are numbered from 1.' },
      { q: 'Can I see the pages before extracting?', a: 'Yes — every page renders as a thumbnail (the first 96 pages for very large files), with selected pages highlighted. What you see checked is exactly what lands in the output.' },
      { q: 'Does the original file get modified?', a: 'Never — the tool reads your file and produces a new one containing only the selected pages. The source PDF on your disk is untouched.' },
      { q: 'Can I split one PDF into many files at once?', a: 'This tool extracts one range per pass — run it again for each piece (the file stays loaded). Each extraction takes a second, so splitting a scan into three documents is three quick passes.' },
      { q: 'Is quality affected?', a: 'No — extraction copies page objects intact. Text, vector graphics and images are byte-preserved, not re-compressed.' },
      { q: 'Is my document uploaded?', a: 'No — the split happens in browser memory via pdf-lib. Nothing is transmitted, which you can verify by working offline.' },
    ],
    keywords: ['split pdf', 'extract pages from pdf', 'pdf page extractor', 'split pdf without uploading', 'save pdf pages separately'],
  },
  {
    slug: 'jpg-to-pdf',
    name: 'Images to PDF Converter',
    icon: '🖼️',
    description:
      'Turn JPG and PNG images into a single PDF — one image per page, ordered your way, generated in the browser with no upload or watermark.',
    lead: 'Photos and scans → one tidy PDF, one image per page, in your order — assembled on your device with no upload, no watermark, no page limit.',
    widget: 'images-to-pdf',
    how: 'Each image is embedded into a PDF page sized to match its dimensions (at your chosen DPI assumption), preserving the original image bytes for JPEGs — no re-compression, so quality is exactly what you supplied. Reorder the list before converting; the output downloads as a single document.',
    note: 'This is the "scan submission" workflow: photograph documents with your phone, load them here in order, download one PDF. Because JPEG bytes are embedded directly rather than re-encoded, the PDF is about the size of the images combined — compress or resize oversized photos first (the image compressor pairs well) if the upload form has a size cap.',
    faqs: [
      { q: 'What image formats are supported?', a: 'JPEG and PNG natively — the two formats pdf-lib embeds directly. Other formats (WebP, HEIC) should be converted to JPEG or PNG first with the image converter, in one local step.' },
      { q: 'Does converting to PDF reduce image quality?', a: 'No — JPEG files are embedded byte-for-byte without re-compression, and PNGs are embedded losslessly. The PDF shows exactly the pixels you provided.' },
      { q: 'How do I control page order and size?', a: 'Images become pages in list order — reorder before converting. Each page is sized to its image\'s aspect ratio, so portrait photos give portrait pages and nothing gets cropped or letterboxed.' },
      { q: 'Why is my PDF so large?', a: 'The PDF is roughly the sum of its images. Phone photos are often 3–8 MB each; running them through the image compressor or resizer first (also local) typically cuts the result by 80%+ with no visible loss on screen.' },
      { q: 'Are my photos uploaded?', a: 'No — images are read and the PDF is assembled entirely in browser memory. For photographed IDs and documents, that is precisely the point.' },
    ],
    keywords: ['jpg to pdf', 'image to pdf converter', 'combine images into pdf', 'photos to pdf', 'png to pdf online free'],
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF Pages',
    icon: '🔄',
    description:
      'Rotate PDF pages 90°, 180° or 270° — all pages or a chosen range — and save the fixed file, processed locally in your browser.',
    lead: 'Fix sideways scans in one click: rotate every page or just the ones you pick, and download — without the document leaving your device.',
    widget: 'rotate',
    how: 'PDF pages carry a rotation attribute that viewers honor, and this tool sets it — adding your chosen 90°, 180° or 270° to each selected page\'s existing rotation. A live thumbnail preview shows every page with the rotation applied before you save: leave the range empty to rotate everything, or click individual pages (or type a range) to rotate only those — sideways pages in a mixed scan are easy to spot and fix visually. Because rotation is a metadata change rather than re-rendering, the operation is instant, lossless and reversible.',
    note: 'The scanner classic: a duplex scanner that flips every second page upside down. Rotate with range "2, 4, 6, 8" (or re-run for long documents) and 180° to fix exactly the even pages. Since rotation is stored, not baked into pixels, there is no quality cost to fixing and re-fixing.',
    faqs: [
      { q: 'Does rotating degrade the PDF?', a: 'No — rotation is a page attribute, not a pixel operation. The content stream is untouched; viewers simply display the page at the new orientation. It\'s fully reversible.' },
      { q: 'Can I rotate just some pages?', a: 'Yes — enter a range like 2, 4, 6 or 10-14, or leave it empty to rotate every page. Handy for the duplex-scanner problem where only alternating pages are flipped.' },
      { q: 'What\'s the difference between 90° and 270°?', a: 'Direction: 90° turns pages clockwise, 270° counter-clockwise (the same as three clockwise turns). 180° fixes upside-down pages. If you pick the wrong one, rotate again — no quality is lost.' },
      { q: 'Will the rotation stick when I print or share?', a: 'Yes — the rotation attribute is part of the saved file and all standards-compliant viewers and printers honor it.' },
      { q: 'Is the PDF uploaded to rotate it?', a: 'No — the file is modified in browser memory and downloaded. Nothing is transmitted at any point.' },
    ],
    keywords: ['rotate pdf', 'rotate pdf pages and save', 'fix sideways pdf', 'rotate pdf online free', 'pdf rotation tool'],
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF (Remove Password)',
    icon: '🔓',
    description:
      'Remove a password from a PDF you have the right to open — qpdf compiled to WebAssembly, so neither the document nor its password ever leaves your browser.',
    lead: 'Enter the password once, download a copy that never asks again — decrypted on your device, because a PDF and its password are the last things to send to a server.',
    widget: 'unlock',
    how: 'The tool runs qpdf — the standard open-source PDF transformation engine — compiled to WebAssembly in your browser. Given the correct password, it decrypts the document and writes an unencrypted copy; content is preserved exactly, since decryption is a structural operation, not a re-render. It also clears owner-password restrictions (the kind that block printing or copying on files that open without any password).',
    note: 'The privacy contrast is the whole story here: the well-known upload-based unlockers require you to send them a confidential document AND its password together — the two things that should never travel as a pair. Here both stay in browser memory. Legal note: unlock only documents you have the right to open — your own files, or ones whose password was legitimately shared with you.',
    faqs: [
      { q: 'Can this crack a PDF whose password I don\'t know?', a: 'No — and that\'s by design. Removing encryption requires the correct password; without it, AES-encrypted PDFs are computationally infeasible to open. This tool is for legitimately removing a password you know from a file you have rights to.' },
      { q: 'My PDF opens fine but won\'t let me print or copy — can this fix it?', a: 'Yes. Those are owner-password restrictions: the file is encrypted but opens with an empty user password. Load it, leave the password field blank, and the unlocked copy has the restrictions cleared.' },
      { q: 'Does unlocking change the document\'s content or quality?', a: 'No — decryption is structural. Text, images, form fields and signatures\' visual content are preserved byte-comparable; only the encryption wrapper is removed. (A digital signature\'s validity indicator may change, since the file bytes necessarily differ.)' },
      { q: 'Is it safe to type the password here?', a: 'The decryption runs in your browser via qpdf compiled to WebAssembly — document and password stay in local memory, nothing is transmitted, and it works offline. That is precisely the property upload-based unlock sites cannot offer.' },
      { q: 'Is removing a PDF password legal?', a: 'Removing protection from documents you own or are authorized to open (a bank statement with a known password, your own archived files) is ordinary use. Circumventing protection on documents you have no rights to is not — this tool requires the password, so it can\'t do that anyway.' },
    ],
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover', 'remove pdf restrictions', 'unlock pdf without uploading'],
  },
  {
    slug: 'protect-pdf',
    name: 'Password Protect PDF',
    icon: '🔐',
    description:
      'Add AES-256 password protection to a PDF in your browser — qpdf WebAssembly encryption with optional separate owner password. No upload.',
    lead: 'Encrypt a PDF with AES-256 before it travels — set the password on your device, so the protected file is the only thing that ever leaves it.',
    widget: 'protect',
    how: 'Encryption runs qpdf compiled to WebAssembly, applying the PDF standard\'s strongest mode: AES-256 (PDF 2.0 / ISO 32000-2). The user password is required to open the document; the optional owner password separately controls permissions like printing and copying (defaulting to the user password if left blank). Every PDF reader supports opening these files — encryption is part of the PDF standard, not a proprietary wrapper.',
    note: 'Two honest caveats. First, protection is only as strong as the password — a short guessable one falls to offline guessing regardless of AES-256; generate a long one. Second, owner-password permissions (no-print, no-copy) are honored by well-behaved readers but are not cryptographic guarantees; the open password is the real protection. For non-PDF files, the file encryption tool does the same job generically.',
    faqs: [
      { q: 'How strong is the encryption?', a: 'AES-256 per the PDF 2.0 standard (ISO 32000-2) — the strongest mode PDF defines, and what qpdf applies here. The practical weak point is never the cipher but the password: use a generated 14+ character one.' },
      { q: 'What\'s the difference between the user and owner password?', a: 'The user password is needed to open the document at all. The owner password controls permissions (printing, copying, editing) and can remove protection later. If you set only one, it serves both roles.' },
      { q: 'Will the protected PDF open in any reader?', a: 'Yes — password protection is part of the PDF standard, so Acrobat, browsers, Preview and mobile readers all prompt for the password and open it normally.' },
      { q: 'Can I recover the file if I forget the password?', a: 'No — AES-256 has no back door, and this tool keeps no copy of anything. Store the password in a password manager at the moment you set it.' },
      { q: 'Is my document uploaded during encryption?', a: 'No — qpdf runs as WebAssembly in your browser; the file and password stay in local memory. Verify by disconnecting from the internet: encryption works identically.' },
    ],
    keywords: ['password protect pdf', 'encrypt pdf', 'add password to pdf', 'secure pdf online free', 'pdf encryption aes 256', 'protect pdf without uploading'],
  },
  {
    slug: 'accessibility-checker',
    name: 'PDF Accessibility Checker',
    icon: '♿',
    description:
      'Quick-check a PDF\'s accessibility foundations — tagging, language, title, text layer, image alt text, headings, bookmarks — in your browser. No upload, no install, works on any OS.',
    lead: 'Is your PDF readable by a screen reader? Check the machine-verifiable foundations in seconds — locally, because the documents that need checking are reports, forms and contracts.',
    widget: 'accessibility',
    how: 'A PDF is accessible when assistive technology can actually read it, and most of the foundations are machine-checkable. This tool inspects the document with the pdf.js engine in your browser: is it a tagged PDF (the MarkInfo flag that gives screen readers structure)? Does the catalog declare a document language (/Lang) and does the metadata carry a real title (with the DisplayDocTitle preference so viewers announce it instead of the filename)? Is there an extractable text layer, or is it a scanned image that\'s silent without OCR? In the structure tree, are there proper heading tags (H1–H6), and do tagged figures carry alt text? Long documents are also checked for bookmarks. Each check reports pass, warn or fail with a plain-language explanation of what to fix — structure checks sample the first five pages to stay fast on large files.',
    note: 'Why this exists now: the European Accessibility Act has applied since 28 June 2025, pulling e-commerce, banking, transport and e-book PDFs into scope (with transition periods running to 2030) — and the established checkers are hard to reach: PAC, the de-facto standard, is Windows-only; commercial checkers are desktop installs; and the web-based ones upload your document to analyse it. A browser-local checker fills the gap for the everyday question "is this PDF fundamentally accessible, and what\'s broken?" — while honest about scope: full PDF/UA conformance also needs human judgment (reading order, alt-text quality, table semantics), so treat this as triage, not certification.',
    faqs: [
      { q: 'What does this checker actually verify?', a: 'The machine-checkable foundations: tagged-PDF flag, document language, metadata title and DisplayDocTitle preference, extractable text layer (vs scanned images), heading tags, alt text on tagged figures, and bookmarks on long documents. Structure checks sample the first five pages.' },
      { q: 'Is passing these checks the same as PDF/UA or WCAG conformance?', a: 'No — it\'s a necessary-but-not-sufficient triage. Full conformance (PDF/UA, the Matterhorn Protocol\'s 136 conditions, WCAG 2.1) also requires human judgment: is the reading order logical, is the alt text meaningful, are tables tagged correctly? Use PAC and manual review for certification-grade checks.' },
      { q: 'Why does "tagged PDF" matter so much?', a: 'Tags are the accessibility skeleton: they tell a screen reader what\'s a heading, a paragraph, a list, a table, and in what order to read. An untagged PDF forces assistive tech to guess from raw layout — which is why "is it tagged?" is the first and most important check.' },
      { q: 'My PDF is a scan — what should I do?', a: 'A scanned PDF is an image: there\'s no text for a screen reader to speak. It needs OCR (optical character recognition) to add a real text layer, and then tagging. The checker detects this case and flags it explicitly.' },
      { q: 'Does the European Accessibility Act apply to my PDFs?', a: 'The EAA (in force since 28 June 2025) covers products and services like e-commerce, banking, e-books and transport — documents that are part of those services, such as invoices, statements and manuals, are pulled into scope, with some transition arrangements running to 2030. Public-sector documents were already covered by the Web Accessibility Directive.' },
      { q: 'Is my document uploaded to be analysed?', a: 'No — pdf.js runs entirely in your browser and the page works offline. Accessibility checks are typically run on reports, statements and contracts; keeping them local is the point.' },
    ],
    keywords: ['pdf accessibility checker', 'check pdf accessibility', 'tagged pdf checker', 'pdf ua check', 'pdf accessibility test online', 'screen reader pdf check', 'eaa pdf accessibility', 'pdf alt text checker'],
  },
  {
    slug: 'redaction-checker',
    name: 'PDF Redaction Checker',
    icon: '🕵️',
    description:
      'Test whether a "redacted" PDF actually removed the content: extract every piece of text a copy-paste can still read, search it for the redacted term, and check overlay annotations, metadata and attachments — locally, nothing uploaded.',
    lead: 'Black boxes are not redaction. Before a "redacted" PDF leaves your hands, see everything a copy-paste can still pull out of it — and search for the exact name or number you meant to remove.',
    widget: 'redact-check',
    how: 'Most redaction failures share one mechanism: the sensitive text is still in the file, merely covered by a drawn rectangle — so selecting the area and copying, or extracting the text layer, reveals it. This checker extracts the complete machine-readable text of every page (exactly what any script or PDF library sees), tells you how many characters remain, and gives you a search box: type the name, account number or address you redacted, and it reports every page where it still exists, with context. It also flags the other classic leaks — drawn/markup annotations that any editor can delete to reveal what is underneath, document metadata (author, title, creator software, dates), and embedded file attachments that travel with the PDF unredacted.',
    note: 'This failure mode keeps making headlines: in December 2025, PDFs released in the Epstein files were found to have black boxes drawn over intact, selectable text, and forensic research on tens of thousands of published agency PDFs has found the majority of "redacted" documents still contained the hidden content. The check that would have caught all of it takes ten seconds and — done here — never uploads the document. One honest limitation: a checker can prove content IS still present, but cannot prove a negative; visual content inside images still needs human review.',
    faqs: [
      { q: 'How do redactions fail if the page looks black?', a: 'Because appearance and content are separate layers in a PDF. A black rectangle drawn over text changes what you see, not what the file contains — the text underneath remains fully extractable by copy-paste, search or any PDF library, and if the box is an annotation, it can simply be deleted.' },
      { q: 'What does this checker examine?', a: 'Four things: the complete extractable text of every page (with a search box to hunt for the redacted content), overlay/markup annotations that could be hiding text, document metadata (author, title, software, dates), and embedded file attachments.' },
      { q: 'The checker found my redacted text — what now?', a: 'The redaction must be done destructively: either use professional redaction that removes the content from the file, or flatten the pages to images with the boxes burned in — the rasterizing redactor here does exactly that. Then re-check the result.' },
      { q: 'The checker found nothing — is my document safe?', a: 'It passed the checks that catch the overwhelming majority of real-world failures. But no tool can prove a negative: content baked into page images (like a photographed document) needs your eyes, and cropped-but-retained image data is beyond any text-level check.' },
      { q: 'Is the document I check uploaded?', a: 'No — text extraction and all analysis run in your browser, offline-capable. Documents being redacted are by definition sensitive; that is exactly why this tool has no server side.' },
    ],
    keywords: ['pdf redaction checker', 'check pdf redaction', 'redacted pdf still searchable', 'failed redaction', 'hidden text in pdf', 'pdf redaction fail', 'verify pdf redaction', 'copy text under black box'],
  },
  {
    slug: 'redact-pdf',
    name: 'Redact PDF (Flatten & Burn In)',
    icon: '⬛',
    description:
      'Truly redact a PDF: draw black boxes on the rendered pages, then every page is flattened to an image with the boxes burned in — the text underneath is destroyed, not covered. All in your browser.',
    lead: 'Draw boxes over what must go, and the tool re-renders every page as a flat image with the boxes burned in — so the hidden text doesn\'t exist in the output, rather than hiding under a rectangle.',
    widget: 'redact',
    how: 'The tool renders each page with the pdf.js engine, you draw black rectangles over anything to remove (click and drag; boxes apply per page; undo as needed), and on export every page is re-rendered as a flat image with your boxes painted in before the image is written to a brand-new PDF. Because the output pages are pixels, not the original content streams, the sensitive text, fonts, metadata and attachments of the source simply do not exist in the result — there is nothing to un-hide. This is the same "print it and scan it" logic that forensic guidance recommends, done digitally at 144 DPI.',
    note: 'The deliberate trade-off: a rasterized PDF is no longer searchable or selectable, and its file size reflects the page images — that\'s the price of redaction that cannot be reversed by deleting an annotation. For documents that must remain accessible, run OCR on the redacted output afterwards (the text you removed stays gone — OCR can only read what\'s visible). Belt and braces: run the result through the redaction checker; it should report zero extractable characters.',
    faqs: [
      { q: 'Why flatten pages to images instead of just adding black boxes?', a: 'Because a drawn box leaves the text underneath intact and extractable — the failure behind most public redaction scandals. Flattening re-creates each page as pixels with the box burned in: the content beneath was never copied into the new file, so no editor, script or copy-paste can recover it.' },
      { q: 'Is the redaction really irreversible?', a: 'Yes, for the file this tool produces: the output contains only page images rendered with your boxes already applied. The original text, fonts, metadata and attachments are not carried over in any form. (Keep the original somewhere safe if you need it — this is a one-way door for the output file.)' },
      { q: 'What quality are the flattened pages?', a: 'Pages render at twice their nominal size (≈144 DPI), which keeps ordinary documents crisp on screen and in print. The result behaves like a good scan: readable, printable, but not text-selectable.' },
      { q: 'How do I redact across multiple pages?', a: 'Navigate with Prev/Next and draw boxes on each page that needs them — the counter shows total boxes and per-page boxes. Export flattens every page of the document, including ones without boxes.' },
      { q: 'Is my document uploaded?', a: 'No — rendering, drawing and rebuilding all happen in your browser, and the tool works offline. Documents being redacted are exactly the files that should never touch a third-party server.' },
    ],
    keywords: ['redact pdf', 'pdf redaction tool', 'black out text in pdf', 'remove text from pdf permanently', 'redact pdf without uploading', 'flatten pdf redaction', 'secure pdf redaction free'],
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    icon: '🖼️',
    widget: 'to-images',
    description: 'Convert PDF pages to JPG or PNG images and download them — every page rendered in your browser, nothing uploaded. In your browser.',
    lead: 'Open a PDF to turn each page into a JPG or PNG image you can download individually or all at once — the file never leaves your device.',
    how: 'The tool renders each page of your PDF to a canvas with the pdf.js engine, then exports it as an image. Choose JPG (smaller files) or PNG (lossless, best for text and diagrams), pick a resolution, and download each page or all of them together. Because rendering happens entirely in your browser, the PDF is never uploaded to a server.',
    note: 'Higher resolution makes sharper images and larger files — "High" (≈216 DPI) keeps scanned text crisp, while "Screen" is fine for quick previews. The output is a picture, so the text is no longer selectable; if you need editable text, that requires OCR. Very large PDFs are capped at the first 100 pages to keep the browser responsive.',
    faqs: [
      { q: 'How do I convert a PDF to JPG?', a: 'Open the PDF here, choose JPG and a resolution, and each page is rendered to an image you can download — individually or all at once. It all happens in your browser, so nothing is uploaded.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. The pages are rendered and exported locally in your browser with pdf.js, and the tool works offline. Documents you convert are exactly the ones that shouldn\'t be sent to a third-party service.' },
      { q: 'Should I choose JPG or PNG?', a: 'JPG gives smaller files and is fine for most pages, especially photos. PNG is lossless and sharper for text, line art and diagrams, at the cost of a larger file. Pick PNG when crispness matters, JPG when size does.' },
      { q: 'What resolution should I use?', a: 'For on-screen viewing, "Screen" (72 dpi) is enough. For printing or keeping scanned text readable, choose "Good" (144 dpi) or "High" (216 dpi). Higher resolution means sharper but larger images.' },
      { q: 'Can I still edit the text after converting?', a: 'No — converting to an image turns the text into pixels, so it\'s no longer selectable or editable. To get editable text back from an image you\'d need optical character recognition (OCR), which is a separate step.' },
    ],
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf to png', 'pdf to jpg without uploading', 'pdf pages to images', 'export pdf as image'],
  },
];
