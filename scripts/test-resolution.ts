import { aspectRatio, resolutionLabel } from '../src/lib/resolution.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

ok('16:9 from 1280x720', aspectRatio(1280, 720) === '16:9');
ok('16:9 from 1920x1080', aspectRatio(1920, 1080) === '16:9');
ok('4:3 from 640x480', aspectRatio(640, 480) === '4:3');
ok('8:5 (=16:10) from 1280x800', aspectRatio(1280, 800) === '8:5');
ok('1:1 square', aspectRatio(500, 500) === '1:1');
ok('bad input', aspectRatio(0, 100) === '—');

ok('720p label', resolutionLabel(1280, 720) === '1280×720 (16:9, 720p (HD))');
ok('1080p label', resolutionLabel(1920, 1080) === '1920×1080 (16:9, 1080p (Full HD))');
ok('4K label', resolutionLabel(3840, 2160) === '3840×2160 (16:9, 4K UHD)');
ok('480p label', resolutionLabel(640, 480) === '640×480 (4:3, 480p (SD))');
ok('non-standard height omits name', resolutionLabel(1000, 900) === '1000×900 (10:9)');
ok('unknown when zero', resolutionLabel(0, 0) === 'unknown');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
