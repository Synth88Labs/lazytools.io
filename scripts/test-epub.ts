import { parseOpf, opfPathFromContainer } from '../src/lib/epub.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- container.xml → OPF path ----
const container = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`;
ok('container opf path', opfPathFromContainer(container) === 'OEBPS/content.opf');
ok('container missing → null', opfPathFromContainer('<container/>') === null);

// ---- EPUB3 OPF with Dublin Core + refinements ----
const opf3 = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>The Sound &amp; the Fury</dc:title>
    <dc:creator id="a1">William Faulkner</dc:creator>
    <dc:contributor>Jane Editor</dc:contributor>
    <dc:language>en</dc:language>
    <dc:identifier id="pub-id">urn:isbn:9780679732242</dc:identifier>
    <dc:publisher>Vintage</dc:publisher>
    <dc:date>1990-10-23</dc:date>
    <dc:subject>Fiction</dc:subject>
    <dc:subject>Modernism</dc:subject>
    <dc:description>A Southern family in decline told in four voices.</dc:description>
    <dc:rights>Public domain in some jurisdictions</dc:rights>
    <meta property="belongs-to-collection" id="c1">Modern Classics</meta>
    <meta refines="#c1" property="group-position">3</meta>
    <meta name="cover" content="cover-img"/>
  </metadata>
  <manifest>
    <item id="cover-img" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>
    <item id="c1" href="ch1.xhtml" media-type="application/xhtml+xml"/>
    <item id="c2" href="ch2.xhtml" media-type="application/xhtml+xml"/>
    <item id="c3" href="ch3.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine><itemref idref="c1"/><itemref idref="c2"/><itemref idref="c3"/></spine>
</package>`;

const m = parseOpf(opf3);
ok('version 3.0', m.version === '3.0');
ok('title with entity', m.title === 'The Sound & the Fury');
ok('creator', m.creators.length === 1 && m.creators[0] === 'William Faulkner');
ok('contributor', m.contributors[0] === 'Jane Editor');
ok('language', m.language === 'en');
ok('identifier', m.identifier === 'urn:isbn:9780679732242');
ok('isbn extracted', m.isbn === '9780679732242');
ok('publisher', m.publisher === 'Vintage');
ok('date', m.date === '1990-10-23');
ok('two subjects', m.subjects.length === 2 && m.subjects.includes('Modernism'));
ok('description', m.description!.startsWith('A Southern family'));
ok('rights', m.rights!.includes('Public domain'));
ok('series', m.series === 'Modern Classics');
ok('series index', m.seriesIndex === '3');
ok('manifest 4 items', m.manifestItems === 4);
ok('spine 3 docs', m.spineItems === 3);
ok('has cover', m.hasCover === true);

// ---- EPUB2 OPF (multiple authors, calibre series, no cover-image property) ----
const opf2 = `<package version="2.0" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Good Omens</dc:title>
    <dc:creator opf:role="aut">Terry Pratchett</dc:creator>
    <dc:creator opf:role="aut">Neil Gaiman</dc:creator>
    <dc:language>en-GB</dc:language>
    <dc:identifier>bookid-12345</dc:identifier>
    <meta name="calibre:series" content="Discworld-adjacent"/>
    <meta name="calibre:series_index" content="1.0"/>
    <meta name="cover" content="mycover"/>
  </metadata>
  <manifest><item id="mycover" href="c.png" media-type="image/png"/></manifest>
  <spine><itemref idref="x"/></spine>
</package>`;
const m2 = parseOpf(opf2);
ok('epub2 version', m2.version === '2.0');
ok('two creators', m2.creators.length === 2 && m2.creators[1] === 'Neil Gaiman');
ok('calibre series', m2.series === 'Discworld-adjacent');
ok('calibre series index', m2.seriesIndex === '1.0');
ok('no isbn when none present', m2.isbn === undefined);
ok('epub2 cover via meta', m2.hasCover === true);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
