import { stairs, studCount, coolingBtu } from '../src/lib/home.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// stairs: total rise 112 in, target riser 7.5, tread 10 → risers round(112/7.5=14.93)=15, actualRiser 7.467, treads 14, run 140, stringer √(112²+140²)=179.3
{ const s=stairs(112,7.5,10)!; ok('stairs 15 risers',s.risers===15,s.risers); ok('actual riser 7.467',rel(s.actualRiser,7.4667,1e-3),s.actualRiser); ok('run 140',s.run===140); ok('stringer 179.3',rel(s.stringer,179.29,1e-3),s.stringer); }
ok('stairs bad → null', stairs(0,7,10)===null);
// studs: 20 ft wall, 16 in = 1.333 ft spacing → ceil(20/1.3333)+1 = 15+1=16
{ const s=studCount(20,16/12)!; ok('studs 16', s.studs===16, s.studs); }
ok('studs w/ 3 extras', studCount(20,16/12,3)!.studs===19);
// cooling: 300 ft² × 20 = 6000 BTU base
ok('cooling 300ft² = 6000', coolingBtu(300)===6000, coolingBtu(300));
ok('cooling sunny +10%', coolingBtu(300,{sun:'sunny'})===6600);
ok('cooling kitchen +4000', coolingBtu(300,{kitchen:true})===10000);
ok('cooling 4 people +1200', coolingBtu(300,{occupants:4})===7200);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
