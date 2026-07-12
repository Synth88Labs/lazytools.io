/** Weather & Atmosphere calculator registry. One entry drives a /weather/ page. */

export interface WeatherToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'heatindex' | 'windchill' | 'dewpoint' | 'humidity' | 'feelslike' | 'wetbulb' | 'beaufort' | 'cloudbase';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const WEATHER_TOOLS: WeatherToolDef[] = [
  {
    slug: 'heat-index-calculator',
    name: 'Heat Index Calculator',
    icon: '🥵',
    widget: 'heatindex',
    description: 'Calculate the heat index — how hot it really feels — from air temperature and humidity, using the official NWS formula. With risk levels. °F or °C, in your browser.',
    lead: 'Enter the temperature and humidity to get the heat index — how hot it actually feels — plus the NWS risk level.',
    how: 'When it\'s humid, sweat evaporates slowly, so your body can\'t cool as well and the air feels hotter than the thermometer reads. The heat index quantifies that using the National Weather Service\'s Rothfusz regression — a formula fitted to temperature and relative humidity. The tool applies it (with the NWS low- and high-humidity adjustments) and shows the matching heat-risk category.',
    note: 'The heat index is calculated for shade and light wind — in full sunshine it can feel up to about 15°F (8°C) hotter still. It becomes meaningful in warm conditions, roughly 80°F (27°C) and above. Above a heat index of 103°F it\'s in the "danger" zone: limit exertion, hydrate and seek cool spaces.',
    faqs: [
      { q: 'What is the heat index?', a: 'A "feels like" temperature that combines air temperature and humidity. Because humidity slows sweat evaporation, humid heat feels hotter — a 90°F day at 70% humidity has a heat index of about 105°F.' },
      { q: 'How is the heat index calculated?', a: 'From the National Weather Service Rothfusz regression, a formula in temperature (°F) and relative humidity (%). The NWS adds small corrections at very low and very high humidity. This tool implements the full official method.' },
      { q: 'What heat index is dangerous?', a: 'The NWS bands are: 80–90°F caution, 90–103°F extreme caution, 103–125°F danger, and above 125°F extreme danger. In the danger zone, heat cramps, exhaustion and heatstroke become likely with activity.' },
      { q: 'Does the heat index account for sun?', a: 'No — it assumes shade and a light breeze. Direct sunlight can add up to about 15°F (8°C) to how hot it feels, so treat the value as a minimum on a sunny day.' },
      { q: 'What\'s the difference between heat index and temperature?', a: 'Air temperature is what the thermometer reads; the heat index adds the effect of humidity on your body\'s cooling. When it\'s dry the two are similar; when it\'s humid the heat index is higher.' },
    ],
    keywords: ['heat index calculator', 'feels like temperature calculator', 'heat index chart', 'apparent temperature', 'how hot does it feel', 'humidity heat calculator', 'nws heat index'],
  },
  {
    slug: 'wind-chill-calculator',
    name: 'Wind Chill Calculator',
    icon: '🥶',
    widget: 'windchill',
    description: 'Calculate wind chill — how cold it feels — from temperature and wind speed, using the 2001 NWS formula. With frostbite-risk times. °F or °C, in your browser.',
    lead: 'Enter the temperature and wind speed to get the wind chill — how cold it feels — and the frostbite risk.',
    how: 'Wind strips the thin layer of warm air next to your skin, so a cold, windy day feels colder than a still one at the same temperature. The tool uses the 2001 National Weather Service / Environment Canada wind-chill formula, which is based on a model of heat loss from the face, and flags how quickly exposed skin can get frostbite.',
    note: 'The formula is defined for temperatures at or below 50°F (10°C) and wind above 3 mph; outside that range it shows the actual temperature. Wind chill measures how cold it feels, not an actual air temperature — but frostbite risk is real, so cover exposed skin when the numbers drop.',
    faqs: [
      { q: 'What is wind chill?', a: 'The "feels like" temperature in cold, windy weather. Wind carries heat away from your skin faster, so 20°F with a 15 mph wind feels like about 6°F. It reflects how quickly you lose body heat.' },
      { q: 'How is wind chill calculated?', a: 'With the 2001 NWS/Environment Canada formula: WC = 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16, where T is °F and V is wind speed in mph. It models heat loss from the human face.' },
      { q: 'At what wind chill does frostbite happen?', a: 'Frostbite on exposed skin can occur in about 30 minutes at a wind chill near −18°F, in 10 minutes near −35°F, and in 5 minutes at −60°F or below. Cover up well below freezing.' },
      { q: 'Does wind chill affect objects or just people?', a: 'Only living things that generate heat. Wind chill describes how fast a warm object (like your body) loses heat; it can\'t cool an object below the actual air temperature, so a car or pipe won\'t freeze faster than the real temperature allows.' },
      { q: 'When does wind chill apply?', a: 'The official formula is defined for air temperatures of 50°F (10°C) or below with winds above 3 mph. In milder or calmer conditions the effect is negligible and the actual temperature is used.' },
    ],
    keywords: ['wind chill calculator', 'wind chill chart', 'feels like temperature cold', 'wind chill factor', 'frostbite calculator', 'how cold does it feel', 'nws wind chill'],
  },
  {
    slug: 'dew-point-calculator',
    name: 'Dew Point Calculator',
    icon: '💧',
    widget: 'dewpoint',
    description: 'Calculate the dew point from temperature and relative humidity using the Magnus formula — the best single measure of how muggy the air feels. °F or °C, in your browser.',
    lead: 'Enter the temperature and humidity to get the dew point — the truest measure of how humid and muggy it feels.',
    how: 'The dew point is the temperature to which air must cool for water vapour to start condensing — dew, fog or clouds. The tool computes it from the temperature and relative humidity with the Magnus formula (Alduchov–Eskridge coefficients). Unlike relative humidity, the dew point maps directly to comfort, so it\'s what meteorologists watch for muggy conditions.',
    note: 'A dew point below 55°F (13°C) feels comfortable and dry; 60–65°F (16–18°C) starts to feel sticky; above 70°F (21°C) is oppressive and above 75°F (24°C) can be dangerous. It also tells you the overnight low can rarely fall below the dew point.',
    faqs: [
      { q: 'What is the dew point?', a: 'The temperature at which air becomes fully saturated and water vapour condenses into dew, fog or cloud. It\'s a direct measure of how much moisture is in the air — and how muggy it feels.' },
      { q: 'How is dew point calculated?', a: 'From temperature and relative humidity using the Magnus formula. This tool uses the Alduchov–Eskridge coefficients (a = 17.625, b = 243.04) for accuracy across normal weather temperatures.' },
      { q: 'Is dew point better than humidity for comfort?', a: 'Yes. Relative humidity depends on temperature and can be misleading; the dew point is an absolute measure. A 70°F dew point feels muggy whether the air temperature is 75°F or 95°F.' },
      { q: 'What dew point feels comfortable?', a: 'Below about 55°F (13°C) feels pleasant and dry; 60–65°F is noticeably humid; above 70°F (21°C) is oppressive. Many people find a dew point around 50–55°F ideal.' },
      { q: 'Can the dew point be higher than the temperature?', a: 'No — the dew point can equal the air temperature (that\'s 100% humidity, saturation) but never exceed it. If they\'re equal, expect fog or dew.' },
    ],
    keywords: ['dew point calculator', 'dewpoint calculator', 'dew point from humidity', 'temperature dew point', 'muggy calculator', 'magnus formula dew point', 'relative humidity to dew point'],
  },
  {
    slug: 'relative-humidity-calculator',
    name: 'Relative Humidity Calculator',
    icon: '🌫️',
    widget: 'humidity',
    description: 'Calculate relative humidity from the air temperature and dew point using the Magnus saturation formula. °F or °C, in your browser.',
    lead: 'Enter the air temperature and dew point to get the relative humidity as a percentage.',
    how: 'Relative humidity is the amount of water vapour in the air compared with the most it could hold at that temperature. The tool derives it from the temperature and dew point using the Magnus saturation-vapour-pressure relationship: it compares the saturation pressure at the dew point with that at the air temperature. When the two are equal, the air is saturated at 100%.',
    note: 'Because warm air holds much more moisture, the same amount of water gives a lower relative humidity when it\'s hot and a higher one when it\'s cold — which is why humidity climbs overnight as the temperature falls toward the dew point.',
    faqs: [
      { q: 'How do I calculate relative humidity?', a: 'From the air temperature and dew point: RH = 100 × saturation pressure at the dew point ÷ saturation pressure at the air temperature, using the Magnus formula. This tool does the calculation for you.' },
      { q: 'What is relative humidity?', a: 'The ratio, as a percentage, of the water vapour currently in the air to the maximum the air can hold at that temperature. 100% means the air is saturated; 50% means it holds half its capacity.' },
      { q: 'Why does humidity change with temperature?', a: 'Warmer air can hold far more moisture, so for a fixed amount of water the relative humidity falls as the air warms and rises as it cools. That\'s why relative humidity is often highest at dawn.' },
      { q: 'What is a comfortable relative humidity?', a: 'Indoors, roughly 30–50% is comfortable and healthy. Much higher feels clammy and encourages mould; much lower dries out skin and airways. Outdoor comfort depends more on the dew point than on relative humidity.' },
      { q: 'Can relative humidity be over 100%?', a: 'Briefly and locally, air can be slightly supersaturated, but for practical purposes it caps at 100% — the point of saturation, where excess vapour condenses into dew, fog or cloud.' },
    ],
    keywords: ['relative humidity calculator', 'humidity from dew point', 'calculate humidity', 'temperature dew point humidity', 'rh calculator', 'humidity percentage calculator'],
  },
  {
    slug: 'feels-like-temperature',
    name: 'Feels Like Temperature Calculator',
    icon: '🌡️',
    widget: 'feelslike',
    description: 'Calculate the "feels like" (apparent) temperature from temperature, humidity and wind — heat index when warm, wind chill when cold. °F or °C, in your browser.',
    lead: 'Enter the temperature, humidity and wind speed to get the apparent "feels like" temperature.',
    how: 'The apparent temperature is what the weather actually feels like on your skin, combining humidity and wind. The tool applies the heat index in warm conditions (80°F/27°C and above, where humidity slows your cooling) and wind chill in cold conditions (50°F/10°C and below, where wind speeds heat loss). In between, the air temperature itself is the best guide.',
    note: 'This is the single number weather apps show as "feels like." It doesn\'t include direct sunshine, which can add up to about 15°F (8°C) to the warm-weather figure. Use it to judge how to dress and how hard to exert yourself.',
    faqs: [
      { q: 'What does "feels like" temperature mean?', a: 'The apparent temperature — how hot or cold the weather feels once humidity and wind are taken into account, rather than the raw thermometer reading. It\'s the heat index when it\'s warm and the wind chill when it\'s cold.' },
      { q: 'How is the feels-like temperature calculated?', a: 'By choosing the right index for the conditions: the heat index (temperature + humidity) at 80°F/27°C and above, and wind chill (temperature + wind) at 50°F/10°C and below. In mild weather the actual temperature is used.' },
      { q: 'Why does it feel hotter than the temperature?', a: 'High humidity stops sweat evaporating, so your body can\'t shed heat — the air feels hotter than it is. The heat index captures this; the muggier it is, the bigger the gap.' },
      { q: 'Why does it feel colder than the temperature?', a: 'Wind carries away the warm air next to your skin, speeding heat loss, so a windy cold day feels colder. Wind chill measures that effect.' },
      { q: 'Does the feels-like temperature include the sun?', a: 'No — like the heat index and wind chill it assumes shade. Standing in direct sun can feel significantly hotter than the calculated value.' },
    ],
    keywords: ['feels like temperature calculator', 'apparent temperature calculator', 'real feel temperature', 'feels like calculator', 'temperature humidity wind calculator', 'perceived temperature'],
  },
  {
    slug: 'wet-bulb-temperature',
    name: 'Wet Bulb Temperature Calculator',
    icon: '🌡️',
    widget: 'wetbulb',
    description: 'Calculate the wet-bulb temperature from air temperature and humidity using Stull\'s formula — the limit of evaporative cooling and a key heat-survival measure. In your browser.',
    lead: 'Enter the temperature and humidity to get the wet-bulb temperature — the true limit of how much the body can cool by sweating.',
    how: 'The wet-bulb temperature is the lowest temperature reachable by evaporating water into the air — the reading of a thermometer wrapped in a wet cloth. It sets the hard limit on how much your body can cool itself by sweating. The tool uses Stull\'s (2011) empirical formula, accurate from the temperature and relative humidity at normal sea-level pressure.',
    note: 'A sustained wet-bulb temperature of 35°C (95°F) is widely cited as the theoretical limit of human survival — at that point sweat can\'t cool you even at rest, whatever you do. Real danger begins well below that during exertion. Stull\'s formula is valid from −20 to 50°C and 5–99% humidity at sea level, and isn\'t a substitute for official heat-health warnings.',
    faqs: [
      { q: 'What is wet-bulb temperature?', a: 'The lowest temperature achievable by evaporating water into the air — literally the reading of a wet-cloth-wrapped thermometer. It combines heat and humidity into the limit of evaporative (sweat) cooling.' },
      { q: 'Why is a 35°C wet-bulb dangerous?', a: 'At a wet-bulb temperature of 35°C (95°F), the air is so warm and humid that sweat can no longer evaporate to cool you — body temperature rises even at rest in the shade. It\'s regarded as the theoretical limit of human survivability.' },
      { q: 'How is wet-bulb temperature calculated?', a: 'This tool uses Stull\'s (2011) formula, which estimates the wet-bulb temperature from air temperature and relative humidity at sea-level pressure, accurate to within about 1°C over normal conditions.' },
      { q: 'How is wet-bulb different from the heat index?', a: 'The heat index is a "feels like" temperature scaled to human perception; the wet-bulb temperature is a physical limit of cooling. Wet-bulb is the better measure of true heat danger, especially for extreme humid heat.' },
      { q: 'What wet-bulb temperature is safe?', a: 'Below about 25°C (77°F) is generally safe; 28–31°C limits safe exertion; above 32°C is dangerous even with rest, and 35°C is the survivability limit. These thresholds shift with acclimatisation, age and health.' },
    ],
    keywords: ['wet bulb temperature calculator', 'wet bulb calculator', 'wet bulb globe temperature', 'heat survival calculator', 'wbt calculator', 'stull wet bulb', '35 wet bulb'],
  },
  {
    slug: 'beaufort-scale-calculator',
    name: 'Beaufort Wind Scale Calculator',
    icon: '💨',
    widget: 'beaufort',
    description: 'Convert a wind speed (mph, km/h, knots or m/s) to its Beaufort force number and description, from calm to hurricane force. In your browser.',
    lead: 'Enter a wind speed in any unit to get its Beaufort force number, name and the effects you\'d see.',
    how: 'The Beaufort scale relates wind speed to what you can observe — smoke, leaves, branches, whole trees, structural damage. The tool converts your wind speed to miles per hour and matches it to the Beaufort force (0 to 12), giving the descriptive name and typical effects on land, based on the National Weather Service / WMO scale.',
    note: 'Devised by Francis Beaufort in 1805 for sailors without instruments, the scale is still used in marine and land forecasts. Force 12 (hurricane force) is open-ended, beginning at 73 mph (64 knots) with no upper limit.',
    faqs: [
      { q: 'What is the Beaufort scale?', a: 'A 0–12 scale relating wind speed to observable effects, from Force 0 (calm, smoke rises straight up) to Force 12 (hurricane force, devastation). It lets you estimate wind strength without instruments.' },
      { q: 'What Beaufort force is a gale?', a: 'Force 8 is a gale (39–46 mph), when twigs break off trees and walking is difficult. Force 9 is a severe gale, and Force 10 a storm. Force 12 is hurricane force at 73 mph and above.' },
      { q: 'How do I convert wind speed to Beaufort?', a: 'Match the speed to the scale\'s bands: for example 19–24 mph is Force 5 (fresh breeze), 25–31 mph is Force 6 (strong breeze). Enter any speed and unit and the tool identifies the force.' },
      { q: 'What wind speed is dangerous?', a: 'Force 7 (near gale, 32+ mph) makes walking hard; Force 8–9 (gale, 39+ mph) can break branches and cause minor damage; Force 10+ (storm, 55+ mph) uproots trees and damages buildings.' },
      { q: 'Is Force 12 the top of the scale?', a: 'Yes — Force 12 (hurricane force) is the highest and is open-ended, starting at 73 mph (64 knots) with no upper bound. Extended scales to Force 17 exist for typhoons but aren\'t part of the standard scale.' },
    ],
    keywords: ['beaufort scale calculator', 'beaufort wind scale', 'wind speed to beaufort', 'beaufort number calculator', 'wind force calculator', 'beaufort scale chart'],
  },
  {
    slug: 'cloud-base-calculator',
    name: 'Cloud Base Calculator',
    icon: '☁️',
    widget: 'cloudbase',
    description: 'Estimate the base height of cumulus clouds from the surface temperature and dew point, using the pilot\'s convergence rule. °F or °C, in your browser.',
    lead: 'Enter the surface temperature and dew point to estimate the height of the cloud base above ground.',
    how: 'As air rises it cools at about 5.4°F per 1,000 ft while its dew point falls at about 1°F per 1,000 ft, so the two converge at roughly 4.4°F per 1,000 ft. The height where they meet is where cloud forms. The tool applies this rule — cloud base ≈ (temperature − dew point in °F) ÷ 4.4 × 1,000 feet — to estimate the base of fair-weather cumulus.',
    note: 'This is a pilot\'s rule of thumb, best for convective (cumulus) cloud on a well-mixed afternoon. It doesn\'t apply to layered stratus, fog, or frontal cloud, and it\'s an estimate — not a substitute for aviation weather reports (METARs/TAFs). Roughly, 400 ft of base for every 1°C of temperature–dew point spread.',
    faqs: [
      { q: 'How do I estimate cloud base height?', a: 'Use the spread between the surface temperature and dew point: cloud base (feet AGL) ≈ (T − dew point in °F) ÷ 4.4 × 1,000, or about 400 ft per °C of spread. A 77°F temperature and 59°F dew point gives roughly 4,000 ft.' },
      { q: 'Why does temperature and dew point predict cloud base?', a: 'Rising air cools faster than its dew point drops, so they converge with height. Where they meet, the air saturates and cloud forms — that\'s the cloud base. A bigger spread means a higher base; a small spread means low cloud or fog.' },
      { q: 'What is the temperature–dew point spread?', a: 'The difference between the air temperature and the dew point. A large spread means dry air and high cloud bases; a spread near zero means the air is near saturation, with low cloud, mist or fog likely.' },
      { q: 'How accurate is this cloud base estimate?', a: 'It\'s a good rule of thumb for fair-weather cumulus on a well-mixed day, typically within a few hundred feet. It doesn\'t apply to stratus, frontal or orographic cloud, and pilots should use official aviation weather for flight planning.' },
      { q: 'Does a small spread mean fog?', a: 'A temperature–dew point spread near zero at the surface means the air is saturated there, so mist or fog is likely. As the spread widens, any cloud base rises accordingly.' },
    ],
    keywords: ['cloud base calculator', 'cloud base height calculator', 'temperature dew point spread', 'cumulus cloud base', 'cloud base estimate', 'dew point cloud base', 'lifted condensation level'],
  },
];

export const getWeatherTool = (slug: string) => WEATHER_TOOLS.find((t) => t.slug === slug);
