import { dogAgeEpigenetic, dogAgeTraditional, catAge, rer, mer, DOG_MER, CAT_MER, getSpecies, aquariumVolume, aquariumVolumeIn, waterIntakeMl, crateSize } from '../src/lib/pets.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Dog epigenetic: 16*ln(x)+31. x=1 -> 31; x=e -> 47; x=4 -> 16*1.386+31=53.18
ok('dog epigenetic 1yr = 31', approx(dogAgeEpigenetic(1)!, 31, 0.01));
ok('dog epigenetic 4yr = 53.2', approx(dogAgeEpigenetic(4)!, 53.18, 0.1));
ok('dog epigenetic e yr = 47', approx(dogAgeEpigenetic(Math.E)!, 47, 0.01));
ok('dog epigenetic 0 = null', dogAgeEpigenetic(0) === null);

// Dog traditional: 1yr=15, 2yr=24, medium 5yr = 24 + 3*5 = 39
ok('dog trad 1yr = 15', approx(dogAgeTraditional(1, 'medium')!, 15, 0.01));
ok('dog trad 2yr = 24', approx(dogAgeTraditional(2, 'medium')!, 24, 0.01));
ok('dog trad medium 5yr = 39', approx(dogAgeTraditional(5, 'medium')!, 39, 0.01));
ok('dog trad giant ages faster than small', dogAgeTraditional(8, 'giant')! > dogAgeTraditional(8, 'small')!);

// Cat: 1yr=15, 2yr=24, 5yr = 24 + 3*4 = 36
ok('cat 1yr = 15', approx(catAge(1)!, 15, 0.01));
ok('cat 2yr = 24', approx(catAge(2)!, 24, 0.01));
ok('cat 5yr = 36', approx(catAge(5)!, 36, 0.01));

// RER = 70 * kg^0.75. 10kg -> 70*5.623 = 393.6
ok('RER 10kg = 393.6', approx(rer(10), 393.6, 0.5));
ok('RER 20kg = 662', approx(rer(20), 662.1, 1));
// MER neutered dog 10kg = 393.6 * 1.6 = 629.8
ok('MER neutered dog 10kg = 629.8', approx(mer(10, 1.6), 629.8, 1));
ok('dog MER factors present', DOG_MER.length >= 8);
ok('cat MER neutered = 1.2', CAT_MER.find((f) => f.id === 'neutered')!.factor === 1.2);

// Gestation
ok('dog gestation 63 days', getSpecies('dog')!.days === 63);
ok('horse gestation 340 days', getSpecies('horse')!.days === 340);

// Aquarium: 100x40x50 cm = 200000 cm3 = 200 L
const aq = aquariumVolume(100, 40, 50);
ok('tank 100x40x50cm = 200 L', approx(aq.litres, 200, 0.1));
ok('200 L = 52.8 US gal', approx(aq.usGal, 52.83, 0.1));
// inches: 20x10x12 in
const aqi = aquariumVolumeIn(20, 10, 12);
ok('tank 20x10x12in = 39.3 L', approx(aqi.litres, 39.33, 0.2));

// Water intake: 10kg dog at 55 ml/kg = 550 ml
ok('water 10kg @55 = 550ml', approx(waterIntakeMl(10, 55), 550, 0.1));

// Crate: 60cm long dog + 7.5 margin = 67.5
const cr = crateSize(60, 45);
ok('crate length 60+7.5 = 67.5', approx(cr.length, 67.5, 0.01));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
