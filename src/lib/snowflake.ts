/**
 * Decode Snowflake IDs (Twitter/X, Discord, Instagram, and custom epochs) into
 * their embedded timestamp and machine/sequence fields. Pure and deterministic,
 * using BigInt for the 64-bit math. Snowflake layout: 41-bit millisecond
 * timestamp (since a service epoch) | 10-bit machine id (5 worker + 5 process on
 * Discord) | 12-bit per-ms sequence.
 */

export interface SnowflakePreset { id: string; name: string; epoch: number }
export const SNOWFLAKE_PRESETS: SnowflakePreset[] = [
  { id: 'discord', name: 'Discord', epoch: 1420070400000 },   // 2015-01-01
  { id: 'twitter', name: 'Twitter / X', epoch: 1288834974657 }, // 2010-11-04
  { id: 'instagram', name: 'Instagram', epoch: 1314220021721 }, // 2011-08-24 (Sharded IDs)
  { id: 'unix', name: 'Unix epoch (raw)', epoch: 0 },
];

export interface SnowflakeResult {
  id: string;
  timestampMs: number;
  isoDate: string;
  worker: number;   // (id >> 17) & 0x1F
  process: number;  // (id >> 12) & 0x1F
  machine: number;  // (id >> 12) & 0x3FF  (full 10-bit machine id)
  increment: number; // id & 0xFFF
  binary: string;
}

/** Decode a Snowflake ID string against the given service epoch (ms). */
export function decodeSnowflake(idStr: string, epoch: number): SnowflakeResult | null {
  const s = idStr.trim();
  if (!/^\d+$/.test(s)) return null;
  let id: bigint;
  try { id = BigInt(s); } catch { return null; }
  if (id < 0n || id > (1n << 64n) - 1n) return null;

  const timestampMs = Number((id >> 22n)) + epoch;
  const machine = Number((id >> 12n) & 0x3ffn);
  const worker = Number((id >> 17n) & 0x1fn);
  const process = Number((id >> 12n) & 0x1fn);
  const increment = Number(id & 0xfffn);

  const d = new Date(timestampMs);
  const isoDate = Number.isFinite(timestampMs) && timestampMs > 0 && !isNaN(d.getTime())
    ? d.toISOString()
    : 'invalid';

  return {
    id: s,
    timestampMs,
    isoDate,
    worker,
    process,
    machine,
    increment,
    binary: id.toString(2).padStart(64, '0'),
  };
}
