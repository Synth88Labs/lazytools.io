/**
 * Self-hosted chart fonts (via @fontsource — bundled, never fetched from a CDN,
 * so the no-external-requests promise holds).
 *
 * Two jobs:
 *  1. Preview — inject @font-face rules pointing at the bundled woff2 URLs. The
 *     browser only downloads a face once it is actually applied to rendered text,
 *     so listing ten fonts costs nothing until one is picked.
 *  2. Export — an SVG rasterised through `new Image()` runs in an isolated
 *     context that cannot see the document's @font-face rules, so the chosen
 *     font must be inlined into the SVG as base64 or the PNG/SVG silently falls
 *     back to a system font. `embedFontCss()` does that.
 */

import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff2?url';
import roboto400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff2?url';
import roboto700 from '@fontsource/roboto/files/roboto-latin-700-normal.woff2?url';
import montserrat400 from '@fontsource/montserrat/files/montserrat-latin-400-normal.woff2?url';
import montserrat700 from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff2?url';
import lato400 from '@fontsource/lato/files/lato-latin-400-normal.woff2?url';
import lato700 from '@fontsource/lato/files/lato-latin-700-normal.woff2?url';
import oswald400 from '@fontsource/oswald/files/oswald-latin-400-normal.woff2?url';
import oswald700 from '@fontsource/oswald/files/oswald-latin-700-normal.woff2?url';
import merriweather400 from '@fontsource/merriweather/files/merriweather-latin-400-normal.woff2?url';
import merriweather700 from '@fontsource/merriweather/files/merriweather-latin-700-normal.woff2?url';
import playfair400 from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2?url';
import playfair700 from '@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2?url';
import lora400 from '@fontsource/lora/files/lora-latin-400-normal.woff2?url';
import lora700 from '@fontsource/lora/files/lora-latin-700-normal.woff2?url';
import mono400 from '@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff2?url';
import mono700 from '@fontsource/roboto-mono/files/roboto-mono-latin-700-normal.woff2?url';

export interface ChartFont {
  id: string;
  /** Menu label */
  name: string;
  /** Short style hint shown in the picker */
  kind: 'Sans' | 'Serif' | 'Display' | 'Mono';
  /** Full CSS font-family stack used on the SVG */
  stack: string;
  /** The @font-face family name (absent for the system stack) */
  family?: string;
  /** Bundled woff2 URLs, by weight */
  files?: { 400: string; 700: string };
}

export const CHART_FONTS: ChartFont[] = [
  { id: 'system', name: 'System UI', kind: 'Sans', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" },
  { id: 'inter', name: 'Inter', kind: 'Sans', family: 'Inter', stack: "'Inter', system-ui, sans-serif", files: { 400: inter400, 700: inter700 } },
  { id: 'roboto', name: 'Roboto', kind: 'Sans', family: 'Roboto', stack: "'Roboto', system-ui, sans-serif", files: { 400: roboto400, 700: roboto700 } },
  { id: 'montserrat', name: 'Montserrat', kind: 'Sans', family: 'Montserrat', stack: "'Montserrat', system-ui, sans-serif", files: { 400: montserrat400, 700: montserrat700 } },
  { id: 'lato', name: 'Lato', kind: 'Sans', family: 'Lato', stack: "'Lato', system-ui, sans-serif", files: { 400: lato400, 700: lato700 } },
  { id: 'oswald', name: 'Oswald', kind: 'Display', family: 'Oswald', stack: "'Oswald', Impact, system-ui, sans-serif", files: { 400: oswald400, 700: oswald700 } },
  { id: 'playfair', name: 'Playfair Display', kind: 'Display', family: 'Playfair Display', stack: "'Playfair Display', Georgia, serif", files: { 400: playfair400, 700: playfair700 } },
  { id: 'merriweather', name: 'Merriweather', kind: 'Serif', family: 'Merriweather', stack: "'Merriweather', Georgia, serif", files: { 400: merriweather400, 700: merriweather700 } },
  { id: 'lora', name: 'Lora', kind: 'Serif', family: 'Lora', stack: "'Lora', Georgia, serif", files: { 400: lora400, 700: lora700 } },
  { id: 'mono', name: 'Roboto Mono', kind: 'Mono', family: 'Roboto Mono', stack: "'Roboto Mono', ui-monospace, monospace", files: { 400: mono400, 700: mono700 } },
];

export const fontById = (id: string): ChartFont => CHART_FONTS.find((f) => f.id === id) ?? CHART_FONTS[0];

/** @font-face rules for the live preview. Browsers lazy-load each face on first use. */
export function previewFontFaceCss(): string {
  return CHART_FONTS.filter((f) => f.files)
    .map((f) =>
      [400, 700]
        .map(
          (w) =>
            `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${w};font-display:swap;src:url(${f.files![w as 400 | 700]}) format('woff2');}`,
        )
        .join(''),
    )
    .join('');
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000; // avoid blowing the call stack on large buffers
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

const embedCache = new Map<string, string>();

/**
 * CSS with the font inlined as base64 — must be injected INTO the SVG so the
 * font survives SVG download and canvas rasterisation. Returns '' for the
 * system stack (system fonts resolve natively when the SVG is rendered).
 */
export async function embedFontCss(font: ChartFont): Promise<string> {
  if (!font.files || !font.family) return '';
  const cached = embedCache.get(font.id);
  if (cached !== undefined) return cached;
  try {
    const faces = await Promise.all(
      ([400, 700] as const).map(async (w) => {
        const res = await fetch(font.files![w]);
        if (!res.ok) throw new Error(`font ${font.id} ${w}`);
        const b64 = toBase64(await res.arrayBuffer());
        return `@font-face{font-family:'${font.family}';font-style:normal;font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
      }),
    );
    const css = faces.join('');
    embedCache.set(font.id, css);
    return css;
  } catch {
    return ''; // fall back to the stack's system fonts rather than failing the export
  }
}
