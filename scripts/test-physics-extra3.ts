import { terminalVelocity, lorentzForce, wireForce } from '../src/lib/physics-extra.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// skydiver: 80kg, 0.7m², Cd 1.0, air 1.225 → ~42.8 m/s
ok('terminal v skydiver ≈ 42.8 m/s', rel(terminalVelocity(80,0.7,1.0)!,42.77,5e-3), terminalVelocity(80,0.7,1.0));
ok('terminal v area 0 → null', terminalVelocity(80,0,1.0)===null);
// lorentz: q=1.6e-19, v=1e6, B=0.5, 90° → 8e-14
ok('lorentz 8e-14 N', rel(lorentzForce(1.6e-19,1e6,0.5),8e-14), lorentzForce(1.6e-19,1e6,0.5));
ok('lorentz at 0° = 0', lorentzForce(1.6e-19,1e6,0.5,0)===0);
ok('lorentz at 30° = half', rel(lorentzForce(1e-19,1e6,1,30),lorentzForce(1e-19,1e6,1,90)*0.5), 'x');
// wire: B=0.5, I=10, L=2, 90° → 10 N
ok('wire force 10 N', rel(wireForce(0.5,10,2),10), wireForce(0.5,10,2));
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
