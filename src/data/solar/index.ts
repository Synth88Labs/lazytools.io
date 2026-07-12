/** Solar & Off-Grid Energy calculator registry. One entry drives a /solar/ page. */

export interface SolarToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'output' | 'load' | 'battery' | 'inverter' | 'appliance' | 'payback' | 'vdrop' | 'charge';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const SOLAR_TOOLS: SolarToolDef[] = [
  {
    slug: 'solar-panel-output-calculator',
    name: 'Solar Panel Output Calculator',
    icon: '☀️',
    widget: 'output',
    description: 'Estimate how much energy a solar array produces per day, month and year from the panel wattage, count, your peak sun hours and system losses. In your browser.',
    lead: 'Enter your panel wattage, how many panels, your peak sun hours and a system-efficiency factor to estimate daily, monthly and yearly production.',
    how: 'A solar array\'s energy output is its power rating multiplied by how much usable sun it gets and how efficiently the system delivers it. The tool works it out as total watts × peak sun hours × system efficiency ÷ 1000 for the daily kilowatt-hours, then scales that to a month and a year. "Peak sun hours" is your location\'s daily solar energy expressed as equivalent hours of full 1 kW/m² sun.',
    note: 'This is an estimate. Real output swings with the weather, the seasons, shading, panel temperature and ageing (~0.5%/year). For off-grid sizing use your worst-month peak sun hours, not the annual average — a temperate site can get 3–4× less sun in December than June. Look up your location\'s figures on a solar-irradiance map such as NREL\'s.',
    faqs: [
      { q: 'How much energy does a solar panel produce per day?', a: 'Panel watts × peak sun hours × system efficiency ÷ 1000 kWh. A 400 W panel at 4.5 peak sun hours and 80% efficiency makes about 1.44 kWh a day. Multiply by the number of panels for the array total.' },
      { q: 'What are peak sun hours?', a: 'The number of hours per day that sunlight averages 1,000 W/m² — the standard test intensity. It bundles a whole day\'s sunlight into an equivalent number of full-strength hours, typically 3–4 in cloudy regions and 5–6+ in sunny ones, and much lower in winter.' },
      { q: 'How many solar panels do I need?', a: 'Divide your daily energy use (kWh) by what one panel produces per day (panel watts × sun hours × efficiency ÷ 1000). If you use 10 kWh/day and each panel makes 1.44 kWh, you\'d need about seven — then round up for cloudy days and losses.' },
      { q: 'Why is my real output lower than the panel rating?', a: 'Panels are rated at ideal lab conditions. In the field you lose energy to inverter and wiring losses, heat (panels get less efficient hot), dust, shading, and mismatch — together roughly 15–25%, which is the system-efficiency factor.' },
      { q: 'What system efficiency should I use?', a: 'Around 75–85%. NREL\'s PVWatts uses about 14% DC losses (a 0.86 factor) plus inverter losses, giving a whole-system figure near 0.77–0.80 for many installs. Use ~0.80 as a reasonable default and adjust for a hot, dusty or shaded site.' },
    ],
    keywords: ['solar panel output calculator', 'solar production calculator', 'solar panel kwh calculator', 'how much energy does a solar panel produce', 'solar output estimate', 'peak sun hours calculator', 'solar array production'],
  },
  {
    slug: 'off-grid-load-calculator',
    name: 'Off-Grid Load Calculator',
    icon: '🔋',
    widget: 'load',
    description: 'Add up your daily energy use from a list of appliances — the starting point for sizing an off-grid solar and battery system. In your browser.',
    lead: 'List your appliances with their watts, quantity and daily run-time to get your total daily energy use in watt-hours.',
    how: 'Sizing any off-grid or solar system starts with one number: how much energy you use in a day. The tool adds up each appliance as watts × quantity × hours run per day, giving watt-hours, then totals them for your daily load in Wh and kWh. That figure feeds directly into the battery-bank and solar-panel calculators.',
    note: 'The realistic part is the run-time. Appliances that cycle — fridges, freezers, pumps, heating and cooling — are only drawing power some of the time, so use the average hours they actually run per day, not the 24 they\'re plugged in. The preset wattages are typical starting points; check your own appliances\' labels for accuracy.',
    faqs: [
      { q: 'How do I calculate my daily energy use?', a: 'For each appliance, multiply its watts by how many you have and by the hours it runs per day to get watt-hours, then add them all up. A 150 W fridge running an effective 8 hours is 1,200 Wh; sum every device for your daily total.' },
      { q: 'How do I size an off-grid solar system?', a: 'Start here with your daily load in watt-hours. Then size the battery bank (load × days of autonomy ÷ depth of discharge) and the solar array (enough daily kWh to replace the load plus losses). This tool produces the input the other two need.' },
      { q: 'Should I use running watts or hours plugged in?', a: 'Running watts and actual run-time. A fridge is rated maybe 150 W but only its compressor running counts, perhaps 8 equivalent hours a day — not 24. Using plugged-in hours hugely overestimates the load and your system cost.' },
      { q: 'What\'s the difference between watts and watt-hours?', a: 'Watts is the rate of power draw; watt-hours is energy — watts multiplied by time. A 100 W device for 3 hours uses 300 Wh. Off-grid systems are sized on watt-hours (energy) per day, which is what this tool totals.' },
      { q: 'How much do common appliances use?', a: 'Roughly: LED bulb 10 W, laptop 60 W, TV 100 W, fridge 150 W (running), microwave 1,000 W. These vary by model, so the presets are starting points — use your appliance\'s actual label or a plug-in meter where you can.' },
    ],
    keywords: ['off grid load calculator', 'daily energy use calculator', 'solar load calculator', 'watt hours calculator', 'appliance power consumption calculator', 'off grid power needs', 'energy audit calculator'],
  },
  {
    slug: 'solar-battery-bank-calculator',
    name: 'Solar Battery Bank Calculator',
    icon: '🔌',
    widget: 'battery',
    description: 'Size an off-grid battery bank in Amp-hours from your daily energy use, days of autonomy, battery chemistry and system voltage. In your browser.',
    lead: 'Enter your daily load, how many days of backup you want, your battery type and system voltage to size the bank in Amp-hours.',
    how: 'A battery bank has to store enough usable energy to run your loads through the hours (and days) without sun. The tool takes your daily load in watt-hours, multiplies by the days of autonomy you want, then divides by the battery\'s usable depth of discharge to get the nominal capacity — and divides that by the system voltage to give the size in Amp-hours.',
    note: 'Depth of discharge is the key: lead-acid batteries should only be drawn to about 50% to preserve their life, while lithium (LiFePO4) can use around 80% — so the same usable energy needs roughly a 60% bigger lead-acid bank. Two cold-weather cautions: lead-acid loses usable capacity in the cold (only ~80% near 0°C), and lithium must not be charged below freezing. Size up for cold climates.',
    faqs: [
      { q: 'How do I size a battery bank for solar?', a: 'Bank capacity = daily load (Wh) × days of autonomy ÷ depth of discharge, then ÷ system voltage for Amp-hours. For 3,000 Wh/day, 1 day of backup, 50% lead-acid DoD at 24 V, that\'s 6,000 Wh nominal ≈ 250 Ah.' },
      { q: 'What is depth of discharge?', a: 'How much of a battery\'s capacity you regularly use. Draining lead-acid past ~50% shortens its life sharply; lithium (LiFePO4) tolerates ~80% or more. Sizing on usable DoD (not full capacity) is why the bank comes out larger than the raw energy figure.' },
      { q: 'How many days of autonomy do I need?', a: 'How long the bank should run with no charging, through cloudy spells. One to two days is common for a system with a generator backup; three or more for full off-grid reliability in cloudy climates. More autonomy means a bigger, costlier bank.' },
      { q: 'What system voltage should I use — 12, 24 or 48 V?', a: 'Higher voltages carry the same power at lower current, meaning thinner wire and less loss, so larger systems use 24 or 48 V. 12 V suits small setups (small RVs, single panels); 24–48 V suits cabins and homes. It doesn\'t change the energy, just the Amp-hours.' },
      { q: 'Does cold weather affect battery size?', a: 'Yes. Lead-acid batteries deliver less capacity when cold — around 80% at 0°C — so you need a bigger bank in cold climates. Lithium holds capacity better but its charging must be blocked below freezing. Either way, size up and insulate the bank.' },
    ],
    keywords: ['solar battery bank calculator', 'battery bank sizing', 'off grid battery calculator', 'battery amp hours calculator', 'how many batteries for solar', 'solar storage calculator', 'battery capacity calculator solar'],
  },
  {
    slug: 'inverter-size-calculator',
    name: 'Inverter Size Calculator',
    icon: '⚙️',
    widget: 'inverter',
    description: 'Work out the inverter size you need from your total running watts and the biggest startup surge, with headroom. In your browser.',
    lead: 'Enter the total watts of everything running at once and your largest startup surge to size the inverter\'s continuous and surge ratings.',
    how: 'An inverter turns battery DC into household AC, and it needs two ratings big enough for your loads: a continuous rating for everything running at the same time (plus headroom so it isn\'t constantly maxed out), and a surge rating for the brief spike when a motor starts. The tool multiplies your running watts by a headroom factor for the continuous size and takes the larger of that or your surge figure for the peak.',
    note: 'Add up only what actually runs simultaneously, not every device you own — an inverter sized for the whole house when you never run it all at once just wastes money. The surge matters for motors: fridges, pumps, compressors and power tools draw roughly 2–3× their running watts for a fraction of a second on startup, and the inverter\'s surge rating must cover the biggest one while other loads run.',
    faqs: [
      { q: 'What size inverter do I need?', a: 'A continuous rating at least 25% above the total watts of everything running at once, and a surge rating that covers your largest motor\'s startup. For 1,500 W of simultaneous load that\'s about a 1,875 W continuous inverter, with surge headroom above that.' },
      { q: 'What is inverter surge?', a: 'The brief peak power an inverter can supply for a moment — needed because motors draw far more than their running watts when they start (roughly 2–3×). A fridge that runs at 150 W might surge to 400–600 W for a fraction of a second.' },
      { q: 'Do I add up all my appliances?', a: 'Only the ones that run at the same time. Size the inverter for your realistic simultaneous load, not the sum of everything you own — you rarely run the microwave, kettle and vacuum together, and sizing for that is wasteful.' },
      { q: 'Why include headroom?', a: 'Running an inverter permanently near its limit stresses it and cuts efficiency and lifespan. A ~25% margin lets it run comfortably and leaves room for a small extra load, without oversizing (which wastes idle power).' },
      { q: 'What happens if the inverter is too small?', a: 'It overloads and shuts down (or trips) when demand exceeds its rating — often right when a motor starts and the surge exceeds its peak. Sizing the continuous and surge ratings correctly avoids nuisance shutdowns.' },
    ],
    keywords: ['inverter size calculator', 'what size inverter do i need', 'inverter sizing', 'solar inverter calculator', 'inverter wattage calculator', 'surge watts calculator', 'inverter power calculator'],
  },
  {
    slug: 'appliance-energy-cost-calculator',
    name: 'Appliance Energy Cost Calculator',
    icon: '💡',
    widget: 'appliance',
    description: 'Calculate what an appliance costs to run per day, month and year from its wattage, daily use and your electricity rate. In your browser.',
    lead: 'Enter an appliance\'s power, how many hours a day it runs and your electricity rate to see the running cost.',
    how: 'Running cost is energy used times price. The tool converts the appliance\'s watts to kilowatts, multiplies by the hours it runs each day for the daily kilowatt-hours, then multiplies by your electricity rate — and scales the result to a month and a year so you can see the real yearly cost of leaving something on.',
    note: 'Find the wattage on the appliance\'s rating label or measure it with a plug-in energy meter. For anything that cycles or is thermostat-controlled — fridges, freezers, heaters, air conditioning — use the average hours it actually runs, not the hours it\'s switched on, or you\'ll overestimate. Standby power adds up too; a device "off" but plugged in can still draw a few watts.',
    faqs: [
      { q: 'How do I calculate the running cost of an appliance?', a: 'Cost = power (kW) × hours used × electricity rate. A 150 W fridge running an effective 8 hours a day at $0.30/kWh costs about $0.36 a day, or roughly $130 a year.' },
      { q: 'How much does it cost to run something 24/7?', a: 'Watts ÷ 1000 × 24 × 365 × your rate. A 10 W device left on all year at $0.30/kWh costs about $26; a 100 W one about $263. Small always-on loads add up over a year.' },
      { q: 'Where do I find an appliance\'s wattage?', a: 'On its rating label or in the manual, or measure it directly with an inexpensive plug-in energy monitor — which also captures cycling and standby draw more accurately than the nameplate figure.' },
      { q: 'What is standby power?', a: 'The energy a device uses while "off" but still plugged in — a few watts for TVs, chargers, consoles and anything with a remote or clock. Individually small, collectively a noticeable share of a home\'s bill; a switched power strip eliminates it.' },
      { q: 'How can I cut an appliance\'s running cost?', a: 'Run it less, replace it with a more efficient model (LED lighting, a modern fridge), and cut standby draw. This tool shows the yearly cost, which makes it easy to see when a more efficient replacement pays for itself.' },
    ],
    keywords: ['appliance energy cost calculator', 'electricity cost calculator', 'cost to run appliance', 'watts to cost calculator', 'energy usage cost', 'how much does it cost to run', 'kwh cost calculator'],
  },
  {
    slug: 'solar-payback-calculator',
    name: 'Solar Payback Calculator',
    icon: '📈',
    widget: 'payback',
    description: 'Estimate how many years a solar system takes to pay for itself from its cost, annual production and your electricity rate. In your browser.',
    lead: 'Enter the net system cost, its annual production and your electricity rate to estimate the simple payback period and long-term savings.',
    how: 'Solar pays back by offsetting electricity you would otherwise buy. The tool multiplies the system\'s annual production by your electricity rate for the yearly savings, then divides the net cost (after any incentives) by that to get the simple payback period in years — and projects the net savings over a 25-year panel lifetime.',
    note: 'This is a simplified, first-order estimate for comparison, not financial advice. It ignores electricity-price inflation (which shortens payback), gradual panel degradation (~0.5%/year), maintenance, and the time-value of money, and it assumes you use or are credited for all the energy produced. Real returns depend on local incentives, net-metering rules and your usage — get quotes and check the details.',
    faqs: [
      { q: 'How long does it take for solar panels to pay for themselves?', a: 'Typically somewhere around 6–12 years, depending on system cost, sunlight, your electricity rate and incentives. Payback = net cost ÷ annual savings; a $12,000 system saving $1,800/year pays back in about 6.7 years.' },
      { q: 'How do I calculate solar payback?', a: 'Divide the net system cost (after rebates and tax credits) by the annual savings, where annual savings = yearly production (kWh) × your electricity rate. The result is the simple payback in years.' },
      { q: 'Is solar worth it financially?', a: 'Usually, if payback is well within the ~25-year panel lifetime — after payback the electricity is essentially free. It depends heavily on your rate (higher rates pay back faster), local sun, incentives and net-metering. This tool gives a first estimate to compare against quotes.' },
      { q: 'Why is this only an estimate?', a: 'Simple payback ignores electricity-price rises (which help), panel degradation and maintenance (which hurt slightly), and financing costs. It also assumes you benefit from all the energy. It\'s a solid comparison tool, not a substitute for a detailed quote.' },
      { q: 'What is net metering and does it matter?', a: 'Net metering credits you for surplus energy you send back to the grid, effectively storing value for later use. Where it\'s generous, more of your production counts toward savings and payback is faster; where it isn\'t, only self-consumed energy saves you money.' },
    ],
    keywords: ['solar payback calculator', 'solar panel roi calculator', 'solar break even calculator', 'is solar worth it', 'solar savings calculator', 'solar payback period', 'solar return on investment'],
  },
  {
    slug: 'dc-voltage-drop-calculator',
    name: 'DC Voltage Drop Calculator',
    icon: '📉',
    widget: 'vdrop',
    description: 'Calculate the voltage drop over a DC wire run for solar and battery systems, and check it against the recommended limits. In your browser.',
    lead: 'Enter the run length, current, wire gauge and system voltage to get the voltage drop, the voltage at the load and whether it\'s within limits.',
    how: 'Every wire has resistance, so some voltage is lost pushing current along it. For a DC run the drop is 2 × length × current × the wire\'s resistance per length (the 2 accounts for the current going out and coming back). The tool computes the drop in volts and as a percentage of the system voltage, the voltage left at the load, and the power wasted as heat — and flags whether the drop is within recommended limits.',
    note: 'Low-voltage DC is very sensitive to voltage drop, which is why solar and battery wiring uses thick cable and short runs. NEC allows up to 3%, but solar best practice targets 2% or less on the main array run to avoid losing harvest. If the drop is too high, use thicker wire, shorten the run, or step up to a higher system voltage (24 or 48 V), which carries the same power at lower current.',
    faqs: [
      { q: 'How do I calculate DC voltage drop?', a: 'Drop = 2 × one-way length × current × the wire\'s resistance per metre (from copper resistivity ÷ cross-section area). The factor of 2 is the round-trip out and back. Divide by the system voltage for the percentage.' },
      { q: 'What is an acceptable voltage drop?', a: 'The NEC treats 3% as the informational limit for a branch circuit and 5% total. For solar, best practice is stricter — 2% or less on the main DC run — because any drop there is lost production. Aim for ≤2–3%.' },
      { q: 'Why is voltage drop worse on 12V systems?', a: 'The same power at a lower voltage means much higher current, and drop is proportional to current. So a 12 V system carrying 100 A drops far more over the same wire than a 48 V system carrying 25 A — which is why bigger systems use higher voltages.' },
      { q: 'How do I reduce voltage drop?', a: 'Use thicker wire (lower gauge number), shorten the run, reduce the current, or raise the system voltage. Thicker wire and higher voltage are the usual fixes for a long run between panels, controller and battery.' },
      { q: 'Does voltage drop waste energy?', a: 'Yes — the lost voltage becomes heat in the wire (power lost = drop × current). A few percent drop is a few percent of your energy gone as heat, plus the load runs on lower voltage, which is why keeping drop low matters in off-grid systems.' },
    ],
    keywords: ['dc voltage drop calculator', 'voltage drop calculator solar', 'wire voltage drop calculator', '12v voltage drop', 'solar cable size calculator', 'voltage drop percentage', 'battery cable voltage drop'],
  },
  {
    slug: 'battery-charge-time-calculator',
    name: 'Battery Charge Time Calculator',
    icon: '🔄',
    widget: 'charge',
    description: 'Estimate how long a battery takes to charge from its capacity and the charge current, plus the C-rate. In your browser.',
    lead: 'Enter the battery capacity, the charge current and a losses allowance to estimate the charge time and the C-rate.',
    how: 'Charge time is roughly the battery\'s capacity divided by the current going into it, plus a bit extra because charging isn\'t perfectly efficient. The tool computes that time and the C-rate — the charge current relative to the capacity — which tells you whether you\'re charging gently or fast, and whether that\'s safe for your battery chemistry.',
    note: 'The C-rate is the safety check: lead-acid batteries want a gentle charge (about 0.1–0.3C), while lithium (LiFePO4) accepts much faster charging (0.5C and beyond). For solar charging, the "charge current" is what your panels and controller actually deliver, which rises and falls through the day and with cloud cover — so real charging takes longer than this best-case figure suggests.',
    faqs: [
      { q: 'How long does it take to charge a battery?', a: 'Roughly capacity (Ah) ÷ charge current (A), plus 10–20% for charging losses. A 100 Ah battery at 20 A takes about 100 ÷ 20 × 1.15 ≈ 5.75 hours from empty to full.' },
      { q: 'What is C-rate?', a: 'The charge (or discharge) current relative to capacity: a 100 Ah battery charged at 20 A is at 0.2C, at 50 A is 0.5C. It tells you how gentle or aggressive the charge is — important because each battery chemistry has a safe maximum.' },
      { q: 'What is a safe charge rate for my battery?', a: 'Lead-acid prefers a gentle 0.1–0.3C (10–30 A per 100 Ah); lithium (LiFePO4) commonly accepts 0.5C and many cells up to 1C. Charging faster than the recommended C-rate shortens life or trips protection — check your battery\'s spec.' },
      { q: 'Why does solar charging take longer than this?', a: 'Because panels don\'t deliver full current all day — output ramps up and down with the sun and drops under cloud. The calculator assumes a steady charge current, so treat its time as a best case and expect real solar charging to take longer.' },
      { q: 'Why add a losses allowance?', a: 'Charging isn\'t 100% efficient — some energy becomes heat, especially near full charge for lead-acid. Adding roughly 10–20% to the ideal time gives a more realistic figure for a full charge.' },
    ],
    keywords: ['battery charge time calculator', 'how long to charge battery', 'c rate calculator', 'battery charging time', 'solar battery charge time', 'charge current calculator', 'lithium battery charge calculator'],
  },
];

export const getSolarTool = (slug: string) => SOLAR_TOOLS.find((t) => t.slug === slug);
