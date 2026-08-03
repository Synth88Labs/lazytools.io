/**
 * Read the metadata out of an EPUB. An EPUB is a ZIP: META-INF/container.xml
 * points at the OPF package document, whose <metadata> block holds Dublin Core
 * fields (title, creator, language, identifier, publisher, date, subjects…).
 * These helpers are pure and regex-based so they are unit-testable without a
 * ZIP library; the component supplies the two extracted XML strings.
 */

export interface EpubMeta {
  version?: string;            // EPUB "2.0", "3.0", …
  title?: string;
  creators: string[];          // authors
  contributors: string[];
  language?: string;
  identifier?: string;
  isbn?: string;
  publisher?: string;
  date?: string;
  subjects: string[];
  description?: string;
  rights?: string;
  series?: string;
  seriesIndex?: string;
  manifestItems: number;
  spineItems: number;          // reading-order documents (≈ chapters)
  hasCover: boolean;
}

const decodeEntities = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&').trim();

/** Extract the OPF package path from META-INF/container.xml. */
export function opfPathFromContainer(xml: string): string | null {
  const m = xml.match(/<rootfile\b[^>]*\bfull-path\s*=\s*["']([^"']+)["']/i);
  return m ? m[1]! : null;
}

/** All text contents of a Dublin Core element (with or without the dc: prefix). */
function allTags(xml: string, name: string): string[] {
  const re = new RegExp(`<(?:dc:)?${name}\\b[^>]*>([\\s\\S]*?)</(?:dc:)?${name}>`, 'gi');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) { const v = decodeEntities(m[1]!); if (v) out.push(v); }
  return out;
}
const firstTag = (xml: string, name: string): string | undefined => allTags(xml, name)[0];

/** Parse an OPF package document's metadata. */
export function parseOpf(xml: string): EpubMeta {
  // Scope to <metadata>…</metadata> when present (avoids picking up manifest text).
  const metaBlock = xml.match(/<metadata\b[\s\S]*?<\/metadata>/i)?.[0] ?? xml;

  const meta: EpubMeta = {
    creators: [], contributors: [], subjects: [],
    manifestItems: 0, spineItems: 0, hasCover: false,
  };

  meta.version = xml.match(/<package\b[^>]*\bversion\s*=\s*["']([^"']+)["']/i)?.[1];
  meta.title = firstTag(metaBlock, 'title');
  meta.creators = allTags(metaBlock, 'creator');
  meta.contributors = allTags(metaBlock, 'contributor');
  meta.language = firstTag(metaBlock, 'language');
  meta.publisher = firstTag(metaBlock, 'publisher');
  meta.date = firstTag(metaBlock, 'date');
  meta.subjects = allTags(metaBlock, 'subject');
  meta.description = firstTag(metaBlock, 'description');
  meta.rights = firstTag(metaBlock, 'rights');

  // Identifier: prefer one that looks like an ISBN.
  const ids = allTags(metaBlock, 'identifier');
  for (const id of ids) {
    const digits = id.replace(/[^0-9Xx]/g, '');
    if (/isbn/i.test(id) || digits.length === 13 || digits.length === 10) { meta.isbn = digits; break; }
  }
  meta.identifier = ids[0];

  // EPUB3 calibre series refinements: <meta property="belongs-to-collection">…
  meta.series = metaBlock.match(/<meta[^>]*\bproperty\s*=\s*["']belongs-to-collection["'][^>]*>([\s\S]*?)<\/meta>/i)?.[1]?.trim()
    ?? metaBlock.match(/<meta[^>]*\bname\s*=\s*["']calibre:series["'][^>]*\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
  meta.seriesIndex = metaBlock.match(/<meta[^>]*\bproperty\s*=\s*["']group-position["'][^>]*>([\s\S]*?)<\/meta>/i)?.[1]?.trim()
    ?? metaBlock.match(/<meta[^>]*\bname\s*=\s*["']calibre:series_index["'][^>]*\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];

  // Manifest / spine counts and cover detection.
  meta.manifestItems = (xml.match(/<item\b[^>]*\bhref=/gi) || []).length;
  meta.spineItems = (xml.match(/<itemref\b/gi) || []).length;
  meta.hasCover = /\bproperties\s*=\s*["'][^"']*cover-image/i.test(xml)
    || /<meta[^>]*\bname\s*=\s*["']cover["']/i.test(metaBlock)
    || /\bid\s*=\s*["']cover["']/i.test(xml);

  if (meta.series) meta.series = decodeEntities(meta.series);
  return meta;
}
