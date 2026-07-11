/** Chemistry & Lab tools registry. One entry drives a /chemistry/ page. */

export interface ChemToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'molarmass' | 'balancer' | 'molarity' | 'idealgas' | 'specheat' | 'ph';
  /** molar-mass satellites: default view */
  view?: 'mass' | 'percent';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const CHEM_TOOLS: ChemToolDef[] = [
  {
    slug: 'molar-mass-calculator',
    name: 'Molar Mass Calculator',
    icon: '⚖️',
    widget: 'molarmass',
    description: 'Calculate the molar mass (molecular weight) of any chemical formula, with a per-element mass and percent-composition breakdown. Handles hydrates and nested groups. Free, in-browser.',
    lead: 'Enter a chemical formula — even hydrates like CuSO₄·5H₂O or nested groups like Fe₂(SO₄)₃ — and get its exact molar mass with a per-element breakdown.',
    how: 'The formula is parsed with a recursive-descent parser that handles nested parentheses and brackets, hydrate dots (CuSO₄·5H₂O), and greedy two-letter element symbols (so “Co” is cobalt, not carbon + oxygen). Each element’s count is multiplied by its standard atomic weight and summed to give the molar mass in g/mol; the per-element mass ÷ total gives percent composition.',
    note: 'Atomic weights are the IUPAC/CIAAW standard values. The parser is what a chatbot gets wrong — it fumbles hydrates and the Co-vs-C+o ambiguity — so this gives the exact mass with the working shown, every time.',
    faqs: [
      { q: 'How do I calculate molar mass?', a: 'Add up the atomic weight of every atom in the formula. For H₂O: 2 × 1.008 (H) + 1 × 15.999 (O) = 18.015 g/mol. This tool parses the formula and does the summation exactly, showing each element’s contribution.' },
      { q: 'Does it handle hydrates like CuSO₄·5H₂O?', a: 'Yes. Write the dot as ·, . or *; the five waters are added to the formula, giving 249.68 g/mol for copper(II) sulfate pentahydrate. Many calculators and chatbots get hydrates wrong.' },
      { q: 'What about nested groups like Fe₂(SO₄)₃?', a: 'The parser expands nested parentheses and brackets correctly — Fe₂(SO₄)₃ is 2 Fe, 3 S, 12 O = 399.88 g/mol, and K₄[Fe(CN)₆] is handled too.' },
      { q: 'What is the difference between molar mass and molecular weight?', a: 'Numerically they are the same value; molar mass carries units of g/mol (mass of one mole) while molecular weight is the dimensionless relative mass. This tool reports g/mol.' },
      { q: 'Which atomic weights are used?', a: 'The IUPAC/CIAAW standard atomic weights (conventional abridged values). These change only rarely — on the order of once every two decades per element — so results are stable.' },
      { q: 'Is my input uploaded?', a: 'No — parsing and the calculation run entirely in your browser.' },
    ],
    keywords: ['molar mass calculator', 'molecular weight calculator', 'molar mass of', 'formula weight', 'grams per mole', 'molar mass h2so4'],
  },
  {
    slug: 'molecular-weight-calculator',
    name: 'Molecular Weight Calculator',
    icon: '🧪',
    widget: 'molarmass',
    description: 'Find the molecular weight of any compound from its chemical formula, with a per-element breakdown. Handles hydrates and nested groups. Free, in-browser.',
    lead: 'Enter a chemical formula to get its molecular weight (g/mol) with each element’s contribution — hydrates and nested groups supported.',
    how: 'The formula is parsed (nested groups, hydrate dots, two-letter symbols) and each element’s count is multiplied by its IUPAC standard atomic weight and summed. The result is the molecular weight in g/mol, with a per-element mass and percent breakdown.',
    note: 'Molecular weight and molar mass are the same number; this page reports it in g/mol from exact atomic-weight constants — no rounding drift.',
    faqs: [
      { q: 'How do I find molecular weight from a formula?', a: 'Sum the atomic weights of all atoms. Glucose C₆H₁₂O₆ = 6×12.011 + 12×1.008 + 6×15.999 = 180.16 g/mol. The tool parses the formula and computes it exactly.' },
      { q: 'Is molecular weight the same as molar mass?', a: 'Numerically yes. Molecular weight is the relative (dimensionless) mass of a molecule; molar mass is that value in g/mol. This tool shows g/mol.' },
      { q: 'Can it handle complex formulas?', a: 'Yes — nested parentheses/brackets like Ca(NO₃)₂ and K₄[Fe(CN)₆], and hydrates like CuSO₄·5H₂O, are all parsed correctly.' },
      { q: 'What units are used?', a: 'Grams per mole (g/mol), the standard for molar mass / molecular weight.' },
      { q: 'Is the calculation private?', a: 'Yes — everything runs in your browser.' },
    ],
    keywords: ['molecular weight calculator', 'molecular weight of', 'formula mass', 'compound molecular weight', 'gram molecular mass'],
  },
  {
    slug: 'percent-composition-calculator',
    name: 'Percent Composition Calculator',
    icon: '📊',
    widget: 'molarmass',
    view: 'percent',
    description: 'Calculate the mass percent composition of each element in a compound from its chemical formula. Exact, with the working shown. Free, in-browser.',
    lead: 'Enter a chemical formula to get the mass percent of each element — each element’s mass ÷ the molar mass, shown as a clear breakdown.',
    how: 'The molar mass is computed by parsing the formula and summing atomic weights; each element’s total mass (atomic weight × count) is then divided by the molar mass and expressed as a percentage. The percentages sum to 100%.',
    note: 'Percent composition is just a view of the molar-mass calculation — the same exact parse, presented as the mass fraction each element contributes.',
    faqs: [
      { q: 'How do I calculate percent composition?', a: 'For each element: (mass of that element in the formula ÷ molar mass) × 100. In water, H is (2×1.008 ÷ 18.015) × 100 = 11.19% and O is 88.81%.' },
      { q: 'Do the percentages add to 100?', a: 'Yes — every atom’s mass contribution is counted, so the element percentages sum to 100% (aside from tiny rounding in the display).' },
      { q: 'What is percent composition used for?', a: 'To find how much of an element a compound contains by mass — useful for empirical formula work, purity checks, and comparing fertilisers or minerals by nutrient content.' },
      { q: 'Does it handle hydrates?', a: 'Yes — the water of hydration is included, so the percentages reflect the full hydrated formula.' },
      { q: 'Is my data uploaded?', a: 'No — the calculation is entirely in-browser.' },
    ],
    keywords: ['percent composition calculator', 'mass percent calculator', 'percent composition by mass', 'element percentage in compound', 'percentage composition'],
  },
  {
    slug: 'chemical-equation-balancer',
    name: 'Chemical Equation Balancer',
    icon: '⚗️',
    widget: 'balancer',
    description: 'Balance any chemical equation exactly — integer coefficients from the linear-algebra nullspace, with the working shown. Handles redox and complex reactions. Free, in-browser.',
    lead: 'Enter an unbalanced equation and get exact, smallest-integer coefficients — computed from the reaction’s linear system, not guessed.',
    how: 'Each species is parsed into an element-count vector; these form a stoichiometric matrix (products negated). The tool solves the homogeneous system A·x = 0 by exact rational Gaussian elimination (BigInt fractions — no floating point) for the null-space vector, then scales it to the smallest positive integers via the LCM of denominators divided by the GCD. It detects reactions that cannot balance or are under-determined.',
    note: 'This is the flagship exact tool: balancing is an integer linear-algebra problem with one right answer, and it is precisely what chatbots get wrong — mis-applying coefficients on redox reactions like KMnO₄ + HCl. Here the coefficients are byte-exact.',
    faqs: [
      { q: 'How do I balance a chemical equation?', a: 'Write it as reactants → products (e.g. “H2 + O2 -> H2O”). The tool converts each species to an element-count vector, solves the resulting linear system exactly, and returns the smallest whole-number coefficients — here 2 H₂ + O₂ → 2 H₂O.' },
      { q: 'Can it balance redox equations?', a: 'Yes. Complex reactions like KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂ balance to 2, 16, 2, 2, 8, 5 — the exact null-space solution, which chatbots frequently get wrong.' },
      { q: 'How do I type an equation?', a: 'Use element symbols and subscripts as numbers (H2O, Fe2O3), separate species with +, and use -> or = between the two sides. Parentheses and hydrates are supported.' },
      { q: 'What if the equation can’t be balanced?', a: 'The tool tells you: either no solution exists (the elements don’t reconcile) or the system is under-determined (more than one independent balance), which usually means a species is missing or mistyped.' },
      { q: 'Why is this more reliable than a chatbot?', a: 'Balancing is exact integer linear algebra with a unique smallest-integer answer. This computes the null-space over exact fractions and scales to integers; a language model pattern-matches and regularly produces coefficients that don’t actually balance.' },
      { q: 'Are the coefficients always the smallest whole numbers?', a: 'Yes — the solution is divided by the greatest common divisor, so you get the simplest integer ratio.' },
    ],
    keywords: ['chemical equation balancer', 'balance chemical equation', 'equation balancer', 'balancing equations calculator', 'redox balancer', 'stoichiometry coefficients'],
  },
  {
    slug: 'balancing-equations-calculator',
    name: 'Balancing Equations Calculator',
    icon: '🧮',
    widget: 'balancer',
    description: 'Balance chemical equations and get the smallest whole-number coefficients, computed exactly from the reaction’s linear system. Free, in-browser.',
    lead: 'Paste an unbalanced chemical equation and get the balanced form with exact, smallest-integer coefficients.',
    how: 'Each species becomes an element-count vector; the tool solves the homogeneous stoichiometric system with exact rational arithmetic (BigInt) and scales the null-space solution to the smallest positive integers. It flags impossible or under-determined equations.',
    note: 'Same exact engine as the equation balancer — integer coefficients from the linear-algebra null-space, with no floating-point error and the working available.',
    faqs: [
      { q: 'How does balancing equations work?', a: 'Every element must have the same number of atoms on both sides. That is a system of linear equations; solving it for the smallest whole-number coefficients balances the equation. This tool does it exactly.' },
      { q: 'What format should I use?', a: 'Reactants and products separated by -> or =, species separated by +, e.g. “C2H6 + O2 -> CO2 + H2O” (balances to 2, 7, 4, 6).' },
      { q: 'Can it do combustion reactions?', a: 'Yes — hydrocarbon combustion (CH₄ + O₂ → CO₂ + H₂O = 1, 2, 1, 2) and larger ones balance exactly.' },
      { q: 'Why not just balance by inspection?', a: 'Inspection works for simple equations but fails on redox and multi-product reactions; the linear-algebra method always finds the exact smallest-integer answer.' },
      { q: 'Is it free and private?', a: 'Yes — free, no sign-up, and computed entirely in your browser.' },
    ],
    keywords: ['balancing equations calculator', 'balance equations', 'chemical equation calculator', 'how to balance equations', 'equation balancing tool'],
  },
  {
    slug: 'molarity-calculator',
    name: 'Molarity Calculator',
    icon: '🧉',
    widget: 'molarity',
    description: 'Calculate molarity, mass, molar mass or volume of a solution (M = n/V) — enter a formula to auto-fill the molar mass. Exact, in-browser.',
    lead: 'Solve any part of a solution’s concentration — molarity, mass, molar mass or volume — from M = n/V, with the molar mass auto-filled from a formula.',
    how: 'Molarity is moles of solute per litre of solution: M = n/V, where n = mass ÷ molar mass. Enter any three of {mass, molar mass, volume, molarity} and the tool solves for the fourth. Type a chemical formula and the molar mass is computed automatically from atomic weights.',
    note: 'The everyday bench calculation for making up a solution. Enter the formula (e.g. NaCl) and the tool fills in 58.44 g/mol for you, then solves for the mass you need.',
    faqs: [
      { q: 'How do I calculate molarity?', a: 'Molarity (mol/L) = moles of solute ÷ litres of solution, and moles = mass ÷ molar mass. For 5.85 g NaCl (58.44 g/mol) in 1 L: 0.1 mol ÷ 1 L = 0.1 M.' },
      { q: 'How much solute do I need for a target molarity?', a: 'mass = molarity × volume (L) × molar mass. For 0.5 M NaCl in 250 mL: 0.5 × 0.25 × 58.44 = 7.31 g. Enter the target and the tool computes the mass.' },
      { q: 'Can it find the molar mass for me?', a: 'Yes — type the chemical formula and the molar mass is calculated from atomic weights and filled in automatically.' },
      { q: 'What units does it use?', a: 'Molarity in mol/L (M), mass in grams, molar mass in g/mol, and volume in litres (enter mL as 0.25 L, or use the mL field).' },
      { q: 'What is the difference between molarity and molality?', a: 'Molarity is moles per litre of solution; molality is moles per kilogram of solvent. This tool computes molarity (M).' },
    ],
    keywords: ['molarity calculator', 'molar concentration', 'moles per liter', 'solution concentration calculator', 'how to calculate molarity', 'M = n/V'],
  },
  {
    slug: 'ideal-gas-law-calculator',
    name: 'Ideal Gas Law Calculator (PV = nRT)',
    icon: '🎈',
    widget: 'idealgas',
    description: 'Solve the ideal gas law PV = nRT for pressure, volume, moles or temperature. Exact, with unit help, in your browser.',
    lead: 'Enter any three of pressure, volume, moles and temperature, and the ideal gas law PV = nRT gives the fourth.',
    how: 'The ideal gas law relates pressure (P), volume (V), amount (n) and temperature (T): PV = nRT, with R = 0.082057 L·atm·K⁻¹·mol⁻¹. Enter any three quantities in the matching units (atm, L, mol, K) and the tool rearranges the equation to solve for the fourth.',
    note: 'Use absolute temperature in kelvin (°C + 273.15) and consistent units. With R in L·atm/(mol·K), pressure is in atm and volume in litres.',
    faqs: [
      { q: 'What is the ideal gas law?', a: 'PV = nRT, relating a gas’s pressure (P), volume (V), number of moles (n) and absolute temperature (T), where R is the gas constant. It describes an ideal gas well at ordinary temperatures and low-to-moderate pressures.' },
      { q: 'What value of R should I use?', a: 'It depends on units. This tool uses R = 0.082057 L·atm·K⁻¹·mol⁻¹, so pressure is in atmospheres, volume in litres, amount in moles and temperature in kelvin.' },
      { q: 'How do I solve for each variable?', a: 'Rearrange PV = nRT: P = nRT/V, V = nRT/P, n = PV/RT, T = PV/nR. Enter the three you know and the tool computes the fourth.' },
      { q: 'Why must temperature be in kelvin?', a: 'The gas law requires absolute temperature; 0 K is absolute zero. Convert Celsius with K = °C + 273.15 before entering it.' },
      { q: 'When does the ideal gas law break down?', a: 'At high pressure or low temperature, where real-gas interactions matter; then equations like van der Waals are more accurate. For typical classroom and lab conditions the ideal law is a good approximation.' },
    ],
    keywords: ['ideal gas law calculator', 'pv=nrt calculator', 'gas law calculator', 'solve for moles gas', 'pressure volume temperature', 'ideal gas'],
  },
  {
    slug: 'specific-heat-calculator',
    name: 'Specific Heat Calculator (q = mcΔT)',
    icon: '🔥',
    widget: 'specheat',
    description: 'Solve q = mcΔT for heat energy, mass, specific heat capacity or temperature change. Exact, in your browser.',
    lead: 'Enter any three of heat, mass, specific heat and temperature change, and q = mcΔT gives the fourth.',
    how: 'The heat absorbed or released is q = m·c·ΔT, where m is mass, c is specific heat capacity, and ΔT is the temperature change. Enter any three quantities and the tool solves for the fourth. Water’s specific heat is 4.184 J/(g·°C).',
    note: 'Keep units consistent: with c in J/(g·°C), use grams and °C, and q comes out in joules. A positive q means heat absorbed; negative means released.',
    faqs: [
      { q: 'What is the specific heat formula?', a: 'q = mcΔT: heat (q) equals mass (m) times specific heat capacity (c) times the temperature change (ΔT = T_final − T_initial).' },
      { q: 'What is the specific heat of water?', a: 'About 4.184 J/(g·°C) — the energy to raise 1 gram of water by 1 °C. This tool pre-fills it and lets you change it for other substances.' },
      { q: 'How do I solve for each variable?', a: 'Rearrange q = mcΔT: m = q/(cΔT), c = q/(mΔT), ΔT = q/(mc). Enter the three known values and the tool computes the fourth.' },
      { q: 'What does a negative q mean?', a: 'The substance released heat (cooled down): if ΔT is negative, q is negative. A positive q means it absorbed heat and warmed up.' },
      { q: 'What units should I use?', a: 'With c in J/(g·°C), use mass in grams and ΔT in °C, giving q in joules. Keep the units consistent throughout.' },
    ],
    keywords: ['specific heat calculator', 'q=mcΔT calculator', 'heat energy calculator', 'specific heat capacity', 'calorimetry calculator', 'heat formula'],
  },
  {
    slug: 'ph-calculator',
    name: 'pH Calculator',
    icon: '🧫',
    widget: 'ph',
    description: 'Calculate pH, pOH, [H⁺] and [OH⁻] from any one value — with the acid/base verdict. Exact, in your browser.',
    lead: 'Enter a pH, pOH, hydrogen-ion or hydroxide-ion concentration, and get all four values plus whether the solution is acidic, neutral or basic.',
    how: 'The relationships are pH = −log₁₀[H⁺], pOH = −log₁₀[OH⁻], pH + pOH = 14 (at 25 °C), and [H⁺][OH⁻] = 1×10⁻¹⁴. From any one input the tool derives the other three and classifies the solution: pH < 7 acidic, = 7 neutral, > 7 basic.',
    note: 'The 14 and 1×10⁻¹⁴ relationships hold at 25 °C (where the water ionisation constant Kw = 1×10⁻¹⁴). At other temperatures Kw shifts slightly.',
    faqs: [
      { q: 'How do I calculate pH?', a: 'pH = −log₁₀[H⁺], where [H⁺] is the hydrogen-ion concentration in mol/L. For [H⁺] = 1×10⁻³ M, pH = 3. Enter any one of pH, pOH, [H⁺] or [OH⁻] and the tool finds the rest.' },
      { q: 'What is the relationship between pH and pOH?', a: 'At 25 °C, pH + pOH = 14. So pOH = 14 − pH, and you can get one from the other.' },
      { q: 'How are [H⁺] and [OH⁻] related?', a: 'Their product is the water ionisation constant: [H⁺][OH⁻] = 1×10⁻¹⁴ at 25 °C. So [OH⁻] = 1×10⁻¹⁴ ÷ [H⁺].' },
      { q: 'What pH is acidic, neutral or basic?', a: 'At 25 °C: pH below 7 is acidic, exactly 7 is neutral, and above 7 is basic (alkaline). The tool shows the verdict.' },
      { q: 'Does temperature affect pH?', a: 'Yes — the “14” and 1×10⁻¹⁴ values are for 25 °C. At higher temperatures water’s Kw increases, so neutral pH is slightly below 7. This tool uses the standard 25 °C values.' },
    ],
    keywords: ['ph calculator', 'poh calculator', 'ph to h+ concentration', 'hydrogen ion concentration', 'ph from concentration', 'acid base calculator'],
  },
];

export const getChemTool = (slug: string) => CHEM_TOOLS.find((t) => t.slug === slug);
