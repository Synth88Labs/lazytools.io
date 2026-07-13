import assert from 'node:assert';
import {
  downloadSeconds, formatDuration, breakdown,
  toBitsPerSecond, fromBitsPerSecond, SIZE_DECIMAL, SIZE_BINARY,
} from '../src/lib/network.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// 1 GB (decimal) over 100 Mbps = 1e9*8 / 1e8 = 80 s
near(downloadSeconds(1e9, 100e6), 80);
// 1 MB over 8 Mbps = 8e6 bits / 8e6 = 1 s
near(downloadSeconds(1e6, 8e6), 1);
// efficiency 0.5 doubles the time
near(downloadSeconds(1e6, 8e6, 0.5), 2);
// guards
assert.strictEqual(downloadSeconds(0, 1e6), 0);
assert.strictEqual(downloadSeconds(1e6, 0), 0);

// breakdown / format
let b = breakdown(3903); // 1h 5m 3s
assert.strictEqual(b.h, 1); assert.strictEqual(b.m, 5); assert.strictEqual(b.s, 3);
assert.strictEqual(formatDuration(3903), '1 h 5 m 3 s');
assert.strictEqual(formatDuration(80), '1 m 20 s');
assert.strictEqual(formatDuration(0.5), '0.50 s');
assert.strictEqual(formatDuration(90061), '1 d 1 h 1 m 1 s');

// bandwidth conversion: 100 Mbps = 12.5 MB/s
near(fromBitsPerSecond(toBitsPerSecond(100, 'Mbps')!, 'MB/s')!, 12.5);
// 1 MB/s = 8 Mbps
near(fromBitsPerSecond(toBitsPerSecond(1, 'MB/s')!, 'Mbps')!, 8);
// round-trip identity
near(fromBitsPerSecond(toBitsPerSecond(2.5, 'Gbps')!, 'Gbps')!, 2.5);
// unknown unit → null
assert.strictEqual(toBitsPerSecond(1, 'nope'), null);

// size tables
assert.strictEqual(SIZE_DECIMAL.GB, 1e9);
assert.strictEqual(SIZE_BINARY.GiB, 2 ** 30);
assert.ok(SIZE_BINARY.MiB > SIZE_DECIMAL.MB); // MiB (1048576) > MB (1000000)

console.log('network: all assertions passed');
