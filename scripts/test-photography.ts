import { SENSORS, getSensor, diagonal, cropFactor, circleOfConfusion, hyperfocalM, depthOfField, angleOfView, frameSizeM, ev100, evAtIso, sunny16Shutter, timelapse, printInches, megapixels } from '../src/lib/photography.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

const ff = getSensor('ff')!;
// Full frame diagonal 43.27, crop 1.0, CoC 0.0288
ok('FF diagonal 43.27', approx(diagonal(ff), 43.267, 0.01));
ok('FF crop = 1.0', approx(cropFactor(ff), 1.0, 0.001));
ok('FF CoC ~0.0288', approx(circleOfConfusion(ff), 0.02884, 0.0005));
// APS-C Canon crop ~1.61
ok('APS-C Canon crop ~1.61', approx(cropFactor(getSensor('apsc-canon')!), 1.613, 0.01));
ok('MFT crop ~2.0', approx(cropFactor(getSensor('mft')!), 2.0, 0.02));

// Hyperfocal: 50mm, f/8, CoC 0.0288 -> H = 50²/(8·0.0288)+50 = 10851+50 = 10901mm ~ 10.9m
const coc = circleOfConfusion(ff);
ok('hyperfocal 50mm f/8 ~10.9m', approx(hyperfocalM(50, 8, coc), 10.9, 0.3));

// DoF: 50mm f/8 FF, subject 5m -> reasonable near<5<far
const dof = depthOfField(50, 8, coc, 5);
ok('DoF near < 5m', dof.nearM < 5 && dof.nearM > 2);
ok('DoF far > 5m', dof.farM != null && dof.farM > 5);
// At subject = hyperfocal, far = infinity
const dofH = depthOfField(50, 8, coc, hyperfocalM(50, 8, coc));
ok('DoF at hyperfocal -> far infinity', dofH.farM === null);

// Angle of view: 50mm on FF horizontal (36mm) -> 2·atan(36/100) = 39.6°
ok('50mm FF horiz AOV ~39.6', approx(angleOfView(36, 50), 39.6, 0.3));
// 50mm FF diagonal (43.27) -> ~46.8°
ok('50mm FF diag AOV ~46.8', approx(angleOfView(43.267, 50), 46.8, 0.3));
// Frame size: 39.6° at 10m -> 2·10·tan(19.8°) = 7.2m
ok('frame 39.6deg at 10m ~7.2m', approx(frameSizeM(39.6, 10), 7.2, 0.1));

// EV: f/16, 1/125s, ISO100 -> log2(256·125) = log2(32000) = 14.97
ok('EV f/16 1/125 ISO100 ~15', approx(ev100(16, 1 / 125), 14.97, 0.05));
// f/2.8, 1/60, ISO100 -> log2(7.84·60)=log2(470.4)=8.88
ok('EV f/2.8 1/60 ~8.88', approx(ev100(2.8, 1 / 60), 8.88, 0.05));
// ISO shift: ISO 400 lowers scene EV by 2
ok('EV ISO400 shift -2', approx(evAtIso(16, 1 / 125, 400) - ev100(16, 1 / 125), -2, 0.001));

// Sunny 16: ISO 100 at f/16 -> 1/100s
ok('sunny16 ISO100 f/16 = 1/100', approx(sunny16Shutter(100, 16), 0.01, 0.0001));
// at f/8 (2 stops brighter) -> 1/400
ok('sunny16 ISO100 f/8 = 1/400', approx(sunny16Shutter(100, 8), 0.0025, 0.0001));

// Time-lapse: shoot 3600s, interval 5s, 30fps -> 721 shots, 24s clip
const tl = timelapse(3600, 5, 30);
ok('timelapse 3600s/5s = 721 shots', tl.shots === 721);
ok('timelapse clip = 24s', approx(tl.clipSec, 24.03, 0.1));

// Print: 6000px at 300dpi = 20in
ok('6000px @300dpi = 20in', approx(printInches(6000, 300), 20, 0.001));
ok('6000x4000 = 24MP', approx(megapixels(6000, 4000), 24, 0.001));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
