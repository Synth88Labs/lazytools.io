import assert from 'node:assert';
import { humidex, humidexComfort, seaLevelPressure } from '../src/lib/weather.ts';

const rel = (a: number, b: number, tol = 5e-3) => assert.ok(Math.abs(a - b) / Math.abs(b) < tol, `${a} !~ ${b}`);

// Humidex: 30°C air, 25°C dew point ≈ 42 (Environment Canada)
rel(humidex(30, 25), 42.3, 1e-2);
// Higher dew point → higher humidex
assert.ok(humidex(30, 27) > humidex(30, 25));
// Cool/dry: humidex never below the air temperature
assert.strictEqual(humidex(15, -5), 15);
// comfort bands
assert.strictEqual(humidexComfort(25), 'Comfortable');
assert.strictEqual(humidexComfort(35), 'Some discomfort');
assert.strictEqual(humidexComfort(43), 'Great discomfort; avoid exertion');
assert.strictEqual(humidexComfort(48), 'Dangerous; heat stroke possible');

// Sea-level pressure: 1000 hPa at 500 m, 15°C ≈ 1060.7
rel(seaLevelPressure(1000, 500, 15)!, 1060.7, 3e-3);
// At sea level (0 m) it returns the station pressure unchanged
rel(seaLevelPressure(1013, 0, 20)!, 1013, 1e-9);
// Higher altitude → larger correction
assert.ok(seaLevelPressure(900, 1000, 10)! > seaLevelPressure(900, 500, 10)!);
// guard
assert.strictEqual(seaLevelPressure(0, 500, 15), null);

console.log('weather-r3: all assertions passed');
