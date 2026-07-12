/** Lazy pdf.js page-thumbnail rendering for the PDF tools' live previews. */

/**
 * pdf.js drives its canvas paint loop with requestAnimationFrame, which browsers
 * pause while a tab is backgrounded — so a render started in a hidden tab (e.g. the
 * user switches tabs mid-conversion) stalls until they come back. This makes progress
 * continue in a hidden tab by falling back to setTimeout only while document.hidden is
 * true; visible-tab behaviour is untouched. Installed once per page, globally idempotent.
 */
export function keepRenderingWhenHidden() {
  if (typeof window === 'undefined' || (window as unknown as { __bgRaf?: boolean }).__bgRaf) return;
  (window as unknown as { __bgRaf?: boolean }).__bgRaf = true;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb: FrameRequestCallback): number =>
    document.hidden ? (window.setTimeout(() => cb(performance.now()), 16) as unknown as number) : raf(cb);
}

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      keepRenderingWhenHidden();
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

export const THUMB_PAGE_CAP = 96;

export interface PdfThumbs {
  pageCount: number;
  /** data-URLs for up to THUMB_PAGE_CAP pages, in order */
  thumbs: string[];
}

/** Render page thumbnails (~`width`px wide) for a PDF. Never throws on render of a single page — skips it. */
export async function renderPdfThumbs(bytes: ArrayBuffer, width = 140, maxPages = THUMB_PAGE_CAP): Promise<PdfThumbs> {
  const pdfjs = await getPdfjs();
  const task = pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true });
  const doc = await task.promise;
  const pageCount = doc.numPages;
  const n = Math.min(pageCount, maxPages);
  const thumbs: string[] = [];
  for (let i = 1; i <= n; i++) {
    try {
      const page = await doc.getPage(i);
      const vp1 = page.getViewport({ scale: 1 });
      const scale = width / vp1.width;
      const vp = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
      thumbs.push(canvas.toDataURL('image/jpeg', 0.7));
    } catch {
      thumbs.push('');
    }
  }
  await task.destroy();
  return { pageCount, thumbs };
}

/** First-page thumbnail only (for merge file cards). */
export async function renderFirstPageThumb(bytes: ArrayBuffer, width = 96): Promise<{ thumb: string; pageCount: number }> {
  const { thumbs, pageCount } = await renderPdfThumbs(bytes, width, 1);
  return { thumb: thumbs[0] ?? '', pageCount };
}

/** Serialize zero-based page indices back to a compact 1-based range string like "1-4, 7, 9-10". */
export function indicesToRange(indices: number[]): string {
  const sorted = [...new Set(indices)].sort((a, b) => a - b).map((i) => i + 1);
  const parts: string[] = [];
  let start = -1, prev = -2;
  for (const p of sorted) {
    if (p !== prev + 1) {
      if (start !== -1) parts.push(start === prev ? String(start) : `${start}-${prev}`);
      start = p;
    }
    prev = p;
  }
  if (start !== -1) parts.push(start === prev ? String(start) : `${start}-${prev}`);
  return parts.join(', ');
}
