import { absoluteHumidity, vpd, rainfallCollectionL, satVaporPressureHpa } from '../src/lib/weather.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=5e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// SVP at 20°C ≈ 23.4 hPa
ok('SVP 20°C ≈ 23.4 hPa', rel(satVaporPressureHpa(20),23.4,1e-2), satVaporPressureHpa(20));
// Absolute humidity 20°C 50% ≈ 8.65 g/m³
ok('AH 20°C/50% ≈ 8.65 g/m³', rel(absoluteHumidity(20,50),8.65,1e-2), absoluteHumidity(20,50));
// AH 30°C 100% ≈ 30.4 g/m³
ok('AH 30°C/100% ≈ 30.4', rel(absoluteHumidity(30,100),30.4,1.5e-2), absoluteHumidity(30,100));
// VPD 25°C 50% (leaf=air) ≈ 1.58 kPa
ok('VPD 25°C/50% ≈ 1.58 kPa', rel(vpd(25,50),1.58,1e-2), vpd(25,50));
// VPD at 100% RH = 0
ok('VPD at 100% = 0', Math.abs(vpd(25,100))<1e-9, vpd(25,100));
// leaf cooler than air raises... actually leaf warmer than air raises VPD
ok('warmer leaf → higher VPD', vpd(25,50,28) > vpd(25,50,25));
// Rainfall: 100 m², 25 mm, coeff 0.9 → 2250 L
ok('rain 100m²·25mm·0.9 = 2250 L', rainfallCollectionL(100,25,0.9)===2250, rainfallCollectionL(100,25,0.9));
ok('rain coeff 1: 1mm/m²=1L', rainfallCollectionL(1,1,1)===1);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
