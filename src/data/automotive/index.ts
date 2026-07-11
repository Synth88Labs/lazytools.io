/** Automotive calculator registry. One entry drives an /automotive/ page. */

export interface AutoToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'tire' | 'tirecompare' | 'gear' | 'displacement' | 'compression' | 'hp' | 'fueleconomy' | 'offset';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const AUTO_TOOLS: AutoToolDef[] = [
  {
    slug: 'tire-size-calculator',
    name: 'Tire Size Calculator',
    icon: '🛞',
    widget: 'tire',
    description: 'Decode a tire size like 225/45R17 into its real dimensions — overall diameter, sidewall height, circumference and revolutions per mile. Exact geometry, in your browser.',
    lead: 'Enter a tire size like 225/45R17 and get its true measurements — overall diameter, sidewall height, circumference and revolutions per mile.',
    how: 'A metric tire code packs three numbers: section width in millimetres (225), the aspect ratio as a percentage of that width (45), and the rim diameter in inches (17). The sidewall height is width × aspect ratio, and the overall diameter is the rim plus two sidewalls: 17″ × 25.4 + 2 × (225 × 0.45) ≈ 634 mm (25.0″). Circumference is π × diameter, and revolutions per mile is one mile divided by the circumference.',
    note: 'The rim diameter is in inches while the width and sidewall are in millimetres — a quirk of the standard. This tool handles the mixed units for you. It reads plain codes like 225/45R17 as well as P- and ZR-prefixed ones.',
    faqs: [
      { q: 'What does 225/45R17 mean?', a: '225 is the tire’s section width in millimetres, 45 is the aspect ratio (the sidewall height is 45% of the width), R means radial construction, and 17 is the wheel (rim) diameter in inches. Together they give a tire about 634 mm (25.0″) in overall diameter.' },
      { q: 'How do I calculate a tire’s overall diameter?', a: 'Overall diameter = rim diameter + 2 × sidewall height, where sidewall height = section width × aspect ratio. For 225/45R17: 17 × 25.4 + 2 × (225 × 0.45) = 431.8 + 202.5 = 634.3 mm (about 25.0 inches).' },
      { q: 'What is the sidewall height of a tire?', a: 'The sidewall (aspect) height is the section width times the aspect ratio. A 225/45 tire has a sidewall of 225 × 0.45 = 101.25 mm. A lower aspect ratio means a shorter, stiffer sidewall.' },
      { q: 'What is revolutions per mile?', a: 'How many full turns the tire makes in one mile — one mile (1,609,344 mm) divided by the tire’s circumference. A 225/45R17 turns about 808 times per mile. It’s used for gearing, speedometer and odometer calculations.' },
      { q: 'Why is part of the size in mm and part in inches?', a: 'It’s a historical quirk of the P-metric standard: width and sidewall are metric (millimetres), but the rim is still specified in inches. This calculator converts between them automatically.' },
    ],
    keywords: ['tire size calculator', 'tyre size calculator', 'tire diameter calculator', 'tire size meaning', '225/45r17 dimensions', 'tire height calculator', 'revolutions per mile'],
  },
  {
    slug: 'tire-size-comparison',
    name: 'Tire Size Comparison & Speedometer Error',
    icon: '📐',
    widget: 'tirecompare',
    description: 'Compare two tire sizes side by side — diameter difference, sidewall, revolutions per mile — and the speedometer error from switching. Exact, in your browser.',
    lead: 'Compare your current and a new tire size to see the diameter difference and exactly how much your speedometer will read off after the change.',
    how: 'The tool computes each tire’s overall diameter and circumference from its code, then compares them. Because the speedometer is calibrated to the original tire, a larger new tire makes the wheels turn more slowly for the same road speed — so your true speed is higher than the reading. The true speed equals the indicated speed times the ratio of new to old diameter.',
    note: 'A rule of thumb is to keep a tire change within about ±3% of the original overall diameter — beyond that, the speedometer and odometer errors grow and you may run into clearance or gearing issues. This tool shows the exact percentage.',
    faqs: [
      { q: 'How do different tire sizes affect my speedometer?', a: 'Your speedometer is calibrated for the original tire diameter. A larger new tire covers more ground per revolution, so at a given wheel speed you’re actually going faster than the speedometer shows; a smaller tire does the opposite. The tool gives the exact error.' },
      { q: 'How much bigger tire can I fit without recalibrating?', a: 'A common guideline is to stay within about ±3% of the original overall diameter. Larger changes noticeably skew the speedometer and odometer and can affect clearance, gearing and ABS/traction systems.' },
      { q: 'Do bigger tires make the speedometer read high or low?', a: 'Low. With larger tires you travel farther per wheel revolution, so your true speed is higher than the indicated speed — the speedometer reads slower than you’re actually going.' },
      { q: 'How do I keep my odometer accurate after changing tire size?', a: 'Match the new tire’s overall diameter to the original as closely as possible, or have the speedometer/odometer recalibrated (many vehicles allow this via a tuner or dealer). The tool’s diameter-difference percentage tells you how far off you’ll be.' },
      { q: 'What is a plus-size or minus-size tire fitment?', a: 'Plus-sizing fits a larger-diameter wheel with a lower-profile tire to keep the overall diameter about the same (e.g. 225/45R17 to 245/40R18). The goal is a similar rolling diameter — compare the two here to check.' },
    ],
    keywords: ['tire size comparison', 'tire size calculator comparison', 'speedometer error calculator', 'tire size difference', 'plus size tire calculator', 'tire upgrade calculator', 'compare tire sizes'],
  },
  {
    slug: 'gear-ratio-calculator',
    name: 'Gear Ratio & RPM Calculator',
    icon: '⚙️',
    widget: 'gear',
    description: 'Work out road speed from engine RPM (or RPM from speed) using your gear ratio, final drive and tire size. Exact, in your browser.',
    lead: 'Enter your gear ratio, final drive (axle) ratio and tire size to find your road speed at a given RPM — or the cruising RPM at a given speed.',
    how: 'The wheels turn at the engine speed divided by the total drive ratio (transmission gear × final drive). Multiply the wheel RPM by the tire’s circumference and you get the distance covered per minute, which converts to road speed. The tool works in both directions — RPM to speed, or speed to the RPM you’d be turning.',
    note: 'A numerically higher final-drive ratio (say 4.10 vs 3.55) gives quicker acceleration but raises cruising RPM and can hurt fuel economy. Larger tires effectively lower the ratio, and smaller tires raise it — which is why tire size is part of the calculation.',
    faqs: [
      { q: 'How do I calculate RPM from speed?', a: 'RPM = (road speed ÷ tire circumference) × total drive ratio, where the total ratio is the transmission gear times the final drive. The tool does the unit conversions and gives the engine RPM for any speed.' },
      { q: 'What is the final drive ratio?', a: 'The ratio of the differential (axle) — how many times the driveshaft turns per wheel revolution. A 3.55 final drive means 3.55 driveshaft turns per wheel turn. Combined with the transmission gear, it sets the total drive ratio.' },
      { q: 'How does tire size change my RPM?', a: 'Larger tires cover more ground per revolution, so for the same speed the wheels — and engine — turn more slowly, effectively lowering your gearing. Smaller tires raise the RPM. That’s why the calculator needs the tire size.' },
      { q: 'Does a higher gear ratio mean faster acceleration?', a: 'A numerically higher final-drive ratio (e.g. 4.10) multiplies torque more, giving quicker acceleration, but the engine spins faster at any given speed — worse for highway RPM and economy. It’s a trade-off.' },
      { q: 'What RPM should I cruise at on the highway?', a: 'It depends on the car, but many modern vehicles cruise around 2,000–2,500 RPM at highway speed in top gear. Enter your top-gear ratio, final drive and tire size to see yours.' },
    ],
    keywords: ['gear ratio calculator', 'rpm calculator', 'rpm from speed calculator', 'final drive ratio calculator', 'engine rpm calculator', 'speed rpm gear calculator', 'axle ratio calculator'],
  },
  {
    slug: 'engine-displacement-calculator',
    name: 'Engine Displacement Calculator',
    icon: '🔧',
    widget: 'displacement',
    description: 'Calculate engine displacement from bore, stroke and cylinder count — in litres, cc and cubic inches. Exact, in your browser.',
    lead: 'Enter the bore, stroke and number of cylinders to get the engine’s displacement in litres, cubic centimetres and cubic inches.',
    how: 'Each cylinder is a cylinder in the geometric sense, so its swept volume is π⁄4 × bore² × stroke. Multiply by the number of cylinders for the total displacement. The tool works in millimetres or inches and shows the result in litres, cc and cubic inches, plus the per-cylinder volume.',
    note: 'Bore is the cylinder’s diameter and stroke is how far the piston travels. A “square” engine has equal bore and stroke; an oversquare (bore larger than stroke) engine tends to rev higher, while an undersquare (long-stroke) design favours low-end torque.',
    faqs: [
      { q: 'How do I calculate engine displacement?', a: 'Displacement = π⁄4 × bore² × stroke × number of cylinders. With bore and stroke in millimetres you get cubic millimetres; divide by 1,000 for cc. For example, an 86 mm bore and 86 mm stroke four-cylinder is about 1,998 cc (2.0 litres).' },
      { q: 'What is bore and stroke?', a: 'Bore is the diameter of each cylinder; stroke is the distance the piston travels from bottom to top. Together with the cylinder count they determine the engine’s displacement.' },
      { q: 'How many cubic inches is a 2.0 litre engine?', a: 'About 122 cubic inches — one litre is 61.02 cubic inches, so 2.0 L × 61.02 ≈ 122 ci. The tool shows litres, cc and cubic inches at once.' },
      { q: 'What is an oversquare vs undersquare engine?', a: 'Oversquare means the bore is larger than the stroke — such engines can rev higher and often make peak power up top. Undersquare (long-stroke) engines have more stroke than bore and tend to produce strong low-end torque.' },
      { q: 'Does bigger displacement mean more power?', a: 'Generally more displacement can move more air and fuel, so more potential power — but tuning, forced induction, RPM and efficiency matter enormously. A small turbocharged engine can out-power a larger naturally-aspirated one.' },
    ],
    keywords: ['engine displacement calculator', 'cc calculator engine', 'bore stroke calculator', 'engine size calculator', 'cubic inch calculator engine', 'displacement from bore and stroke', 'liters to cubic inches engine'],
  },
  {
    slug: 'compression-ratio-calculator',
    name: 'Compression Ratio Calculator',
    icon: '🎯',
    widget: 'compression',
    description: 'Calculate an engine’s compression ratio from the swept and clearance (combustion chamber) volumes. Exact, in your browser.',
    lead: 'Enter the swept volume and the clearance (combustion chamber) volume per cylinder to get the compression ratio.',
    how: 'The compression ratio compares the cylinder’s volume with the piston at the bottom of its stroke to its volume at the top. It’s (swept volume + clearance volume) ÷ clearance volume. The clearance volume is the total space left above the piston at top dead centre — the combustion chamber, head-gasket, deck and any piston-dish volumes added together.',
    note: 'Higher compression extracts more energy from each combustion cycle, improving power and efficiency, but it needs higher-octane fuel to avoid knock. Shaving the head, thinner gaskets or dished/domed pistons all change the clearance volume and therefore the ratio.',
    faqs: [
      { q: 'How do I calculate compression ratio?', a: 'Compression ratio = (swept volume + clearance volume) ÷ clearance volume, per cylinder. If the swept volume is 500 cc and the clearance volume is 50 cc, the ratio is (500 + 50) ÷ 50 = 11:1.' },
      { q: 'What is the clearance volume?', a: 'The total volume above the piston when it’s at top dead centre: the combustion chamber in the head, plus the head-gasket volume, the deck clearance and any dish or dome in the piston crown, added together.' },
      { q: 'Does higher compression need higher-octane fuel?', a: 'Usually yes. Higher compression raises cylinder pressures and temperatures, which can cause knock (detonation) on low-octane fuel. Higher-octane fuel resists knock, so high-compression and boosted engines need it.' },
      { q: 'What is a typical compression ratio?', a: 'Many naturally-aspirated petrol engines run around 10:1 to 12:1; forced-induction engines often run lower (8:1–10:1) to manage cylinder pressure; diesels are far higher, roughly 14:1–23:1.' },
      { q: 'How do I raise my engine’s compression?', a: 'Reduce the clearance volume — mill the cylinder head, fit a thinner head gasket, or use domed pistons. Each lowers the volume above the piston at top dead centre, raising the ratio. Recalculate to stay within safe limits for your fuel.' },
    ],
    keywords: ['compression ratio calculator', 'engine compression calculator', 'static compression ratio', 'clearance volume calculator', 'compression ratio formula', 'combustion chamber volume calculator'],
  },
  {
    slug: 'horsepower-torque-calculator',
    name: 'Horsepower & Torque Calculator',
    icon: '🐎',
    widget: 'hp',
    description: 'Convert between horsepower and torque at a given RPM using the exact HP = torque × RPM ÷ 5252 relationship. Also shows kW and N·m. In your browser.',
    lead: 'Convert between horsepower and torque at any engine speed — enter two of the three and get the third, plus the metric kW and N·m equivalents.',
    how: 'Power is torque times rotational speed, and in the traditional units that relationship is horsepower = torque (lb-ft) × RPM ÷ 5252. The constant 5252 comes from 33,000 ÷ 2π (one horsepower is 33,000 ft-lb per minute). Rearranged, torque = horsepower × 5252 ÷ RPM. The tool also converts to kilowatts and newton-metres.',
    note: 'A consequence of the formula: horsepower and torque are always numerically equal at 5252 RPM — which is why dyno graphs of the two curves always cross at that point. Below 5252 RPM torque is the larger number; above it, horsepower is.',
    faqs: [
      { q: 'How do I convert torque to horsepower?', a: 'Horsepower = torque (lb-ft) × RPM ÷ 5252. So 300 lb-ft at 5,000 RPM is 300 × 5000 ÷ 5252 ≈ 286 hp. The tool converts either direction and adds kW and N·m.' },
      { q: 'Why is the number 5252 used?', a: 'One horsepower is defined as 33,000 foot-pounds of work per minute. Converting rotational torque and RPM into that unit introduces a factor of 2π, and 33,000 ÷ 2π ≈ 5252 — the constant in the horsepower formula.' },
      { q: 'Why do horsepower and torque cross at 5252 RPM?', a: 'Because horsepower = torque × RPM ÷ 5252. At exactly 5252 RPM the RPM ÷ 5252 term equals 1, so horsepower equals torque numerically — the two dyno curves always intersect there.' },
      { q: 'What is the difference between horsepower and torque?', a: 'Torque is the twisting force the engine makes; horsepower is the rate at which it does work — torque combined with how fast the engine spins. Torque gets you moving; horsepower (torque sustained at high RPM) determines top-end performance.' },
      { q: 'How do I convert horsepower to kilowatts?', a: 'Multiply by 0.7457 — 1 hp = 0.7457 kW. So 250 hp is about 186 kW. The tool shows the kW value automatically.' },
    ],
    keywords: ['horsepower calculator', 'torque to horsepower calculator', 'horsepower to torque', 'hp torque rpm calculator', '5252 rpm', 'hp to kw calculator', 'engine power calculator'],
  },
  {
    slug: 'fuel-economy-converter',
    name: 'Fuel Economy Converter (MPG, L/100km)',
    icon: '⛽',
    widget: 'fueleconomy',
    description: 'Convert fuel economy between US MPG, UK (imperial) MPG, litres per 100 km and km per litre — the US and UK gallons differ, and this handles it. In your browser.',
    lead: 'Convert fuel economy between US MPG, UK MPG, litres per 100 km and kilometres per litre — with the US-vs-UK gallon difference handled correctly.',
    how: 'Every figure is converted through a common basis using the exact unit definitions: the US gallon is 3.785 L, the imperial (UK) gallon is 4.546 L, and a mile is 1.609 km. Miles-per-gallon is a distance-per-fuel measure (higher is better), while litres-per-100-km is fuel-per-distance (lower is better) — the tool inverts correctly between them.',
    note: 'The big trap is that a US MPG and a UK MPG are not the same, because the gallons differ by about 20%. A car rated 30 US mpg is about 36 UK mpg — same car, different number. Always check which gallon a figure uses.',
    faqs: [
      { q: 'How do I convert MPG to L/100km?', a: 'For US MPG, litres per 100 km = 235.21 ÷ MPG. So 30 US mpg is 235.21 ÷ 30 ≈ 7.84 L/100km. For UK MPG use 282.48 ÷ MPG instead, because the imperial gallon is larger.' },
      { q: 'Is US MPG the same as UK MPG?', a: 'No. The US gallon (3.785 L) is smaller than the imperial gallon (4.546 L), so the same real economy gives a higher number in UK MPG. 30 US mpg equals about 36 UK mpg.' },
      { q: 'Is a lower L/100km better or worse?', a: 'Lower is better — litres per 100 km measures how much fuel you use to cover a fixed distance, so using fewer litres is more efficient. It’s the opposite sense to MPG, where higher is better.' },
      { q: 'How do I convert L/100km to MPG?', a: 'US MPG = 235.21 ÷ (L/100km); UK MPG = 282.48 ÷ (L/100km). For 5 L/100km that’s about 47 US mpg or 56 UK mpg. The tool does all four units at once.' },
      { q: 'What is km per litre?', a: 'Kilometres travelled per litre of fuel — common in many countries. It equals 100 ÷ (L/100km); higher is better. For example, 7.84 L/100km is about 12.75 km/L.' },
    ],
    keywords: ['fuel economy converter', 'mpg to l/100km', 'l/100km to mpg', 'us mpg to uk mpg', 'fuel consumption calculator', 'km per litre converter', 'gas mileage converter'],
  },
  {
    slug: 'wheel-offset-calculator',
    name: 'Wheel Offset & Backspacing Calculator',
    icon: '🛠️',
    widget: 'offset',
    description: 'Convert between wheel offset (ET) and backspacing from the wheel width — to check fitment when changing wheels. Exact, in your browser.',
    lead: 'Convert between wheel offset (ET) and backspacing from your wheel width — the two ways of describing where a wheel sits, so you can compare fitments.',
    how: 'Offset and backspacing describe the same thing two ways. Backspacing is the distance from the wheel’s mounting face to its inner lip; offset (ET) is the distance from the mounting face to the wheel’s centreline. They’re related by: backspacing = wheel width ÷ 2 + offset (converting the width to millimetres). The tool converts either way.',
    note: 'A more positive offset (or larger backspacing) tucks the wheel further inboard under the arch; a lower or negative offset pushes it outboard for a wider stance. Changing offset affects clearance, steering and bearing loads, so compare against your original wheels before fitting.',
    faqs: [
      { q: 'What is wheel offset?', a: 'Offset (marked ET, from the German Einpresstiefe) is the distance in millimetres from the wheel’s mounting face to its centreline. Positive offset sits the face outboard of centre (wheel tucked in); negative offset pushes the wheel outward.' },
      { q: 'What is backspacing?', a: 'The distance from the wheel’s mounting face to its inner (back) lip, usually in inches. More backspacing pulls the wheel inboard. It’s related to offset by backspacing = width ÷ 2 + offset.' },
      { q: 'How do I convert offset to backspacing?', a: 'Backspacing (mm) = wheel width ÷ 2 + offset, with the width converted from inches to millimetres. For an 8″ wheel with +45 mm offset: (8 × 25.4) ÷ 2 + 45 = 101.6 + 45 = 146.6 mm ≈ 5.77″.' },
      { q: 'Does changing offset affect fitment?', a: 'Yes. A lower/negative offset moves the wheel outward (wider track, possible fender or suspension rubbing); a higher offset pulls it inward (possible strut/brake clearance issues). Stay close to the original offset unless you’ve checked clearances.' },
      { q: 'Is more offset better?', a: 'Neither is universally better — it depends on the vehicle. The safe approach is to match the manufacturer’s offset, or change it only after checking clearance to the suspension, brakes and fenders. Big changes also load wheel bearings differently.' },
    ],
    keywords: ['wheel offset calculator', 'backspacing calculator', 'offset to backspacing', 'wheel fitment calculator', 'et offset calculator', 'wheel backspacing to offset', 'rim offset calculator'],
  },
];

export const getAutoTool = (slug: string) => AUTO_TOOLS.find((t) => t.slug === slug);
