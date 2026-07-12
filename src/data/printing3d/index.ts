/** 3D Printing calculator registry. One entry drives a /3d-printing/ page. */

export interface Printing3dToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'filament' | 'cost' | 'energy' | 'scale' | 'esteps' | 'flow' | 'volflow' | 'resin';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const PRINTING3D_TOOLS: Printing3dToolDef[] = [
  {
    slug: 'filament-calculator',
    name: 'Filament Weight & Length Calculator',
    icon: '🧵',
    widget: 'filament',
    description: 'Convert 3D-printer filament between weight, length and volume by material and diameter. Know how much a print uses, or how much is left on a spool. In your browser.',
    lead: 'Enter a weight or a length, pick your material and diameter, and get the filament\'s weight, length and volume.',
    how: 'Filament is a uniform plastic cylinder, so its weight, length and volume are locked together by geometry. The cross-section area is π·(d/2)² for diameter d; multiply by length for volume, and by the material\'s density for weight. The tool converts either way — weight to length or length to weight — using the density of your chosen material (PLA, PETG, ABS and more) and the standard 1.75 mm or 2.85 mm diameter.',
    note: 'A 1 kg spool of PLA (density 1.24 g/cm³) in 1.75 mm holds about 335 m; the same weight in a less-dense plastic like ABS is longer, and in thick 2.85 mm filament it\'s much shorter. Densities vary a little between brands and colours, so for a precise figure use the value on your spool\'s datasheet.',
    faqs: [
      { q: 'How much filament is on a 1 kg spool?', a: 'For 1.75 mm PLA (1.24 g/cm³), about 330–335 m. Lower-density plastics like ABS give a bit more length per kilogram, and 2.85 mm filament gives far less (roughly a third), because the strand is thicker.' },
      { q: 'How do I convert filament length to weight?', a: 'Weight = length × cross-section area × density, where the area is π·(d/2)². The tool does it for you — enter the length, material and diameter and it returns the weight and volume.' },
      { q: 'How much filament does my print use?', a: 'Your slicer (Cura, PrusaSlicer, OrcaSlicer, Bambu Studio) reports the estimated filament length or weight for a sliced model. Enter either here to convert to the other and to a volume, and use the cost tool to price it.' },
      { q: 'Why does the filament density matter?', a: 'Because weight depends on it directly: the same length of a denser plastic weighs more. Using the right density (PLA 1.24, PETG 1.27, ABS 1.04 g/cm³, etc.) makes the length↔weight conversion accurate — the wrong one skews the result.' },
      { q: 'How do I know how much filament is left on a spool?', a: 'Weigh the spool, subtract the empty spool\'s weight (often printed on it) to get the filament weight, and enter that here to get the remaining length. It\'s the reliable way to tell if a print will finish.' },
    ],
    keywords: ['filament calculator', 'filament weight calculator', 'filament length calculator', 'filament weight to length', '3d printing filament calculator', 'how much filament on a spool', 'filament density calculator'],
  },
  {
    slug: 'filament-cost-calculator',
    name: 'Filament Cost Calculator',
    icon: '💵',
    widget: 'cost',
    description: 'Calculate the filament cost of a 3D print from the grams used and the spool price per kilogram. In your browser.',
    lead: 'Enter the grams of filament a print uses and your spool\'s price per kilogram to get the material cost.',
    how: 'The material cost of a print is simply the fraction of the spool it consumes: grams used ÷ 1000 × the price per kilogram. Your slicer reports the grams (or length) a sliced model needs; enter that with your spool price and the tool gives the cost, plus the filament length for reference.',
    note: 'This is the filament cost only. For what a print really costs you, add the electricity (see the print energy tool), a share of the printer\'s price and maintenance, and a margin for failed prints — a few percent of prints fail, and that wasted filament is a real cost when you\'re pricing prints for others.',
    faqs: [
      { q: 'How much does a 3D print cost in filament?', a: 'Grams used ÷ 1000 × price per kg. A 50 g print from a $20/kg spool costs $1.00 in filament. Your slicer gives the grams; enter them with your spool price for the exact figure.' },
      { q: 'How do I price a 3D print for selling?', a: 'Start with the filament cost here, then add electricity, a share of printer wear and maintenance, a failure allowance, and your labour and design time. Material is usually the smallest part of a fair price.' },
      { q: 'Where do I find the grams a print uses?', a: 'Slice the model in Cura, PrusaSlicer, OrcaSlicer or Bambu Studio and read the estimated filament weight (or length) it reports. Enter that weight here.' },
      { q: 'Does colour or brand change the cost?', a: 'Only through the spool price. Some specialty filaments (silk, CF-filled, high-temp) cost much more per kilogram, so use the actual price you paid for that spool rather than a generic figure.' },
      { q: 'What about failed prints?', a: 'They\'re a real cost, especially when selling. A common approach is to add a small percentage (say 5–10%) to the material cost to cover the filament lost to occasional failures.' },
    ],
    keywords: ['filament cost calculator', '3d print cost calculator', 'filament price calculator', 'cost of 3d print', 'how much does a 3d print cost', '3d printing cost estimator', 'filament cost per gram'],
  },
  {
    slug: 'print-energy-cost-calculator',
    name: 'Print Electricity Cost Calculator',
    icon: '⚡',
    widget: 'energy',
    description: 'Estimate the electricity cost of a 3D print from the printer\'s power draw, the print time and your electricity rate. In your browser.',
    lead: 'Enter the printer\'s power, how long the print takes and your electricity rate to estimate the energy cost.',
    how: 'Electricity cost is power × time × rate. The tool multiplies the printer\'s average power (in watts, ÷1000 for kilowatts) by the print time in hours to get kilowatt-hours, then multiplies by your per-kWh rate. Enter the print time in hours and minutes and your local electricity price.',
    note: 'A typical desktop FDM printer averages roughly 50–150 watts during a print — the heated bed dominates, so large or high-temperature (ABS) prints draw more, and an enclosure or a bigger bed raises it further. 100 W is a reasonable default, but for accuracy measure your own printer with an inexpensive plug-in energy meter.',
    faqs: [
      { q: 'How much electricity does a 3D print use?', a: 'Power (kW) × time (h). A printer averaging 100 W over a 5-hour print uses 0.5 kWh — at $0.30/kWh, about $0.15. The heated bed is the biggest draw, so hotter and bigger prints cost more.' },
      { q: 'How many watts does a 3D printer use?', a: 'A desktop FDM printer typically averages 50–150 W during a print, with brief peaks of 200–300 W while the bed and nozzle heat up. The exact figure depends on bed size and temperature and whether it\'s enclosed.' },
      { q: 'Is 3D printing expensive to run?', a: 'Usually not — electricity is a small part of the cost. Most prints cost a few cents to a couple of dollars in power, far less than the filament. Long prints on a big heated bed in a cold room are the priciest.' },
      { q: 'How do I measure my printer\'s power?', a: 'Plug it into a cheap energy monitor (a "kill-a-watt"-style plug meter) and watch the average watts over a print, or read the total kWh for a job. Enter that wattage here for an accurate estimate.' },
      { q: 'Does the heated bed use the most power?', a: 'Yes. Heating the bed — especially a large one to ABS/PETG temperatures — dominates a printer\'s power draw. The hotend, steppers and fans are comparatively minor.' },
    ],
    keywords: ['3d printer electricity cost', '3d printing power consumption', 'print energy cost calculator', 'how much electricity does a 3d printer use', '3d printer watts', 'cost to run 3d printer', 'kwh 3d print'],
  },
  {
    slug: 'model-scale-calculator',
    name: 'Model Scale Calculator',
    icon: '🔍',
    widget: 'scale',
    description: 'Resize a 3D model by a percentage and see the new dimensions and how much more filament it needs — plus a fit-to-bed scale helper. In your browser.',
    lead: 'Enter a scale percentage and the model\'s dimensions to see the resized size and the change in material and print time.',
    how: 'Scaling multiplies every dimension by the same factor (the percentage ÷ 100), so a 50 mm part at 200% becomes 100 mm. But volume — and therefore filament and print time — grows with the cube of that factor: doubling the size is 2³ = 8 times the material. The tool shows the new dimensions, the linear factor and the volume/material multiplier, and includes a helper to find the percentage that fits a model onto your print bed.',
    note: 'The cube rule is the thing people forget: scaling a model up "just a bit" can balloon the print time and filament far more than expected, while scaling down shrinks them dramatically. When you scale, also sanity-check that walls and small features stay above your nozzle\'s minimum printable size.',
    faqs: [
      { q: 'How does scaling a 3D model affect print time?', a: 'Print time and filament scale with volume, which is the cube of the linear scale. Scaling to 200% (twice as tall/wide/deep) uses about 8× the material and time; scaling to 50% uses about ⅛.' },
      { q: 'How do I resize a model to a specific size?', a: 'Divide the size you want by the current size and multiply by 100 for the percentage. To make a 50 mm part 75 mm, scale to 150%. The fit-to-bed helper does this against your bed size automatically.' },
      { q: 'Why does a slightly bigger model take so much longer?', a: 'Because volume grows with the cube of the scale. A model at 130% isn\'t 30% more plastic — it\'s 1.3³ ≈ 2.2×, more than double. That cube relationship is why small scale changes have outsized effects.' },
      { q: 'How do I scale a model to fit my print bed?', a: 'Take the model\'s largest footprint dimension and divide your bed size by it (×100) for the maximum scale that fits. Enter both in the fit-to-bed helper and it returns that percentage.' },
      { q: 'Does scaling down affect print quality?', a: 'It can — shrinking a model makes walls and details thinner, and features below your nozzle/line width won\'t print cleanly. After scaling down, check that thin walls are still at least one or two line-widths thick.' },
    ],
    keywords: ['3d model scale calculator', 'model resize calculator', 'scale 3d print', 'stl scale calculator', 'resize stl for printing', 'scale to fit print bed', '3d print scaling'],
  },
  {
    slug: 'e-steps-calculator',
    name: 'E-Steps Calculator',
    icon: '📐',
    widget: 'esteps',
    description: 'Calibrate your 3D printer\'s extruder E-steps (steps/mm) from a 100 mm extrusion test, so it extrudes exactly the right amount. In your browser.',
    lead: 'Enter your current E-steps and how much filament actually extruded from a 100 mm test to get the corrected value.',
    how: 'A printer\'s E-steps value tells it how many motor steps push 1 mm of filament. If it\'s off, every print is over- or under-extruded. You calibrate by asking the printer to extrude a known amount (usually 100 mm), measuring what actually came out, and correcting: new E-steps = current × (requested ÷ actually extruded). The tool computes the new value and gives the G-code to set and save it.',
    note: 'Extrude slowly (for example G1 E100 F50) with the nozzle at printing temperature, and don\'t tug or force the filament, or the measurement will be wrong. After setting the value with M92, save it with M500 — otherwise it resets when the printer restarts. Calibrate E-steps before flow/extrusion multiplier.',
    faqs: [
      { q: 'How do I calibrate E-steps?', a: 'Mark the filament 120 mm above the extruder, tell the printer to extrude 100 mm slowly at temperature, then measure the gap left. The amount extruded is 100 − gap. Enter your current E-steps and that measured amount for the corrected value.' },
      { q: 'What is the E-steps formula?', a: 'New E-steps = current E-steps × (requested length ÷ actually extruded length). For the standard test that\'s current × (100 ÷ measured). Set it with M92 E<value> and save with M500.' },
      { q: 'Why is my printer over- or under-extruding?', a: 'Often the E-steps are miscalibrated, so the requested and actual filament amounts don\'t match. Calibrating E-steps fixes the baseline; if extrusion is still slightly off after that, fine-tune with the flow/extrusion-multiplier calibration.' },
      { q: 'Do I need to redo E-steps after changing the extruder?', a: 'Yes — a new extruder, gears or a different drive ratio changes the steps needed per millimetre, so recalibrate. It\'s also worth checking after a firmware reset, which can restore default values.' },
      { q: 'What\'s the difference between E-steps and flow rate?', a: 'E-steps is a hardware calibration of how much filament the motor moves; flow (extrusion multiplier) is a software fine-tune of how much plastic ends up in the wall. Calibrate E-steps first, then adjust flow.' },
    ],
    keywords: ['e-steps calculator', 'esteps calibration', 'extruder calibration calculator', '3d printer e steps', 'steps per mm calculator', 'calibrate extruder', 'e-step calibration 100mm'],
  },
  {
    slug: 'flow-rate-calculator',
    name: 'Flow Rate / Extrusion Multiplier Calculator',
    icon: '🎚️',
    widget: 'flow',
    description: 'Calibrate your 3D printer\'s flow rate (extrusion multiplier) from a measured single-wall thickness. In your browser.',
    lead: 'Enter your current flow %, the target wall thickness and the wall you measured to get the corrected flow rate.',
    how: 'Flow rate (or extrusion multiplier) fine-tunes how much plastic goes into each line. You print a single-wall test at a known line width, measure the actual wall with calipers, and correct: new flow % = current % × (target wall ÷ measured wall). If your wall came out too thick, flow comes down; too thin, it goes up. The tool gives the new percentage and the decimal extrusion multiplier for PrusaSlicer/OrcaSlicer.',
    note: 'This is the classic single-wall method and the measurement is a little noisy, so measure the wall in several places and average. Calibrate your E-steps first — flow assumes the extruder is already moving the right amount of filament. Some printers now prefer dedicated flow-test patterns, but the single-wall method is quick and widely used.',
    faqs: [
      { q: 'How do I calibrate flow rate?', a: 'Print a single-wall cube (one perimeter, no top/bottom or infill), measure the wall with calipers, and set new flow = current × (target ÷ measured), where the target is your line width. Average several measurements for reliability.' },
      { q: 'What is the extrusion multiplier?', a: 'The same thing as flow rate, expressed as a decimal (a flow of 95% is an extrusion multiplier of 0.95). Cura calls it "flow"; PrusaSlicer and OrcaSlicer call it "extrusion multiplier". It scales how much filament each move deposits.' },
      { q: 'Should I calibrate E-steps or flow first?', a: 'E-steps first. E-steps is a hardware calibration that makes the extruder move the correct length of filament; flow is a finer software adjustment on top. Getting E-steps right means flow only needs a small tweak.' },
      { q: 'My walls are too thick — what flow do I use?', a: 'Lower it. If a 0.40 mm target wall measured 0.42 mm, new flow = current × 0.40 ÷ 0.42 ≈ 95% of the current value. Enter your numbers for the exact figure.' },
      { q: 'Why measure a single-wall print?', a: 'A single perimeter with no infill or top layers isolates the extrusion width, so the wall thickness directly reflects how much plastic is coming out — making it a clean target for calibrating flow.' },
    ],
    keywords: ['flow rate calculator 3d printing', 'extrusion multiplier calculator', 'flow calibration', '3d printer flow rate', 'calibrate extrusion multiplier', 'single wall flow calibration', 'flow percentage calculator'],
  },
  {
    slug: 'volumetric-flow-calculator',
    name: 'Volumetric Flow Rate Calculator',
    icon: '🌊',
    widget: 'volflow',
    description: 'Calculate the volumetric flow a print needs (layer × width × speed) and check it against your hotend\'s limit to avoid under-extrusion. In your browser.',
    lead: 'Enter your layer height, line width and print speed to get the volumetric flow — and check it against your hotend\'s maximum.',
    how: 'Volumetric flow is the amount of plastic your hotend has to melt each second: layer height × line width × print speed, in mm³/s. Every hotend has a maximum flow it can melt fast enough; ask for more and the print under-extrudes no matter what speed the slicer shows. The tool computes the required flow, flags it if it exceeds the hotend limit you enter, and shows the fastest print speed that limit allows for your line.',
    note: 'A standard hotend manages roughly 10–15 mm³/s; high-flow or Volcano-style hotends reach 20–40 mm³/s or more. The real limit depends on the material and temperature, so treat these as guidelines and, for a precise figure, run a max-flow test on your own printer.',
    faqs: [
      { q: 'What is volumetric flow rate in 3D printing?', a: 'The volume of plastic extruded per second: layer height × line width × print speed, in mm³/s. It\'s the true speed limit of a hotend, because it can only melt filament so fast regardless of how quickly the nozzle moves.' },
      { q: 'How fast can I print without under-extruding?', a: 'Until the required volumetric flow reaches your hotend\'s maximum. For a 0.2 mm layer and 0.4 mm line, a 15 mm³/s hotend allows up to about 187 mm/s; beyond that it can\'t melt filament fast enough.' },
      { q: 'What is the max volumetric flow of a hotend?', a: 'Roughly 10–15 mm³/s for a standard hotend and 20–40+ mm³/s for high-flow/Volcano designs, but it varies with material and temperature. Run a max-flow calibration test to find your exact limit.' },
      { q: 'Why is my print under-extruding at high speed?', a: 'Likely because the required volumetric flow exceeds what your hotend can melt. Slow down, use a thinner layer or narrower line width to lower the flow, print hotter (within the filament\'s range), or fit a high-flow hotend.' },
      { q: 'How do I increase my printing speed?', a: 'Raise the flow ceiling: a higher-flow hotend, a higher (safe) temperature, or a thicker layer/wider line, which lets each pass lay down more plastic. The volumetric limit — not the motion speed — is usually what caps real throughput.' },
    ],
    keywords: ['volumetric flow calculator', 'max volumetric flow rate', '3d printing flow rate mm3/s', 'hotend flow rate', 'print speed calculator 3d printing', 'volumetric flow 3d print', 'under extrusion speed'],
  },
  {
    slug: 'resin-cost-calculator',
    name: 'Resin Cost Calculator',
    icon: '🧪',
    widget: 'resin',
    description: 'Calculate the resin cost and weight of an SLA/MSLA print from the volume your slicer reports, with a waste allowance. In your browser.',
    lead: 'Enter the resin volume a print uses and the resin\'s price per litre to get the cost, with waste included.',
    how: 'Resin printers price by volume: cost = resin used (in litres) × price per litre. Your MSLA slicer (Lychee, Chitubox) reports the millilitres a print needs; the tool adds a waste allowance for the resin that clings to the plate, supports and vat, then computes the cost and — using the resin density — the weight.',
    note: 'Standard photopolymer resin is about 1.10 g/mL (Formlabs standard measures nearer 1.08); specialty resins — castable, tough, filled — differ, so override the density for those. The waste allowance matters more with resin than filament because a meaningful amount is lost to supports and cleanup on every print.',
    faqs: [
      { q: 'How much does a resin print cost?', a: 'Resin volume (litres) × price per litre. A 30 mL print from a $50/litre bottle costs about $1.50 in resin, before adding a little for the resin lost to supports and cleanup.' },
      { q: 'Where do I find the resin volume of a print?', a: 'Your MSLA slicer — Lychee, Chitubox or your printer\'s software — reports the estimated resin volume in millilitres for a sliced model. Enter that here with your resin price.' },
      { q: 'How much does resin weigh?', a: 'About 1.10 grams per millilitre for standard photopolymer (some brands nearer 1.08), so 100 mL weighs roughly 110 g. Specialty resins vary; enter the density from the bottle for an exact weight.' },
      { q: 'Why include a waste allowance for resin?', a: 'Because every resin print loses material that clings to the build plate, drips off supports and stays in the vat. A 5–15% allowance makes the cost realistic rather than counting only the resin in the final model.' },
      { q: 'Is resin printing more expensive than filament?', a: 'Per gram, resin usually costs more than filament, but resin prints are often small, so a given model can be cheap either way. Compare using the actual volume/weight your slicer reports and each material\'s price.' },
    ],
    keywords: ['resin cost calculator', '3d resin print cost', 'sla print cost calculator', 'msla resin cost', 'resin price calculator', 'how much does a resin print cost', 'resin volume weight calculator'],
  },
];

export const getPrinting3dTool = (slug: string) => PRINTING3D_TOOLS.find((t) => t.slug === slug);
