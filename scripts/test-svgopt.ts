import { optimizeSvg } from '../src/lib/svg-optimize.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

const MESSY = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generator: Adobe Illustrator -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     inkscape:version="1.0" width="100" height="100" viewBox="0 0 100 100">
  <title>My Icon</title>
  <desc>A description</desc>
  <metadata><rdf:RDF></rdf:RDF></metadata>
  <sodipodi:namedview inkscape:zoom="2"/>
  <rect x="10.123456" y="20" width="80.0" height="60" fill="#ff0000" inkscape:label="box"/>
</svg>`;

const r = optimizeSvg(MESSY);
ok('removes XML declaration', !r.output.includes('<?xml'));
ok('removes DOCTYPE', !/<!DOCTYPE/i.test(r.output));
ok('removes comments', !r.output.includes('Adobe Illustrator'));
ok('removes <title>', !r.output.includes('<title>'));
ok('removes <desc>', !r.output.includes('<desc>'));
ok('removes <metadata>', !r.output.includes('<metadata>'));
ok('removes sodipodi:namedview element', !r.output.includes('namedview'));
ok('removes inkscape: attributes', !/inkscape:/.test(r.output));
ok('removes xmlns:inkscape', !/xmlns:inkscape/.test(r.output));
ok('keeps the rect + viewBox', r.output.includes('<rect') && r.output.includes('viewBox="0 0 100 100"'));
ok('keeps the fill', r.output.includes('fill="#ff0000"'));
ok('collapses inter-tag whitespace', !/>\s+</.test(r.output));
ok('smaller output', r.optimizedBytes < r.originalBytes && r.savedBytes > 0);
ok('savedPercent computed', r.savedPercent > 0 && r.savedPercent <= 100);

// rounding
const r2 = optimizeSvg('<svg viewBox="0 0 10 10"><path d="M10.123456 20.987654 L30 40"/></svg>', { roundPrecision: 2 });
ok('rounds decimals to 2', r2.output.includes('10.12') && r2.output.includes('20.99') && !r2.output.includes('10.123456'));
ok('leaves integers intact when rounding', r2.output.includes('30 40'));

// default (no rounding) keeps precision
const r3 = optimizeSvg('<svg viewBox="0 0 10 10"><path d="M10.123456 20"/></svg>');
ok('no rounding by default', r3.output.includes('10.123456'));

// idempotence-ish: optimizing already-clean svg still valid and not larger
const clean = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>';
const r4 = optimizeSvg(clean);
ok('clean svg stays valid', r4.output.includes('<svg') && r4.output.includes('</svg>') && r4.optimizedBytes <= r4.originalBytes);

let threw = false; try { optimizeSvg('<html>not svg</html>'); } catch { threw = true; }
ok('rejects non-SVG', threw);

// toggle off removals
const r5 = optimizeSvg('<svg viewBox="0 0 1 1"><!-- keep me --><rect/></svg>', { removeComments: false });
ok('keeps comments when disabled', r5.output.includes('keep me'));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
