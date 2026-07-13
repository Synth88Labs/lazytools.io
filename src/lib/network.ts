/**
 * Networking math: download/upload time and bandwidth-unit conversion. Pure
 * arithmetic on the standard bit/byte definitions — a byte is 8 bits, network
 * speeds are quoted in decimal bits per second (kilo = 1000), and file sizes
 * are given in either decimal (MB = 10⁶ B) or binary (MiB = 2²⁰ B) units.
 */

/** Decimal (SI) file-size multipliers, bytes. */
export const SIZE_DECIMAL: Record<string, number> = {
  B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12,
};
/** Binary (IEC) file-size multipliers, bytes. */
export const SIZE_BINARY: Record<string, number> = {
  B: 1, KiB: 2 ** 10, MiB: 2 ** 20, GiB: 2 ** 30, TiB: 2 ** 40,
};
/** Connection-speed multipliers, bits per second (decimal, as ISPs quote). */
export const SPEED_BPS: Record<string, number> = {
  'bps': 1, 'Kbps': 1e3, 'Mbps': 1e6, 'Gbps': 1e9,
};

/**
 * Download/upload time in seconds for a file of `bytes` over a link of
 * `speedBps` bits per second. An optional `efficiency` (0–1) models real-world
 * throughput after protocol overhead — e.g. 0.9 for ~10% TCP/IP overhead.
 */
export function downloadSeconds(bytes: number, speedBps: number, efficiency = 1): number {
  if (bytes <= 0 || speedBps <= 0 || efficiency <= 0) return 0;
  return (bytes * 8) / (speedBps * efficiency);
}

/** Break a duration in seconds into d/h/m/s parts. */
export function breakdown(totalSeconds: number): { d: number; h: number; m: number; s: number } {
  let s = Math.max(0, totalSeconds);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  return { d, h, m, s };
}

/** Human-readable duration, e.g. "1 h 5 m 3 s" (drops leading zero units). */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 1) return `${totalSeconds.toFixed(2)} s`;
  const { d, h, m, s } = breakdown(totalSeconds);
  const parts: string[] = [];
  if (d) parts.push(`${d} d`);
  if (h) parts.push(`${h} h`);
  if (m) parts.push(`${m} m`);
  if (s || parts.length === 0) parts.push(`${Math.round(s)} s`);
  return parts.join(' ');
}

/**
 * Convert a bandwidth value between units. Recognised units: bit-rates
 * bps/Kbps/Mbps/Gbps and byte-rates B/s, KB/s, MB/s, GB/s (decimal). Returns
 * the value in bits per second as the common base, plus the requested target.
 */
export function toBitsPerSecond(value: number, unit: string): number | null {
  if (SPEED_BPS[unit] != null) return value * SPEED_BPS[unit];
  const byteRates: Record<string, number> = { 'B/s': 8, 'KB/s': 8e3, 'MB/s': 8e6, 'GB/s': 8e9 };
  if (byteRates[unit] != null) return value * byteRates[unit];
  return null;
}
export function fromBitsPerSecond(bps: number, unit: string): number | null {
  if (SPEED_BPS[unit] != null) return bps / SPEED_BPS[unit];
  const byteRates: Record<string, number> = { 'B/s': 8, 'KB/s': 8e3, 'MB/s': 8e6, 'GB/s': 8e9 };
  if (byteRates[unit] != null) return bps / byteRates[unit];
  return null;
}
