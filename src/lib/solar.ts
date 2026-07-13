/**
 * Solar & off-grid energy math. Standard sizing formulas used across the solar
 * industry (daily production from peak sun hours, battery-bank Amp-hours from
 * load and depth of discharge, inverter sizing, DC voltage drop, charge time).
 * Reference values (peak sun hours, system derate, depth of discharge) are
 * cited on each tool page — do not invent them; verify against NREL/PVWatts and
 * battery-manufacturer references, and note that they vary by site and product.
 */

/** Copper resistivity, Ω·m (for DC voltage-drop). Matches the electronics lib. */
export const COPPER_RESISTIVITY = 1.68e-8;

/**
 * Daily/monthly/annual solar production (kWh) from an array.
 *   daily kWh = panel watts × peak sun hours × derate ÷ 1000
 */
export function solarProduction(totalWatts: number, peakSunHours: number, derate: number): { dailyKwh: number; monthlyKwh: number; annualKwh: number } | null {
  if (totalWatts < 0 || peakSunHours < 0 || derate <= 0) return null;
  const dailyKwh = (totalWatts * peakSunHours * derate) / 1000;
  return { dailyKwh, monthlyKwh: dailyKwh * 30.4368, annualKwh: dailyKwh * 365.25 };
}

/** Number of panels needed to hit a daily-kWh target. */
export function panelsForTarget(dailyKwhTarget: number, panelWatts: number, peakSunHours: number, derate: number): number | null {
  if (dailyKwhTarget <= 0 || panelWatts <= 0 || peakSunHours <= 0 || derate <= 0) return null;
  const perPanelDaily = (panelWatts * peakSunHours * derate) / 1000;
  return dailyKwhTarget / perPanelDaily;
}

export interface Appliance { name: string; watts: number; hoursPerDay: number; qty: number; }
/** Total daily energy (Wh) from a list of appliances. */
export function dailyLoadWh(appliances: Appliance[]): number {
  return appliances.reduce((sum, a) => sum + a.watts * a.hoursPerDay * (a.qty || 1), 0);
}

/** Depth-of-discharge presets by battery chemistry (fraction usable). */
export const DOD_PRESETS: { name: string; dod: number; note: string }[] = [
  { name: 'Flooded lead-acid', dod: 0.5, note: 'Discharge to ~50% to preserve cycle life.' },
  { name: 'AGM / sealed lead-acid', dod: 0.5, note: 'Also ~50% recommended for longevity.' },
  { name: 'LiFePO4 (lithium)', dod: 0.8, note: 'Typically 80% usable (many rated to 100%, but 80% extends life).' },
];

/**
 * Battery-bank sizing.
 *   usable Wh  = daily load × days of autonomy
 *   nominal Wh = usable ÷ depth of discharge
 *   Amp-hours  = nominal Wh ÷ system voltage
 */
export function batteryBank(dailyLoadWh: number, daysAutonomy: number, dod: number, systemVoltage: number): { usableWh: number; nominalWh: number; ampHours: number } | null {
  if (dailyLoadWh < 0 || daysAutonomy <= 0 || dod <= 0 || dod > 1 || systemVoltage <= 0) return null;
  const usableWh = dailyLoadWh * daysAutonomy;
  const nominalWh = usableWh / dod;
  return { usableWh, nominalWh, ampHours: nominalWh / systemVoltage };
}

/**
 * Inverter sizing.
 *   continuous ≥ running watts × headroom (default 1.25)
 *   surge      ≥ largest motor's surge (running × surge factor)
 */
export function inverterSize(runningWatts: number, surgeWatts: number, headroom = 1.25): { continuous: number; surge: number } | null {
  if (runningWatts < 0 || surgeWatts < 0 || headroom < 1) return null;
  return { continuous: runningWatts * headroom, surge: Math.max(surgeWatts, runningWatts * headroom) };
}

/**
 * DC voltage drop over a wire run.
 *   Vdrop = 2 × length × current × ρ ÷ area   (round trip, single conductor area)
 * length in metres, area in mm² (converted to m²), returns volts + percent.
 */
export function voltageDrop(lengthM: number, currentA: number, areaMm2: number, systemVoltage: number, resistivity = COPPER_RESISTIVITY): { drop: number; percent: number; endVoltage: number } | null {
  if (lengthM <= 0 || currentA < 0 || areaMm2 <= 0 || systemVoltage <= 0) return null;
  const areaM2 = areaMm2 * 1e-6;
  const drop = (2 * lengthM * currentA * resistivity) / areaM2;
  return { drop, percent: (drop / systemVoltage) * 100, endVoltage: systemVoltage - drop };
}

/** Current a load draws at a system voltage (P = VI). */
export const currentForLoad = (watts: number, volts: number) => (volts > 0 ? watts / volts : 0);

/**
 * Battery charge time.
 *   hours ≈ (Ah ÷ charge current) × inefficiency   (default 1.15 for losses)
 *   C-rate = charge current ÷ Ah
 */
export function chargeTime(ampHours: number, chargeCurrentA: number, inefficiency = 1.15): { hours: number; cRate: number } | null {
  if (ampHours <= 0 || chargeCurrentA <= 0 || inefficiency < 1) return null;
  return { hours: (ampHours / chargeCurrentA) * inefficiency, cRate: chargeCurrentA / ampHours };
}

/** Appliance energy use and running cost. */
export function applianceCost(watts: number, hoursPerDay: number, ratePerKwh: number): { dailyKwh: number; dailyCost: number; monthlyCost: number; annualCost: number; annualKwh: number } | null {
  if (watts < 0 || hoursPerDay < 0 || ratePerKwh < 0) return null;
  const dailyKwh = (watts * hoursPerDay) / 1000;
  const dailyCost = dailyKwh * ratePerKwh;
  return { dailyKwh, dailyCost, monthlyCost: dailyCost * 30.4368, annualCost: dailyCost * 365.25, annualKwh: dailyKwh * 365.25 };
}

/**
 * Simple solar payback / savings.
 *   annual savings = annual production (kWh) × electricity rate
 *   payback years  = net system cost ÷ annual savings
 */
export function solarPayback(netCost: number, annualKwh: number, ratePerKwh: number): { annualSavings: number; paybackYears: number; savings25yr: number } | null {
  if (netCost < 0 || annualKwh < 0 || ratePerKwh < 0) return null;
  const annualSavings = annualKwh * ratePerKwh;
  if (annualSavings <= 0) return null;
  return { annualSavings, paybackYears: netCost / annualSavings, savings25yr: annualSavings * 25 - netCost };
}

/** A few common household appliance wattages (reference starting points; actual varies). */
export const APPLIANCE_PRESETS: { name: string; watts: number }[] = [
  { name: 'LED light bulb', watts: 10 },
  { name: 'Laptop', watts: 60 },
  { name: 'LED TV', watts: 100 },
  { name: 'Fridge (running avg)', watts: 150 },
  { name: 'Wi-Fi router', watts: 10 },
  { name: 'Phone charger', watts: 10 },
  { name: 'Ceiling fan', watts: 70 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Coffee maker', watts: 900 },
  { name: 'Water pump', watts: 250 },
];

/* ---------------- Panel tilt angle ---------------- */

export interface TiltResult {
  yearRound: number;
  summer: number;
  winter: number;
}
/**
 * Optimal fixed panel tilt (degrees from horizontal) by latitude. Year-round
 * uses the widely-cited Landau refinement of the "tilt ≈ latitude" rule, which
 * gives a slightly shallower angle; summer and winter apply the standard
 * ±15° seasonal adjustment. Uses the absolute latitude (works for either
 * hemisphere); panels face the equator.
 */
export function solarTilt(latitudeDeg: number): TiltResult {
  const lat = Math.abs(latitudeDeg);
  let yearRound: number;
  if (lat < 25) yearRound = lat * 0.87;
  else if (lat <= 50) yearRound = lat * 0.76 + 3.1;
  else yearRound = lat * 0.89; // high latitudes, approximate
  return {
    yearRound,
    summer: Math.max(0, lat - 15),
    winter: Math.min(90, lat + 15),
  };
}

/* ---------------- Array wiring ---------------- */

export interface ArrayResult {
  panels: number;
  voc: number;
  isc: number;
  power: number;
}
/**
 * Total array electrical figures for panels wired in series strings and
 * parallel: series multiplies voltage (Voc × series), parallel multiplies
 * current (Isc × parallel), and total power is the sum of all panels
 * (Pmax × series × parallel). Check the string Voc against your charge
 * controller / inverter maximum input voltage.
 */
export function arrayWiring(series: number, parallel: number, voc: number, isc: number, pmax: number): ArrayResult | null {
  if (series < 1 || parallel < 1 || voc <= 0 || isc <= 0 || pmax <= 0) return null;
  const s = Math.floor(series), p = Math.floor(parallel);
  return {
    panels: s * p,
    voc: voc * s,
    isc: isc * p,
    power: pmax * s * p,
  };
}
