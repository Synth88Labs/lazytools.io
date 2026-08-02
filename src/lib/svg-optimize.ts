/**
 * Lightweight, conservative SVG optimizer/minifier. Pure and deterministic (no
 * DOM, no dependency) so it runs in Node tests and the browser identically. It
 * removes the cruft that editors (Illustrator, Inkscape, Figma) leave behind —
 * comments, metadata, editor-specific namespaces, the XML declaration and
 * DOCTYPE — and collapses inter-tag whitespace, optionally rounding coordinate
 * numbers. It deliberately does NOT restructure paths or merge shapes, so the
 * rendered image is unchanged.
 */

export interface SvgOptOptions {
  removeComments?: boolean;      // default true
  removeMetadata?: boolean;      // default true — <metadata>, <title>, <desc>
  removeEditorData?: boolean;    // default true — inkscape:/sodipodi: elements & attrs
  removeXmlDecl?: boolean;       // default true — <?xml …?> and <!DOCTYPE …>
  collapseWhitespace?: boolean;  // default true
  roundPrecision?: number;       // e.g. 2 to round decimals; 0/undefined = leave numbers
}

export interface SvgOptResult {
  output: string;
  originalBytes: number;
  optimizedBytes: number;
  savedBytes: number;
  savedPercent: number;
}

const byteLen = (s: string) => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : Buffer.byteLength(s, 'utf-8'));

export function optimizeSvg(input: string, opts: SvgOptOptions = {}): SvgOptResult {
  const o = {
    removeComments: opts.removeComments !== false,
    removeMetadata: opts.removeMetadata !== false,
    removeEditorData: opts.removeEditorData !== false,
    removeXmlDecl: opts.removeXmlDecl !== false,
    collapseWhitespace: opts.collapseWhitespace !== false,
    roundPrecision: opts.roundPrecision && opts.roundPrecision > 0 ? Math.floor(opts.roundPrecision) : 0,
  };
  if (!/<svg[\s>]/i.test(input)) throw new Error('This does not look like an SVG (no <svg> element found).');

  const original = input;
  let s = input;

  if (o.removeXmlDecl) {
    s = s.replace(/<\?xml[\s\S]*?\?>/gi, '');
    s = s.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
  }
  if (o.removeComments) {
    s = s.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (o.removeMetadata) {
    s = s.replace(/<metadata\b[\s\S]*?<\/metadata>/gi, '');
    s = s.replace(/<title\b[\s\S]*?<\/title>/gi, '');
    s = s.replace(/<desc\b[\s\S]*?<\/desc>/gi, '');
  }
  if (o.removeEditorData) {
    // Editor-specific elements (e.g. <sodipodi:namedview …/>, <inkscape:… >…</…>).
    s = s.replace(/<(sodipodi|inkscape):[a-z0-9-]+\b[\s\S]*?(\/>|<\/\1:[a-z0-9-]+>)/gi, '');
    // Editor-specific attributes and their xmlns declarations.
    s = s.replace(/\s(?:inkscape|sodipodi):[a-z0-9-]+\s*=\s*"[^"]*"/gi, '');
    s = s.replace(/\s(?:inkscape|sodipodi):[a-z0-9-]+\s*=\s*'[^']*'/gi, '');
    s = s.replace(/\sxmlns:(?:inkscape|sodipodi|dc|cc|rdf)\s*=\s*"[^"]*"/gi, '');
    s = s.replace(/\sxmlns:(?:inkscape|sodipodi|dc|cc|rdf)\s*=\s*'[^']*'/gi, '');
  }
  if (o.roundPrecision) {
    const p = o.roundPrecision;
    // Round decimals with more than `p` fractional digits; keep integers intact.
    s = s.replace(/-?\d*\.\d+/g, (m) => {
      const num = parseFloat(m);
      const r = Number(num.toFixed(p));
      return String(r);
    });
  }
  if (o.collapseWhitespace) {
    s = s.replace(/>\s+</g, '><');       // whitespace between tags
    s = s.replace(/\s{2,}/g, ' ');        // runs of whitespace inside tags → single space
    s = s.trim();
  }

  const optimizedBytes = byteLen(s);
  const originalBytes = byteLen(original);
  const savedBytes = originalBytes - optimizedBytes;
  return {
    output: s,
    originalBytes,
    optimizedBytes,
    savedBytes,
    savedPercent: originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 1000) / 10 : 0,
  };
}
