import { evChargingTime, powerToWeight, stoppingDistance } from '../src/lib/automotive.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// EV: 60 kWh, 20→80%, 11 kW AC, 0.9 eff → energy 36 kWh, time 36/9.9 = 3.636 h
{ const e=evChargingTime(60,20,80,11,0.9)!; ok('EV energy 36 kWh',rel(e.energyNeeded,36),e.energyNeeded); ok('EV time ~3.64 h',rel(e.hours,3.6364,1e-3),e.hours); }
ok('EV end<=start → null', evChargingTime(60,80,80,11)===null);
// power-to-weight: 300 hp, 1500 kg → 200 hp/tonne
{ const p=powerToWeight(300,1500)!; ok('P/W 200 hp/tonne',rel(p.hpPerTonne,200),p.hpPerTonne); ok('P/W W/kg ~149',rel(p.wPerKg,149.14,1e-2),p.wPerKg); }
// stopping: 100 km/h, 1.0 s reaction, μ=0.7 → v=27.78, reaction=27.78, braking=27.78²/(2·0.7·9.80665)=56.2, total~84
{ const s=stoppingDistance(100,1.0,0.7)!; ok('stop reaction 27.78 m',rel(s.reaction,27.78,1e-3),s.reaction); ok('stop braking ~56.2 m',rel(s.braking,56.22,1e-2),s.braking); ok('stop total ~84 m',rel(s.total,84.0,1e-2),s.total); }
ok('stop μ 0 → null', stoppingDistance(100,1,0)===null);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
