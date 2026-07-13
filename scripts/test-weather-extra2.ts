import { densityAltitude, snowLoad } from '../src/lib/weather.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b)+1e-6;
// DA: 5000 ft PA, 25°C → ISA 5.1, DA = 5000+120*19.9 = 7388
ok('DA 5000/25 ≈ 7388', rel(densityAltitude(5000,25),7388), densityAltitude(5000,25));
// at ISA conditions DA = PA
ok('DA at ISA = PA', rel(densityAltitude(0,15),0,1e-6) || Math.abs(densityAltitude(0,15))<1e-6, densityAltitude(0,15));
// snow: 0.3 m, 300 kg/m³ → 90 kg/m², 0.8826 kPa, 18.43 psf
{ const s=snowLoad(0.3,300)!; ok('snow mass 90', rel(s.massPerArea,90)); ok('snow kPa ~0.883', rel(s.kPa,0.88260,1e-3),s.kPa); ok('snow psf ~18.43', rel(s.psf,18.435,1e-3),s.psf); }
ok('snow density 0 → null', snowLoad(0.3,0)===null);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
