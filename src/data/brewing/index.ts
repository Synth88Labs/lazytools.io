/** Homebrewing calculator registry. One entry drives a /brewing/ page. */

export interface BrewingToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'abv' | 'ibu' | 'priming' | 'brix' | 'hydrometer' | 'strike' | 'dilution' | 'refractometer' | 'carbonation' | 'color';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const BREWING_TOOLS: BrewingToolDef[] = [
  {
    slug: 'abv-calculator',
    name: 'ABV Calculator',
    icon: '🍺',
    widget: 'abv',
    description: 'Calculate alcohol by volume (ABV) from your original and final gravity, plus attenuation and calories. In your browser.',
    lead: 'Enter your original and final gravity to get the ABV — with the more accurate high-gravity formula, attenuation and calories too.',
    how: 'As yeast ferments sugar into alcohol and CO₂, the wort gets less dense, so the drop in gravity tells you how much alcohol was made. The standard estimate is ABV = (OG − FG) × 131.25. The tool also shows Michael Hall\'s more accurate formula (better for strong beers), the apparent attenuation (how much sugar fermented) and an estimate of the calories per serving.',
    note: 'The simple ×131.25 formula is spot-on for typical beers but reads slightly low above about 1.070 — use the "accurate" figure for big beers. Gravities are specific gravity (water = 1.000); if you measured with a refractometer after fermentation started, correct the final reading first (alcohol skews refractometers), which the refractometer tool handles.',
    faqs: [
      { q: 'How do I calculate ABV from OG and FG?', a: 'ABV = (original gravity − final gravity) × 131.25. For OG 1.050 and FG 1.010 that\'s (0.040) × 131.25 ≈ 5.25% ABV. For strong beers above ~1.070, use the more accurate formula the tool also shows.' },
      { q: 'What is the difference between the two ABV formulas?', a: 'The simple one (×131.25) is a linear approximation that\'s accurate for normal-strength beers. Michael Hall\'s formula accounts for the non-linear relationship at higher gravities, where the simple version underestimates by more than 0.2% ABV.' },
      { q: 'What is attenuation?', a: 'The percentage of the original sugar the yeast fermented: (OG − FG) ÷ (OG − 1). Typical ales finish around 70–80%. Low attenuation means a sweeter, fuller beer; high attenuation a drier one.' },
      { q: 'How are the calories calculated?', a: 'From the alcohol and residual carbohydrates using the original and final gravity, per 12 oz (355 mL) serving. It\'s a standard homebrew estimate — most of the calories come from the alcohol, with the rest from unfermented sugars.' },
      { q: 'Why is my ABV different from the label of a similar beer?', a: 'ABV depends on your exact OG and FG, which vary with your recipe, yeast and fermentation. Two beers of the same style can differ by a percent or more. The calculation is only as good as your gravity readings — take them at the right temperature.' },
    ],
    keywords: ['abv calculator', 'alcohol by volume calculator', 'og fg abv', 'homebrew abv calculator', 'beer alcohol calculator', 'abv from gravity', 'brewing abv formula'],
  },
  {
    slug: 'ibu-calculator',
    name: 'IBU Calculator (Tinseth)',
    icon: '🌿',
    widget: 'ibu',
    description: 'Calculate a beer\'s bitterness in IBU from your hop additions using the Tinseth formula. In your browser.',
    lead: 'Add your hop additions — weight, alpha-acid percentage and boil time — with your boil gravity and volume to get the total IBU.',
    how: 'Bitterness comes from alpha acids in the hops isomerising during the boil. The tool uses Glenn Tinseth\'s widely-used model: each addition contributes bitterness based on the alpha acids added (weight × alpha% ÷ volume) times a utilization factor that rises with boil time and falls as wort gravity increases. It sums every addition for the total IBU and shows each one\'s share.',
    note: 'IBU estimates are exactly that — estimates. The Tinseth model assumes a normal boil; hop form (pellets vs whole), boil vigour, a hop stand or whirlpool, and your equipment all shift real utilization. Late and dry-hop additions add lots of aroma but little measured IBU. Use it to compare and balance recipes rather than as an exact lab figure.',
    faqs: [
      { q: 'How is IBU calculated?', a: 'IBU = utilization × the alpha acids added (in mg/L). Utilization comes from the Tinseth formula: it increases with boil time and decreases as wort gravity rises. Each hop addition is calculated separately and summed.' },
      { q: 'What is the Tinseth formula?', a: 'Glenn Tinseth\'s hop utilization model: utilization = bigness factor × boil-time factor, where bigness = 1.65 × 0.000125^(gravity−1) and boil-time factor = (1 − e^(−0.04 × minutes)) ÷ 4.15. It\'s the default in most brewing software.' },
      { q: 'Why does higher gravity lower the IBU?', a: 'A denser, sugarier wort extracts alpha acids less efficiently, so the same hops in a stronger beer give fewer IBU. That\'s the "bigness factor" — big beers need proportionally more hops to hit the same bitterness.' },
      { q: 'Do late and dry hops add IBU?', a: 'Very little measured IBU — bitterness needs boil time to isomerise the alpha acids. A 5-minute or flame-out addition contributes mostly flavour and aroma, and dry hops add aroma with essentially no IBU, though they can taste bitter.' },
      { q: 'How accurate is the IBU estimate?', a: 'It\'s a solid relative guide but not a lab measurement. Real utilization depends on hop form, boil vigour, whirlpool time and your system, so treat the number as a target for balancing a recipe rather than an exact value.' },
    ],
    keywords: ['ibu calculator', 'tinseth ibu calculator', 'hop bitterness calculator', 'beer ibu calculator', 'homebrew ibu', 'hop utilization calculator', 'bitterness units calculator'],
  },
  {
    slug: 'priming-sugar-calculator',
    name: 'Priming Sugar Calculator',
    icon: '🫧',
    widget: 'priming',
    description: 'Calculate the priming sugar needed to carbonate your beer to a target CO₂ level when bottling. In your browser.',
    lead: 'Enter your target carbonation, beer temperature, batch volume and sugar type to get the priming sugar to add at bottling.',
    how: 'Bottle carbonation works by feeding the yeast a measured dose of sugar so it produces exactly the CO₂ you want in the sealed bottle. The beer already holds some dissolved CO₂ that depends on its temperature, so the tool works out how much more you need and converts that to grams of your chosen sugar for the batch volume.',
    note: 'Use the highest temperature the beer reached after fermentation — that sets how much CO₂ is already dissolved (warmer beer holds less). Different sugars carry different amounts of fermentable weight, so corn sugar, table sugar and DME give slightly different doses; the factors here come from CO₂ stoichiometry and vary a little between references. Over-priming is dangerous — too much sugar can over-pressurise and burst bottles, so measure carefully.',
    faqs: [
      { q: 'How much priming sugar do I need?', a: 'It depends on your target carbonation, beer temperature and batch size. For a typical 20 L ale to 2.4 volumes of CO₂ at 20 °C, it\'s roughly 120–130 g of corn sugar. Enter your figures for the exact amount.' },
      { q: 'Why does beer temperature matter for priming?', a: 'Beer already holds dissolved CO₂, and the amount depends on temperature — warmer beer holds less. You only add sugar for the difference between what\'s there and your target, so the temperature (the warmest it reached) sets the starting point.' },
      { q: 'What\'s the difference between corn sugar and table sugar for priming?', a: 'Both work; they just differ slightly by weight. Corn sugar (dextrose) is sold as a monohydrate so you need a touch more than table sugar (sucrose) for the same CO₂. The tool adjusts for the sugar you pick.' },
      { q: 'What carbonation level should I target?', a: 'By style: British ales around 2.0 volumes, American ales and lagers ~2.4, Belgian ales ~2.9, and wheat beers or saisons ~3.2 or higher. The tool has quick presets for these.' },
      { q: 'Can I add too much priming sugar?', a: 'Yes — and it\'s dangerous. Too much sugar over-carbonates and can build enough pressure to burst bottles ("bottle bombs"). Weigh the sugar accurately, don\'t guess, and never exceed what your bottles are rated for.' },
    ],
    keywords: ['priming sugar calculator', 'bottle carbonation calculator', 'priming calculator', 'corn sugar calculator', 'co2 priming calculator', 'how much priming sugar', 'bottle conditioning calculator'],
  },
  {
    slug: 'brix-to-sg-calculator',
    name: 'Brix to Specific Gravity Converter',
    icon: '🔬',
    widget: 'brix',
    description: 'Convert between °Brix (refractometer) and specific gravity (hydrometer), in both directions. In your browser.',
    lead: 'Enter a Brix or specific-gravity value to convert between the two — the scales refractometers and hydrometers use.',
    how: 'Refractometers read sugar content in °Brix (percent sugar by weight), while hydrometers read specific gravity (density relative to water). The tool converts between them with the standard cubic formulas used across brewing software, in whichever direction you need — Brix to gravity or gravity to Brix.',
    note: 'This conversion is for sugar solutions like unfermented wort or must. Once fermentation begins, alcohol throws off refractometer Brix readings, so this straight conversion no longer gives the true gravity — use the refractometer final-gravity tool for that. °Brix and °Plato are close enough to treat as the same for homebrewing.',
    faqs: [
      { q: 'How do I convert Brix to specific gravity?', a: 'Use the standard formula SG = Brix ÷ (258.6 − (Brix ÷ 258.2 × 227.1)) + 1. For 12 °Brix that\'s about 1.048. The tool does it both ways instantly.' },
      { q: 'What is the difference between Brix and specific gravity?', a: 'Brix measures dissolved sugar as a percentage by weight; specific gravity measures the solution\'s density relative to water. Refractometers use Brix, hydrometers use gravity — both indicate how much sugar is present, just on different scales.' },
      { q: 'Is Brix the same as Plato?', a: 'Almost. Both measure sugar by weight percentage and are defined slightly differently, but for practical homebrewing the difference is negligible — a Brix reading and a Plato reading are effectively interchangeable.' },
      { q: 'Can I use this on fermenting beer?', a: 'No — once alcohol is present it distorts refractometer Brix readings, so a plain Brix-to-gravity conversion reads the final gravity too high. Use it for pre-fermentation wort or must; for post-fermentation refractometer readings, use the refractometer correction tool.' },
      { q: 'Why does my refractometer disagree with my hydrometer?', a: 'On unfermented wort they should match after this conversion (calibrate the refractometer with distilled water at zero). If they differ on fermenting beer, it\'s the alcohol skewing the refractometer — the hydrometer is right there.' },
    ],
    keywords: ['brix to specific gravity', 'brix to sg calculator', 'sg to brix converter', 'brix conversion calculator', 'plato to gravity', 'refractometer to gravity', 'brix gravity converter'],
  },
  {
    slug: 'hydrometer-temperature-correction',
    name: 'Hydrometer Temperature Correction',
    icon: '🌡️',
    widget: 'hydrometer',
    description: 'Correct a hydrometer gravity reading for the temperature of the sample, using the calibration temperature. In your browser.',
    lead: 'Enter your hydrometer reading, the sample temperature and the hydrometer\'s calibration temperature to get the corrected gravity.',
    how: 'Liquids expand when warm, so a hot sample is less dense and the hydrometer floats lower — reading a gravity that\'s too low. Hydrometers are calibrated to be exact at one temperature (often 20 °C / 68 °F or 15.5 °C / 60 °F). The tool applies the standard density correction to convert your reading at the sample temperature back to the true gravity.',
    note: 'The correction is tiny near the calibration temperature but grows for a hot sample taken straight off the boil — where it can shift the reading by several points. Check the calibration temperature printed on your hydrometer\'s scale and enter it, since cheaper hydrometers are often calibrated at 20 °C and some at 15.5 °C. Better still, cool the sample close to calibration temperature before reading.',
    faqs: [
      { q: 'Do I need to correct hydrometer readings for temperature?', a: 'Yes, unless the sample is at the hydrometer\'s calibration temperature. A warm sample reads low; the correction adds the difference back. It\'s small near calibration temperature but significant for hot wort.' },
      { q: 'What temperature are hydrometers calibrated at?', a: 'Commonly 20 °C (68 °F), though many are calibrated at 15.5 °C (60 °F). The calibration temperature is printed on the hydrometer\'s paper scale — enter that value so the correction is right.' },
      { q: 'How much does temperature change a hydrometer reading?', a: 'Near calibration temperature, almost nothing. But a sample at 40 °C read on a 20 °C hydrometer can be off by several gravity points, enough to matter for OG and ABV. The hotter the sample, the bigger the correction.' },
      { q: 'Should I cool my sample before reading?', a: 'Ideally yes — cooling to near the calibration temperature makes the reading accurate without correction. When that\'s not practical (checking a boiling wort), take the reading and apply the correction here.' },
      { q: 'Which way does the correction go?', a: 'For a sample hotter than calibration temperature, the true gravity is higher than the reading (the correction is positive). For a colder sample it\'s slightly lower. The tool shows the corrected value and the size of the correction.' },
    ],
    keywords: ['hydrometer temperature correction', 'hydrometer temp adjustment', 'gravity temperature correction', 'hydrometer calibration temperature', 'correct hydrometer reading', 'brewing temperature correction', 'specific gravity temperature'],
  },
  {
    slug: 'strike-water-calculator',
    name: 'Strike Water Temperature Calculator',
    icon: '♨️',
    widget: 'strike',
    description: 'Calculate the strike water temperature to hit your mash temperature, from the grain temperature and water-to-grain ratio. In your browser.',
    lead: 'Enter your target mash temperature, grain temperature and water-to-grain ratio to get the strike water temperature.',
    how: 'When you mix hot strike water with cool, dry grain, the grain absorbs heat and the mixture settles below the water temperature. The tool uses Palmer\'s infusion equation to work backwards: it heats the water enough above your mash target to land exactly on it once the grain has taken its share of the heat, based on how much water you use per unit of grain.',
    note: 'The formula assumes a mash tun already at room temperature. A cold metal pot or cooler steals extra heat, so preheat it with some hot water first, or aim a degree or two higher and stir well. Metric works in °C and litres per kilogram; imperial in °F and quarts per pound — the 0.2 (or 0.41 metric) constant is grain\'s heat capacity relative to water.',
    faqs: [
      { q: 'How do I calculate strike water temperature?', a: 'Palmer\'s formula: strike temp = (0.2 ÷ ratio) × (mash temp − grain temp) + mash temp, where the ratio is water-to-grain in quarts per pound (0.41 and litres per kilogram in metric). The tool handles both unit systems.' },
      { q: 'Why is strike water hotter than the mash temperature?', a: 'Because the cool, dry grain absorbs heat when you add it, pulling the mixture down. You start the water hotter so that, after the grain takes its share, the mash settles at your target temperature.' },
      { q: 'What water-to-grain ratio should I use?', a: 'A common single-infusion ratio is about 3 L/kg (1.5 qt/lb) — thinner ratios need less-hot water, thicker ones more. The ratio also subtly affects the mash; 2.5–3.5 L/kg is a typical range.' },
      { q: 'My mash came in too low — why?', a: 'Usually the tun or grain was colder than assumed, or the grain wasn\'t at the temperature you entered. Preheat the mash tun, measure the grain temperature, and if you consistently land low, aim a degree or two higher. Stir to even out hot and cold spots.' },
      { q: 'Does the mash tun material matter?', a: 'Yes. A pre-warmed cooler holds temperature well and matches the formula\'s assumption; a cold metal pot absorbs noticeable heat and will drop your mash below target unless you preheat it or add a little to the strike temperature.' },
    ],
    keywords: ['strike water calculator', 'strike temperature calculator', 'mash strike water temp', 'infusion temperature calculator', 'brewing strike water', 'mash temperature calculator', 'all grain strike water'],
  },
  {
    slug: 'gravity-dilution-calculator',
    name: 'Gravity Dilution Calculator',
    icon: '💧',
    widget: 'dilution',
    description: 'Calculate how much water to add to bring a too-strong wort down to your target gravity. In your browser.',
    lead: 'Enter your current volume and gravity and a target gravity to see how much water to add.',
    how: 'If your wort finished stronger than the recipe called for, adding water dilutes it to the gravity you want. The tool uses gravity points (the last digits of the specific gravity): the total points are conserved when you add water, so it solves for the final volume that gives your target gravity and tells you how much water that means adding.',
    note: 'Add the water gradually and re-measure as you go — it\'s easy to overshoot, and you can\'t easily undo it. Remember that diluting lowers everything proportionally, not just the gravity: the bitterness (IBU), colour and flavour intensity all drop too, so a big correction can leave the beer tasting thin.',
    faqs: [
      { q: 'How much water do I add to lower gravity?', a: 'Water to add = current volume × (current gravity points ÷ target points − 1), where points are the last two SG digits. To take 20 L of 1.060 down to 1.050: 20 × (60 ÷ 50 − 1) = 4 L. The tool computes it for you.' },
      { q: 'How does diluting wort work?', a: 'Gravity points × volume stays constant when you add water, so spreading the same sugar over more liquid lowers the gravity. It\'s the same principle as any dilution — more solvent, lower concentration.' },
      { q: 'Does adding water change anything besides gravity?', a: 'Yes — it dilutes everything. Bitterness, colour and flavour all drop in the same proportion as the gravity, so a large dilution can make the beer taste watery. Correct in small steps and taste as you go.' },
      { q: 'My original gravity is too high — what should I do?', a: 'Top up with clean, sanitised water (or cooled boiled water) to the volume this tool gives, mixing and re-measuring. Catching it before fermentation is easiest; adjusting later dilutes the finished beer.' },
      { q: 'Can I use this to raise gravity?', a: 'Not directly — this tool dilutes. To raise gravity you\'d boil longer to evaporate water, or add malt extract; a target above the current gravity isn\'t achievable by adding water.' },
    ],
    keywords: ['gravity dilution calculator', 'dilute wort calculator', 'lower gravity calculator', 'water to add brewing', 'og correction calculator', 'wort dilution calculator', 'adjust gravity with water'],
  },
  {
    slug: 'refractometer-calculator',
    name: 'Refractometer Final Gravity Calculator',
    icon: '🔭',
    widget: 'refractometer',
    description: 'Correct a refractometer reading for alcohol to estimate the true final gravity and ABV of fermenting or finished beer. In your browser.',
    lead: 'Enter the original Brix, the current Brix reading and your correction factor to estimate the true final gravity and ABV.',
    how: 'Refractometers are quick and need only a drop of sample, but alcohol bends light differently from sugar, so once fermentation starts they read the final gravity too high. The tool applies a wort correction factor and Sean Terrill\'s cubic formula to estimate the true final gravity from your original and current Brix readings — and works out the ABV.',
    note: 'The wort correction factor (WCF) is specific to your refractometer — around 1.04 is typical, but calibrate yours by comparing a pre-fermentation refractometer reading against a hydrometer. The correction is an estimate that assumes a normal fermentation; for a reading that really matters (a competition, a big beer), confirm it with a hydrometer.',
    faqs: [
      { q: 'Why can\'t I use a refractometer for final gravity directly?', a: 'Because alcohol refracts light differently from sugar, inflating the reading once fermentation begins. A raw Brix-to-gravity conversion then reads the final gravity too high — you need an alcohol correction like this one.' },
      { q: 'How does the refractometer correction work?', a: 'It takes your original and current Brix, divides them by a wort correction factor (WCF) specific to your device, and applies Sean Terrill\'s cubic formula to estimate the true final gravity accounting for the alcohol present.' },
      { q: 'What is the wort correction factor?', a: 'A per-refractometer adjustment (typically ~1.04) that aligns its Brix scale with actual gravity. Calibrate it by measuring an unfermented wort with both the refractometer and a hydrometer and dividing to find your factor.' },
      { q: 'How accurate is the estimate?', a: 'Good enough for tracking a fermentation and ballparking ABV, but it\'s a model, not a direct measurement. For readings that matter — a competition entry or a very strong beer — confirm with a hydrometer.' },
      { q: 'Can I track fermentation progress with a refractometer?', a: 'Yes — that\'s a great use. A few drops each day, run through this correction, shows the gravity falling and stabilising, telling you when fermentation is complete without drawing large hydrometer samples.' },
    ],
    keywords: ['refractometer calculator', 'refractometer final gravity', 'refractometer correction calculator', 'refractometer fg abv', 'wort correction factor', 'refractometer alcohol correction', 'brewing refractometer calculator'],
  },
  {
    slug: 'keg-carbonation-calculator',
    name: 'Keg Carbonation Pressure Calculator',
    icon: '🫧',
    widget: 'carbonation',
    description: 'Find the CO₂ regulator pressure to force-carbonate beer to a target volume at a given temperature — in PSI, kPa and bar. In your browser.',
    lead: 'Enter your beer\'s temperature and target CO₂ volumes to get the regulator pressure for force carbonation.',
    how: 'How much CO₂ dissolves in beer depends on both pressure and temperature: colder beer holds more gas at the same pressure. To force-carbonate in a keg, you set the regulator to the pressure that, at your serving temperature, holds the CO₂ level (measured in "volumes") you want. The tool solves the standard solubility relation P = (volumes + 0.003342) ÷ (0.01821 + 0.09011·e^(−(T−32)/43.11)) − 14.695 for the gauge pressure, and shows it in PSI, kPa and bar.',
    note: 'Set the regulator, keep the keg at that temperature, and give it about a week to reach equilibrium — or speed it up by rocking/shaking the cold keg under pressure. If the beer is very cold and lightly carbonated the required pressure can be near zero. Once carbonated, drop to a lower serving pressure that matches your line length to avoid foaming.',
    faqs: [
      { q: 'What PSI to carbonate beer?', a: 'It depends on temperature and target CO₂. For a typical ale at 2.5 volumes and 38°F (3°C), about 11–12 PSI. Colder beer needs less pressure, warmer needs more — enter your numbers for the exact figure.' },
      { q: 'How do I force-carbonate a keg?', a: 'Chill the beer, set the CO₂ regulator to the pressure this calculator gives for your temperature and target volumes, and leave it connected for about a week. To carbonate faster, rock or shake the cold keg while it\'s under pressure for a few minutes a day.' },
      { q: 'What are CO₂ "volumes"?', a: 'A volume of CO₂ is the amount of gas that, at standard conditions, would fill the same volume as the liquid. Most beers sit around 2.0–2.7 volumes; British ales are lower (1.5–2.0) and wheat/Belgian styles higher (3.0–4.0).' },
      { q: 'Why does temperature affect carbonation pressure?', a: 'CO₂ is more soluble in cold liquid, so colder beer holds more gas at a given pressure. To reach the same carbonation, warm beer needs a higher regulator pressure than cold beer — which is why the temperature input matters.' },
      { q: 'What is the difference between carbonation and serving pressure?', a: 'Carbonation pressure sets the CO₂ level; serving pressure pushes beer through the lines to the tap. They\'re often different — you carbonate at the calculated pressure, then serve at a pressure balanced to your line length and height so the pour isn\'t all foam.' },
    ],
    keywords: ['keg carbonation calculator', 'force carbonation calculator', 'co2 pressure calculator beer', 'carbonation pressure chart', 'beer carbonation psi', 'kegging pressure calculator', 'co2 volumes calculator'],
  },
  {
    slug: 'beer-color-srm-ebc-calculator',
    name: 'Beer Color Calculator (SRM & EBC)',
    icon: '🎨',
    widget: 'color',
    description: 'Estimate your beer\'s colour in SRM and EBC from the grain bill and batch volume, using the Morey equation — with a colour swatch. In your browser.',
    lead: 'Add your malts and batch volume to estimate the beer\'s colour in SRM and EBC, with a visual swatch.',
    how: 'Beer colour is estimated from the malts and how concentrated they are in the batch. For each grain you find its malt colour units — MCU = malt colour in °Lovibond × weight in pounds ÷ volume in gallons — and add them up. The total goes through the Morey equation, SRM = 1.4922 × MCU^0.6859, which flattens out at dark colours the way real beer does. EBC, the European scale, is simply SRM × 1.97. Add a row for each malt in your recipe.',
    note: 'This is an estimate: actual colour also shifts with boil length and intensity (Maillard browning), mash pH, water chemistry and oxidation, so the finished beer can differ from the number. The swatch is a visual approximation of the SRM value, not a precise colour match. Use °Lovibond (°L) for malt colour — it\'s close to SRM for the malts themselves.',
    faqs: [
      { q: 'How do I calculate beer colour (SRM)?', a: 'Add each malt\'s colour units — MCU = °Lovibond × pounds ÷ gallons — then apply the Morey equation: SRM = 1.4922 × MCU^0.6859. For a 5-gallon batch with 9 lb of 10°L malt (MCU 18), that\'s about 10.6 SRM, a gold colour.' },
      { q: 'What is the difference between SRM and EBC?', a: 'They\'re two scales for the same thing — beer colour. SRM is used in the US, EBC in Europe, and they convert with EBC = SRM × 1.97. A pale lager is around 3–4 SRM; a stout is 40+.' },
      { q: 'What is the Morey equation?', a: 'A widely-used formula relating malt colour units to perceived beer colour: SRM = 1.4922 × MCU^0.6859. The exponent under 1 reflects that adding dark malt has diminishing returns on colour once beer is already dark — matching how real beer looks.' },
      { q: 'Why is my actual beer darker than the estimate?', a: 'Colour also comes from the boil (longer/harder boils darken wort through Maillard reactions), mash pH, water chemistry and oxidation over time. The grain-bill estimate is a good baseline, but expect the finished beer to run a little darker.' },
      { q: 'What is °Lovibond?', a: 'The traditional scale for the colour of a malt (or beer), close to SRM in value for the malts themselves. Malt suppliers list each grain\'s °L; enter those figures here. It\'s effectively interchangeable with SRM for individual malts in this calculation.' },
    ],
    keywords: ['beer color calculator', 'srm calculator', 'ebc calculator', 'beer color srm ebc', 'morey equation calculator', 'malt color units calculator', 'grain bill color calculator', 'beer colour calculator'],
  },
];

export const getBrewingTool = (slug: string) => BREWING_TOOLS.find((t) => t.slug === slug);
