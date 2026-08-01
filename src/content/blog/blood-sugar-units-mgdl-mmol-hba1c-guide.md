---
title: "Blood Sugar Units Explained: mg/dL, mmol/L, HbA1c and eAG"
description: "mg/dL and mmol/L are the same glucose measured on two scales — divide mg/dL by 18.0182 to get mmol/L. HbA1c has its own two scales (% and mmol/mol) plus an estimated average glucose. Here's how they all connect. Converts in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-01
archetype: explainer
heroImage: /blog/blood-sugar-units-mgdl-mmol-hba1c-guide.png
heroAlt: "How blood sugar units relate — mg/dL to mmol/L by dividing by 18.0182, and HbA1c percent to IFCC mmol/mol and estimated average glucose"
tools: ["/calc/blood-sugar-converter/", "/calc/hba1c-calculator/"]
keywords:
  - blood sugar units
  - mg/dl to mmol/l
  - mmol/l to mg/dl
  - hba1c to mmol/mol
  - what is eag
  - a1c to average glucose
  - glucose unit conversion
faqs:
  - q: "How do I convert mg/dL to mmol/L?"
    a: "Divide the mg/dL value by 18.0182. For example, 100 mg/dL ÷ 18.0182 = 5.6 mmol/L, and 140 mg/dL ÷ 18.0182 = 7.8 mmol/L. To go the other way, multiply mmol/L by 18.0182: 7 mmol/L × 18.0182 = 126 mg/dL. The factor is the molar mass of glucose (180.156 g/mol) divided by 10."
  - q: "Why is the conversion factor 18.0182?"
    a: "Because mg/dL and mmol/L differ in two ways at once. mmol/L counts molecules (millimoles) while mg/dL counts mass (milligrams), and the two units use different volumes (litre vs decilitre). Dividing glucose's molar mass, 180.156 g/mol, by 10 to account for the dL-to-L step gives 18.0182 — the single number that bridges both differences."
  - q: "Which countries use mg/dL and which use mmol/L?"
    a: "The United States, Germany, France, Japan and a few others report glucose in mg/dL. The UK, Ireland, Canada, Australia, New Zealand and most of the rest of the world use mmol/L. This is purely a difference in convention — the underlying blood glucose is identical, which is why an exact conversion factor exists."
  - q: "What's the difference between HbA1c % and mmol/mol?"
    a: "They measure the same glycated haemoglobin on two scales. The older NGSP/DCCT scale reports a percentage (aligned to the landmark diabetes trials), while the newer IFCC scale reports millimoles of HbA1c per mole of haemoglobin. They're linked by IFCC = 10.929 × (NGSP% − 2.15), so 7% equals 53 mmol/mol. Many labs now print both."
  - q: "What is estimated average glucose (eAG)?"
    a: "eAG expresses an HbA1c result on the same scale as a day-to-day glucose meter. It comes from the ADAG study (Nathan et al., Diabetes Care 2008), which found eAG (mg/dL) = 28.7 × HbA1c% − 46.7. So an HbA1c of 7% corresponds to an average glucose of about 154 mg/dL, or 8.6 mmol/L. It's a population average, not an exact personal reading."
  - q: "Is HbA1c the same as a blood sugar reading?"
    a: "No. A glucose reading (mg/dL or mmol/L) is a snapshot of your blood sugar at one moment. HbA1c reflects your average glucose over roughly the previous 2–3 months, because it measures how much haemoglobin has become glycated over the lifespan of red blood cells. eAG is the bridge that puts HbA1c back onto the familiar glucose scale."
  - q: "Is my data private when I use these converters?"
    a: "Yes. The LazyTools blood sugar and HbA1c converters run entirely in your browser — nothing you type is uploaded or stored. These tools convert between units and are not medical advice or a diagnosis; what a given number means for you is a conversation to have with your clinician."
draft: false
---

**mg/dL and mmol/L are the same blood glucose written on two scales: divide mg/dL by 18.0182 to get
mmol/L, or multiply mmol/L by 18.0182 to go back.** HbA1c — a longer-term measure — has its *own* pair
of scales (percent and mmol/mol) plus an "estimated average glucose" that maps it back onto the
familiar meter reading. This guide connects all four so a number in one system stops being a mystery.
Convert instantly with the [Blood Sugar Converter](/calc/blood-sugar-converter/) and the
[HbA1c Converter](/calc/hba1c-calculator/) — both run locally in your browser.

> These tools and this article explain unit conversions only. They are **not medical advice** and
> can't tell you whether a value is high, low or normal for you — that depends on your circumstances
> and is a question for a healthcare professional.

## Glucose: mg/dL ↔ mmol/L

A glucose reading is a snapshot — your blood sugar right now, from a meter or lab. Two conventions
report it:

- **mg/dL** (milligrams per decilitre) — a measure of *mass* per volume. Used in the US, Germany,
  France and Japan.
- **mmol/L** (millimoles per litre) — a measure of *number of molecules* per volume. Used in the UK,
  Canada, Australia and most of the world.

They differ by a single fixed factor:

> **mmol/L = mg/dL ÷ 18.0182**  ·  **mg/dL = mmol/L × 18.0182**

That 18.0182 isn't arbitrary. Glucose has a molar mass of **180.156 g/mol**; dividing by 10 to convert
between decilitres and litres gives 18.0182. Because it's exact, no precision is lost either way.

| mg/dL | mmol/L |
|---|---|
| 70 | 3.9 |
| 100 | 5.6 |
| 126 | 7.0 |
| 140 | 7.8 |
| 180 | 10.0 |
| 200 | 11.1 |

<figure class="my-8">
<svg viewBox="0 0 1200 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Glucose converts between mg/dL and mmol/L by 18.0182; HbA1c converts between percent, mmol/mol and estimated average glucose" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" fill="#0f172a">How the four numbers connect</text>

  <!-- Glucose row -->
  <text x="70" y="130" font-family="system-ui,sans-serif" font-size="26" font-weight="700" fill="#be123c">SNAPSHOT · glucose right now</text>
  <rect x="70" y="150" width="360" height="110" rx="16" fill="#fff1f2" stroke="#e11d48" stroke-width="3"/>
  <text x="250" y="200" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#9f1239">mg/dL</text>
  <text x="250" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#9f1239">US, DE, FR, JP</text>

  <rect x="500" y="150" width="360" height="110" rx="16" fill="#fff1f2" stroke="#e11d48" stroke-width="3"/>
  <text x="680" y="200" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#9f1239">mmol/L</text>
  <text x="680" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#9f1239">UK, CA, AU, world</text>

  <text x="465" y="195" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" fill="#e11d48">↔</text>
  <rect x="360" y="278" width="480" height="44" rx="10" fill="#e11d48"/>
  <text x="600" y="309" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#ffffff">÷ 18.0182  ·  × 18.0182</text>

  <!-- HbA1c row -->
  <text x="70" y="400" font-family="system-ui,sans-serif" font-size="26" font-weight="700" fill="#1d4ed8">AVERAGE · last 2–3 months</text>
  <rect x="70" y="420" width="300" height="110" rx="16" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="220" y="470" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#1e40af">HbA1c %</text>
  <text x="220" y="508" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#1e40af">NGSP / DCCT</text>

  <rect x="440" y="420" width="300" height="110" rx="16" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="590" y="470" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="800" fill="#1e40af">mmol/mol</text>
  <text x="590" y="508" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#1e40af">IFCC</text>

  <rect x="810" y="420" width="320" height="110" rx="16" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/>
  <text x="970" y="465" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#15803d">eAG</text>
  <text x="970" y="503" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" fill="#15803d">avg glucose (mg/dL · mmol/L)</text>

  <text x="405" y="483" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" fill="#2563eb">↔</text>
  <text x="775" y="483" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" fill="#16a34a">→</text>
  <text x="600" y="580" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23" fill="#1e40af">IFCC = 10.929 × (% − 2.15)</text>
  <text x="600" y="612" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23" fill="#15803d">eAG mg/dL = 28.7 × % − 46.7   (ADAG, 2008)</text>
</svg>
</figure>

## HbA1c: a different measurement entirely

HbA1c isn't a snapshot. It measures the fraction of your haemoglobin that has become *glycated* —
bonded with glucose — which builds up over the ~2–3 month lifespan of red blood cells. So it reflects
your **average** glucose over months, not this morning's reading. And like glucose, it's reported on
two scales:

- **NGSP / DCCT (%)** — the older percentage scale, aligned to the Diabetes Control and Complications
  Trial. A value like "7%".
- **IFCC (mmol/mol)** — the newer international standard: millimoles of HbA1c per mole of total
  haemoglobin. A value like "53 mmol/mol".

The two are linked by the IFCC–NGSP master equation:

> **IFCC (mmol/mol) = 10.929 × (NGSP% − 2.15)**

So 7% → 53 mmol/mol, and 8% → 64 mmol/mol. Since around 2011 many labs report both side by side, which
is exactly when people start needing to convert.

## eAG: putting HbA1c back on the meter scale

An HbA1c percentage is hard to picture next to your daily readings. The **estimated average glucose
(eAG)** fixes that. From the ADAG study (Nathan et al., *Diabetes Care*, 2008), which correlated HbA1c
with continuous glucose monitoring:

> **eAG (mg/dL) = 28.7 × HbA1c% − 46.7**

Then divide by 18.0182 for mmol/L. So an HbA1c of 7% ≈ **154 mg/dL (8.6 mmol/L)** average glucose.

| HbA1c % | IFCC mmol/mol | eAG mg/dL | eAG mmol/L |
|---|---|---|---|
| 6.0 | 42 | 126 | 7.0 |
| 6.5 | 48 | 140 | 7.8 |
| 7.0 | 53 | 154 | 8.6 |
| 7.5 | 58 | 169 | 9.4 |
| 8.0 | 64 | 183 | 10.2 |

eAG is a *population average*: two people with the same HbA1c can have somewhat different true average
glucose because red-cell turnover varies. Treat it as a helpful translation, not a personal guarantee.

## Putting it together

- A **glucose reading** is now; convert mg/dL ↔ mmol/L with **÷ or × 18.0182**.
- **HbA1c** is a 2–3 month average; convert % ↔ mmol/mol with **IFCC = 10.929 × (% − 2.15)**.
- **eAG** bridges the two, turning an HbA1c into an average meter reading with **28.7 × % − 46.7**.

Do the arithmetic instantly and privately with the [Blood Sugar Converter](/calc/blood-sugar-converter/)
and [HbA1c Converter](/calc/hba1c-calculator/) — and remember these convert units, they don't interpret
them. For what your numbers mean, talk to your clinician.
