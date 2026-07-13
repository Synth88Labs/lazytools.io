/** Fitness & Exercise calculator registry. One entry drives a /fitness/ page. */

export interface FitnessToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'pace' | 'paceconv' | 'onerm' | 'hrzone' | 'racepredict' | 'vo2' | 'calories' | 'steps' | 'bodyfat' | 'tdee';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const FITNESS_TOOLS: FitnessToolDef[] = [
  {
    slug: 'running-pace-calculator',
    name: 'Running Pace Calculator',
    icon: '🏃',
    widget: 'pace',
    description: 'Calculate running pace, time or distance — enter any two and get the third, with pace in min/km and min/mile plus speed. Includes 5K, 10K, half and marathon presets. In your browser.',
    lead: 'Enter any two of pace, time and distance, and get the third — with your pace in both min/km and min/mile, and your speed in km/h and mph.',
    how: 'Pace is simply time divided by distance. Give the tool a distance and a finish time and it returns your pace and speed; give it a distance and a target pace and it projects your finish time; give it a time and a pace and it works out how far you\'d go. Times are entered as mm:ss or h:mm:ss, and the distance presets cover the common race distances.',
    note: 'Use it to find the pace you need to hit a goal time — enter the marathon distance and your target time to see the min/km you must hold. Race pace and training pace differ, so treat a projected time as a best-case even effort.',
    faqs: [
      { q: 'How do I calculate running pace?', a: 'Divide your time by the distance. For 10 km in 50 minutes, pace = 50 ÷ 10 = 5:00 per km (about 8:03 per mile). Enter the distance and time and the tool shows both, plus your speed.' },
      { q: 'What pace do I need for a sub-4-hour marathon?', a: 'A 4-hour marathon is about 5:41 per km (9:09 per mile). Enter the marathon distance (42.195 km) and a 4:00:00 target time and the tool gives the exact pace to hold.' },
      { q: 'How do I convert between min/km and min/mile?', a: 'A mile is 1.609 km, so a per-mile pace is about 1.609 times the per-km pace. This tool shows both at once; there\'s also a dedicated pace converter for speeds.' },
      { q: 'What is a good running pace?', a: 'It\'s very individual. Many recreational runners cover 5K around 6:00–7:00 per km (about 9:40–11:15 per mile); trained runners are faster. Use your own recent times as the baseline and aim to improve gradually.' },
      { q: 'How do I use pace to hit a goal time?', a: 'Enter the race distance and your goal finish time in "find pace" mode — the tool returns the even pace you\'d need to hold the whole way. Then practise running at that pace in training.' },
    ],
    keywords: ['running pace calculator', 'pace calculator', 'marathon pace calculator', 'race pace calculator', 'min per km calculator', 'running time calculator', 'goal pace calculator'],
  },
  {
    slug: 'pace-converter',
    name: 'Pace Converter (min/km, min/mile, mph, km/h)',
    icon: '🔁',
    widget: 'paceconv',
    description: 'Convert running or walking pace between min/km, min/mile, km/h and mph instantly. Enter a pace or a speed and see all four. In your browser.',
    lead: 'Convert a pace or speed between min/km, min/mile, km/h and mph — enter one and see all four at once.',
    how: 'Pace (minutes per distance) and speed (distance per time) are inverses of the same thing. The tool converts your input to a common metres-per-second basis using the exact mile (1.609344 km), then expresses it as pace per km and per mile and as speed in km/h and mph.',
    note: 'Treadmills usually show speed (km/h or mph) while running watches show pace (min/km or min/mile) — this converter bridges the two so you can match a treadmill setting to your target pace.',
    faqs: [
      { q: 'How do I convert min/km to min/mile?', a: 'Multiply the per-km pace by 1.609. A 5:00/km pace is about 8:03/mile. The tool does it precisely and also shows the equivalent speeds.' },
      { q: 'What speed is a 5 min/km pace?', a: '5:00 per km is 12 km/h, which is about 7.46 mph or 8:03 per mile. Enter the pace and the tool shows all the equivalents.' },
      { q: 'How do I convert treadmill speed to pace?', a: 'A treadmill\'s km/h or mph is a speed; divide into distance to get pace. For example 10 km/h is 6:00 per km. Enter the treadmill speed here and read off the pace.' },
      { q: 'Is pace the same as speed?', a: 'They measure the same movement inversely: speed is distance per time (km/h), pace is time per distance (min/km). Higher speed means a lower (faster) pace number.' },
      { q: 'How many min/mile is 10 km/h?', a: '10 km/h is about 9:39 per mile (and 6:00 per km). The converter shows this instantly.' },
    ],
    keywords: ['pace converter', 'min/km to min/mile', 'pace to speed converter', 'kmh to pace', 'mph to min per mile', 'treadmill speed to pace', 'running speed converter'],
  },
  {
    slug: 'one-rep-max-calculator',
    name: 'One-Rep Max (1RM) Calculator',
    icon: '🏋️',
    widget: 'onerm',
    description: 'Estimate your one-rep max from a weight and reps, using the Epley, Brzycki and Lombardi formulas, plus a training-percentage table. In your browser.',
    lead: 'Enter a weight and the reps you managed to estimate your one-rep max — averaged across three proven formulas, with a percentage table for programming.',
    how: 'A one-rep max (1RM) is the most you could lift once. Rather than testing it directly (which is risky), the tool estimates it from a lighter set: the Epley formula is weight × (1 + reps⁄30), Brzycki is weight × 36⁄(37 − reps), and Lombardi is weight × reps^0.1. It averages the three and builds a table of the weights corresponding to each rep count.',
    note: 'These estimates are most accurate for sets of about 1–10 reps; beyond that they tend to overestimate. Use the percentage table to pick training loads — e.g. 5×5 work is often around 80–85% of 1RM. Always warm up, lift within your ability and use a spotter.',
    faqs: [
      { q: 'How do I calculate my one-rep max?', a: 'Do a set to near-failure at a known weight, then apply a formula. Epley: 1RM = weight × (1 + reps⁄30). For 100 kg × 5 reps that\'s 100 × (1 + 5⁄30) ≈ 116.7 kg. This tool averages Epley, Brzycki and Lombardi.' },
      { q: 'Which 1RM formula is most accurate?', a: 'No single one is best for everyone — they agree closely at low reps and diverge as reps rise. Averaging several (as this tool does) is more robust than relying on one, and all are estimates rather than a true test.' },
      { q: 'What percentage of 1RM should I train at?', a: 'It depends on the goal: strength work is often 80–95% of 1RM for low reps, hypertrophy around 65–80%, and endurance below 65%. The percentage table shows the weight for each rep count.' },
      { q: 'Is it safe to test my actual 1RM?', a: 'A true 1RM test is demanding and carries injury risk, especially without experience or a spotter. Estimating from a submaximal set is safer and accurate enough for programming for most lifters.' },
      { q: 'Why is the estimate less accurate at high reps?', a: 'The formulas are calibrated for low-rep sets. Past about 10–12 reps, fatigue, technique and endurance vary so much between people that the linear/curved models overestimate the true max.' },
    ],
    keywords: ['one rep max calculator', '1rm calculator', 'max lift calculator', 'epley formula calculator', 'brzycki calculator', 'bench press max calculator', 'squat 1rm calculator'],
  },
  {
    slug: 'heart-rate-zone-calculator',
    name: 'Heart Rate Zone Calculator',
    icon: '❤️',
    widget: 'hrzone',
    description: 'Calculate your training heart-rate zones from age (and optionally resting HR, for the Karvonen method), using the Tanaka, traditional or Gulati max-HR formulas. In your browser.',
    lead: 'Enter your age to get your five training heart-rate zones — add a resting heart rate for personalised Karvonen zones based on your heart-rate reserve.',
    how: 'First the tool estimates your maximum heart rate from age — Tanaka (208 − 0.7 × age), the traditional 220 − age, or Gulati (206 − 0.88 × age) for women. Without a resting HR, each zone is a percentage band of that maximum. With a resting HR, it uses the Karvonen (heart-rate-reserve) method: target = (max − rest) × intensity + rest, which better reflects your individual range.',
    note: 'Maximum-heart-rate formulas are population averages — an individual\'s true max can be 10–12 bpm higher or lower. For serious training, a lab or field max-HR test is more accurate. This is general fitness information, not medical advice.',
    faqs: [
      { q: 'How do I calculate my heart rate zones?', a: 'Estimate your maximum heart rate (e.g. Tanaka: 208 − 0.7 × age), then take percentage bands of it — Zone 2 is 60–70%, Zone 4 is 80–90%, and so on. With a resting HR, the Karvonen method personalises the bands.' },
      { q: 'What is the Karvonen formula?', a: 'It sets target heart rate using your heart-rate reserve: target = (max HR − resting HR) × intensity% + resting HR. Because it accounts for your resting HR, it gives more individual zones than plain percentage-of-max.' },
      { q: 'What is Zone 2 training?', a: 'Zone 2 is a light, conversational intensity — roughly 60–70% of maximum heart rate — used to build aerobic base and fat-burning endurance. Much of an endurance athlete\'s training is done here.' },
      { q: 'Which max heart rate formula should I use?', a: 'Tanaka (208 − 0.7 × age) is generally more accurate than the older 220 − age across ages; Gulati (206 − 0.88 × age) was derived specifically for women. All are estimates — an actual tested max is best.' },
      { q: 'Is 220 minus age accurate?', a: 'It\'s a rough rule of thumb that can be off by 10–20 bpm for an individual. It\'s fine as a starting point, but Tanaka is usually closer, and a measured max HR is more reliable than any formula.' },
    ],
    keywords: ['heart rate zone calculator', 'target heart rate calculator', 'karvonen formula calculator', 'max heart rate calculator', 'zone 2 heart rate', 'training heart rate zones', 'fat burning heart rate'],
  },
  {
    slug: 'race-time-predictor',
    name: 'Race Time Predictor',
    icon: '🏅',
    widget: 'racepredict',
    description: 'Predict your race times across distances (5K, 10K, half and full marathon) from one recent result, using Peter Riegel\'s proven formula. In your browser.',
    lead: 'Enter one recent race time and get predicted times — and paces — for 5K, 10K, 15K, half and full marathon, using Riegel\'s formula.',
    how: 'The tool uses Peter Riegel\'s endurance formula: predicted time = known time × (new distance ÷ known distance)^1.06. The 1.06 exponent captures how pace slows as distance grows. From your one result it projects a full table of race times and the pace each implies.',
    note: 'Predictions assume you\'ve trained appropriately for the target distance and run an even effort — a marathon predicted from a 5K only holds if you\'ve done the endurance work. Accuracy is best between distances of a broadly similar range.',
    faqs: [
      { q: 'How accurate is a race time predictor?', a: 'Riegel\'s formula is well-regarded and usually within a few percent for well-trained runners racing distances in a similar range. The catch is that predicting a marathon from a 5K assumes you\'ve built the endurance — otherwise the real time is slower.' },
      { q: 'What is the Riegel formula?', a: 'T2 = T1 × (D2 ÷ D1)^1.06, where T1 is your time over distance D1 and T2 is the predicted time over D2. The 1.06 exponent reflects that you can\'t hold short-race pace over long distances.' },
      { q: 'Can I predict a marathon from a 5K?', a: 'You can, but treat it cautiously: the formula assumes equivalent training. A 5K-based marathon prediction is optimistic unless you\'ve done the long runs and endurance training a marathon demands.' },
      { q: 'Why does pace slow over longer distances?', a: 'Because you can sustain a higher intensity for a short time than a long one. The Riegel exponent of 1.06 (greater than 1) mathematically slows the predicted pace as the distance increases.' },
      { q: 'How do I use my 10K time to set a half-marathon goal?', a: 'Enter your 10K distance and time; the tool predicts your half-marathon time and pace. Use that pace as a starting goal, then adjust for your training and the course.' },
    ],
    keywords: ['race time predictor', 'riegel formula calculator', 'marathon time predictor', 'race pace predictor', '5k to 10k predictor', 'running race calculator', 'predict race time'],
  },
  {
    slug: 'vo2-max-calculator',
    name: 'VO2 Max Calculator (Cooper Test)',
    icon: '🫁',
    widget: 'vo2',
    description: 'Estimate your VO2 max from the Cooper 12-minute run test — enter the distance you covered and get your VO2 max and a fitness rating. In your browser.',
    lead: 'Do the Cooper test — run as far as you can in 12 minutes — then enter the distance to estimate your VO2 max and see a fitness rating.',
    how: 'VO2 max is the maximum rate at which your body can use oxygen, a key marker of aerobic fitness. The Cooper test estimates it from how far you run in 12 minutes: VO2 max = (distance in metres − 504.9) ÷ 44.73. The tool converts your distance and returns the estimate in ml/kg/min with an indicative rating.',
    note: 'This is a field-test estimate, not a lab measurement, and it depends on giving a genuine maximal effort while pacing evenly. Only attempt a maximal test if you\'re healthy and cleared to exercise hard; stop if you feel unwell.',
    faqs: [
      { q: 'What is a good VO2 max?', a: 'It varies by age and sex, but for adults roughly: below ~32 ml/kg/min is below average, ~38–45 is good, and above ~52 is excellent. Elite endurance athletes can exceed 60–70. The tool gives an indicative rating.' },
      { q: 'How does the Cooper test work?', a: 'Warm up, then run (or run/walk) as far as you can on a flat course or track in exactly 12 minutes. Enter the total distance and the formula VO2 max = (metres − 504.9) ÷ 44.73 estimates your aerobic capacity.' },
      { q: 'How accurate is the Cooper test?', a: 'It correlates well with lab VO2 max (around r ≈ 0.9) when you give a true maximal, evenly-paced effort. It\'s an estimate, though — pacing, motivation, terrain and conditions all affect the result.' },
      { q: 'How can I improve my VO2 max?', a: 'Regular aerobic training, and especially interval work near your max heart rate, raises VO2 max over time. Consistency matters more than any single session; retest every few weeks to track progress.' },
      { q: 'Do I need a lab to measure VO2 max?', a: 'A lab test (measuring the gases you breathe during a graded exercise test) is the gold standard, but field tests like Cooper\'s give a useful estimate for free — handy for tracking your own trend.' },
    ],
    keywords: ['vo2 max calculator', 'cooper test calculator', 'vo2max estimate', '12 minute run test', 'aerobic fitness calculator', 'cooper 12 minute test', 'vo2 max from running'],
  },
  {
    slug: 'calories-burned-calculator',
    name: 'Calories Burned Calculator',
    icon: '🔥',
    widget: 'calories',
    description: 'Estimate calories burned during exercise from the activity, your weight and the duration, using MET values from the Compendium of Physical Activities. In your browser.',
    lead: 'Pick an activity, enter your weight and how long you did it, and get an estimate of the calories you burned — using standard MET values.',
    how: 'Each activity has a MET value — how many times more energy it uses than sitting at rest. The tool applies the ACSM formula: calories per minute = MET × 3.5 × body-weight-in-kg ÷ 200, multiplied by the duration. MET values come from the Compendium of Physical Activities, the reference researchers use.',
    note: 'This is an estimate. Real energy expenditure varies with intensity, fitness, technique and body composition, and the MET for an activity covers a range — running at 6 mph burns more than at 5 mph. Use it to compare activities and track trends, not as an exact figure.',
    faqs: [
      { q: 'How are calories burned during exercise calculated?', a: 'From the activity\'s MET value and your weight: calories/min = MET × 3.5 × weight(kg) ÷ 200. A 70 kg person running at ~6 mph (about 9.3 MET) for 30 minutes burns roughly 340 kcal.' },
      { q: 'What is a MET?', a: 'A metabolic equivalent — the ratio of an activity\'s energy cost to resting. One MET is sitting quietly; an 8-MET activity uses eight times as much energy per minute. MET values come from the Compendium of Physical Activities.' },
      { q: 'Does body weight affect calories burned?', a: 'Yes — heavier people burn more calories doing the same activity, because moving more mass takes more energy. That\'s why the formula multiplies by your weight in kilograms.' },
      { q: 'How accurate is a calories-burned estimate?', a: 'It\'s a reasonable ballpark but not exact. The same activity spans a MET range depending on intensity, and individual efficiency varies. Treat the number as an estimate for comparison rather than a precise count.' },
      { q: 'Which burns more calories, running or cycling?', a: 'It depends on intensity and duration, but vigorous running (11–12+ MET) generally burns more per minute than moderate cycling (~8 MET). Pick both activities in the tool and compare for your weight and time.' },
    ],
    keywords: ['calories burned calculator', 'exercise calories calculator', 'met calculator', 'calories burned running', 'calories burned walking', 'workout calorie calculator', 'calories burned cycling'],
  },
  {
    slug: 'steps-to-distance-calculator',
    name: 'Steps to Distance Calculator',
    icon: '👣',
    widget: 'steps',
    description: 'Convert steps to distance in km and miles — estimate your stride from your height, or enter it directly. In your browser.',
    lead: 'Turn a step count into distance in kilometres and miles — estimate your stride length from your height, or enter your own.',
    how: 'Distance is simply your number of steps times your stride length. If you know your stride, enter it; otherwise the tool estimates it from your height (a walking stride is roughly 0.414 × height). Multiply and you get the distance in metres, kilometres and miles.',
    note: 'Stride length varies with pace, terrain and individual gait — running strides are longer than walking ones — so the height estimate is a starting point. For accuracy, measure your own stride by counting steps over a known distance and dividing.',
    faqs: [
      { q: 'How do I convert steps to distance?', a: 'Multiply your steps by your stride length. For 10,000 steps at a 0.75 m stride, that\'s 7,500 m = 7.5 km (about 4.7 miles). The tool can estimate your stride from your height if you don\'t know it.' },
      { q: 'How far is 10,000 steps?', a: 'Roughly 6.5–8 km (4–5 miles) for most people, depending on stride length. With a 0.75 m stride it\'s exactly 7.5 km. Enter your height or stride for a personalised figure.' },
      { q: 'How do I estimate my stride length?', a: 'A rough estimate is about 0.414 × your height for walking. For a precise value, walk a known distance (say 20 m), count your steps, and divide the distance by the number of steps.' },
      { q: 'Why does stride length matter?', a: 'Because distance = steps × stride, a small difference in stride changes the total noticeably over thousands of steps. Taller people and faster paces have longer strides, so a personal stride gives a better result than a generic one.' },
      { q: 'Is a walking stride the same as a running stride?', a: 'No — running strides are longer, so the same number of steps covers more ground running than walking. Enter your running stride directly if you\'re converting run steps.' },
    ],
    keywords: ['steps to distance calculator', 'steps to km', 'steps to miles', 'how far is 10000 steps', 'stride length calculator', 'step distance converter', 'pedometer distance calculator'],
  },
  {
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator (US Navy)',
    icon: '📏',
    widget: 'bodyfat',
    description: 'Estimate your body fat percentage with the US Navy tape method — from height and a few circumference measurements. In your browser.',
    lead: 'Enter your height and a couple of tape measurements to estimate your body-fat percentage and category.',
    how: 'The US Navy circumference method estimates body fat from the ratio of your body measurements to your height, using a logarithmic formula validated against hydrostatic weighing. Men need height, neck and waist; women add hip. The tool converts your measurements (inches or centimetres) and returns a percentage plus a general fitness category. It needs only a tape measure, which is why the military and gyms use it, though it\'s an estimate — typically within 3–4% of a DEXA scan.',
    note: 'Measure consistently for repeatable results: waist at the navel, neck just below the larynx, hip at the widest point, tape snug but not compressing the skin, and ideally first thing in the morning. Because it\'s based on averages, very muscular or very lean builds can read high or low — track the trend over time rather than obsessing over a single number, and consult a professional for medical assessment.',
    faqs: [
      { q: 'How does the US Navy body fat method work?', a: 'It uses body circumferences relative to height in a logarithmic formula. Men: 86.010·log₁₀(waist − neck) − 70.041·log₁₀(height) + 36.76. Women add hip: 163.205·log₁₀(waist + hip − neck) − 97.684·log₁₀(height) − 78.387. All measurements in inches.' },
      { q: 'How accurate is the Navy body fat calculator?', a: 'For most people it lands within about 3–4% of a DEXA or hydrostatic measurement — good for tracking trends. It\'s less accurate for very muscular or very lean builds, since it\'s based on population averages, not your individual composition.' },
      { q: 'Where do I measure for body fat?', a: 'Waist at the navel, neck just below the Adam\'s apple, and (for women) hips at the widest point. Keep the tape level and snug without compressing the skin, and measure at the same time of day for consistency.' },
      { q: 'What is a healthy body fat percentage?', a: 'General ranges: men ~10–20% and women ~18–28% are commonly considered fit/average, with athletes lower. "Essential fat" (the minimum for health) is about 3–5% for men and 10–13% for women. These are broad guides, not medical thresholds.' },
      { q: 'Why do women need a hip measurement?', a: 'Women store proportionally more fat around the hips, so the formula includes hip circumference to model female body composition accurately. The male formula uses only waist and neck against height.' },
    ],
    keywords: ['body fat calculator', 'navy body fat calculator', 'body fat percentage calculator', 'how to calculate body fat', 'body fat tape measure', 'us navy body fat', 'bodyfat estimate'],
  },
  {
    slug: 'tdee-calculator',
    name: 'TDEE & BMR Calculator',
    icon: '🔥',
    widget: 'tdee',
    description: 'Calculate your BMR and total daily energy expenditure (TDEE) with the Mifflin-St Jeor equation — plus calorie targets for losing or gaining weight. In your browser.',
    lead: 'Enter your details and activity level to get your BMR, maintenance calories (TDEE) and targets for losing or gaining weight.',
    how: 'Your basal metabolic rate (BMR) is the energy your body burns at complete rest, estimated here with the Mifflin-St Jeor equation — the most accurate of the common formulas: 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5 (men) or − 161 (women). Multiplying BMR by an activity factor (1.2 sedentary up to 1.9 for very hard training) gives your total daily energy expenditure (TDEE) — the calories to maintain your weight. The tool also shows a roughly 500-kcal deficit and surplus for gradual weight loss or gain.',
    note: 'These are population-average estimates; individual metabolism varies by ±10% or more, and the activity factors are approximate. Use the number as a starting point, then adjust based on how your weight actually responds over 2–3 weeks. For medical, pregnancy or clinical situations, consult a doctor or dietitian rather than a calculator.',
    faqs: [
      { q: 'What is the difference between BMR and TDEE?', a: 'BMR is the energy you\'d burn lying at rest all day. TDEE is BMR plus everything else — daily activity, exercise and digestion — so it\'s always higher. TDEE = BMR × an activity multiplier, and it\'s the number you use for maintenance calories.' },
      { q: 'How do I calculate my TDEE?', a: 'First find BMR with Mifflin-St Jeor (10·kg + 6.25·cm − 5·age ± 5/161), then multiply by your activity factor: 1.2 (sedentary), 1.375 (light), 1.55 (moderate), 1.725 (very active) or 1.9 (extra active). The result is your maintenance calories.' },
      { q: 'How many calories to lose weight?', a: 'A deficit of about 500 kcal/day below your TDEE gives roughly 0.5 kg (1 lb) of loss per week, since a kilogram of fat is about 7,700 kcal. The tool shows this target automatically. Avoid going below your BMR for long.' },
      { q: 'Which BMR formula is most accurate?', a: 'Mifflin-St Jeor (used here) is generally the most accurate predictive equation for the general population, more so than the older Harris-Benedict. All predictive formulas are estimates; only lab measurement gives your exact BMR.' },
      { q: 'What activity level should I choose?', a: 'Be honest and conservative — most people overestimate. "Sedentary" suits desk work with little exercise; "moderate" means real training 3–5 days a week. If unsure, pick the lower option and adjust once you see how your weight responds.' },
    ],
    keywords: ['tdee calculator', 'bmr calculator', 'maintenance calories calculator', 'daily calorie calculator', 'mifflin st jeor calculator', 'how many calories to maintain weight', 'total daily energy expenditure'],
  },
];

export const getFitnessTool = (slug: string) => FITNESS_TOOLS.find((t) => t.slug === slug);
