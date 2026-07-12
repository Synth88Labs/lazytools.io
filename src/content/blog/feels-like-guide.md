---
title: "Why 'Feels Like' Isn't the Temperature: Heat Index, Wind Chill and Wet-Bulb"
description: "The thermometer only tells half the story. In humid heat, sweat can't evaporate — the heat index. In cold wind, heat is stripped away — the wind chill. And the wet-bulb temperature sets the hard limit on how much the body can cool at all. What each means and when it matters."
pubDate: 2026-07-12
updatedDate: 2026-07-12
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

Your body's main cooling system is sweat evaporating off your skin. But evaporation only works if the air can accept more moisture — and **humid air already holds a lot**. So when it's humid, sweat just sits there, cooling fails, and the same temperature feels much hotter. That's the **[heat index](/weather/heat-index-calculator/)**: 90°F at 70% humidity feels like about **106°F**, squarely in the National Weather Service "danger" zone. The heat index (from the NWS Rothfusz formula) is what tells you a humid 90°F day is genuinely more dangerous than a dry one.

## When it's cold: wind and the wind chill

In the cold the mechanism reverses. Your body warms a thin boundary layer of air right against your skin — and **wind blows it away**, forcing you to keep reheating fresh cold air, so heat drains faster. The **[wind chill](/weather/wind-chill-calculator/)** captures this: 20°F with a 15 mph wind feels like about **6°F**, and exposed skin can get frostbite far quicker than the still-air temperature suggests. The modern formula (adopted by the NWS in 2001) is based on a model of heat loss from a human face.

Put those together and you get the single **[feels-like temperature](/weather/feels-like-temperature/)** your weather app shows: heat index when warm, wind chill when cold, and the plain temperature in between.

## The hard limit: wet-bulb temperature

Here's the sobering part. Both the heat index and wind chill are about *comfort and perception*. The **[wet-bulb temperature](/weather/wet-bulb-temperature/)** is about *physics and survival*. It's the lowest temperature you could reach by evaporating water into the air — literally a thermometer wrapped in a wet cloth. It sets the absolute floor on how cool sweating can make you.

When the wet-bulb temperature climbs, that floor rises. At a sustained wet-bulb of **35°C (95°F)**, sweat can no longer cool you *even sitting still in the shade* — your core temperature rises regardless, and prolonged exposure is fatal. That's why scientists watch the wet-bulb, not the thermometer, when assessing extreme humid heatwaves. Real danger begins well below 35°C during exertion. (Our calculator uses Stull's 2011 formula, valid at sea level.)

## Why it matters

Knowing *which* number applies helps you make the right call. In a humid heatwave, the **heat index** and **wet-bulb** tell you when to stop exercising and find air conditioning. On a windy winter day, the **wind chill** tells you to cover exposed skin. And remembering that none of them count the sun means a bright day is always a bit worse than the number. All of these run privately in your browser from the values you enter — no forecast feed, no upload.

---

*These tools use the official meteorological formulas — the NWS Rothfusz heat index, the 2001 NWS wind-chill formula, the Magnus dew-point equation and Stull's (2011) wet-bulb formula. They're calculators, not a live forecast: for warnings and current conditions, always check your national weather service.*
