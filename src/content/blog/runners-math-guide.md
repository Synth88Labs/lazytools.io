---
title: "The Runner's Math: Pace, Race Times and Heart-Rate Zones Explained"
seoTitle: "Runner's Math: Pace, Race Times & HR Zones"
description: "Runner's math in three formulas: pace = time ÷ distance, Riegel's race-time predictor, and heart-rate zones from your max HR, with worked examples."
pubDate: 2026-07-11
updatedDate: 2026-08-23
archetype: explainer
tools: ["/fitness/running-pace-calculator/", "/fitness/race-time-predictor/", "/fitness/heart-rate-zone-calculator/", "/fitness/vo2-max-calculator/"]
keywords:
  - running pace explained
  - how to predict race time
  - heart rate zones explained
  - riegel formula
  - marathon pace calculator
  - running math
heroImage: /blog/runners-math-guide.png
heroAlt: "Three running formulas: pace = time ÷ distance, Riegel race predictor, and heart-rate zones from max HR"
faqs:
  - q: "How do I calculate my running pace?"
    a: "Pace is time divided by distance. A 10K (10 km) run in 50 minutes is a pace of 50 ÷ 10 = 5:00 per kilometre, which is about 8:03 per mile. To find a goal pace, divide your target time by the race distance."
  - q: "How can I predict my race time from another distance?"
    a: "Use Peter Riegel's formula: predicted time = known time × (new distance ÷ known distance) raised to the power 1.06. A 25-minute 5K predicts roughly a 52-minute 10K and a ~4-hour marathon, assuming you've trained for the longer distance."
  - q: "What are heart-rate training zones?"
    a: "Five intensity bands defined as percentages of your maximum heart rate: Zone 1 (50-60%, recovery) up to Zone 5 (90-100%, maximum). Estimate max HR with 208 − 0.7 × age, or personalise the zones with the Karvonen method using your resting heart rate."
  - q: "Is a 25-minute 5K really equivalent to a 4-hour marathon?"
    a: "By the Riegel formula, a 25:00 5K predicts about 3:59 for the marathon, but that only holds if you've done marathon-specific endurance training. Without the long runs, the real marathon time will be slower. The prediction shows your potential, not a guarantee."
  - q: "Which max heart rate formula is best?"
    a: "The Tanaka formula (208 − 0.7 × age) is generally more accurate across ages than the old 220 − age; Gulati (206 − 0.88 × age) was derived for women. All are estimates, an individual's true max can be 10-12 bpm different, so a measured max is best if you have one."
  - q: "What is Zone 2 running and why does it matter?"
    a: "Zone 2 is an easy, conversational effort at about 60-70% of max heart rate. It builds aerobic base and teaches the body to burn fat efficiently, which is why endurance athletes do the majority of their training there rather than always running hard."
  - q: "What's a good VO2 max?"
    a: "It depends on age and sex, but roughly: under ~32 ml/kg/min is below average, ~38-45 is good, and over ~52 is excellent for adults. You can estimate it with the Cooper 12-minute run test, see the VO2 max calculator."
draft: false
---

**Almost all of running math comes down to three formulas.** One turns a time and a distance into a **pace**. One turns a single race result into a **prediction for every other distance**. And one turns your **age** into the heart-rate **zones** you should train in. Learn these three and you can plan a training run, set a realistic race goal and structure your effort, all from a stopwatch.

<aside class="key-takeaways">

**Key takeaways**

- **Pace = time ÷ distance.** A 10K in 50:00 is 5:00/km (8:03/mile).
- **Riegel predicts across distances:** `t2 = t1 × (d2 ÷ d1)^1.06`. A 25-min 5K ≈ a 4-hour marathon *if you've trained for it*.
- **Heart-rate zones** are % bands of your max HR (≈ **208 − 0.7 × age**); add a resting HR for personalised Karvonen zones.
- **Most training is easy (Zone 2);** hard days are the minority.
- All three are estimates, use them as guides, then adjust to your body and training.

</aside>

<figure>
<img src="/blog/infographic-runners-math.svg" alt="Three running formulas side by side: pace = time ÷ distance (10K in 50:00 = 5:00/km); Riegel prediction t2 = t1 × (d2/d1)^1.06 (25:00 5K predicts ~52:08 10K, ~1:55 half, ~3:59 marathon); and heart-rate zones from HRmax ≈ 208 − 0.7 × age." width="1200" height="640" loading="lazy" />
<figcaption>Pace, prediction and zones, the three formulas that cover most of running.</figcaption>
</figure>

## 1. Pace: time ÷ distance

**Pace** is how long it takes you to cover one unit of distance, minutes per kilometre or per mile. It's just your time divided by the distance:

`50:00 ÷ 10 km = 5:00 per km` (about 8:03 per mile, or 12 km/h).

The real power is running it *backwards* to find a **goal pace**. Want a sub-4-hour marathon? Divide 4:00:00 by 42.195 km and you get **5:41 per km** (9:09 per mile), the pace you'd need to hold for all 42.195 km. Now you have a concrete number to practise in training. The [running pace calculator](/fitness/running-pace-calculator/) does this in both directions, and the [pace converter](/fitness/pace-converter/) switches between min/km, min/mile and treadmill speeds.

The one thing that trips people up is unit conversion, because a treadmill shows km/h, a race sign shows miles, and your watch might show either. One mile is **1.609 km**, so a pace in min/km multiplied by 1.609 gives min/mile. Here is a quick reference you can eyeball mid-run:

| Pace (min/km) | Pace (min/mile) | Speed (km/h) | Roughly |
|---|---|---|---|
| 4:00 | 6:26 | 15.0 | Fast 10K racing |
| 5:00 | 8:03 | 12.0 | Solid tempo effort |
| 6:00 | 9:39 | 10.0 | Steady long-run pace |
| 7:00 | 11:16 | 8.6 | Easy / recovery jog |

A useful sanity check: **speed in km/h = 60 ÷ pace-in-min/km**. Running 5:00/km means 60 ÷ 5 = 12 km/h, exactly what the treadmill should read.

## 2. Race prediction: the Riegel formula

How fast could you run a 10K based on your 5K? Peter Riegel's endurance formula answers exactly that:

> **t₂ = t₁ × (d₂ ÷ d₁)^1.06**

Your predicted time (t₂) for a new distance (d₂) equals your known time (t₁) over the known distance (d₁), scaled by the distance ratio raised to the power **1.06**. That exponent, slightly greater than 1, captures a basic truth: you can't hold your 5K pace over a marathon, so pace slows as distance grows.

Take a **25:00 5K**. Riegel predicts:

| Distance | Predicted time |
|---|---|
| 10K | ~52:07 |
| Half marathon | ~1:55:00 |
| Marathon | ~3:59:47 |

So a 25-minute 5K runner has roughly **four-hour-marathon** potential. The big caveat: predictions assume you've done the **training for the target distance**. A marathon predicted from a 5K is only realistic if you've built the endurance with long runs, otherwise the real time is slower. The [race time predictor](/fitness/race-time-predictor/) builds this whole table from one result.

**Why the exponent is 1.06 and where it breaks down.** Riegel derived the value 1.06 by fitting the formula to a broad set of world-class and everyday race records; it is an average of how much humans slow as distance grows. Because it is an average, the further your prediction distance is from your input distance, the less it holds. Predicting a 10K from a 5K (a 2× jump) is very reliable; predicting a marathon from a 5K (an 8× jump) is far more speculative, since the marathon adds fuelling, glycogen depletion and heat management that a 5K never tests. The rule of thumb: **predict from the closest race you have.** A recent half-marathon predicts a marathon far better than a 5K does. If your predictions consistently overshoot at long distances, your personal exponent is above 1.06, a signal that endurance, not speed, is your limiter.

## 3. Heart-rate zones: training at the right intensity

Running the right *effort* matters as much as the right pace, and heart rate is how you measure effort. First estimate your **[maximum heart rate](https://en.wikipedia.org/wiki/Heart_rate)**. The old rule is 220 − age, but the **Tanaka formula is more accurate**:

`HRmax ≈ 208 − 0.7 × age` → for a 30-year-old, about **187 bpm**.

Then your training zones are percentage bands of that maximum:

| Zone | % of max HR | Feels like | Purpose |
|---|---|---|---|
| 1 | 50-60% | Very easy | Warm-up, recovery |
| 2 | 60-70% | Conversational | Fat burn, aerobic base |
| 3 | 70-80% | Comfortably hard | Aerobic, stamina |
| 4 | 80-90% | Hard | Anaerobic threshold |
| 5 | 90-100% | Maximal | VO₂ max, sprints |

The counterintuitive part for many runners: **most of your running should be easy (Zone 1-2)**, with only a small share of hard Zone 4-5 work. Piling on moderate-hard efforts every day is the classic mistake. If you enter your **resting heart rate**, the [heart-rate zone calculator](/fitness/heart-rate-zone-calculator/) switches to the **Karvonen method**, target = (max − rest) × intensity + rest, which personalises the bands to your own heart-rate reserve.

Worked example: a 30-year-old with a resting HR of 55 bpm. Estimated max is 208 − 0.7 × 30 = **187 bpm**, so their reserve is 187 − 55 = 132 bpm. A "70% Karvonen" target is 0.70 × 132 + 55 = **147 bpm**, notably higher than a plain 70%-of-max figure of 131 bpm, because Karvonen anchors intensity to the range you actually train across rather than to zero. The two methods disagree most for very fit people with low resting rates, which is exactly why entering a resting HR is worth the extra field.

Which max-HR formula should you trust? They diverge more than most runners expect:

| Formula | Equation | Best for | Age-40 estimate |
|---|---|---|---|
| Classic | 220 − age | Rough, historical default | 180 bpm |
| Tanaka | 208 − 0.7 × age | General adult accuracy | 180 bpm |
| Gulati | 206 − 0.88 × age | Derived on women | 171 bpm |

At age 40 the classic and Tanaka formulas happen to agree, but Tanaka tracks better at the young and old ends of the range. All of them are population averages: an individual's true maximum can sit **roughly 10-12 bpm** either side of the estimate, so a value measured in a hard effort or a lab test always beats a formula when you have one.

## 4. VO2 max: your aerobic ceiling

Where pace measures output and heart rate measures effort, **[VO2 max](https://en.wikipedia.org/wiki/VO2_max)** measures capacity, the maximum volume of oxygen your body can use per minute, in millilitres per kilogram of bodyweight per minute (ml/kg/min). It sets the ceiling all your other numbers push against. You don't need a lab: the **Cooper 12-minute run test** estimates it from how far you can run flat-out in 12 minutes.

> **VO2 max ≈ (distance in metres − 504.9) ÷ 44.73**

Run 2,400 m in 12 minutes and the estimate is (2400 − 504.9) ÷ 44.73 ≈ **42 ml/kg/min**, a good recreational figure. Because the number is population-calibrated, treat it as a fitness *tracker* rather than an exact physiological reading: watching it climb over a training block tells you the training is working. The [VO2 max calculator](/fitness/vo2-max-calculator/) runs this test and cross-checks it against typical ranges for your age and sex.

## Putting it together

These formulas work as a system, and it's easiest to see when you chain them. Say you just ran a **22:00 5K** and want to target a half marathon. Feed it to the **race predictor** and Riegel returns roughly **1:41** for the half. Hand that goal to the **pace calculator**: 1:41:00 ÷ 21.0975 km ≈ **4:47 per km** (7:42/mile), the race pace to rehearse in tempo sessions. Then set your **heart-rate zones** so those tempo efforts land in Zone 3-4 while your recovery and long runs stay in Zone 1-2, keeping legs fresh for the days that matter. Finally, retest your **VO2 max** every few weeks to confirm the aerobic ceiling is rising rather than flat.

Use the four tools together and you have a full loop, a goal, a pace, an intensity plan and a progress metric:

- **[Race time predictor](/fitness/race-time-predictor/)** → a realistic goal time from a recent result.
- **[Running pace calculator](/fitness/running-pace-calculator/)** → that goal converted into a per-km/per-mile pace.
- **[Heart-rate zone calculator](/fitness/heart-rate-zone-calculator/)** → the effort bands that keep easy days easy.
- **[VO2 max calculator](/fitness/vo2-max-calculator/)** → a number to watch trend upward over a training block.

Every calculation runs privately in your browser, no account, no upload, no data leaving your device, so you can plan an entire season from a single stopwatch reading.

---

*These are established exercise-science formulas, Riegel for prediction, Tanaka and Karvonen for heart rate, each an estimate calibrated on populations, not a personal guarantee. This is general fitness information, not medical advice; check with a doctor before hard training or a maximal test if you have any health concerns. Sources: Riegel P., "Athletic Records and Human Endurance" (American Scientist); Tanaka H. et al., J Am Coll Cardiol 2001; Karvonen M. et al. (heart-rate reserve).*
