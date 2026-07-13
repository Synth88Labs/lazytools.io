import assert from 'node:assert';
import { DEV } from '../src/lib/dev-compute.ts';

const qs = DEV.querystring;

// Parse a plain query string
let r = qs('q=hello+world&page=2', { mode: 'parse' });
assert.deepStrictEqual(JSON.parse(r.output), { q: 'hello world', page: '2' });

// Parse a full URL (strips scheme/path and #fragment)
r = qs('https://example.com/search?a=1&b=two#frag', { mode: 'parse' });
assert.deepStrictEqual(JSON.parse(r.output), { a: '1', b: 'two' });

// Repeated keys → array
r = qs('tag=x&tag=y&tag=z', { mode: 'parse' });
assert.deepStrictEqual(JSON.parse(r.output), { tag: ['x', 'y', 'z'] });

// URL-encoded values decode
r = qs('name=John%20Doe&city=S%C3%A3o%20Paulo', { mode: 'parse' });
assert.deepStrictEqual(JSON.parse(r.output), { name: 'John Doe', city: 'São Paulo' });

// Empty → {}
assert.strictEqual(qs('', { mode: 'parse' }).output, '{}');
assert.strictEqual(qs('https://x.com/', { mode: 'parse' }).output, '{}');

// Key with no value
r = qs('flag&x=1', { mode: 'parse' });
assert.deepStrictEqual(JSON.parse(r.output), { flag: '', x: '1' });

// Build: JSON → query string
r = qs('{"q":"hello world","page":2}', { mode: 'build' });
assert.strictEqual(r.output, 'q=hello%20world&page=2');
// Build with array → repeated key
r = qs('{"tag":["x","y"]}', { mode: 'build' });
assert.strictEqual(r.output, 'tag=x&tag=y');
// Round-trip: parse then build
const parsed = qs('a=1&b=hello%20there', { mode: 'parse' }).output;
assert.strictEqual(qs(parsed, { mode: 'build' }).output, 'a=1&b=hello%20there');

// Build errors on non-object
assert.throws(() => qs('not json', { mode: 'build' }));
assert.throws(() => qs('[1,2,3]', { mode: 'build' }));

console.log('dev-querystring: all assertions passed');
