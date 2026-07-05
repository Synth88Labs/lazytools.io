/** Image tools registry. */

export interface ImageToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'compress' | 'convert' | 'resize' | 'base64';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const IMAGE_TOOLS: ImageToolDef[] = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    icon: '🗜️',
    description:
      'Compress JPEG, PNG and WebP images with a live quality slider and before/after size comparison — processed on your device, never uploaded.',
    lead: 'Shrink image file size with a quality slider and instant before/after comparison — your photo never leaves the browser.',
    widget: 'compress',
    how: 'The image is decoded and re-encoded by the browser\'s own codec at your chosen quality level. Lossy formats (JPEG, WebP) discard detail the eye rarely misses — most photos survive quality 70–85 with no visible change while dropping to a fraction of the size. The size readout updates live so you can find the point where quality loss becomes visible, and re-encoding also strips metadata as a side effect.',
    note: 'The counterintuitive tip: for photographs, converting PNG to JPEG or WebP saves far more than any PNG optimization — PNG is lossless by design and stores photographic noise expensively. Keep PNG for screenshots, diagrams and anything with text or sharp edges, where JPEG artifacts show first.',
    faqs: [
      { q: 'What quality setting should I use?', a: 'For photos, 75–85 is the sweet spot — usually 5–10× smaller than the original with no visible difference at normal viewing size. Go lower for thumbnails, higher (90+) only for print or editing masters.' },
      { q: 'Why is my PNG barely shrinking?', a: 'PNG is lossless — the quality slider doesn\'t apply, and photographic content compresses poorly in it. Convert photos to JPEG or WebP for major savings; keep PNG for screenshots and graphics with text or transparency.' },
      { q: 'Does compression remove metadata too?', a: 'Yes — re-encoding through the canvas produces a file with pixels only, so EXIF, GPS and other metadata are dropped as a side effect. For metadata specifically, the image metadata remover shows what was present first.' },
      { q: 'Is WebP better than JPEG?', a: 'For the same visual quality, WebP files are typically 25–35% smaller, and WebP supports transparency. Every modern browser displays it; the residual reason to pick JPEG is compatibility with old software and some upload forms.' },
      { q: 'Is the image uploaded for processing?', a: 'No — decoding and re-encoding use the browser\'s built-in codecs on your device. Nothing is transmitted; the tool works offline.' },
    ],
    keywords: ['compress image online', 'image compressor', 'reduce image file size', 'compress jpeg', 'compress png'],
  },
  {
    slug: 'image-converter',
    name: 'Image Format Converter',
    icon: '🔁',
    description:
      'Convert images between PNG, JPEG and WebP in your browser — with quality control for lossy targets and transparency handling explained. No upload.',
    lead: 'PNG ↔ JPEG ↔ WebP in one click, locally — with the transparency and quality trade-offs made visible instead of silently mangled.',
    widget: 'convert',
    how: 'The browser decodes the source and re-encodes it in the target format with its native codec. The conversions differ in what they can carry: PNG is lossless and keeps transparency; JPEG is lossy and has no alpha channel — transparent regions get flattened onto a background; WebP does both lossy compression and transparency. The tool warns when a conversion drops something the source had.',
    note: 'The classic mistake this tool prevents: converting a transparent logo to JPEG and getting a white (or black) box behind it. If you need transparency, the answer is PNG or WebP — no JPEG setting fixes it, because the format simply has no alpha channel.',
    faqs: [
      { q: 'Which format should I convert to?', a: 'Photos → JPEG (universal) or WebP (smaller); screenshots, diagrams, text → PNG; anything needing transparency → PNG or WebP. Converting a photo to PNG makes it dramatically larger for zero visible gain.' },
      { q: 'What happens to transparency when converting to JPEG?', a: 'JPEG has no alpha channel, so transparent pixels must be flattened onto a solid background (white by default here). If the result looks wrong, the source needed WebP or PNG instead.' },
      { q: 'Does converting JPEG to PNG improve quality?', a: 'No — JPEG\'s compression loss already happened and is baked into the pixels. PNG conversion just stores those same pixels losslessly in a much bigger file. Converting the other way (PNG → JPEG) does discard detail; do it once, from the original.' },
      { q: 'Can I convert HEIC photos from an iPhone?', a: 'Only if your browser can decode HEIC, which most currently can\'t (Safari can). If the picker accepts the file and a preview appears, the conversion works; otherwise export as JPEG from the Photos app first.' },
      { q: 'Are my images uploaded?', a: 'No — decoding and re-encoding happen with the browser\'s built-in codecs, on your device, offline-capable.' },
    ],
    keywords: ['convert png to jpg', 'image converter online', 'webp to png', 'jpg to webp', 'png to webp converter'],
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    icon: '📏',
    description:
      'Resize images to exact pixel dimensions with aspect-ratio lock and high-quality downscaling — in your browser, no upload, no watermark.',
    lead: 'Resize to exact pixels — aspect ratio locked by default so nothing gets squashed — and download, all without the image leaving your device.',
    widget: 'resize',
    how: 'The image is redrawn at the target dimensions on a canvas with high-quality resampling enabled, then re-encoded in your chosen format. The aspect-ratio lock recalculates the other dimension as you type, because independent width/height edits are how images get visibly stretched. Downscaling discards pixels (fine); upscaling invents them (soft) — the tool tells you which you\'re doing.',
    note: 'Resolution advice that saves storage: screens are the destination for most images, and a 4000-pixel-wide photo shown in an 800-pixel column wastes 25× the pixels. Resize to roughly the largest display size you need (retina = 2× the CSS size), then compress — the combination routinely cuts files by 90%+.',
    faqs: [
      { q: 'How do I resize without distorting the image?', a: 'Keep the aspect-ratio lock on: set one dimension, and the other follows automatically. Distortion only happens when width and height are changed independently to a different ratio than the original.' },
      { q: 'Can I make an image bigger?', a: 'You can set larger dimensions, but upscaling cannot add detail that was never captured — results look progressively softer. It\'s acceptable for modest bumps (up to ~1.5×); for serious enlargement you\'d want a dedicated AI upscaler.' },
      { q: 'What size should images be for the web?', a: 'Match the largest size they\'ll display: full-width hero images ~1600–2400px wide, content images ~800–1200px, thumbnails 300–400px. Double the CSS pixel size for sharp rendering on high-DPI ("retina") screens.' },
      { q: 'Does resizing reduce file size?', a: 'Dramatically — file size scales roughly with pixel count, so halving both dimensions cuts pixels (and typically bytes) by ~75%. Resizing down is the single most effective image "compression" step.' },
      { q: 'Is the image uploaded to resize it?', a: 'No — the canvas API resamples on your device. Nothing is transmitted, and there\'s no watermark or size cap beyond your device\'s memory.' },
    ],
    keywords: ['resize image online', 'image resizer', 'resize photo to pixels', 'change image dimensions', 'resize image without losing quality'],
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64 Converter',
    icon: '🖇️',
    description:
      'Convert an image to a Base64 data URL for embedding in CSS, HTML or JSON — generated locally with size shown honestly (+33% overhead).',
    lead: 'Image in, data: URL out — ready to paste into CSS or HTML, with the 33% size overhead shown so you know when not to.',
    widget: 'base64',
    how: 'The file\'s bytes are Base64-encoded into a data: URL (data:image/png;base64,…) that carries the entire image inside a string — usable anywhere a URL is: CSS background-image, <img src>, JSON payloads. Encoding happens in your browser; the output size readout includes Base64\'s inherent 4/3 overhead so the cost is visible before you embed.',
    note: 'When to embed and when not to: data URLs shine for small assets (icons, tiny logos under a few KB) where saving an HTTP request matters more than bytes. For anything larger they backfire — 33% bigger, excluded from image caching, and they bloat the document that contains them. If you\'re embedding a 500 KB photo, link it instead.',
    faqs: [
      { q: 'What is a Base64 data URL?', a: 'A URL that contains the resource itself: data:image/png;base64, followed by the image bytes re-spelled as text. Browsers render it like any image URL — no separate file or request needed.' },
      { q: 'Why is the Base64 output bigger than my image?', a: 'Base64 spends 4 text characters per 3 bytes — a fixed 33% overhead. That\'s the price of representing binary as text; it\'s why embedding is best reserved for small assets.' },
      { q: 'Where would I use this?', a: 'Inlining small icons in CSS to cut HTTP requests, embedding images in self-contained HTML files or emails, and carrying images inside JSON APIs. Also handy for testing image handling without hosting a file.' },
      { q: 'Is there a size limit for data URLs?', a: 'Browsers handle multi-megabyte data URLs, but practical limits arrive sooner: some email clients and CSS processors choke on very long strings, and page weight suffers. Keep embedded images small — icons, not photos.' },
      { q: 'Is my image uploaded to convert it?', a: 'No — the encoding is a local byte transformation in your browser. The string appears in the output box and nowhere else.' },
    ],
    keywords: ['image to base64', 'base64 image encoder', 'data url generator', 'convert image to data uri', 'png to base64'],
  },
];
