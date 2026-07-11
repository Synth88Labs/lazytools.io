/** Cooking & Kitchen converter registry. One entry drives a /cooking/ page. */

export interface CookingToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'grams' | 'measure' | 'butter' | 'oven' | 'scaler' | 'pan' | 'bakers' | 'yeast' | 'coffee' | 'meat';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const COOKING_TOOLS: CookingToolDef[] = [
  {
    slug: 'grams-to-cups-converter',
    name: 'Grams to Cups Converter',
    icon: '⚖️',
    widget: 'grams',
    description: 'Convert grams to cups (and back) for flour, sugar, butter, honey and more — ingredient-aware, because a cup of flour and a cup of sugar weigh very different amounts. Weights from King Arthur Baking. In your browser.',
    lead: 'Pick an ingredient and convert between cups, tablespoons, grams and ounces — using the correct weight for that ingredient, not a one-size-fits-all number.',
    how: 'A cup is a measure of volume, but grams measure weight, so the conversion depends entirely on the ingredient: a US cup of all-purpose flour is about 120 g, but a cup of granulated sugar is 198 g and a cup of honey is 336 g. The tool multiplies your amount by the ingredient’s weight per cup (from King Arthur Baking’s Ingredient Weight Chart, the US baking standard) to convert volume to weight, or divides to go the other way.',
    note: 'For accuracy, baking is best done by weight — a kitchen scale removes the guesswork of how tightly flour is packed. Weights here are per US customary cup (236.6 mL); a metric or Australian cup (250 mL) holds about 6% more.',
    faqs: [
      { q: 'How many grams is one cup?', a: 'It depends on the ingredient. One US cup is about 120 g of all-purpose flour, 198 g of granulated sugar, 226 g of butter, 227 g of water or milk, and 336 g of honey. There is no single grams-per-cup number — that’s why this converter asks which ingredient you mean.' },
      { q: 'How many grams of flour in a cup?', a: 'About 120 g of all-purpose, bread or cake flour per US cup (whole wheat is ~113 g), using King Arthur Baking’s standard. Flour is easily compressed, so scooping straight from the bag can add 20% or more — weighing is far more reliable.' },
      { q: 'Why do a cup of flour and a cup of sugar weigh different amounts?', a: 'Because they have different densities. Sugar granules pack more tightly and are heavier than the fluffy, air-filled particles of flour, so the same volume (one cup) weighs more for sugar (198 g) than flour (120 g).' },
      { q: 'Is a cup 236 ml or 250 ml?', a: 'A US customary cup is 236.6 mL; the metric cup used in Australia, New Zealand and much of Europe is 250 mL — about 6% larger. This tool’s weights are based on the US cup. In baking, that 6% difference can matter.' },
      { q: 'Should I measure by weight or volume?', a: 'Weight (grams) is more accurate and consistent, especially for flour and other easily-packed ingredients. Professional and serious home bakers weigh their ingredients; a cheap digital scale pays for itself in reliable results.' },
    ],
    keywords: ['grams to cups', 'cups to grams', 'grams to cups converter', 'how many grams in a cup', 'flour cups to grams', 'sugar grams to cups', 'baking weight converter'],
  },
  {
    slug: 'cooking-measurement-converter',
    name: 'Cooking Measurement Converter',
    icon: '🥄',
    widget: 'measure',
    description: 'Convert cooking measurements — teaspoons, tablespoons, cups, fluid ounces, millilitres, pints, quarts and gallons — across US, metric and imperial systems, with the pitfalls flagged. In your browser.',
    lead: 'Convert any cooking volume between US, metric and imperial units — and see all the equivalents at once, so a recipe from anywhere is easy to follow.',
    how: 'Every volume is converted through millilitres using exact NIST/BIPM factors: a US cup is 236.6 mL, a US tablespoon 14.79 mL, a US teaspoon 4.93 mL. The tool shows your amount in every other unit at once. It keeps US, imperial (UK) and metric units separate because they differ — an important safeguard against recipe errors.',
    note: 'The classic traps: the US gallon (3.79 L) is about 20% smaller than the imperial gallon (4.55 L); the metric cup is 250 mL vs the US cup’s 236.6 mL; and the Australian tablespoon is 20 mL, not the 15 mL used almost everywhere else.',
    faqs: [
      { q: 'How many tablespoons are in a cup?', a: 'Exactly 16 US tablespoons make one US cup (a tablespoon is 1/16 of a cup). So half a cup is 8 tbsp and a quarter cup is 4 tbsp. This relationship is definitional, with no rounding.' },
      { q: 'How many teaspoons in a tablespoon?', a: 'Exactly 3 teaspoons in one tablespoon, in both the US and modern metric systems. So 1 tbsp = 3 tsp and ½ tbsp = 1½ tsp.' },
      { q: 'Is a US gallon the same as a UK gallon?', a: 'No — and this trips people up. A US gallon is 3.785 L; an imperial (UK) gallon is 4.546 L, about 20% larger. US and imperial pints and quarts differ by the same ratio, so always check which system a recipe uses.' },
      { q: 'Is an Australian tablespoon different?', a: 'Yes. The Australian tablespoon is 20 mL, while the US, UK and most metric tablespoons are 15 mL. An Australian recipe’s “3 tablespoons” is 60 mL — a third more than elsewhere.' },
      { q: 'Is a metric cup the same as a US cup?', a: 'No. The metric cup (Australia, NZ, much of Europe) is exactly 250 mL; the US customary cup is 236.6 mL. Treating them as equal overshoots by about 6%, enough to affect baking.' },
    ],
    keywords: ['cooking measurement converter', 'tablespoons to cups', 'teaspoons to tablespoons', 'ml to cups', 'cups to ml', 'cooking conversion chart', 'us to metric cooking'],
  },
  {
    slug: 'butter-converter',
    name: 'Butter Converter (Sticks, Cups, Grams)',
    icon: '🧈',
    widget: 'butter',
    description: 'Convert butter between US sticks, tablespoons, cups, grams and ounces — for following American recipes with a scale, or metric recipes without sticks. In your browser.',
    lead: 'Convert butter between sticks, tablespoons, cups, grams and ounces instantly — perfect for bridging American stick-based recipes and the rest of the world’s grams.',
    how: 'The tool works from the fixed US definition: 1 stick of butter = ½ cup = 8 tablespoons = 4 ounces = 113 grams. It converts your amount to grams and back out to every other unit. Because the ratios are exact, the conversions are precise — no ingredient density needed, since butter is sold to these standard weights.',
    note: 'Outside North America, butter is sold by weight (250 g blocks and similar), not in “sticks” — so metric recipes give grams. The wrapper on a US stick is marked at tablespoon intervals, which is handy for cutting off exactly what you need.',
    faqs: [
      { q: 'How many grams is a stick of butter?', a: 'One US stick of butter is 113 grams (4 ounces). Two sticks make one cup, which is 226 grams.' },
      { q: 'How many tablespoons in a stick of butter?', a: 'Eight tablespoons in one stick. Since a stick is ½ cup and a cup is 16 tablespoons, half of that is 8 tbsp. US stick wrappers are printed with tablespoon marks for easy cutting.' },
      { q: 'How much is 1 cup of butter?', a: 'One cup of butter is 2 sticks = 16 tablespoons = 226 grams = 8 ounces.' },
      { q: 'How do I convert a US recipe’s butter if I don’t have sticks?', a: 'Convert to grams: 1 stick = 113 g, ½ stick = 57 g, 1 tbsp ≈ 14 g. Weigh out the grams and you’ll match the recipe exactly — which is how butter is sold outside the US anyway.' },
      { q: 'Is butter measured by weight or volume?', a: 'Both, depending on where you are. The US uses sticks and cups (volume by convention, but sold to a set weight); most other countries use grams (weight). This tool bridges the two.' },
    ],
    keywords: ['butter converter', 'sticks of butter to grams', 'how many grams in a stick of butter', 'butter cups to grams', 'tablespoons in a stick of butter', 'butter measurement converter'],
  },
  {
    slug: 'oven-temperature-converter',
    name: 'Oven Temperature Converter (°F, °C, Gas Mark)',
    icon: '🌡️',
    widget: 'oven',
    description: 'Convert oven temperatures between Fahrenheit, Celsius and UK gas marks — plus the fan/convection adjustment. Follow any recipe on any oven. In your browser.',
    lead: 'Convert an oven temperature between °Fahrenheit, °Celsius and gas mark, and get the fan-oven setting — so a recipe written for any oven works on yours.',
    how: 'Fahrenheit and Celsius convert exactly with °C = (°F − 32) × 5⁄9. Gas marks map to the conventional cooking equivalents (gas mark 4 = 350 °F = 180 °C), which are rounded to practical oven settings rather than exact maths. For fan (convection) ovens, the tool subtracts about 20 °C, the standard adjustment.',
    note: 'These are the standard UK cooking equivalents, so the Celsius values are rounded to tidy oven settings (gas mark 4 is written as 180 °C, though 350 °F is mathematically 176.7 °C). Fan ovens run hotter for the same dial setting, so reduce the temperature by ~20 °C or shorten the time.',
    faqs: [
      { q: 'What is 350°F in Celsius and gas mark?', a: '350 °F is 180 °C and gas mark 4 — the most common baking temperature, described as a “moderate” oven. For a fan oven, use about 160 °C.' },
      { q: 'What gas mark is 200°C?', a: '200 °C is gas mark 6 (400 °F), a “moderately hot” oven used for roasting and many breads.' },
      { q: 'How do I convert Fahrenheit to Celsius exactly?', a: 'Subtract 32 and multiply by 5/9: °C = (°F − 32) × 5⁄9. So 425 °F = (425 − 32) × 5⁄9 = 218.3 °C, rounded to 220 °C for oven use.' },
      { q: 'How much cooler should a fan oven be?', a: 'About 20 °C lower than a conventional oven for the same result — a fan circulates hot air, so it cooks faster and more evenly. Some recipes suggest reducing time instead of temperature.' },
      { q: 'Why don’t the Celsius and Fahrenheit values match exactly?', a: 'Because oven dials use rounded, practical settings. 350 °F is 176.7 °C mathematically, but ovens and recipes use the tidy 180 °C. The gas mark table follows these conventional cooking equivalents.' },
    ],
    keywords: ['oven temperature converter', 'fahrenheit to celsius oven', 'gas mark to celsius', 'gas mark to fahrenheit', '350 f to celsius', 'fan oven conversion', 'oven temp conversion chart'],
  },
  {
    slug: 'recipe-scaler',
    name: 'Recipe Scaler & Multiplier',
    icon: '🍽️',
    widget: 'scaler',
    description: 'Scale a recipe up or down by servings or by a multiplier — every ingredient adjusted at once. Handles fractions like ½ and 1¾. In your browser.',
    lead: 'Enter your recipe’s ingredients and change the servings (or a multiplier), and every quantity is rescaled at once — halve it, double it or resize to any number of servings.',
    how: 'The tool finds a single scaling factor — the new servings divided by the original (or the multiplier you type) — and multiplies every ingredient quantity by it. Quantities can be decimals or fractions (enter ½ as 1/2 and 1½ as 1 1/2), and the scaled results appear alongside each ingredient.',
    note: 'Ingredients scale linearly, but a few things don’t: cooking and baking times change less than proportionally, pan sizes may need rethinking, and strong seasonings (salt, spices, chilli) and leaveners are worth tasting and adjusting rather than scaling blindly.',
    faqs: [
      { q: 'How do I double a recipe?', a: 'Multiply every ingredient by 2. Enter your ingredients and set the multiplier to 2 (or double the servings) — the tool does them all at once. Remember that cooking time increases only a little, not double.' },
      { q: 'How do I scale a recipe to a different number of servings?', a: 'Divide the new servings by the original to get the factor, then multiply each ingredient by it. For 4 servings scaled to 6, the factor is 1.5 — the tool applies it to every quantity for you.' },
      { q: 'Does everything in a recipe scale the same way?', a: 'Quantities do, but timing and seasoning don’t. Baking and roasting times rise less than proportionally, and salt, spices and raising agents are best adjusted to taste rather than multiplied exactly.' },
      { q: 'Can it handle fractions?', a: 'Yes — enter ½ as 1/2 and 1½ as 1 1/2 (a whole number, a space, then the fraction). The tool parses them and shows the scaled amount as a decimal.' },
      { q: 'Do I need to change the pan size when scaling?', a: 'Often yes. Doubling a cake batter needs a larger pan or a second one to keep the same depth — use a pan-size converter to work out the right dimensions and adjust the bake time accordingly.' },
    ],
    keywords: ['recipe scaler', 'recipe multiplier', 'how to double a recipe', 'scale recipe servings', 'halve a recipe', 'recipe portion calculator', 'adjust recipe servings'],
  },
  {
    slug: 'baking-pan-size-converter',
    name: 'Baking Pan Size Converter',
    icon: '🍰',
    widget: 'pan',
    description: 'Convert between baking pan sizes and shapes — round, square and rectangular — by comparing their area, so you know how to adjust the batter. In your browser.',
    lead: 'Compare the pan your recipe calls for with the pan you have, and get the batter ratio — so you can swap a round tin for a square one, or resize, with confidence.',
    how: 'The key is the pan’s floor area, since that sets how deep a given amount of batter sits. The tool computes each pan’s area (a round pan is π × (diameter/2)²; a square or rectangular pan is length × width) and divides the two to give a ratio — how much to scale the recipe to keep the same batter depth.',
    note: 'Matching area keeps the depth, and roughly the bake time, similar. A much larger or smaller pan will still change how fast the centre cooks, so watch it and test for doneness. As a rule of thumb, an 8-inch square pan holds about the same as a 9-inch round.',
    faqs: [
      { q: 'Can I use a square pan instead of a round one?', a: 'Yes, if the areas are close. An 8-inch (20 cm) square pan has about the same area as a 9-inch (23 cm) round pan, so they’re common substitutes. The tool shows the exact ratio so you can adjust the batter if they differ.' },
      { q: 'How do I convert between pan sizes?', a: 'Compare their floor areas. Divide the area of your pan by the area the recipe calls for — that ratio is how much to scale the recipe to keep the same batter depth. The tool does the area maths for both shapes.' },
      { q: 'What if my pan is bigger than the recipe’s?', a: 'The batter will sit shallower and bake faster, so lower the temperature slightly or check for doneness earlier. Scale the recipe up by the area ratio if you want to keep the original depth.' },
      { q: 'How do I find a round pan’s area?', a: 'Area = π × (diameter ÷ 2)². A 9-inch round pan is π × 4.5² ≈ 63.6 square inches. The tool calculates this automatically when you pick the round shape.' },
      { q: 'Does pan depth matter too?', a: 'Yes — this tool compares floor area (which sets batter depth for a given volume). If your pan is much shallower or deeper than usual, factor that in and adjust the bake time and fill level accordingly.' },
    ],
    keywords: ['baking pan size converter', 'pan size conversion', 'cake pan converter', 'round to square pan', 'baking dish size chart', 'pan area calculator', 'substitute pan size'],
  },
  {
    slug: 'bakers-percentage-calculator',
    name: "Baker's Percentage Calculator",
    icon: '🍞',
    widget: 'bakers',
    description: "Calculate baker's percentages and dough hydration — every ingredient expressed relative to the flour. Essential for bread formulas. In your browser.",
    lead: "Enter your flour and the other ingredients by weight, and get each one as a baker's percentage plus the dough hydration — the language of every serious bread recipe.",
    how: "In baker's percentage, the flour is always 100%, and every other ingredient is expressed as a percentage of the flour weight: an ingredient’s weight ÷ flour weight × 100. Hydration is the total liquid (water, milk) as a percentage of flour. This lets you scale a formula to any batch size and compare recipes on equal terms.",
    note: 'Percentages can total well over 100% — that’s normal, because each is relative to the flour, not to the whole. A lean bread dough runs about 60–65% hydration; rustic, open-crumb loaves like ciabatta and focaccia go to 75% and beyond.',
    faqs: [
      { q: "What is baker's percentage?", a: "A way of writing recipes where the flour is 100% and every other ingredient is a percentage of the flour weight. So 350 g water with 500 g flour is 70% water. It makes scaling and comparing bread formulas easy." },
      { q: 'What is dough hydration?', a: 'The weight of liquid (water, milk) as a percentage of the flour. 500 g flour with 350 g water is 70% hydration. Higher hydration gives a wetter, stickier dough and a more open crumb.' },
      { q: 'Why can the percentages add up to more than 100%?', a: 'Because each is measured against the flour, not the total. Flour is 100% by definition, water might be 70%, salt 2% and so on — they’re independent ratios, so the sum can exceed 100%.' },
      { q: 'What hydration should my bread be?', a: 'Around 60–65% for a standard sandwich loaf, 70% for many artisan breads, and 75–85% for ciabatta, focaccia and high-hydration sourdough. Higher hydration is harder to handle but gives an airier crumb.' },
      { q: "How do I scale a recipe with baker's percentages?", a: 'Choose your total flour weight, then multiply it by each ingredient’s percentage. Want 1 kg of flour at 70% hydration and 2% salt? That’s 700 g water and 20 g salt. The percentages stay fixed at any batch size.' },
    ],
    keywords: ["baker's percentage calculator", 'dough hydration calculator', 'bread formula calculator', 'bakers math', 'hydration percentage bread', 'sourdough hydration calculator'],
  },
  {
    slug: 'yeast-converter',
    name: 'Yeast Converter (Active Dry, Instant, Fresh)',
    icon: '🫧',
    widget: 'yeast',
    description: 'Convert between active dry, instant (rapid-rise) and fresh (cake) yeast by weight — plus packets and teaspoons. Sourced from Red Star and King Arthur. In your browser.',
    lead: 'Convert a yeast quantity between active dry, instant and fresh (cake) yeast — and see it in packets and teaspoons — so you can use whatever type you have.',
    how: 'The tool works by weight. Active dry and instant yeast are interchangeable roughly 1:1 (Red Star’s conversion chart); fresh (cake) yeast is about 2.5 times the dry weight (King Arthur). It also expresses the amount in standard packets and teaspoons, where 1 packet = ¼ oz = 7 g = 2¼ teaspoons.',
    note: 'Active dry and instant can be swapped 1:1, though some bakers use about 25% less instant since it’s slightly more active — treat that as a fine-tuning, not a rule. Instant yeast can be mixed straight into the dry ingredients; older active dry recipes often dissolve it in warm liquid first. Fresh yeast is perishable and now uncommon in home kitchens.',
    faqs: [
      { q: 'How do I convert active dry yeast to instant?', a: 'They’re interchangeable about 1:1 by weight (Red Star). Some bakers use roughly 25% less instant because it’s a little more active, but for most home recipes an equal swap works fine.' },
      { q: 'How much fresh yeast equals dry yeast?', a: 'Fresh (cake) yeast is about 2.5 times the weight of active dry yeast — so 7 g of active dry ≈ 17–18 g of fresh. Fresh yeast is perishable and less common in home baking now.' },
      { q: 'How many grams is a packet of yeast?', a: 'A standard packet of active dry or instant yeast is 7 grams (¼ ounce), which is about 2¼ teaspoons. Most bread recipes call for one packet.' },
      { q: 'Can I substitute instant for active dry directly?', a: 'Yes. Use the same weight, and you can usually add instant straight to the flour rather than proofing it in water first. Rise times can be a little shorter with instant.' },
      { q: 'How many teaspoons is 7 grams of yeast?', a: 'About 2¼ teaspoons — the amount in one standard packet of active dry or instant yeast.' },
    ],
    keywords: ['yeast converter', 'active dry to instant yeast', 'fresh yeast to dry yeast', 'yeast conversion chart', 'grams of yeast in a packet', 'cake yeast conversion', 'instant yeast substitute'],
  },
  {
    slug: 'coffee-to-water-ratio-calculator',
    name: 'Coffee-to-Water Ratio Calculator',
    icon: '☕',
    widget: 'coffee',
    description: 'Calculate how much coffee and water to use for any brew size, using a coffee-to-water ratio — the “golden ratio” for consistent, great coffee. In your browser.',
    lead: 'Set your coffee-to-water ratio and enter either the coffee or the water you have, and get the exact amount of the other — for consistent coffee, cup after cup.',
    how: 'Good coffee is about proportion. The tool uses a ratio of 1 gram of coffee to N grams of water: enter the ratio and one quantity, and it computes the other by multiplying or dividing. Water is measured by weight, which is why it’s given in grams (1 g of water ≈ 1 mL).',
    note: 'The widely-used “golden ratio” is roughly 1:15 to 1:18 by weight — a lower number (more coffee) brews stronger. Weighing your coffee and water, rather than scooping, is the single biggest step to consistent results. Grind size and brew method matter too.',
    faqs: [
      { q: 'What is the golden ratio for coffee?', a: 'About 1 gram of coffee to 15–18 grams of water by weight (often written 1:15 to 1:18). 1:16 is a popular balanced starting point; use more coffee (a lower ratio) for a stronger cup.' },
      { q: 'How much coffee for one cup?', a: 'For a ~250 g (250 mL) cup at a 1:16 ratio, use about 15–16 g of coffee. Adjust the ratio to taste — 1:15 is stronger, 1:17–18 is lighter.' },
      { q: 'How much coffee per litre of water?', a: 'At a 1:16 ratio, one litre (1000 g) of water needs about 62 g of coffee. At 1:15 that’s 67 g, and at 1:18 about 56 g. Enter the water and the tool gives the coffee.' },
      { q: 'Why weigh coffee and water instead of using scoops?', a: 'Scoops vary with grind and bean, so weighing is far more consistent. A cheap kitchen scale lets you hit the same ratio every time, which is the key to repeatable coffee.' },
      { q: 'Does this work for any brew method?', a: 'The ratio is a starting point for pour-over, drip, French press and more. Different methods and grind sizes shift the ideal ratio slightly, so tweak from here to taste.' },
    ],
    keywords: ['coffee to water ratio', 'coffee ratio calculator', 'golden ratio coffee', 'how much coffee per cup', 'coffee water ratio calculator', 'pour over coffee ratio', 'coffee grams per cup'],
  },
  {
    slug: 'meat-cooking-temperature-guide',
    name: 'Meat Cooking Temperature Guide',
    icon: '🍖',
    widget: 'meat',
    description: 'USDA safe minimum internal cooking temperatures for chicken, beef, pork, fish and more — plus a steak doneness reference. Sourced from FoodSafety.gov. In your browser.',
    lead: 'The safe internal temperatures to cook meat, poultry, fish and eggs to — straight from USDA FoodSafety.gov — plus a cook’s doneness guide for steaks.',
    how: 'These are the USDA/FoodSafety.gov safe minimum internal temperatures, measured with a food thermometer in the thickest part of the meat, away from bone. Reaching them ensures harmful bacteria are killed. Poultry needs 165 °F (74 °C), ground meats 160 °F (71 °C), and whole cuts of beef, pork and lamb 145 °F (63 °C) with a 3-minute rest.',
    note: 'Safe minimum temperatures are food-safety floors, not doneness preferences. The steak doneness guide (rare, medium-rare, etc.) shows culinary targets for whole cuts of beef and lamb — some fall below the USDA minimum and are a personal-risk choice. Ground meat, poultry and pork should always reach their safe minimum.',
    faqs: [
      { q: 'What temperature should chicken be cooked to?', a: 'All poultry — whole, parts and ground — is safe at 165 °F (74 °C) internal temperature, measured in the thickest part. There’s no rest-time requirement for poultry.' },
      { q: 'What is the safe internal temperature for beef, pork and lamb?', a: 'For whole steaks, chops and roasts, 145 °F (63 °C) with a 3-minute rest. Ground beef, pork and lamb must reach 160 °F (71 °C). Ground poultry is 165 °F (74 °C).' },
      { q: 'Is medium-rare steak safe?', a: 'Medium-rare (about 135 °F / 57 °C) is below the USDA safe minimum of 145 °F, so it carries some risk — a personal choice for whole cuts of beef or lamb. Ground meat and poultry should always reach their safe minimum, never medium-rare.' },
      { q: 'What temperature should fish be cooked to?', a: 'Fish and shellfish are safe at 145 °F (63 °C), or when the flesh is opaque and separates easily with a fork.' },
      { q: 'Why let meat rest after cooking?', a: 'Resting lets carry-over heat finish the cooking (the temperature keeps rising a few degrees) and lets juices redistribute. USDA requires a 3-minute rest for whole cuts of beef, pork, lamb and veal at 145 °F.' },
    ],
    keywords: ['meat cooking temperature', 'safe internal temperature chart', 'chicken cooking temperature', 'steak doneness temperatures', 'usda safe cooking temperatures', 'meat temperature guide', 'beef internal temp'],
  },
];

export const getCookingTool = (slug: string) => COOKING_TOOLS.find((t) => t.slug === slug);
