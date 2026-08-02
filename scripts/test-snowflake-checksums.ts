import { decodeSnowflake, SNOWFLAKE_PRESETS } from '../src/lib/snowflake.ts';
import { adler32, checksumText, crc32 } from '../src/lib/checksums.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- Snowflake (Discord) ----
// Documented Discord example: 175928847299117063 → 2016-04-30T11:18:25.796Z, worker 1, process 0, increment 7
const disc = decodeSnowflake('175928847299117063', 1420070400000)!;
ok('discord worker=1', disc.worker === 1);
ok('discord process=0', disc.process === 0);
ok('discord increment=7', disc.increment === 7);
ok('discord date 2016-04-30', disc.isoDate.startsWith('2016-04-30T11:18:25'));
ok('discord timestampMs', disc.timestampMs === 1462015105796);
ok('discord binary 64 bits', disc.binary.length === 64);

// preset exists
ok('discord preset epoch', SNOWFLAKE_PRESETS.find(p => p.id === 'discord')!.epoch === 1420070400000);
ok('twitter preset epoch', SNOWFLAKE_PRESETS.find(p => p.id === 'twitter')!.epoch === 1288834974657);

// twitter epoch decode: a known tweet id 20 (first tweet) has ts 0 offset issues; use a modern id
// 1541815603606036480 (Twitter epoch) → 2022-06-28 area
const tw = decodeSnowflake('1541815603606036480', 1288834974657)!;
ok('twitter decodes to 2022', tw.isoDate.startsWith('2022-'));

// invalid
ok('rejects non-numeric', decodeSnowflake('abc', 0) === null);
ok('rejects empty', decodeSnowflake('', 0) === null);

// raw unix epoch: (id>>22) is the ms directly
const raw = decodeSnowflake(String((1700000000000n << 22n)), 0)!;
ok('raw unix epoch timestamp', raw.timestampMs === 1700000000000);

// ---- Adler-32 known vectors ----
// adler32("Wikipedia") = 0x11E60398 (300286872)
ok('adler32 "Wikipedia" = 0x11E60398', checksumText('Wikipedia').adler32Hex === '11E60398');
// adler32("") = 1
ok('adler32 empty = 1', adler32(new Uint8Array(0)) === 1);
// adler32("abc") = 0x024D0127
ok('adler32 "abc"', checksumText('abc').adler32Hex === '024D0127');

// ---- CRC-32 known vectors ----
// crc32("The quick brown fox jumps over the lazy dog") = 0x414FA339
ok('crc32 quick brown fox', checksumText('The quick brown fox jumps over the lazy dog').crc32Hex === '414FA339');
// crc32("123456789") = 0xCBF43926 (the standard CRC-32 check value)
ok('crc32 "123456789" = CBF43926', checksumText('123456789').crc32Hex === 'CBF43926');
// crc32("") = 0
ok('crc32 empty = 0', crc32(new Uint8Array(0)) === 0);

// byte count
ok('byte count utf-8', checksumText('héllo').bytes === 6); // é is 2 bytes

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
