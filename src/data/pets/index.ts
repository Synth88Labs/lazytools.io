/** Pets & Animals calculator registry. One entry drives a /pets/ page. */

export interface PetToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'dogage' | 'catage' | 'dogfood' | 'catfood' | 'gestation' | 'aquarium' | 'water' | 'crate';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const PET_TOOLS: PetToolDef[] = [
  {
    slug: 'dog-age-calculator',
    name: 'Dog Age Calculator (Dog Years to Human Years)',
    icon: '🐕',
    widget: 'dogage',
    description: 'Convert your dog\'s age to human years — using both the 2020 epigenetic (DNA-methylation) formula and the traditional size-based guideline. The "multiply by 7" rule is a myth. In your browser.',
    lead: 'Enter your dog\'s age to see it in human years — with the modern epigenetic-clock estimate and the traditional size-based one side by side.',
    how: 'Dogs don\'t age at a steady 7-to-1 ratio: they mature very quickly in the first two years, then slow down. The tool shows two estimates. The epigenetic formula from a 2020 study — human age = 16 × ln(dog age) + 31 — was derived by comparing DNA methylation ("molecular ageing") in dogs and humans. The traditional estimate counts the first year as about 15 human years, the second as about 9 more (≈ 24), then adds a per-year amount that grows with the dog\'s size, since larger breeds age faster.',
    note: 'Both are population-level estimates, not a clinical measurement of your individual dog. The epigenetic study was based on Labradors; the size-based per-year increments after age two are a common convention rather than an official standard. Bigger dogs generally have shorter lifespans, which is why they "age" faster in the size-based view.',
    faqs: [
      { q: 'How do I calculate my dog\'s age in human years?', a: 'Not by multiplying by 7 — that\'s a myth. A better estimate is the epigenetic formula: human age = 16 × ln(dog age in years) + 31. So a 4-year-old dog is about 16 × ln(4) + 31 ≈ 53 human years. The tool also shows a traditional size-based estimate.' },
      { q: 'Is the "multiply by 7" rule accurate?', a: 'No. Dogs mature much faster than humans early on — a 1-year-old dog is roughly a 15-year-old human, not 7 — then age more slowly. The 7× rule badly misjudges both ends. Use the epigenetic or size-based methods instead.' },
      { q: 'Why do large dogs age faster than small dogs?', a: 'Larger breeds have shorter lifespans and reach "old age" sooner, so each calendar year counts for more human-equivalent years. That\'s why the traditional estimate adds more per year for big and giant breeds than for small ones.' },
      { q: 'What is the epigenetic dog age formula?', a: 'From a 2020 study (Wang et al.), human age = 16 × ln(dog age) + 31, based on how chemical marks (methylation) accumulate on DNA in both species. It captures the fast-then-slow ageing curve better than a fixed ratio.' },
      { q: 'How old is a 10-year-old dog in human years?', a: 'By the epigenetic formula, about 16 × ln(10) + 31 ≈ 68 human years. The size-based estimate varies: a small dog might be ~56 and a giant breed considerably older. Enter your dog\'s size for that view.' },
    ],
    keywords: ['dog age calculator', 'dog years to human years', 'dog age in human years', 'how old is my dog', 'dog years calculator', 'dog to human age', 'dog age chart'],
  },
  {
    slug: 'cat-age-calculator',
    name: 'Cat Age Calculator (Cat Years to Human Years)',
    icon: '🐈',
    widget: 'catage',
    description: 'Convert your cat\'s age to human years using the standard veterinary chart, and see its life stage. First year ≈ 15, second ≈ 24, then +4 per year. In your browser.',
    lead: 'Enter your cat\'s age to see it in human years and its life stage, using the standard veterinary conversion.',
    how: 'Cats age fastest in their first two years. Following the veterinary chart (AAHA/AAFP), the first year is about 15 human years, the second year adds another 9 (≈ 24 in total), and every year after that adds roughly 4 human years. The tool applies this and shows the matching life stage, from kitten to senior.',
    note: 'This is the widely-used veterinary reference chart; individual cats vary with breed, lifestyle and health. Indoor cats commonly reach 15+ years — the equivalent of a human in their mid-seventies or beyond.',
    faqs: [
      { q: 'How old is my cat in human years?', a: 'The first year counts as about 15 human years, the second brings the total to about 24, and each year after adds roughly 4. So a 5-year-old cat is about 24 + 3 × 4 = 36 human years.' },
      { q: 'How do cats age compared to humans?', a: 'Very fast at first — a 1-year-old cat is roughly a 15-year-old human, and a 2-year-old about 24 — then about 4 human years per cat year. This reflects rapid early development followed by steadier ageing.' },
      { q: 'What are the cat life stages?', a: 'Broadly: kitten (under 1), junior/young adult (1–6), mature (7–10), senior (11–14) and geriatric (15+). Knowing the stage helps tailor diet, activity and vet check-ups.' },
      { q: 'How long do cats live?', a: 'Indoor cats often live 13–17 years and many reach the late teens or older; outdoor cats typically less. That\'s equivalent to a human living well into their seventies or eighties.' },
      { q: 'Is a cat year the same as a dog year?', a: 'No — the curves differ. Both age fast early, but the per-year human-equivalent after age two is about 4 for cats, while for dogs it depends on size. Use the matching calculator for each.' },
    ],
    keywords: ['cat age calculator', 'cat years to human years', 'cat age in human years', 'how old is my cat', 'cat years calculator', 'cat to human age', 'cat age chart'],
  },
  {
    slug: 'dog-food-calculator',
    name: 'Dog Food Calculator (How Much to Feed)',
    icon: '🦴',
    widget: 'dogfood',
    description: 'Calculate how much to feed your dog — daily calories from its weight and life stage (RER/MER veterinary formula), converted to cups using your food\'s label. In your browser.',
    lead: 'Enter your dog\'s weight and life stage to get its daily calorie needs — and roughly how many cups of your food that is.',
    how: 'Vets estimate energy needs in two steps. The Resting Energy Requirement is RER = 70 × (body-weight-kg)^0.75 — the calories needed at rest. That\'s multiplied by a life-stage factor to get the Maintenance Energy Requirement (daily need): about 1.6 for a neutered adult, 1.8 intact, 2.0+ for working dogs, 3.0 for a young puppy, and 1.0 for weight loss. Dividing by the calories per cup on your food\'s label gives the cups per day.',
    note: 'This is a starting estimate — real needs vary by up to ±50% with metabolism, activity and neuter status. The best guide is your dog\'s body condition: you should be able to feel the ribs easily and see a waist. Always use the kcal/cup from your specific food, and check with your vet.',
    faqs: [
      { q: 'How much should I feed my dog?', a: 'Estimate daily calories: RER = 70 × weight(kg)^0.75, then multiply by a life-stage factor (≈ 1.6 for a neutered adult). Divide by your food\'s calories-per-cup to get cups per day. A 15 kg neutered adult needs roughly 600–650 kcal a day.' },
      { q: 'What is RER and MER for dogs?', a: 'RER (resting energy requirement) is the calories a dog needs at rest: 70 × weight(kg)^0.75. MER (maintenance energy requirement) is RER times a factor for life stage and activity — that\'s the daily amount to feed.' },
      { q: 'How many cups of food does my dog need?', a: 'Divide the daily calories by the kcal-per-cup printed on the bag (it varies widely, often 300–450 kcal/cup). The tool does this once you enter your food\'s figure — never rely on cups alone without the calorie content.' },
      { q: 'Should I feed my puppy more than an adult dog?', a: 'Yes — growing puppies need far more energy per kilo, with a factor around 3.0 (0–4 months) or 2.0 (4 months to adult) versus about 1.6 for a neutered adult. Choose the puppy option for the higher estimate.' },
      { q: 'How do I know if I\'m feeding the right amount?', a: 'Watch body condition, not just the number: you should feel the ribs without pressing hard and see a waist from above. Adjust up or down over weeks and weigh regularly; your vet can score body condition.' },
    ],
    keywords: ['dog food calculator', 'how much to feed my dog', 'dog feeding calculator', 'dog calorie calculator', 'how much food dog', 'dog portion calculator', 'rer mer dog'],
  },
  {
    slug: 'cat-food-calculator',
    name: 'Cat Food Calculator (How Much to Feed)',
    icon: '🐟',
    widget: 'catfood',
    description: 'Calculate how much to feed your cat — daily calories from weight and life stage (RER/MER veterinary formula), converted to cups using your food\'s label. In your browser.',
    lead: 'Enter your cat\'s weight and life stage to get its daily calorie needs — and roughly how much of your food that is.',
    how: 'The Resting Energy Requirement is RER = 70 × (body-weight-kg)^0.75. Multiplying by a factor for the cat\'s status gives the daily need: about 1.2 for a neutered adult, 1.4 intact, 2.5 for a growing kitten, and 1.0 for weight management. Dividing by the calories per cup (or per can) on your food\'s label gives the amount to feed.',
    note: 'Cats are small, so portions are modest and precision matters — a 4–5 kg neutered cat needs only around 200–250 kcal a day. Obesity is common; measure meals rather than free-feeding, use the label\'s calorie content, and let your vet\'s body-condition assessment be the final word.',
    faqs: [
      { q: 'How much should I feed my cat?', a: 'Estimate daily calories: RER = 70 × weight(kg)^0.75, then multiply by a factor (≈ 1.2 for a neutered adult). A typical 4.5 kg neutered cat needs roughly 210 kcal a day. Divide by your food\'s kcal-per-cup or per-can for the portion.' },
      { q: 'How many calories does a cat need per day?', a: 'It depends on weight and status. Many neutered indoor adult cats need about 180–250 kcal a day. The tool calculates it from RER × a life-stage factor for your cat\'s weight.' },
      { q: 'Why is my cat gaining weight?', a: 'Usually free-feeding or portions above needs, often with low activity. Neutered indoor cats have modest calorie needs (factor ≈ 1.2). Measure meals to a calorie target and check body condition with your vet.' },
      { q: 'How much should I feed a kitten?', a: 'Kittens need far more energy per kilo for growth — a factor around 2.5 versus 1.2 for a neutered adult. Choose the kitten option and feed to that higher estimate, split across several small meals.' },
      { q: 'Wet food or dry — does the amount change?', a: 'The calorie target is the same, but wet food has fewer calories per gram, so the volume is larger. Always convert using the kcal-per-can or kcal-per-cup on your specific food\'s label.' },
    ],
    keywords: ['cat food calculator', 'how much to feed my cat', 'cat feeding calculator', 'cat calorie calculator', 'how many calories cat', 'cat portion calculator', 'kitten feeding calculator'],
  },
  {
    slug: 'pet-gestation-calculator',
    name: 'Pet Gestation Calculator (Due Date)',
    icon: '🐾',
    widget: 'gestation',
    description: 'Calculate the due date for a pregnant dog, cat, rabbit, horse and more from the breeding date, using average gestation periods. In your browser.',
    lead: 'Choose the animal and enter the breeding date to estimate the due (whelping / kindling / foaling) date, with the normal delivery window.',
    how: 'Each species has a typical gestation length — about 63 days for a dog, 65 for a cat, 31 for a rabbit, 340 for a horse. The tool adds that to your breeding date to give the estimated due date, and adds the low and high end of the normal range to show the likely window.',
    note: 'Gestation varies within a normal range, and the breeding date isn\'t always the conception date. For dogs, dating from ovulation (via progesterone testing) is far more precise than from mating. This is a planning estimate, not veterinary advice — work with your vet for a pregnancy and whelping plan.',
    faqs: [
      { q: 'How long is a dog pregnant?', a: 'About 63 days on average (roughly 58–68 days). Counting from the mating date is approximate because sperm can survive several days; dating from ovulation with progesterone testing is more accurate.' },
      { q: 'How long is a cat pregnant?', a: 'Around 63–65 days (about nine weeks). Enter the breeding date and the tool estimates the due date and the normal window.' },
      { q: 'What is the gestation period of a rabbit?', a: 'About 31 days (roughly 28–33). Rabbits can conceive again very soon after kindling, so keeping does and bucks separated matters if you\'re not planning another litter.' },
      { q: 'How accurate is a gestation due date?', a: 'It\'s an estimate based on average gestation from the breeding date, so the actual delivery can fall anywhere in the normal range shown. Species with longer gestation (like horses) have wider windows.' },
      { q: 'Which animals does this cover?', a: 'Dog, cat, rabbit, guinea pig, hamster, rat, mouse, ferret, horse, cow, pig, sheep and goat — each with its typical gestation length and normal range.' },
    ],
    keywords: ['pet gestation calculator', 'dog pregnancy calculator', 'dog due date calculator', 'cat gestation calculator', 'rabbit gestation', 'whelping date calculator', 'animal gestation period'],
  },
  {
    slug: 'aquarium-volume-calculator',
    name: 'Aquarium Volume Calculator',
    icon: '🐠',
    widget: 'aquarium',
    description: 'Calculate your fish tank\'s volume in litres and US/UK gallons from its dimensions — with an allowance for substrate and the water line. In your browser.',
    lead: 'Enter your tank\'s length, width and height to get its volume in litres and gallons, plus the real water volume after substrate and the rim.',
    how: 'A rectangular tank\'s volume is length × width × height. The tool computes it from centimetres or inches, converts to litres and both US and UK gallons, and also shows an approximate real water volume — about 10% less — because substrate, rocks, decorations and the gap below the rim all displace water.',
    note: 'Knowing the true volume matters for dosing medications and water treatments, calculating filter turnover, and stocking. Use the inside dimensions, and remember that a "20-gallon" marketed tank rarely holds exactly 20 gallons of water once it\'s set up.',
    faqs: [
      { q: 'How do I calculate aquarium volume?', a: 'Multiply length × width × height (inside dimensions). In centimetres, divide by 1,000 for litres: a 100 × 40 × 50 cm tank is 200,000 cm³ = 200 litres (about 53 US gallons).' },
      { q: 'How many gallons is my fish tank?', a: 'Work out the volume in litres, then divide by 3.785 for US gallons or 4.546 for UK gallons. The tool shows both. A 200-litre tank is about 53 US or 44 UK gallons.' },
      { q: 'Why is the actual water volume less than the tank size?', a: 'Substrate, rocks, décor and the few centimetres of air below the rim all take up space, so the real water volume is typically around 10% less than the raw dimensions suggest. The tool shows this adjusted figure.' },
      { q: 'Why does tank volume matter for dosing?', a: 'Medications, dechlorinator and fertilisers are dosed per unit of water. Using the true water volume (not the marketed tank size) avoids under- or over-dosing, which can harm fish or fail to treat them.' },
      { q: 'Does the calculator work for US and UK gallons?', a: 'Yes — it shows both, because a US gallon (3.785 L) and a UK gallon (4.546 L) differ by about 20%. Make sure you know which your equipment or medication assumes.' },
    ],
    keywords: ['aquarium volume calculator', 'fish tank volume calculator', 'aquarium gallons calculator', 'tank litres calculator', 'how many gallons fish tank', 'aquarium size calculator', 'fish tank capacity'],
  },
  {
    slug: 'pet-water-intake-calculator',
    name: 'Pet Water Intake Calculator',
    icon: '💧',
    widget: 'water',
    description: 'Estimate how much water your dog or cat should drink per day from its weight, using the standard veterinary guideline (about 50–60 ml per kg). In your browser.',
    lead: 'Enter your dog or cat\'s weight to estimate its healthy daily water intake — so you know what\'s normal and can spot changes.',
    how: 'A common veterinary guideline is roughly 50–60 ml of water per kilogram of body weight per day for dogs (cats sit around 50 ml/kg). The tool multiplies your pet\'s weight by that range and also shows it in cups, giving a healthy ballpark rather than a strict target.',
    note: 'Actual needs vary with diet (wet food provides a lot of water, so dogs on it drink less), weather, exercise and health. What matters most is a consistent pattern: a sudden, sustained increase or decrease in drinking can signal a problem — such as kidney disease or diabetes — and is worth a vet visit.',
    faqs: [
      { q: 'How much water should my dog drink a day?', a: 'Roughly 50–60 ml per kilogram of body weight — so a 15 kg dog needs about 750–900 ml (about 3–4 cups) a day. Dogs on wet food drink less because the food supplies water.' },
      { q: 'How much water should a cat drink?', a: 'Around 50 ml per kilogram per day, so a 4.5 kg cat needs roughly 225 ml. Cats often get much of this from wet food and naturally drink less than dogs; encourage fresh water and consider a fountain.' },
      { q: 'When should I worry about my pet\'s drinking?', a: 'A sudden, sustained change — drinking a lot more or a lot less than usual — can indicate kidney disease, diabetes or other issues. If it persists for more than a day or two, see your vet.' },
      { q: 'Does food type affect water needs?', a: 'Yes. Wet/canned food is about 70–80% water, so pets eating it drink noticeably less from the bowl. Dry-food diets mean more drinking. Both can be perfectly healthy.' },
      { q: 'How can I get my pet to drink more?', a: 'Offer fresh water in clean bowls in several spots, try a pet water fountain, add water or a little broth to food, and include wet food. Cats especially often prefer moving water.' },
    ],
    keywords: ['pet water intake calculator', 'how much water should my dog drink', 'dog water calculator', 'cat water intake', 'dog daily water', 'pet hydration calculator', 'how much water dog per day'],
  },
  {
    slug: 'dog-crate-size-calculator',
    name: 'Dog Crate Size Calculator',
    icon: '📦',
    widget: 'crate',
    description: 'Find the right dog crate size from your dog\'s measurements, using the AKC guideline of adding 2–4 inches to length and height. In your browser.',
    lead: 'Measure your dog and get the crate length and height to look for — enough room to stand, turn around and lie down.',
    how: 'The AKC guideline is to measure your dog\'s length from the nose to the base of the tail, and its height from the floor to the top of the head (or the ear tip for erect-eared breeds), then add about 2–4 inches (5–10 cm) to each. The tool applies that margin so you get a length and height range to shop for.',
    note: 'A crate should let your dog stand up, turn around and lie down comfortably — but not be so large that it can toilet at one end and rest at the other, which undermines house-training. For a puppy, size the crate for the adult dog and use a divider to expand the space as it grows.',
    faqs: [
      { q: 'What size crate does my dog need?', a: 'Measure nose-to-tail-base for length and floor-to-head for height, then add 2–4 inches (5–10 cm) to each. A dog measuring 24 in long and 18 in tall wants a crate roughly 26–28 in long and 20–22 in tall.' },
      { q: 'How do I measure my dog for a crate?', a: 'Length: from the tip of the nose to the base of the tail (don\'t include the tail). Height: from the floor to the top of the head while sitting or standing — use the ear tips for breeds with erect ears.' },
      { q: 'Should a crate be bigger for a puppy?', a: 'Buy for the adult size but use a divider to keep the usable space small while house-training. Too much room lets a puppy toilet in one corner and sleep in another, which slows toilet training.' },
      { q: 'Can a crate be too big?', a: 'Yes — an over-large crate can hinder house-training and feel less den-like and secure. The goal is enough room to stand, turn and lie down, plus a couple of inches, not a lot of extra space.' },
      { q: 'What if my dog is between crate sizes?', a: 'Size up to the larger crate so your dog can stand and turn comfortably, and add a divider if you need to reduce the interior for training. Comfort and the ability to stand fully are the priorities.' },
    ],
    keywords: ['dog crate size calculator', 'what size crate for my dog', 'dog crate size chart', 'crate size by weight', 'how to measure dog for crate', 'dog kennel size', 'crate dimensions dog'],
  },
];

export const getPetTool = (slug: string) => PET_TOOLS.find((t) => t.slug === slug);
