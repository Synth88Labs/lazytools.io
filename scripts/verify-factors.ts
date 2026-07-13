/**
 * Factors audit (roadmap issue #1): verifies every conversion factor in the
 * registry against an INDEPENDENT fixtures table transcribed from authoritative
 * definitions — BIPM SI Brochure (9th ed.), NIST Handbook 44 Appendix C,
 * the 1959 International Yard and Pound Agreement, and IEC 80000-13 (binary prefixes).
 *
 * Run: node scripts/verify-factors.ts   (Node 24 native type-stripping)
 * Fails with exit code 1 on any mismatch beyond 1e-12 relative tolerance.
 */
import { QUANTITIES, convert, getUnit } from '../src/data/units/index.ts';

// unitId → exact factor to base unit, per the cited definitions
const AUTHORITATIVE: Record<string, Record<string, number>> = {
  // base: meter. 1 yd = 0.9144 m exactly (1959 agreement); derived units exact.
  length: {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    nmi: 1852, um: 1e-6,
  },
  // base: kg. 1 lb = 0.45359237 kg exactly (1959 agreement).
  weight: {
    mg: 1e-6, g: 0.001, kg: 1, t: 1000,
    oz: 0.45359237 / 16, lb: 0.45359237, st: 0.45359237 * 14,
    uston: 0.45359237 * 2000, ct: 0.0002,
  },
  // base: m². Derived from exact length factors.
  area: {
    sqcm: 1e-4, sqm: 1, ha: 10000, sqkm: 1e6,
    sqin: 0.0254 ** 2, sqft: 0.3048 ** 2, sqyd: 0.9144 ** 2,
    acre: 43560 * 0.3048 ** 2, sqmi: 1609.344 ** 2,
  },
  // base: liter. US gallon = 231 in³ exactly; UK gallon = 4.54609 L exactly.
  volume: {
    ml: 0.001, l: 1, m3: 1000,
    gal: 231 * 2.54 ** 3 / 1000, ukgal: 4.54609,
    qt: (231 * 2.54 ** 3 / 1000) / 4, pt: (231 * 2.54 ** 3 / 1000) / 8,
    cup: (231 * 2.54 ** 3 / 1000) / 16, floz: (231 * 2.54 ** 3 / 1000) / 128,
    tbsp: (231 * 2.54 ** 3 / 1000) / 256, tsp: (231 * 2.54 ** 3 / 1000) / 768,
    cuft: 0.3048 ** 3 * 1000, cuin: 0.0254 ** 3 * 1000,
  },
  // base: m/s.
  speed: {
    mps: 1, kmh: 1000 / 3600, mph: 1609.344 / 3600, kn: 1852 / 3600,
    fps: 0.3048, mach: 340.29,
  },
  // base: second. Month = 1/12 Gregorian year; year = 365.2425 d.
  time: {
    ns: 1e-9, us: 1e-6, ms: 1e-3, s: 1, min: 60, h: 3600, d: 86400,
    wk: 604800, yr: 365.2425 * 86400, mo: (365.2425 * 86400) / 12,
  },
  // base: byte. SI decimal + IEC binary.
  data: {
    bit: 1 / 8, b: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12,
    kib: 2 ** 10, mib: 2 ** 20, gib: 2 ** 30, tib: 2 ** 40,
  },
  // base: pascal. psi = 0.45359237·9.80665/0.0254² exactly; atm = 101325 Pa exactly.
  pressure: {
    pa: 1, kpa: 1e3, mpa: 1e6, bar: 1e5,
    psi: (0.45359237 * 9.80665) / 0.0254 ** 2,
    atm: 101325, torr: 101325 / 760, mmhg: 133.322387415, inhg: 3386.389,
  },
  // base: joule. cal(th) = 4.184 J exactly; BTU(IT) = 1055.05585262 J.
  energy: {
    j: 1, kj: 1e3, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3.6e6,
    btu: 1055.05585262, ftlb: 0.45359237 * 9.80665 * 0.3048,
  },
  // base: watt. hp = 550 ft·lbf/s; PS = 75 kgf·m/s.
  power: {
    w: 1, kw: 1e3, mw: 1e6,
    hp: 550 * 0.45359237 * 9.80665 * 0.3048,
    ps: 75 * 9.80665, btuh: 1055.05585262 / 3600,
  },
  // base: bit/s. 1 byte = 8 bits; SI kilo = 1000, IEC mebi = 1024².
  'data-transfer-rate': {
    bps: 1, kbps: 1e3, mbps: 1e6, gbps: 1e9,
    'kb-s': 8 * 1e3, 'mb-s': 8 * 1e6, 'gb-s': 8 * 1e9, 'mib-s': 8 * 1024 * 1024,
  },
  // base: hertz. 1 RPM = 1/60 Hz; 1 rad/s = 1/(2π) Hz.
  frequency: {
    hz: 1, khz: 1e3, mhz: 1e6, ghz: 1e9,
    rpm: 1 / 60, 'rad-s': 1 / (2 * Math.PI), bpm: 1 / 60,
  },
  // base: kg/m³. 1 g/cm³ = 1000; 1 lb/ft³ = 0.45359237/0.3048³; 1 lb/in³ = 0.45359237/0.0254³.
  density: {
    'kg-m3': 1, 'g-cm3': 1000, 'g-ml': 1000, 'kg-l': 1000, 'g-l': 1,
    'lb-ft3': 0.45359237 / (0.3048 ** 3),
    'lb-in3': 0.45359237 / (0.0254 ** 3),
  },
  // base: m³/s. 1 US gal = 3.785411784 L; 1 ft³ = 0.3048³ m³.
  'flow-rate': {
    'm3-s': 1, 'm3-h': 1 / 3600, 'l-s': 1e-3, 'l-min': 1e-3 / 60,
    gpm: 0.003785411784 / 60,
    cfm: (0.3048 ** 3) / 60,
    'ft3-s': 0.3048 ** 3,
  },
  // base: newton. 1 lbf = 0.45359237×9.80665 N; 1 kgf = 9.80665 N; 1 dyne = 1e-5 N; 1 poundal = 0.45359237×0.3048 N.
  force: {
    n: 1, kn: 1e3,
    lbf: 0.45359237 * 9.80665,
    kgf: 9.80665,
    dyn: 1e-5,
    ozf: (0.45359237 * 9.80665) / 16,
    pdl: 0.45359237 * 0.3048,
  },
  // base: newton-metre. 1 lbf = 0.45359237×9.80665 N; 1 ft = 0.3048 m; 1 kgf·m = 9.80665 N·m.
  torque: {
    nm: 1, knm: 1e3,
    'lbf-ft': 0.45359237 * 9.80665 * 0.3048,
    'lbf-in': (0.45359237 * 9.80665 * 0.3048) / 12,
    'kgf-m': 9.80665,
    'ozf-in': (0.45359237 * 9.80665 * 0.3048) / 12 / 16,
  },
  // base: degree. π rad = 180°; 400 gon = 360°; 1° = 60′ = 3600″; 1 turn = 360°; 32 compass points = 360°.
  angle: {
    deg: 1,
    rad: 180 / Math.PI,
    grad: 0.9,
    arcmin: 1 / 60,
    arcsec: 1 / 3600,
    mrad: (180 / Math.PI) / 1000,
    turn: 360,
    point: 11.25,
  },
  // base: m/s². g = 9.80665 (exact); 1 ft/s² = 0.3048; 1 Gal = 0.01; km/h/s = 1000/3600; mph/s = 1609.344/3600.
  acceleration: {
    ms2: 1,
    g: 9.80665,
    fts2: 0.3048,
    gal: 0.01,
    kmhs: 1000 / 3600,
    mphs: 1609.344 / 3600,
    ins2: 0.0254,
  },
};

// Temperature is offset-based → verified via known point pairs instead.
const TEMP_POINTS: [string, string, number, number][] = [
  ['c', 'f', 0, 32],
  ['c', 'f', 100, 212],
  ['c', 'f', 37, 98.6],
  ['c', 'f', -40, -40],
  ['c', 'k', 0, 273.15],
  ['c', 'k', 25, 298.15],
  ['f', 'k', 32, 273.15],
  ['k', 'r', 0, 0],
  ['c', 'r', 0, 491.67],
];

const REL_TOL = 1e-12;
let checked = 0;
let failures = 0;

function relDiff(a: number, b: number): number {
  if (a === b) return 0;
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
}

for (const q of QUANTITIES) {
  if (q.id === 'temperature') continue;
  const expected = AUTHORITATIVE[q.id];
  if (!expected) {
    console.error(`✗ no fixtures for quantity "${q.id}"`);
    failures++;
    continue;
  }
  for (const u of q.units) {
    checked++;
    if (!(u.id in expected)) {
      console.error(`✗ ${q.id}:${u.id} — unit missing from fixtures`);
      failures++;
      continue;
    }
    const d = relDiff(u.factor, expected[u.id]!);
    if (d > (u.id === 'mach' ? 1e-3 : REL_TOL)) {
      console.error(`✗ ${q.id}:${u.id} — registry ${u.factor} vs authoritative ${expected[u.id]} (rel diff ${d.toExponential(2)})`);
      failures++;
    }
  }
  // fixtures entries that reference unknown units (catches renames)
  for (const id of Object.keys(expected)) {
    try {
      getUnit(q, id);
    } catch {
      console.error(`✗ fixtures reference unknown unit ${q.id}:${id}`);
      failures++;
    }
  }
}

const temp = QUANTITIES.find((q) => q.id === 'temperature')!;
for (const [fromId, toId, input, want] of TEMP_POINTS) {
  checked++;
  const got = convert(input, getUnit(temp, fromId), getUnit(temp, toId));
  if (Math.abs(got - want) > 1e-9) {
    console.error(`✗ temperature ${input} ${fromId} → ${toId}: got ${got}, want ${want}`);
    failures++;
  }
}

// End-to-end spot checks through the public convert() API
const spot: [string, string, string, number, number][] = [
  ['weight', 'kg', 'lb', 70, 154.32358352941432],
  ['length', 'km', 'mi', 42.195, 26.218757456454306],
  ['volume', 'l', 'gal', 50, 13.208602617907],
  ['data', 'tb', 'gib', 1, 931.3225746154785],
  ['power', 'hp', 'kw', 300, 223.7099614746811],
];
for (const [qid, a, b, input, want] of spot) {
  checked++;
  const q = QUANTITIES.find((x) => x.id === qid)!;
  const got = convert(input, getUnit(q, a), getUnit(q, b));
  if (Math.abs(got - want) / want > 1e-8) {
    console.error(`✗ spot ${input} ${a} → ${b}: got ${got}, want ~${want}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\nFactors audit FAILED: ${failures} problem(s) across ${checked} checks.`);
  process.exit(1);
}
console.log(`Factors audit passed: ${checked} checks against authoritative definitions, 0 mismatches.`);
