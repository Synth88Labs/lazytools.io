/** PDF tools registry. */

export interface PdfToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'merge' | 'split' | 'images-to-pdf' | 'rotate';
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
];
