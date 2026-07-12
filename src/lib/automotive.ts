/**
 * Automotive shared math. Everything here is a mathematical identity or a
 * definitional unit conversion (like the /units/ category) — no empirical or
 * sourced lookup data. All computed in the browser.
 */

const MM_PER_INCH = 25.4;
const MM_PER_MILE = 1609344; // 1 mile = 1609.344 m
const MM_PER_KM = 1000000;

export interface TireSpec { width: number; aspect: number; wheel: number }

/**
 * Parse a metric tire code like "225/45R17", "P225/45ZR17" or "225/45 R17".
 * width = section width (mm), aspect = aspect ratio (%), wheel = rim (inches).
 */
export function parseTire(code: string): TireSpec | null {
  const m = code.trim().toUpperCase().match(/(\d{3})\s*\/\s*(\d{2,3})\s*[A-Z]*R?\s*(\d{2}(?:\.\d)?)/);
  if (!m) return null;
  const width = +m[1], aspect = +m[2], wheel = +m[3];
  if (width < 100 || width > 400 || aspect < 20 || aspect > 100 || wheel < 8 || wheel > 30) return null;
  return { width, aspect, wheel };
}

export interface TireDims {
  sidewallMm: number;
  diameterMm: number;
  diameterIn: number;
  widthIn: number;
  circumferenceMm: number;
  revsPerMile: number;
  revsPerKm: number;
}

export function tireDims({ width, aspect, wheel }: TireSpec): TireDims {
  const sidewallMm = width * (aspect / 100);
  const diameterMm = wheel * MM_PER_INCH + 2 * sidewallMm;
  const circumferenceMm = Math.PI * diameterMm;
  return {
    sidewallMm,
    diameterMm,
    diameterIn: diameterMm / MM_PER_INCH,
    widthIn: width / MM_PER_INCH,
    circumferenceMm,
    revsPerMile: MM_PER_MILE / circumferenceMm,
    revsPerKm: MM_PER_KM / circumferenceMm,
  };
}

/**
 * Speedometer error when swapping from an original to a new tire. A larger new
 * tire makes the true speed HIGHER than the reading. Returns the true speed for
 * an indicated speed, and the percentage difference.
 */
export function speedoError(orig: TireDims, next: TireDims, indicated: number) {
  const ratio = next.diameterMm / orig.diameterMm;
  return { trueSpeed: indicated * ratio, pctDiff: (ratio - 1) * 100 };
}

/** Horsepower ↔ torque. hp = torque(lb-ft) × rpm / 5252 (5252 = 33000 / 2π). */
export const HP_CONST = 5252;
export function hpFromTorque(torqueLbFt: number, rpm: number) { return (torqueLbFt * rpm) / HP_CONST; }
export function torqueFromHp(hp: number, rpm: number) { return (hp * HP_CONST) / rpm; }
export const KW_PER_HP = 0.745699872;

/** Engine displacement: π/4 × bore² × stroke × cylinders. Bore/stroke in mm → cc. */
export function displacementCc(boreMm: number, strokeMm: number, cylinders: number) {
  const perCylMm3 = (Math.PI / 4) * boreMm * boreMm * strokeMm;
  return (perCylMm3 * cylinders) / 1000; // mm³ → cm³ (cc)
}
export const CI_PER_LITRE = 61.0237440947; // cubic inches per litre

/** Compression ratio = (swept + clearance) / clearance, per cylinder volumes in cc. */
export function compressionRatio(sweptCc: number, clearanceCc: number) {
  if (clearanceCc <= 0) return null;
  return (sweptCc + clearanceCc) / clearanceCc;
}

/**
 * Fuel-economy conversions. Definitional: US gal = 3.785411784 L,
 * UK gal = 4.54609 L, mile = 1.609344 km.
 */
export const FUEL = {
  usMpgToL100: 235.214583, // = 100 × 3.785411784 / 1.609344
  ukMpgToL100: 282.480936, // = 100 × 4.54609 / 1.609344
  kmPerLToL100: (kmpl: number) => 100 / kmpl,
};
export function fuelFromUsMpg(mpg: number) {
  const l100 = FUEL.usMpgToL100 / mpg;
  const kmpl = 100 / l100;
  return { usMpg: mpg, ukMpg: mpg * (4.54609 / 3.785411784), l100km: l100, kmPerL: kmpl };
}
export function fuelFromL100(l100: number) {
  const usMpg = FUEL.usMpgToL100 / l100;
  return { usMpg, ukMpg: FUEL.ukMpgToL100 / l100, l100km: l100, kmPerL: 100 / l100 };
}

/**
 * Gear / speed: road speed from engine rpm, tyre diameter and total drive ratio
 * (gearbox ratio × final-drive ratio). Returns km/h and mph.
 * wheel rpm = engine rpm / totalRatio; speed = wheelRpm × circumference.
 */
export function roadSpeed(rpm: number, totalRatio: number, tireDiameterMm: number) {
  if (totalRatio <= 0) return null;
  const wheelRpm = rpm / totalRatio;
  const circM = (Math.PI * tireDiameterMm) / 1000; // metres
  const metresPerMin = wheelRpm * circM;
  const kmh = (metresPerMin * 60) / 1000;
  return { kmh, mph: kmh / 1.609344, wheelRpm };
}
export function engineRpm(kmh: number, totalRatio: number, tireDiameterMm: number) {
  const circM = (Math.PI * tireDiameterMm) / 1000;
  const metresPerMin = (kmh * 1000) / 60;
  const wheelRpm = metresPerMin / circM;
  return wheelRpm * totalRatio;
}

/** Wheel offset ↔ backspacing. backspacing(mm) = width/2 + offset. */
export function wheelGeometry(widthIn: number, offsetMm: number) {
  const widthMm = widthIn * MM_PER_INCH;
  const backspacingMm = widthMm / 2 + offsetMm;
  return { backspacingMm, backspacingIn: backspacingMm / MM_PER_INCH, frontSpaceMm: widthMm / 2 - offsetMm };
}
export function offsetFromBackspacing(widthIn: number, backspacingIn: number) {
  const widthMm = widthIn * MM_PER_INCH;
  const backspacingMm = backspacingIn * MM_PER_INCH;
  return backspacingMm - widthMm / 2;
}

/* ---------------- EV charging time ---------------- */
/** Hours to charge from SoC% to SoC%. energy = batteryKwh × ΔSoC; time = energy ÷ (chargerKw × efficiency). */
export function evChargingTime(batteryKwh: number, socStart: number, socEnd: number, chargerKw: number, efficiency = 0.9) {
  if (chargerKw <= 0 || efficiency <= 0 || socEnd <= socStart) return null;
  const energyNeeded = batteryKwh * ((socEnd - socStart) / 100);
  const hours = energyNeeded / (chargerKw * efficiency);
  return { hours, energyNeeded };
}

/* ---------------- Power-to-weight ratio ---------------- */
/** Power (hp) and mass (kg) → common power-to-weight expressions. */
export function powerToWeight(hp: number, massKg: number) {
  if (massKg <= 0) return null;
  const kw = hp * 0.7456998715822702;
  return {
    hpPerTonne: (hp / massKg) * 1000,
    hpPerLb: hp / (massKg * 2.2046226218487757),
    wPerKg: (kw * 1000) / massKg,
    kwPerTonne: (kw / massKg) * 1000,
  };
}

/* ---------------- Stopping distance ---------------- */
/** Reaction + braking distance (m) from speed (km/h), reaction time (s) and tyre-road friction μ. */
export function stoppingDistance(speedKmh: number, reactionS: number, mu: number, g = 9.80665) {
  if (mu <= 0) return null;
  const v = speedKmh / 3.6; // m/s
  const reaction = v * reactionS;
  const braking = (v * v) / (2 * mu * g);
  return { reaction, braking, total: reaction + braking };
}

export { MM_PER_INCH };
