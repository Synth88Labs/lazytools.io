/** PDF tools registry. */

export interface PdfToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'merge' | 'split' | 'images-to-pdf' | 'rotate' | 'unlock' | 'protect';
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
    how: 'Each source PDF is parsed in browser memory and its pages are copied, in your chosen order, into a fresh document that you download. This is a structural operation — pages are transplanted intact, so text stays selectable, links keep working and quality is untouched, because nothing is rasterized or re-compressed.',
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
    how: 'The PDF is parsed in browser memory, the pages matching your range are copied structurally into a new document, and you download the result. Ranges accept single pages (7), spans (3-9) and combinations (1-4, 7, 12-15). As with merging, pages are transplanted rather than re-rendered, so the extract is pixel-identical to the source pages.',
    note: 'The common real-world uses: sending one signed page instead of the whole contract, splitting a scanned batch into separate documents, and extracting the relevant pages of a statement for an application — exactly the document types that shouldn\'t transit a stranger\'s server, which is why this runs locally.',
    faqs: [
      { q: 'How do I specify which pages to extract?', a: 'Type a range like 3-9, a list like 1, 4, 7, or a mix like 1-4, 8, 11-13. Pages are numbered from 1 and appear in the output in the order listed.' },
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
    how: 'PDF pages carry a rotation attribute that viewers honor, and this tool sets it — adding your chosen 90°, 180° or 270° to each selected page\'s existing rotation. Because it\'s a metadata change rather than re-rendering, the operation is instant, lossless and reversible: rotating back restores the original view exactly.',
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
];
