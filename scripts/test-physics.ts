import { solveSuvat } from '../src/lib/physics.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol: number, msg: string) => {
  if (Math.abs(a - b) <= tol) pass++; else { fail++; console.log(`FAIL ${msg}: got ${a}, expected ${b}`); }
};

// car: u=0, a=2, t=5 -> v=10, s=25
let r = solveSuvat({ u: 0, a: 2, t: 5 })!;
approx(r.v, 10, 1e-9, 'v (u,a,t)'); approx(r.s, 25, 1e-9, 's (u,a,t)');

// u=0, v=30, t=6 -> a=5, s=90
r = solveSuvat({ u: 0, v: 30, t: 6 })!;
approx(r.a, 5, 1e-9, 'a (u,v,t)'); approx(r.s, 90, 1e-9, 's (u,v,t)');

// v²=u²+2as: u=0, a=9.8, s=20 -> v=√392=19.799, t=v/a
r = solveSuvat({ u: 0, a: 9.8, s: 20 })!;
approx(r.v, Math.sqrt(392), 1e-6, 'v (u,a,s)'); approx(r.t, Math.sqrt(392) / 9.8, 1e-6, 't (u,a,s)');

// u=5, v=25, s=60 -> a=(625-25)/120=5, t=(v-u)/a=4
r = solveSuvat({ u: 5, v: 25, s: 60 })!;
approx(r.a, 5, 1e-9, 'a (u,v,s)'); approx(r.t, 4, 1e-9, 't (u,v,s)');

// projectile vertical: u=20, a=-9.8, v=0 (apex) -> t=2.041, s=20.408
r = solveSuvat({ u: 20, a: -9.8, v: 0 })!;
approx(r.t, 20 / 9.8, 1e-6, 't apex'); approx(r.s, 400 / (2 * 9.8), 1e-4, 's apex');

// s,t unknown: u=10, v=20, a=2 -> t=5, s=75
r = solveSuvat({ u: 10, v: 20, a: 2 })!;
approx(r.t, 5, 1e-9, 't (u,v,a)'); approx(r.s, 75, 1e-9, 's (u,v,a)');

// u,v unknown: a=2, s=100, t=10 -> u=(s-½at²)/t=(100-100)/10=0 ; v=u+at=20
r = solveSuvat({ a: 2, s: 100, t: 10 })!;
approx(r.u, 0, 1e-9, 'u (a,s,t)'); approx(r.v, 20, 1e-9, 'v (a,s,t)');

// under-determined -> null
if (solveSuvat({ u: 1, v: 2 }) === null) pass++; else { fail++; console.log('FAIL under-determined'); }

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
