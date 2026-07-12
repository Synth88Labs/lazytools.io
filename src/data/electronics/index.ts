/** Electronics & Circuits calculator registry. One entry drives an /electronics/ page. */

export interface ElectronicsToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'resistor' | 'led' | 'divider' | 'capcode' | 'awg' | 'rc' | 'timer555' | 'battery';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const ELECTRONICS_TOOLS: ElectronicsToolDef[] = [
  {
    slug: 'resistor-color-code-calculator',
    name: 'Resistor Color Code Calculator',
    icon: '🎨',
    widget: 'resistor',
    description: 'Decode a resistor\'s color bands into its resistance and tolerance — 4, 5 and 6-band, with a live visual resistor. Uses the IEC 60062 code. In your browser.',
    lead: 'Pick the color of each band to read a resistor\'s value and tolerance — with a live picture of the resistor as you go.',
    how: 'Resistors carry their value in colored bands: the first two or three are digits, the next is a ×10ⁿ multiplier, then a tolerance band, and on 6-band parts a temperature-coefficient band. The tool follows the IEC 60062 color code — Black 0, Brown 1, Red 2 and so on — combines the digits, applies the multiplier, and shows the resistance with SI prefixes plus the tolerance range.',
    note: 'Read the bands from the end where they\'re grouped closest, with the tolerance band (often gold or silver, and slightly separated) last. Gold and silver as the third band are fractional multipliers (×0.1 and ×0.01) for sub-10-ohm values.',
    faqs: [
      { q: 'How do I read a resistor color code?', a: 'The first two bands (or three on a 5/6-band resistor) are digits, the next is the number of zeros (the ×10ⁿ multiplier), then tolerance. Brown-Black-Red-Gold is 1, 0, ×100 = 1,000 Ω (1 kΩ) at ±5%.' },
      { q: 'What are the resistor color code values?', a: 'Black 0, Brown 1, Red 2, Orange 3, Yellow 4, Green 5, Blue 6, Violet 7, Grey 8, White 9 — as digits, and the same colors as ×10ⁿ multipliers. Gold ×0.1 and Silver ×0.01 handle small values.' },
      { q: 'What does the gold or silver band mean?', a: 'As the tolerance band, gold is ±5% and silver ±10% — the two most common. As a multiplier band, gold is ×0.1 and silver ×0.01, used for resistors below 10 Ω.' },
      { q: 'What is the difference between 4, 5 and 6-band resistors?', a: '4-band has two digit bands (±2%–20% tolerance); 5-band adds a third digit for a more precise value (typically ±1% or better); 6-band adds a temperature-coefficient band showing how the value drifts with temperature.' },
      { q: 'Which end do I start reading from?', a: 'From the end where the bands are grouped together, leaving the slightly-separated tolerance band (often gold or silver) at the far end. If it\'s ambiguous, the tolerance band is the odd one out — gold, silver, or a wider gap.' },
    ],
    keywords: ['resistor color code calculator', 'resistor color code', 'resistor band calculator', '4 band resistor calculator', '5 band resistor calculator', 'resistor value calculator', 'resistor color chart'],
  },
  {
    slug: 'led-resistor-calculator',
    name: 'LED Resistor Calculator',
    icon: '💡',
    widget: 'led',
    description: 'Calculate the series resistor for an LED from the supply voltage, LED forward voltage and current — with the nearest standard value and power rating. In your browser.',
    lead: 'Enter your supply voltage, the LED\'s forward voltage and its current to get the exact series resistor — plus the nearest standard value and its power.',
    how: 'An LED needs a resistor in series to limit its current, or it burns out. The value is Ohm\'s law on the voltage the resistor must drop: R = (supply voltage − LED forward voltage) ÷ LED current. The tool computes that, rounds up to the nearest standard (E12) value so the current stays safe, and gives the resistor\'s power dissipation so you can pick a part rated above it.',
    note: 'Round the resistor up, never down — a larger resistor means slightly less brightness but a safe current, while a smaller one risks overdriving the LED. Typical forward voltages are about 1.8 V for red, 2.0 V for yellow/green and 3.0–3.4 V for blue/white; check your LED\'s datasheet.',
    faqs: [
      { q: 'How do I calculate the resistor for an LED?', a: 'R = (supply voltage − LED forward voltage) ÷ LED current. For a 5 V supply, a 2 V red LED at 20 mA: (5 − 2) ÷ 0.02 = 150 Ω. Round up to the nearest standard value.' },
      { q: 'What resistor do I need for an LED on 5V?', a: 'It depends on the LED, but for a common red LED (2 V, 20 mA) on 5 V it\'s about 150 Ω; for a blue/white LED (3.2 V) it\'s around 90–100 Ω. Enter your LED\'s voltage and current to get the exact value.' },
      { q: 'What happens without a resistor?', a: 'An LED has very little internal resistance, so without a current-limiting resistor it draws far too much current and quickly overheats and fails — often instantly on a normal supply. Always include a resistor (or a proper constant-current driver).' },
      { q: 'What power rating should the resistor be?', a: 'Above the dissipation the tool shows (P = current² × resistance). For typical indicator LEDs that\'s well under ¼ W, so a standard ¼ W resistor is fine; higher currents may need ½ W or more.' },
      { q: 'What is an LED\'s forward voltage?', a: 'The voltage dropped across the LED when it\'s lit, which depends on its color/chemistry — roughly 1.8 V (red), 2.0 V (yellow/green), 3.0–3.4 V (blue/white). It\'s on the datasheet; use it as the "LED forward voltage" input.' },
    ],
    keywords: ['led resistor calculator', 'led series resistor', 'resistor for led calculator', 'current limiting resistor calculator', 'led calculator', 'what resistor for led', 'led ohms calculator'],
  },
  {
    slug: 'voltage-divider-calculator',
    name: 'Voltage Divider Calculator',
    icon: '📉',
    widget: 'divider',
    description: 'Calculate a resistive voltage divider\'s output voltage from the input and two resistors — plus the current and power. In your browser.',
    lead: 'Enter the input voltage and the two resistors to get the divider\'s output voltage, the current it draws and the power it dissipates.',
    how: 'Two resistors in series split a voltage in proportion to their values. The output, taken across the lower resistor R2, is Vout = Vin × R2 ÷ (R1 + R2). The tool also gives the current flowing through the pair (Vin ÷ (R1 + R2)) and the power dissipated, so you can choose resistor values that don\'t waste too much energy.',
    note: 'This formula assumes the output feeds a high-impedance input (like an op-amp or ADC) that draws almost no current. A real load in parallel with R2 pulls the output down, so use lower resistor values relative to the load — or better, a buffer or regulator — when the output has to supply current.',
    faqs: [
      { q: 'How does a voltage divider work?', a: 'Two resistors in series divide the input voltage. The voltage across the lower one (R2) is Vout = Vin × R2 ÷ (R1 + R2). Equal resistors give exactly half the input.' },
      { q: 'How do I calculate a voltage divider?', a: 'Vout = Vin × R2 ÷ (R1 + R2). For 12 V with R1 = 1 kΩ and R2 = 2 kΩ: 12 × 2000 ÷ 3000 = 8 V. Swap R1 and R2 to get the opposite ratio.' },
      { q: 'Can a voltage divider power a device?', a: 'Not really. As soon as the load draws current it upsets the ratio and the output sags, and dividers waste power as heat. Use them for reference/sense signals into high-impedance inputs; use a regulator to actually power something.' },
      { q: 'How do I pick resistor values for a divider?', a: 'Choose the ratio for the voltage you want, then scale the actual values: larger resistors waste less power but are more affected by loading and noise; smaller ones are stiffer but draw more current. A few kΩ to tens of kΩ suits most sensing.' },
      { q: 'What is the current through a voltage divider?', a: 'Vin ÷ (R1 + R2) when unloaded. For 12 V across 3 kΩ total that\'s 4 mA. The tool shows the current and the resulting power so you can keep dissipation reasonable.' },
    ],
    keywords: ['voltage divider calculator', 'voltage divider formula', 'resistor divider calculator', 'vout calculator', 'potential divider calculator', 'two resistor voltage calculator'],
  },
  {
    slug: 'capacitor-code-calculator',
    name: 'Capacitor Code Calculator',
    icon: '🔋',
    widget: 'capcode',
    description: 'Decode a 3-digit ceramic capacitor code (like 104) into its capacitance in pF, nF and µF. In your browser.',
    lead: 'Enter a ceramic capacitor\'s printed code (like 104) to get its capacitance in picofarads, nanofarads and microfarads.',
    how: 'Small ceramic capacitors are marked with a 3-digit code read like the resistor color code: the first two digits are significant figures and the third is the number of zeros, giving the value in picofarads. So 104 means 10 followed by four zeros = 100,000 pF = 100 nF. The tool decodes it and shows the value in all three common units.',
    note: 'A 1 or 2-digit marking is simply the value in picofarads. A trailing letter (like J or K) is the tolerance, not part of the value. Larger electrolytic capacitors usually print their value and unit directly (e.g. "470 µF"), so they don\'t need decoding.',
    faqs: [
      { q: 'How do I read a capacitor code?', a: 'The first two digits are the value and the third is the number of zeros, giving picofarads. 104 = 10 with 4 zeros = 100,000 pF = 100 nF; 223 = 22,000 pF = 22 nF.' },
      { q: 'What does 104 mean on a capacitor?', a: '100 nF (0.1 µF) — the code 104 is 10 × 10⁴ = 100,000 picofarads. It\'s one of the most common decoupling capacitor values.' },
      { q: 'What does the letter after the code mean?', a: 'It\'s the tolerance: common ones are J (±5%), K (±10%) and M (±20%). It doesn\'t change the capacitance value the digits give.' },
      { q: 'How do I convert pF, nF and µF?', a: '1 µF = 1,000 nF = 1,000,000 pF. So 100 nF = 0.1 µF = 100,000 pF. The tool shows all three units at once.' },
      { q: 'Do all capacitors use this code?', a: 'Mostly small ceramic (and some film) capacitors. Larger electrolytic and tantalum capacitors usually print the capacitance and voltage directly, so there\'s nothing to decode.' },
    ],
    keywords: ['capacitor code calculator', 'capacitor value calculator', 'ceramic capacitor code', 'capacitor code 104', 'smd capacitor code', 'capacitor pf nf uf converter', 'capacitor marking calculator'],
  },
  {
    slug: 'wire-gauge-calculator',
    name: 'Wire Gauge (AWG) Calculator',
    icon: '🔌',
    widget: 'awg',
    description: 'Look up an AWG wire\'s diameter, cross-sectional area, copper resistance and typical current rating (ampacity). In your browser.',
    lead: 'Choose an AWG size to see its diameter, cross-section, copper resistance per length and typical current rating.',
    how: 'American Wire Gauge (AWG) is a logarithmic scale where a lower number means a thicker wire. The diameter follows d = 0.127 × 92^((36 − AWG)/39) mm; from that the tool gives the cross-sectional area and the copper resistance per kilometre and per 1,000 feet (from copper\'s resistivity). It also lists typical ampacity for a single wire in free air and for bundled/in-conduit wiring.',
    note: 'Ampacity is safety-critical and standard-dependent: the safe current changes with the insulation\'s temperature rating, the ambient temperature, and how many conductors are bundled. The figures here are conservative guidelines only — for mains and building wiring, follow your local electrical code (e.g. NEC Table 310.16) and consult a qualified electrician.',
    faqs: [
      { q: 'What gauge wire do I need for a given current?', a: 'It depends on the wiring conditions, but as a rough guide for chassis/free-air wiring: about 24 AWG for under ~3 A, 18 AWG for ~10 A, 14 AWG for ~30 A. Bundled or in-conduit wiring must carry less. Always check your local code for mains circuits.' },
      { q: 'How is AWG diameter calculated?', a: 'diameter (mm) = 0.127 × 92^((36 − AWG)/39). 36 AWG is defined as 0.127 mm, and each 6 gauges roughly doubles the diameter (and quadruples the cross-section).' },
      { q: 'Does a lower AWG number mean a thicker or thinner wire?', a: 'Thicker. The scale is inverted: 10 AWG is much thicker (and carries more current) than 24 AWG. Every step down in number is a bigger wire.' },
      { q: 'What is ampacity?', a: 'The maximum current a wire can carry continuously without overheating. It depends heavily on the wire\'s insulation rating, the ambient temperature and whether the wire is in open air or bundled — which is why a single AWG size has several different ratings.' },
      { q: 'Why do the two current ratings differ so much?', a: 'A single wire in free air sheds heat easily, so it can carry more; the same wire bundled in a conduit runs hotter and must carry less. Use the lower, bundled figure for anything enclosed, and always defer to code for building wiring.' },
    ],
    keywords: ['wire gauge calculator', 'awg calculator', 'awg to mm calculator', 'wire size calculator', 'awg ampacity chart', 'wire gauge amps', 'awg diameter calculator'],
  },
  {
    slug: 'rc-filter-calculator',
    name: 'RC Time Constant & Filter Calculator',
    icon: '〰️',
    widget: 'rc',
    description: 'Calculate the RC time constant and the −3 dB cutoff frequency of a resistor-capacitor filter. In your browser.',
    lead: 'Enter a resistance and capacitance to get the RC time constant and the filter\'s cutoff frequency.',
    how: 'A resistor and capacitor together set a characteristic time and frequency. The time constant is τ = R × C — the capacitor charges to about 63% of the final voltage in one τ and is essentially full after five. The −3 dB cutoff frequency of an RC filter is fₒ = 1 ÷ (2π·R·C): a low-pass passes frequencies below it and attenuates above; a high-pass does the reverse.',
    note: 'The same RC pair describes both a timing circuit (how fast a capacitor charges through a resistor) and a filter (where it starts rolling off signals). Units carry through automatically here — pick kΩ and nF or Ω and µF as convenient.',
    faqs: [
      { q: 'What is the RC time constant?', a: 'τ = R × C, the time for a capacitor charging through a resistor to reach about 63% of its final voltage. After five time constants it\'s over 99% charged. A 1 kΩ resistor and 1 µF capacitor give τ = 1 ms.' },
      { q: 'How do I calculate an RC filter\'s cutoff frequency?', a: 'fₒ = 1 ÷ (2π·R·C). For 1 kΩ and 1 µF that\'s about 159 Hz. Below the cutoff a low-pass filter passes the signal; above it, the signal is progressively attenuated.' },
      { q: 'What is the −3 dB point?', a: 'The cutoff frequency, where the output power has dropped to half (the voltage to about 70.7%) of the passband — a fall of 3 decibels. It marks the edge between the passed and attenuated bands.' },
      { q: 'What\'s the difference between a low-pass and high-pass RC filter?', a: 'Both use the same R and C and share the same cutoff; the difference is where you take the output. Across the capacitor gives a low-pass (passes low frequencies); across the resistor gives a high-pass (passes high frequencies).' },
      { q: 'How long until a capacitor is fully charged?', a: 'Practically, about five time constants (5·R·C) — it reaches ~63% after one τ, ~86% after two, ~95% after three and >99% after five. The tool shows τ so you can multiply.' },
    ],
    keywords: ['rc time constant calculator', 'rc filter calculator', 'cutoff frequency calculator', 'rc low pass filter calculator', 'capacitor charge time calculator', 'time constant calculator', '3db frequency calculator'],
  },
  {
    slug: '555-timer-calculator',
    name: '555 Timer Calculator',
    icon: '⏲️',
    widget: 'timer555',
    description: 'Calculate 555 timer frequency, duty cycle and pulse width for astable and monostable circuits from your resistors and capacitor. In your browser.',
    lead: 'Enter your resistors and capacitor to get the 555\'s output frequency and duty cycle (astable) or pulse width (monostable).',
    how: 'The 555 is the classic timer chip. In astable (oscillator) mode it outputs a square wave at f = 1.44 ÷ ((R1 + 2·R2)·C), with a duty cycle of (R1 + R2) ÷ (R1 + 2·R2). In monostable (one-shot) mode a trigger produces a single pulse of width t = 1.1 · R · C. The tool computes these and the high/low times, handling your R and C units automatically.',
    note: 'A standard 555 astable duty cycle is always above 50% because the capacitor charges through R1 + R2 but discharges through R2 alone. To get a symmetric (or under-50%) square wave, add a diode across R2 so charge and discharge use separate paths.',
    faqs: [
      { q: 'How do I calculate 555 timer frequency?', a: 'For astable mode, f = 1.44 ÷ ((R1 + 2·R2)·C). With R1 = 1 kΩ, R2 = 10 kΩ and C = 10 µF that\'s about 6.9 Hz. Larger resistors or capacitor give a lower frequency.' },
      { q: 'What is the difference between astable and monostable?', a: 'Astable runs continuously, producing an oscillating square wave (a clock, blinker or tone). Monostable is a one-shot: a trigger produces a single timed pulse of width 1.1·R·C, then it waits for the next trigger.' },
      { q: 'Why can\'t I get a 50% duty cycle from a 555?', a: 'Because the timing capacitor charges through R1 + R2 but discharges through only R2, the high time is always longer than the low time. Adding a diode across R2 lets it charge through R1 alone, allowing a 50% (or lower) duty cycle.' },
      { q: 'How do I calculate a 555 monostable pulse width?', a: 't = 1.1 · R · C. For R = 100 kΩ and C = 10 µF that\'s about 1.1 seconds. Increase R or C for a longer one-shot pulse.' },
      { q: 'What do R1, R2 and C do in a 555 astable?', a: 'R1 and R2 set the charge/discharge paths and thus the timing and duty cycle; C is the timing capacitor. Bigger values slow the oscillation; the ratio of R1 to R2 sets how long the output stays high versus low.' },
    ],
    keywords: ['555 timer calculator', '555 astable calculator', '555 monostable calculator', 'ne555 calculator', '555 frequency calculator', '555 duty cycle calculator', '555 timer frequency'],
  },
  {
    slug: 'battery-life-calculator',
    name: 'Battery Life Calculator',
    icon: '🔋',
    widget: 'battery',
    description: 'Estimate how long a battery will last from its capacity (mAh) and your device\'s current draw (mA), with a real-world efficiency factor. In your browser.',
    lead: 'Enter your battery capacity and the device\'s current draw to estimate how long it will run.',
    how: 'A battery\'s capacity in milliamp-hours divided by the load\'s current in milliamps gives the theoretical runtime in hours. Real batteries deliver less than the label, so the tool multiplies by an efficiency factor (about 70–85%) to give a more realistic estimate alongside the theoretical maximum.',
    note: 'This is a rule-of-thumb, not a guarantee: actual runtime also depends on the discharge rate (batteries deliver less capacity at high current — the Peukert effect), temperature, the device\'s cutoff voltage, and how the load varies over time. Use it to compare options and size a battery, then test.',
    faqs: [
      { q: 'How do I calculate battery life?', a: 'Battery life (hours) ≈ capacity (mAh) ÷ current draw (mA), then multiplied by an efficiency factor (~0.8) for real-world losses. A 2,000 mAh battery powering a 100 mA device lasts roughly 16 hours in practice.' },
      { q: 'What does mAh mean?', a: 'Milliamp-hours — a measure of charge capacity. A 2,000 mAh battery can (ideally) supply 2,000 mA for one hour, 1,000 mA for two hours, or 100 mA for twenty. Divide by your device\'s current draw for the runtime.' },
      { q: 'Why does my battery last less than the calculation?', a: 'Real capacity is lower than the rating, especially at higher currents (the Peukert effect), in the cold, or once voltage sags below the device\'s cutoff. The efficiency factor accounts for some of this, but treat the result as an estimate.' },
      { q: 'How do I find my device\'s current draw?', a: 'Check its specifications, measure it with a multimeter or USB power meter, or estimate from its power (current = power ÷ voltage). Enter that milliamp figure as the load.' },
      { q: 'What efficiency factor should I use?', a: 'Around 0.8 (80%) is a reasonable default for many batteries and loads; use lower (0.7) for high-drain or cold conditions and higher (0.85–0.9) for gentle, steady loads. Adjust it to match your situation.' },
    ],
    keywords: ['battery life calculator', 'battery runtime calculator', 'mah battery life calculator', 'battery capacity calculator', 'how long will battery last', 'battery discharge calculator', 'battery hours calculator'],
  },
];

export const getElectronicsTool = (slug: string) => ELECTRONICS_TOOLS.find((t) => t.slug === slug);
