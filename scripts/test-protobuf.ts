import { decodeProtobuf, decodeMessage, bytesFromInput, type WireField } from '../src/lib/protobuf.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- Canonical example from Google's protobuf encoding docs ----
// message Test1 { int32 a = 1; }  a = 150  →  08 96 01
const f1 = decodeProtobuf('08 96 01');
ok('field 1 present', f1.length === 1 && f1[0]!.field === 1);
ok('field 1 varint 150', f1[0]!.wire === 'varint' && (f1[0] as any).uint === '150');

// message Test2 { string b = 2; }  b = "testing"  →  12 07 74 65 73 74 69 6e 67
const f2 = decodeProtobuf('12 07 74 65 73 74 69 6e 67');
ok('field 2 string', f2[0]!.field === 2 && f2[0]!.wire === 'len' && (f2[0] as any).kind === 'string');
ok('field 2 = testing', (f2[0] as any).text === 'testing');

// base64 of the same "testing" message decodes identically
const b64 = Buffer.from([0x12, 0x07, 0x74, 0x65, 0x73, 0x74, 0x69, 0x6e, 0x67]).toString('base64');
ok('base64 input works', (decodeProtobuf(b64)[0] as any).text === 'testing');

// ---- Nested message: field 3 = Test1{a:150}  →  1a 03 08 96 01 ----
const nested = decodeProtobuf('1a 03 08 96 01');
ok('field 3 nested message', nested[0]!.field === 3 && (nested[0] as any).kind === 'message');
ok('nested inner field', (nested[0] as any).fields[0].field === 1 && (nested[0] as any).fields[0].uint === '150');

// ---- Multiple fields + zigzag (sint) ----
// field 4 varint 3  →  20 03 ; zigzag(3)= (3>>1)^-(3&1)= 1 ^ -1 = -2
const zz = decodeProtobuf('20 03');
ok('varint uint 3', (zz[0] as any).uint === '3');
ok('varint sint zigzag -2', (zz[0] as any).sint === '-2');

// ---- i32 (wire type 5): field 5 = float ; 5 fixed32 tag = (5<<3)|5 = 0x2d ----
// value 1.0 as float LE = 00 00 80 3f
const i32 = decodeProtobuf('2d 00 00 80 3f');
ok('i32 field 5', i32[0]!.field === 5 && i32[0]!.wire === 'i32');
ok('i32 float 1.0', (i32[0] as any).float === 1 && (i32[0] as any).uint === 1065353216);

// ---- i64 (wire type 1): field 6 = double ; tag = (6<<3)|1 = 0x31 ----
// value 2.0 as double LE = 00 00 00 00 00 00 00 40
const i64 = decodeProtobuf('31 00 00 00 00 00 00 00 40');
ok('i64 field 6', i64[0]!.field === 6 && i64[0]!.wire === 'i64');
ok('i64 double 2.0', (i64[0] as any).double === 2);

// ---- large varint stays exact via BigInt ----
// field 1 varint = 300 → 08 ac 02
ok('varint 300', (decodeProtobuf('08 ac 02')[0] as any).uint === '300');
// a 64-bit value: field 1 = 0xFFFFFFFFFFFFFFFF (max uint64) varint
const maxv = decodeProtobuf('08 ff ff ff ff ff ff ff ff ff 01');
ok('varint max uint64', (maxv[0] as any).uint === '18446744073709551615');

// ---- input parsing: hex with 0x and commas ----
ok('0x + commas hex', decodeProtobuf('0x08,0x96,0x01')[0]!.field === 1);

// ---- rejections ----
const reject = (s: string, label: string) => { let t = false; try { decodeProtobuf(s); } catch { t = true; } ok(label, t); };
reject('08', 'truncated varint throws');
reject('', 'empty throws');
reject('0d 00 00 80', 'truncated i32 throws'); // wire 5 needs 4 bytes

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
