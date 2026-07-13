/**
 * Fitness & Exercise math. These are published exercise-science formulas
 * (Epley, Brzycki, Tanaka, Karvonen, Riegel, Cooper) and the standard MET
 * energy equation — each cited on its tool page. MET values are from the
 * Compendium of Physical Activities (Ainsworth et al.). Do not invent constants.
 */

const M_PER_MILE = 1609.344;

/* ---------------- Pace ---------------- */

/** From distance (metres) and time (seconds): pace per km/mile and speed. */
export function pace(distanceM: number, timeSec: number) {
  if (distanceM <= 0 || timeSec <= 0) return null;
  const secPerKm = timeSec / (distanceM / 1000);
  const secPerMile = timeSec / (distanceM / M_PER_MILE);
  const kmh = (distanceM / 1000) / (timeSec / 3600);
  return { secPerKm, secPerMile, kmh, mph: kmh / 1.609344 };
}

/** Distance (m) from pace (sec per km) and time (sec). */
export function distanceFromPace(secPerKm: number, timeSec: number) {
  if (secPerKm <= 0) return 0;
  return (timeSec / secPerKm) * 1000;
}
/** Time (sec) from pace (sec per km) and distance (m). */
export function timeFromPace(secPerKm: number, distanceM: number) {
  return secPerKm * (distanceM / 1000);
}

export function fmtDuration(totalSec: number): string {
  if (!isFinite(totalSec) || totalSec < 0) return '—';
  const s = Math.round(totalSec);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}
export function fmtPace(secPerUnit: number, unit: string): string {
  if (!isFinite(secPerUnit) || secPerUnit <= 0) return '—';
  const m = Math.floor(secPerUnit / 60), s = Math.round(secPerUnit % 60);
  return `${m}:${String(s).padStart(2, '0')} /${unit}`;
}

/* ---------------- 1RM ---------------- */

/** Epley: 1RM = w × (1 + reps/30). Exact for reps ≥ 1; reps=1 returns w. */
export function epley1RM(weight: number, reps: number) {
  if (reps <= 1) return weight;
  return weight * (1 + reps / 30);
}
/** Brzycki: 1RM = w × 36 / (37 − reps). Valid for reps < 37. */
export function brzycki1RM(weight: number, reps: number) {
  if (reps <= 1) return weight;
  if (reps >= 37) return null;
  return weight * 36 / (37 - reps);
}
/** Lombardi: 1RM = w × reps^0.1. */
export function lombardi1RM(weight: number, reps: number) {
  if (reps <= 1) return weight;
  return weight * Math.pow(reps, 0.1);
}
/** Percentage-of-1RM table (Epley basis): weight you could lift for n reps. */
export function repWeight(oneRM: number, reps: number) {
  return oneRM / (1 + reps / 30);
}

/* ---------------- Heart rate ---------------- */

/** Traditional (Fox/Haskell) max HR — a rough approximation. */
export const maxHrTraditional = (age: number) => 220 - age;
/** Tanaka, Monahan & Seals (2001): HRmax = 208 − 0.7 × age. */
export const maxHrTanaka = (age: number) => 208 - 0.7 * age;
/** Gulati et al. (2010), for women: HRmax = 206 − 0.88 × age. */
export const maxHrGulati = (age: number) => 206 - 0.88 * age;

/** Karvonen (heart-rate reserve): target = (HRmax − HRrest) × intensity + HRrest. */
export function karvonen(maxHr: number, restHr: number, intensity: number) {
  return (maxHr - restHr) * intensity + restHr;
}

export interface HrZone { name: string; lo: number; hi: number; desc: string }
export const HR_ZONES: { name: string; lo: number; hi: number; desc: string }[] = [
  { name: 'Zone 1', lo: 0.5, hi: 0.6, desc: 'Very light — warm-up, recovery' },
  { name: 'Zone 2', lo: 0.6, hi: 0.7, desc: 'Light — fat burn, base endurance' },
  { name: 'Zone 3', lo: 0.7, hi: 0.8, desc: 'Moderate — aerobic, stamina' },
  { name: 'Zone 4', lo: 0.8, hi: 0.9, desc: 'Hard — anaerobic threshold' },
  { name: 'Zone 5', lo: 0.9, hi: 1.0, desc: 'Maximum — VO₂ max, sprints' },
];

/* ---------------- Race prediction (Riegel) ---------------- */

/** Riegel: t2 = t1 × (d2/d1)^1.06. Times in seconds, distances in metres. */
export const RIEGEL_EXP = 1.06;
export function riegel(t1Sec: number, d1M: number, d2M: number) {
  if (d1M <= 0 || t1Sec <= 0) return null;
  return t1Sec * Math.pow(d2M / d1M, RIEGEL_EXP);
}

/* ---------------- VO2 max (Cooper) ---------------- */

/** Cooper 12-minute run: VO2max (ml/kg/min) = (distance_m − 504.9) / 44.73. */
export function cooperVo2(distanceM: number) {
  return (distanceM - 504.9) / 44.73;
}

/* ---------------- Calories (MET) ---------------- */

export interface Activity { id: string; name: string; met: number }
/**
 * Representative MET values, Compendium of Physical Activities (Ainsworth et al.,
 * Med Sci Sports Exerc 2011;43(8):1575–1581 / pacompendium.com). METs vary with
 * intensity — these are single representative values.
 */
export const ACTIVITIES: Activity[] = [
  { id: 'walk-25', name: 'Walking, 2.5 mph (level)', met: 3.0 },
  { id: 'walk-mod', name: 'Walking, 3.0 mph (moderate)', met: 3.5 },
  { id: 'walk-brisk', name: 'Walking, 3.5–3.9 mph (brisk)', met: 4.8 },
  { id: 'run-5', name: 'Running, 5 mph (12 min/mile)', met: 8.5 },
  { id: 'run-6', name: 'Running, 6 mph (10 min/mile)', met: 9.3 },
  { id: 'run-7', name: 'Running, 7 mph (8.5 min/mile)', met: 11.0 },
  { id: 'run-8', name: 'Running, 8 mph (7.5 min/mile)', met: 12.0 },
  { id: 'cycle-mod', name: 'Cycling, 12–13.9 mph (moderate)', met: 8.0 },
  { id: 'cycle-vig', name: 'Cycling, 14–15.9 mph (vigorous)', met: 10.0 },
  { id: 'cycle-stationary', name: 'Stationary cycling, moderate', met: 6.0 },
  { id: 'swim', name: 'Swimming laps, freestyle (recreational)', met: 5.8 },
  { id: 'row-mod', name: 'Rowing machine, 100–149 W (moderate)', met: 7.5 },
  { id: 'row-vig', name: 'Rowing machine, 150–199 W (vigorous)', met: 11.0 },
  { id: 'elliptical', name: 'Elliptical trainer, moderate', met: 5.0 },
  { id: 'weights', name: 'Weight training, light/moderate (8–15 reps)', met: 3.5 },
  { id: 'weights-vig', name: 'Weight training, vigorous (powerlifting)', met: 6.0 },
  { id: 'yoga', name: 'Yoga, hatha', met: 2.5 },
  { id: 'hike', name: 'Hiking, cross-country', met: 6.0 },
  { id: 'stairs', name: 'Stair-treadmill ergometer', met: 9.3 },
  { id: 'basketball', name: 'Basketball, game', met: 8.0 },
  { id: 'tennis', name: 'Tennis, singles', met: 8.0 },
  { id: 'dance-ballroom', name: 'Dancing, ballroom (fast)', met: 5.5 },
  { id: 'dance-aerobic', name: 'Dancing, aerobic (vigorous)', met: 7.3 },
];
export const getActivity = (id: string) => ACTIVITIES.find((a) => a.id === id);

/** ACSM: kcal/min = MET × 3.5 × weightKg / 200. Returns total kcal for minutes. */
export function caloriesBurned(met: number, weightKg: number, minutes: number) {
  const perMin = (met * 3.5 * weightKg) / 200;
  return perMin * minutes;
}

/* ---------------- Steps ---------------- */

/** Estimate stride length (m) from height (cm): walking ≈ 0.414 × height. */
export function strideFromHeight(heightCm: number) { return (heightCm / 100) * 0.414; }
export function stepsDistance(steps: number, strideM: number) {
  const metres = steps * strideM;
  return { metres, km: metres / 1000, miles: metres / M_PER_MILE };
}

export { M_PER_MILE };
