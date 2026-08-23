---
title: "Why 'Feels Like' Isn't the Temperature: Heat Index, Wind Chill and Wet-Bulb"
description: "The thermometer only tells half the story. In humid heat, sweat can't evaporate — the heat index. In cold wind, heat is stripped away — the wind chill. And the wet-bulb temperature sets the hard limit on how much the body can cool at all. What each means and when it matters."
pubDate: 2026-07-12
updatedDate: 2026-08-23
archetype: explainer
tools: ["/weather/feels-like-temperature/", "/weather/heat-index-calculator/", "/weather/wind-chill-calculator/", "/weather/wet-bulb-temperature/"]
keywords:
  - feels like temperature explained
  - heat index vs wind chill
  - what is wet bulb temperature
  - apparent temperature
  - why does it feel hotter than it is
  - real feel temperature
heroImage: /blog/feels-like-guide.png
heroAlt: "Hot weather feels-like is driven by humidity (heat index); cold by wind (wind chill); wet-bulb 35°C is the survival limit"
faqs:
  - q: "What does 'feels like' temperature mean?"
    a: "The apparent temperature — how hot or cold the weather feels on your skin once humidity and wind are included, rather than the raw thermometer reading. Weather apps show the heat index when it's warm and the wind chill when it's cold."
  - q: "Why does it feel hotter than the actual temperature?"
    a: "Humidity. Your body cools by evaporating sweat, but when the air is already moist, sweat evaporates slowly and you can't shed heat — so it feels hotter than the thermometer says. The heat index measures this."
  - q: "Why does it feel colder than the actual temperature?"
    a: "Wind. It constantly strips away the thin layer of warm air next to your skin, speeding up heat loss, so a windy cold day feels colder than a still one. The wind chill measures this effect."
  - q: "What is the wet-bulb temperature?"
    a: "The lowest temperature that evaporating water — sweat — can reach in the current air. It's the true physical limit of how much your body can cool itself. A sustained wet-bulb of 35°C (95°F) is regarded as the limit of human survival, because sweat stops cooling you even at rest."
  - q: "What's the difference between heat index and wet-bulb temperature?"
    a: "The heat index is a 'feels like' number scaled to human perception in the shade; the wet-bulb temperature is a hard physical limit of evaporative cooling. Heat index is better for everyday comfort; wet-bulb is the better measure of extreme, potentially deadly humid heat."
  - q: "When does wind chill apply and when does heat index apply?"
    a: "Wind chill is defined for 50°F (10°C) and below with wind above 3 mph; the heat index applies at about 80°F (27°C) and above where humidity matters. Between those, the plain air temperature is the best guide."
  - q: "Do these include direct sunlight?"
    a: "No — the heat index and wind chill both assume shade. Standing in full sun can feel up to about 15°F (8°C) hotter than the heat index suggests."
draft: false
---

**A thermometer measures the air — not how the air treats your body.** On a muggy August afternoon it can feel far hotter than the reading; on a raw, windy winter morning, far colder. Two invisible factors — **humidity** and **wind** — are the reason, and a third measure, the **wet-bulb temperature**, marks the point where humid heat becomes deadly.

<aside class="key-takeaways">

**Key takeaways**

- **Hot weather:** humidity drives the "feels like" — the **heat index** (sweat can't evaporate).
- **Cold weather:** wind drives it — the **wind chill** (heat stripped from skin).
- **Wet-bulb temperature** is the hard limit of cooling by sweating; **35°C (95°F) is the survival limit.**
- Heat index applies ~**80°F+**, wind chill ~**50°F and below**; between them, the air temperature is the guide.
- None include direct **sun**, which can add up to ~15°F to the heat.

</aside>

<figure>
<img src="/blog/infographic-feels-like.svg" alt="Diagram: in hot weather (80°F+), humidity drives the heat index — 90°F at 70% humidity feels like 106°F. In cold weather (50°F and below), wind drives the wind chill — 20°F with 15 mph wind feels like 6°F. The wet-bulb temperature is the limit of cooling by sweating, with 35°C the survival threshold." width="1200" height="640" loading="lazy" />
<figcaption>Humidity rules the heat, wind rules the cold — and wet-bulb sets the survival limit.</figcaption>
</figure>

## When it's hot: humidity and the heat index

Your body's main cooling system is sweat evaporating off your skin. Evaporation carries away heat — but it only works if the surrounding air can accept more moisture, and **humid air already holds a lot**. When the humidity is high, sweat beads up and lingers instead of evaporating, cooling stalls, and the same air temperature feels much hotter. That's the **[heat index](/weather/heat-index-calculator/)**: an "apparent temperature" that combines the air temperature with the relative humidity.

Consider a worked example. At **90°F with 70% relative humidity**, the heat index is roughly **106°F** — squarely in the National Weather Service (NWS) "danger" band, where heat cramps and heat exhaustion are likely with prolonged exposure. Drop the humidity to a dry 30% at the same 90°F and the heat index falls back to around 85°F, well below the air temperature itself. Same thermometer reading, radically different risk. The heat index comes from the NWS Rothfusz regression, which was fitted to a detailed model of the human body's heat balance and is defined for shade conditions.

Here is roughly how the apparent temperature climbs with humidity at a fixed 90°F:

| Relative humidity | Heat index at 90°F | NWS risk category |
|---|---|---|
| 30% | ~85°F | Caution |
| 50% | ~96°F | Extreme caution |
| 70% | ~106°F | Danger |
| 85% | ~117°F | Danger |

*Values are approximate; the NWS heat-index chart and formula are the authority for exact figures.*

## When it's cold: wind and the wind chill

In the cold the mechanism reverses. Your body warms a thin boundary layer of air right against your skin — and **wind blows it away**, forcing you to keep reheating fresh cold air, so heat drains faster. The **[wind chill](/weather/wind-chill-calculator/)** captures this. A concrete case: **20°F with a 15 mph wind feels like about 6°F**, and exposed skin can reach frostbite far quicker than the still-air temperature alone would suggest.

The modern formula was adopted by the U.S. NWS (and Environment Canada) in 2001, replacing an older 1940s index that overstated the effect. It models heat loss from an exposed human face at a typical walking pace, and is defined for air temperatures at or below **50°F (10°C)** with wind above about **3 mph**. Note that wind chill only affects living tissue that is generating heat — it cannot cool an object below the actual air temperature, so it never freezes your car's radiator faster than the real temperature would.

Put the two together and you get the single **[feels-like temperature](/weather/feels-like-temperature/)** your weather app shows: heat index when it's warm, wind chill when it's cold, and the plain air temperature in the mild range between them.

## The hard limit: wet-bulb temperature

Here's the sobering part. Both the heat index and the wind chill are about *comfort and perception*. The **[wet-bulb temperature](/weather/wet-bulb-temperature/)** is about *physics and survival*. It is the lowest temperature that a parcel of air can be cooled to by evaporating water into it — literally the reading of a thermometer wrapped in a wet cloth and ventilated. It sets the absolute floor on how cool sweating can ever make you.

When humidity rises, that floor rises with it. At a sustained wet-bulb of **35°C (95°F)**, sweat can no longer shed heat *even for a healthy person sitting still in full shade with unlimited water* — core temperature climbs regardless, and prolonged exposure becomes fatal. This 35°C threshold was proposed in a widely cited 2010 study by Sherwood and Huber, and it is why climate scientists track the wet-bulb, not the dry thermometer, when assessing extreme humid heatwaves. Crucially, real danger begins **well below** 35°C: during physical exertion, or for the elderly and those with heart conditions, wet-bulb values in the high 20s°C can already be life-threatening. Our calculator uses Stull's 2011 approximation, which is accurate for typical sea-level conditions.

## How the three measures compare

The same day can be described by more than one of these numbers — the trick is knowing which one answers your question.

| | Heat index | Wind chill | Wet-bulb temperature |
|---|---|---|---|
| **Driven by** | Temperature + humidity | Temperature + wind | Temperature + humidity |
| **Applies when** | ~80°F (27°C) and up | ~50°F (10°C) and below | Any time; matters most in humid heat |
| **Tells you** | How hot it feels | How cold it feels | Physical limit of sweat cooling |
| **Nature** | Perceived comfort | Perceived comfort | Hard physical limit |
| **Assumes shade?** | Yes | Yes | Yes |

Because both the heat index and the wind chill assume shade, direct sun is the one big factor none of them include. Standing in full sunlight can feel up to about **15°F (8°C)** hotter than the heat index reads — so on a bright day, treat the number as a floor, not a ceiling.

## Why it matters

Knowing *which* number applies helps you make the right call. In a humid heatwave, the **heat index** and **wet-bulb** tell you when to stop exercising, hydrate, and find air conditioning — and the wet-bulb is the better guide as the heat turns genuinely dangerous. On a windy winter day, the **wind chill** tells you how fast exposed skin can freeze and to cover up. And remembering that none of them count the sun means a bright day is always a bit worse than the headline figure suggests.

All four of our calculators — [feels-like](/weather/feels-like-temperature/), [heat index](/weather/heat-index-calculator/), [wind chill](/weather/wind-chill-calculator/) and [wet-bulb](/weather/wet-bulb-temperature/) — run entirely in your browser from the values you type in. Nothing is uploaded, no location is requested, and there is no forecast feed to phone home to.

---

*These tools use the official meteorological formulas — the NWS Rothfusz heat index, the 2001 NWS wind-chill formula, the Magnus dew-point equation and Stull's (2011) wet-bulb formula. They're calculators, not a live forecast: for warnings and current conditions, always check your national weather service.*
