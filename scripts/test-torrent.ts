import { createHash } from 'node:crypto';
import { decodeBencode, parseTorrent } from '../src/lib/torrent.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- minimal bencode encoder to build fixtures ----
const enc = new TextEncoder();
const cat = (arrs: Uint8Array[]) => { const n = arrs.reduce((a, x) => a + x.length, 0); const o = new Uint8Array(n); let i = 0; for (const a of arrs) { o.set(a, i); i += a.length; } return o; };
function bint(n: number) { return enc.encode(`i${n}e`); }
function bstr(s: string | Uint8Array) { const b = typeof s === 'string' ? enc.encode(s) : s; return cat([enc.encode(`${b.length}:`), b]); }
function blist(...items: Uint8Array[]) { return cat([enc.encode('l'), ...items, enc.encode('e')]); }
function bdict(pairs: [string, Uint8Array][]) { return cat([enc.encode('d'), ...pairs.flatMap(([k, v]) => [bstr(k), v]), enc.encode('e')]); }

// ---- bencode decoder sanity ----
ok('decode int', decodeBencode(enc.encode('i42e')) === 42n);
ok('decode negative int', decodeBencode(enc.encode('i-7e')) === -7n);
ok('decode string', new TextDecoder().decode(decodeBencode(enc.encode('4:spam')) as Uint8Array) === 'spam');
const list = decodeBencode(enc.encode('l4:spami42ee')) as any[];
ok('decode list', list.length === 2 && list[1] === 42n);
const dict = decodeBencode(enc.encode('d3:bar4:spam3:fooi42ee')) as Map<string, any>;
ok('decode dict', dict.get('foo') === 42n && new TextDecoder().decode(dict.get('bar')) === 'spam');

// ---- build a single-file torrent ----
const pieces = new Uint8Array(40); for (let i = 0; i < 40; i++) pieces[i] = i; // 2 pieces (20 bytes each)
// info dict keys sorted: length, name, piece length, pieces, private
const infoBytes = bdict([
  ['length', bint(2048)],
  ['name', bstr('holiday.mp4')],
  ['piece length', bint(16384)],
  ['pieces', bstr(pieces)],
  ['private', bint(1)],
]);
const torrent = bdict([
  ['announce', bstr('http://tracker.example.com/announce')],
  ['announce-list', blist(blist(bstr('http://tracker.example.com/announce')), blist(bstr('udp://backup.example.net:6969')))],
  ['comment', bstr('A test torrent')],
  ['created by', bstr('LazyTools/1.0')],
  ['creation date', bint(1700000000)],
  ['info', infoBytes],
]);

// independent SHA-1 of the exact info bytes (node:crypto, a different impl from crypto.subtle)
const expectedHash = createHash('sha1').update(Buffer.from(infoBytes)).digest('hex');

const t = await parseTorrent(torrent);
ok('name', t.name === 'holiday.mp4');
ok('info-hash matches node:crypto SHA-1', t.infoHash === expectedHash);
ok('info-hash is 40 hex chars', /^[0-9a-f]{40}$/.test(t.infoHash));
ok('announce', t.announce === 'http://tracker.example.com/announce');
ok('announce-list flattened', t.announceList.length === 2 && t.announceList[1] === 'udp://backup.example.net:6969');
ok('comment', t.comment === 'A test torrent');
ok('created by', t.createdBy === 'LazyTools/1.0');
ok('creation date', t.creationDate === '2023-11-14T22:13:20Z');
ok('piece length', t.pieceLength === 16384);
ok('piece count 2', t.pieceCount === 2);
ok('total size single', t.totalSize === 2048);
ok('single file', t.single === true && t.files.length === 1 && t.files[0]!.path === 'holiday.mp4');
ok('private flag', t.isPrivate === true);

// ---- multi-file torrent ----
const mInfo = bdict([
  ['files', blist(
    bdict([['length', bint(100)], ['path', blist(bstr('docs'), bstr('readme.txt'))]]),
    bdict([['length', bint(2900)], ['path', blist(bstr('video.mkv'))]]),
  )],
  ['name', bstr('MyRelease')],
  ['piece length', bint(32768)],
  ['pieces', bstr(new Uint8Array(20))],
]);
const mTorrent = bdict([['announce', bstr('http://t/')], ['info', mInfo]]);
const mt = await parseTorrent(mTorrent);
ok('multi not single', mt.single === false);
ok('multi 2 files', mt.files.length === 2);
ok('multi nested path joined', mt.files[0]!.path === 'docs/readme.txt');
ok('multi total size', mt.totalSize === 3000);
ok('multi info-hash cross-check', mt.infoHash === createHash('sha1').update(Buffer.from(mInfo)).digest('hex'));

// ---- rejections ----
let threw = false; try { await parseTorrent(enc.encode('4:spam')); } catch { threw = true; }
ok('rejects non-dict', threw);
let threw2 = false; try { decodeBencode(enc.encode('i12')); } catch { threw2 = true; }
ok('rejects unterminated int', threw2);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
