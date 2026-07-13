/** Travel & Trips calculator registry. One entry drives a /travel/ page. */

export interface TravelToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'distance' | 'flighttime' | 'layover' | 'jetlag' | 'tip' | 'roadtrip' | 'budget' | 'luggage' | 'timezone' | 'sdt';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const TRAVEL_TOOLS: TravelToolDef[] = [
  {
    slug: 'flight-distance-calculator',
    name: 'Flight Distance Calculator',
    icon: '🛫',
    widget: 'distance',
    description: 'Calculate the great-circle distance between two cities or airports in km, miles and nautical miles — with the bearing and a rough flight time, on a live world map. In your browser.',
    lead: 'Pick two cities (or enter coordinates) to get the great-circle distance, the compass bearing between them, and a rough flight time — drawn on a world map.',
    how: 'The shortest distance between two points on the globe follows a great circle. From each place\'s latitude and longitude the tool applies the haversine formula on a spherical Earth (mean radius 6,371 km) to get the distance, and computes the initial compass bearing you\'d set off on. It also estimates a rough flight time — distance divided by a typical jetliner cruise speed (~830 km/h) plus about 30 minutes for taxi, climb, descent and approach.',
    note: 'This is the great-circle (straight-line) distance — the theoretical shortest path. Actual flights are longer because they follow airways, avoid restricted airspace and ride the winds, and the flight-time figure is an approximation that ignores head- and tail-winds. Use it for planning and comparison, not exact scheduling.',
    faqs: [
      { q: 'How is flight distance calculated?', a: 'By the great-circle distance — the shortest path over a spherical Earth — using the haversine formula on the two points\' latitude and longitude with a mean Earth radius of 6,371 km. It\'s the same method aviation and mapping tools use for straight-line distance.' },
      { q: 'Why is the actual flight longer than this distance?', a: 'Aircraft follow published airways and air-traffic routing, detour around restricted or weather-affected airspace, and route to catch tailwinds or avoid headwinds. The great-circle distance is the shortest possible path, so real routes are a bit longer.' },
      { q: 'What is a great-circle distance?', a: 'The shortest distance between two points on a sphere, measured along the circle whose centre is the centre of the Earth. On a flat map it looks curved, which is why long flights appear to arc toward the poles.' },
      { q: 'How accurate is the distance?', a: 'The haversine formula assumes a perfect sphere, so it\'s within about 0.5% of the true (ellipsoidal) distance — plenty accurate for travel planning. For survey-grade geodesy you\'d use the Vincenty or Karney method on the WGS-84 ellipsoid.' },
      { q: 'What is the bearing?', a: 'The initial compass direction (0° = north, 90° = east) you\'d head to follow the great circle. On a long route the bearing changes along the way, which is why it\'s labelled the "initial" bearing.' },
    ],
    keywords: ['flight distance calculator', 'great circle distance calculator', 'distance between two coordinates', 'distance between airports', 'haversine calculator', 'as the crow flies distance', 'lat long distance calculator'],
  },
  {
    slug: 'flight-time-calculator',
    name: 'Flight Time Calculator',
    icon: '✈️',
    widget: 'flighttime',
    description: 'Estimate how long a flight takes from the distance and a cruise speed, including taxi, climb and descent time. In km or miles, in your browser.',
    lead: 'Enter a distance and a cruise speed to estimate the flight time — the cruise portion plus taxi, climb, descent and approach.',
    how: 'Flight time is roughly the distance divided by the aircraft\'s cruise speed, plus a fixed overhead for the parts of the journey that aren\'t cruise: taxiing out and in, the climb to altitude and the descent and approach. The tool uses a typical jetliner cruise of about 830 km/h (515 mph) by default and adds around 30 minutes of overhead, and shows both the cruise-only time and the estimated total.',
    note: 'Real ground speed swings by 100 km/h or more with head- and tail-winds — the jet stream is why an eastbound flight can be an hour shorter than the same route westbound. Treat this as a ballpark; airline schedules build in buffers and reflect the actual winds and routing.',
    faqs: [
      { q: 'How do I estimate flight time?', a: 'Divide the distance by the cruise speed, then add about 30 minutes for taxi, climb, descent and approach. For 5,000 km at 830 km/h that\'s about 6 hours cruise plus overhead — roughly 6½ hours total.' },
      { q: 'How fast does a passenger jet fly?', a: 'A typical airliner (737/A320 family) cruises around Mach 0.78 — about 830–840 km/h (515–520 mph) true airspeed. Long-haul widebodies are similar. Ground speed varies with wind.' },
      { q: 'Why do flight times differ by direction?', a: 'Because of winds aloft, especially the jet stream. Flying with a tailwind (often eastbound at mid-latitudes) is faster; flying into a headwind is slower — so the same route can take noticeably longer one way than the other.' },
      { q: 'Does this include taxi and boarding?', a: 'It adds roughly 30 minutes for taxi, climb, descent and approach — the non-cruise flying time. It does not include boarding, pushback waits or gate delays, which vary by airport and airline.' },
      { q: 'How accurate is the estimate?', a: 'It\'s a rough guide. It ignores the actual winds, the specific routing, and airport-specific taxi times, all of which airline schedules account for. Use it to compare routes, not to plan a tight connection.' },
    ],
    keywords: ['flight time calculator', 'flight duration calculator', 'how long is the flight', 'estimate flight time', 'flight time from distance', 'travel time calculator', 'air travel time'],
  },
  {
    slug: 'layover-calculator',
    name: 'Layover & Connection Calculator',
    icon: '🔁',
    widget: 'layover',
    description: 'Work out your layover length between two flights and check it against a typical minimum connection time. In your browser.',
    lead: 'Enter your arrival and next-departure times to see how long the layover is — and whether it clears a typical minimum connection time.',
    how: 'The layover is simply the gap between when your first flight arrives and your next one departs. The tool works out that gap (handling connections that spill past midnight) and compares it to a typical minimum connection time for the type of connection — domestic-to-domestic, international, or a mix where you re-clear security and immigration and may re-check bags.',
    note: 'Minimum connection times are set per airport and can be much longer at big hubs or when changing terminals; these defaults are rough safety floors. Crucially, on a single ticket the airline must rebook you if a delay makes you miss a legal connection — on separate tickets it won\'t, so leave a generous buffer when self-connecting.',
    faqs: [
      { q: 'How much layover time do I need?', a: 'As a rough floor, about 45 minutes for a domestic-to-domestic connection and 90 minutes or more for international connections where you re-clear security or immigration — but big hubs and terminal changes need more. When in doubt, give yourself extra.' },
      { q: 'What is a minimum connection time?', a: 'The shortest gap an airport/airline considers a valid connection, accounting for the walk between gates, security and (for international) immigration and bag transfer. Airlines won\'t sell a single-ticket connection shorter than it.' },
      { q: 'Is a 1-hour layover enough?', a: 'Often yes for a domestic connection at a familiar airport, but it can be tight internationally or when changing terminals. If your flights are on one ticket you\'re protected against a missed connection; on separate tickets, an hour is risky.' },
      { q: 'What happens if I miss a connection?', a: 'On a single ticket the airline rebooks you on the next available flight at no charge (and covers care for long delays under some rules). On separate tickets you bear the cost of a new flight — the reason to leave more time when self-connecting.' },
      { q: 'Does the calculator handle overnight layovers?', a: 'Yes — tick "next day" when the departure is after midnight relative to the arrival, and it adds the 24 hours so the layover comes out right.' },
    ],
    keywords: ['layover calculator', 'connection time calculator', 'minimum connection time', 'how long is my layover', 'is my layover enough', 'flight connection calculator', 'airport transfer time'],
  },
  {
    slug: 'jet-lag-calculator',
    name: 'Jet Lag Calculator',
    icon: '😴',
    widget: 'jetlag',
    description: 'Estimate how long jet lag will take to shake off from the number of time zones you cross and the direction of travel. In your browser.',
    lead: 'Enter how many time zones you\'ll cross and which way you\'re flying for an estimate of how long adjustment takes — plus tips to ease it.',
    how: 'Jet lag comes from your body clock being out of step with local time. A widely-cited rule of thumb is that the body re-syncs at roughly one time zone per day. Because our internal clock naturally runs a little longer than 24 hours, going westward (lengthening the day) is usually easier than going eastward (shortening it), so the tool applies a slower rate — about 1½ days per zone — for eastward trips.',
    note: 'This is general guidance, not medical advice, and people vary widely — roughly a quarter of travellers find the opposite direction harder. Light exposure at the right time, shifting your schedule before departure, and adopting local meal and sleep times on arrival all help you adjust faster than the rule of thumb suggests.',
    faqs: [
      { q: 'How long does jet lag last?', a: 'A common rule of thumb is about one day of adjustment per time zone crossed, so a 6-hour shift takes roughly six days to fully clear — though many people function well sooner and good light and sleep habits speed it up.' },
      { q: 'Why is flying east worse than flying west?', a: 'Eastward travel shortens your day, forcing your body clock to advance, which is harder than delaying it. Since our natural circadian rhythm is slightly longer than 24 hours, westward travel (a longer day) aligns with it more easily.' },
      { q: 'How can I reduce jet lag?', a: 'Shift your sleep toward the destination\'s time a few days before you travel, get bright daylight at the right time (morning light after eastward flights, evening light after westward), adopt local meal and sleep times on arrival, and stay hydrated while limiting alcohol and late caffeine.' },
      { q: 'Does the number of time zones matter more than flight length?', a: 'Yes. Jet lag is driven by how many time zones you cross, not how many hours you fly. A long north–south flight within one time zone causes travel fatigue but little jet lag; a shorter east–west flight across several zones causes more.' },
      { q: 'Is this medical advice?', a: 'No. It\'s a general estimate based on widely-cited guidance (Cleveland Clinic, the Sleep Foundation and others). If jet lag seriously affects you or you have a health condition, speak to a healthcare professional.' },
    ],
    keywords: ['jet lag calculator', 'jet lag recovery time', 'time zones jet lag', 'how long does jet lag last', 'jet lag east vs west', 'travel fatigue calculator', 'time zone adjustment'],
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator (by Country)',
    icon: '🧾',
    widget: 'tip',
    description: 'Work out a restaurant tip and split the bill, with customary tipping guidance for countries around the world. In your browser.',
    lead: 'Enter your bill and tip percent to get the tip, total and per-person share — or pick a country to set a customary rate.',
    how: 'The tip is the bill multiplied by your chosen percentage, added on to give the total, then divided by the number of people splitting. Choosing a country fills in a customary restaurant tipping rate as a starting point — from 15–20% where tipping is expected, down to "not expected" in places where it isn\'t part of the culture.',
    note: 'Tipping is cultural and shifts over time. In many countries (often France, Italy, Brazil and the UAE) a service charge is already on the bill, so an extra tip is optional; in Japan and China tipping can even cause confusion. The country figures are guidance from travel-etiquette references, not fixed rules — read the bill and use judgement.',
    faqs: [
      { q: 'How much should I tip?', a: 'It depends on the country. In the US and Canada 15–20% is expected; in much of Europe rounding up or 5–10% is customary if service isn\'t included; in Japan and China tipping generally isn\'t expected. Pick a country in the tool for a customary starting point.' },
      { q: 'How do I calculate a tip?', a: 'Multiply the bill by the tip percentage (e.g. 18% = bill × 0.18), add it to the bill for the total, and divide by the number of people to split it. The tool does all three at once.' },
      { q: 'Do I tip if there\'s a service charge?', a: 'Usually no, or only a small extra. When a service charge (or "servizio"/"service compris") is already on the bill — common in France, Italy, Brazil and the UAE — an additional tip is optional and often just rounding up.' },
      { q: 'Which countries don\'t expect tips?', a: 'Japan and China traditionally don\'t (and tipping can be awkward), and in places like Australia, much of Europe and Scandinavia it\'s appreciated but not expected because staff are paid a full wage. The country notes in the tool spell this out.' },
      { q: 'Does the calculator convert currency?', a: 'No — it works in whatever currency you type, with no conversion and nothing sent anywhere. Enter the bill in local currency and it returns the tip and total in the same units.' },
    ],
    keywords: ['tip calculator', 'tip calculator by country', 'restaurant tip calculator', 'how much to tip', 'gratuity calculator', 'split the bill calculator', 'tipping guide by country'],
  },
  {
    slug: 'road-trip-calculator',
    name: 'Road Trip Time Calculator',
    icon: '🚗',
    widget: 'roadtrip',
    description: 'Estimate driving time and arrival for a road trip from the distance, your average speed and break time. In km or miles, in your browser.',
    lead: 'Enter the distance, your average speed and break time to get the total trip time, driving time and an estimated arrival.',
    how: 'Driving time is the distance divided by your average speed; add the total time you\'ll spend stopped — fuel, food, rest — for the full trip time. Give a departure time and the tool projects your arrival, rolling over past midnight if the drive is long. It works in kilometres or miles, matching the speed unit you choose.',
    note: 'The key is using a realistic average speed, not the speed limit. Towns, junctions, traffic, roadworks and fuel stops all pull the average down, so a motorway trip that seems like "120 km/h" often averages closer to 90. Estimate low and you\'ll arrive on time.',
    faqs: [
      { q: 'How do I calculate driving time?', a: 'Divide the distance by your average speed, then add your break time. 600 km at an average 100 km/h is 6 hours driving; add a 30-minute lunch stop for 6½ hours total.' },
      { q: 'What average speed should I use?', a: 'Use your realistic door-to-door average, which is well below the speed limit once you include towns, traffic, junctions and stops — often around 90 km/h (55 mph) for a mixed motorway trip, less for rural or urban routes.' },
      { q: 'Does it include rest and fuel stops?', a: 'Yes — enter your total expected break time and it\'s added to the driving time. A good habit is a short break every couple of hours, which also keeps you alert.' },
      { q: 'How is arrival time worked out?', a: 'It adds the total trip time (driving plus breaks) to your departure time, and if the drive runs past midnight it shows the arrival with a "+1 day" marker so overnight trips read correctly.' },
      { q: 'Can I use miles instead of kilometres?', a: 'Yes — switch the distance unit to miles and enter your average speed in mph. All the results then use the same unit.' },
    ],
    keywords: ['road trip calculator', 'driving time calculator', 'travel time calculator', 'how long to drive', 'trip time estimator', 'driving distance time', 'road trip planner time'],
  },
  {
    slug: 'travel-budget-calculator',
    name: 'Travel Budget Calculator',
    icon: '💰',
    widget: 'budget',
    description: 'Break a trip budget down into per-day and per-person spending, with a typical category split. In your browser.',
    lead: 'Enter your total budget, trip length and number of travellers to see per-day and per-person spending — with a suggested category breakdown.',
    how: 'The tool divides your total budget by the number of days to give a daily figure, and by travellers for the per-person share, so you can sanity-check a trip before booking. It then splits the daily amount across the usual categories — accommodation, food, local transport, activities and extras — as a starting point you can adjust.',
    note: 'Amounts are in whatever currency you enter, with no conversion. The category split is only a typical shape — accommodation and food usually dominate, but a beach week and a city break spend very differently. Keep a contingency of about 10–15% for the things you can\'t predict.',
    faqs: [
      { q: 'How do I budget for a trip?', a: 'Start from a total you\'re comfortable with, divide by the number of days for a daily target, then split that across accommodation, food, transport, activities and extras. The tool does the arithmetic and suggests a split to adjust.' },
      { q: 'How much should I budget per day?', a: 'It depends entirely on the destination and style of travel. The tool shows your per-day and per-person figures from your total so you can compare them against typical costs for where you\'re going and adjust the trip or the budget.' },
      { q: 'What\'s a typical spending breakdown?', a: 'As a rough guide, accommodation is often the largest share (~35%), then food (~25%), with local transport, activities and shopping/extras making up the rest — but this varies a lot by destination and travel style.' },
      { q: 'Should I keep a contingency?', a: 'Yes — set aside roughly 10–15% for the unexpected: a pricier-than-planned meal, a last-minute ticket, a taxi when you\'re tired, or a currency swing. It keeps a small surprise from derailing the trip.' },
      { q: 'Does it convert currencies?', a: 'No. It works in whatever currency you type and never sends your figures anywhere. Budget in your home currency or the destination\'s — just keep it consistent.' },
    ],
    keywords: ['travel budget calculator', 'trip budget calculator', 'holiday budget planner', 'per day travel budget', 'vacation cost calculator', 'budget per person trip', 'travel spending calculator'],
  },
  {
    slug: 'luggage-size-calculator',
    name: 'Luggage Size & Volume Calculator',
    icon: '🧳',
    widget: 'luggage',
    description: 'Work out a bag\'s packing volume in litres and its linear dimensions, and check them against common carry-on and checked baggage limits. In your browser.',
    lead: 'Enter your bag\'s dimensions to get its volume in litres and linear total — and see whether it fits common cabin or checked-baggage limits.',
    how: 'A bag\'s capacity is length × width × height (in centimetres, ÷1,000 for litres), and airlines usually judge size by the linear total — the three dimensions added together. The tool computes both, in centimetres or inches, and compares the linear total against common reference limits: roughly 56 × 36 × 23 cm for a cabin bag and a 158 cm (62 in) linear total for checked baggage.',
    note: 'Baggage rules vary by airline and fare, and this checks size only, not weight (cabin bags are often capped around 7–10 kg and checked bags around 23 kg). Budget carriers like Ryanair and easyJet have their own, often smaller, cabin allowances — always confirm your specific airline\'s limits before you pack.',
    faqs: [
      { q: 'What size is a standard carry-on?', a: 'Commonly around 56 × 36 × 23 cm (22 × 14 × 9 in) on US full-service airlines, or the IATA guideline of roughly 55 × 40 × 20 cm. Budget and some international carriers allow less, so check your airline.' },
      { q: 'How many litres is my suitcase?', a: 'Multiply length × width × height in centimetres and divide by 1,000. A 55 × 40 × 20 cm cabin bag is 44 litres; the tool computes it for you in cm or inches.' },
      { q: 'What is the linear dimension of a bag?', a: 'The sum of its length, width and height. Airlines quote checked-bag limits this way — most commonly 158 cm (62 inches) total for standard checked baggage.' },
      { q: 'What is the checked baggage size limit?', a: 'A 158 cm (62 in) linear total is the widely-followed standard for a single checked bag, with a typical economy weight limit around 23 kg (50 lb). Premium cabins and some airlines allow more.' },
      { q: 'Does this check weight too?', a: 'No — it checks dimensions only. Weight limits are separate (often ~7–10 kg cabin, ~23 kg checked economy) and vary by airline and cabin, so weigh your bag and check your carrier\'s allowance as well.' },
    ],
    keywords: ['luggage size calculator', 'suitcase volume calculator', 'carry on size checker', 'baggage linear dimensions', 'litres suitcase calculator', 'checked baggage size', 'bag volume litres'],
  },
  {
    slug: 'time-zone-converter',
    name: 'Time Zone Converter',
    icon: '🕒',
    widget: 'timezone',
    description: 'Convert a time between UTC offsets and see whether it lands on the previous, same or next day — for scheduling calls and travel. In your browser.',
    lead: 'Enter a time and pick two UTC offsets to convert it, with a clear "same/next/previous day" note.',
    how: 'Every time zone is an offset from Coordinated Universal Time (UTC). To convert a clock time from one zone to another you add the difference between their offsets — for example UTC−5 to UTC+0 is +5 hours. The tool does that and, because adding hours can cross midnight, tells you whether the result is on the previous, same or next day. It works entirely with numeric offsets, so there\'s no location lookup — you choose the zones directly.',
    note: 'This uses fixed UTC offsets and does not know about daylight saving time, which shifts many zones by an hour for part of the year. For a specific date, check whether DST is active at either end and adjust the offset accordingly (for example New York is UTC−5 in winter but UTC−4 in summer).',
    faqs: [
      { q: 'How do I convert between time zones?', a: 'Add the difference in UTC offsets to the original time. From UTC−5 to UTC+1 is a +6-hour shift, so 09:00 becomes 15:00. If the result passes midnight, it moves to the next or previous day — this tool shows that automatically.' },
      { q: 'What is a UTC offset?', a: 'The number of hours a time zone is ahead of (+) or behind (−) Coordinated Universal Time. New York is UTC−5 (standard time), London UTC+0, Tokyo UTC+9. Some zones use half or quarter hours, like India at UTC+5:30.' },
      { q: 'Does this account for daylight saving time?', a: 'No — it uses fixed offsets. Many regions shift by an hour in summer (for example UTC−5 becomes UTC−4), so for a specific date pick the offset that is actually in effect there. Zones near the equator often don\'t use DST at all.' },
      { q: 'Why does the converted time show a different day?', a: 'Because adding or subtracting enough hours crosses midnight. Converting from a far-eastern zone to a far-western one can land you on the previous day, and vice versa — the tool labels the result "previous/same/next day" so you don\'t miscount.' },
      { q: 'How do I schedule a call across time zones?', a: 'Convert your proposed time into each participant\'s zone and check the day label so nobody is caught at 3 a.m. or on the wrong date. Entering the offsets directly keeps it simple; just confirm DST for the meeting\'s actual date.' },
    ],
    keywords: ['time zone converter', 'utc offset converter', 'convert time between zones', 'time difference calculator', 'world clock converter', 'meeting time zone calculator', 'utc time converter'],
  },
  {
    slug: 'speed-distance-time-calculator',
    name: 'Speed, Distance & Time Calculator',
    icon: '🚗',
    widget: 'sdt',
    description: 'Solve for speed, distance or travel time from the other two — distance = speed × time — in km or miles. For trip planning. In your browser.',
    lead: 'Enter any two of speed, distance and time, and the calculator works out the third.',
    how: 'Travel maths rests on one identity: distance = average speed × time. Rearranged, time = distance ÷ speed and speed = distance ÷ time. Pick which quantity to solve for, enter the other two, and the tool returns the answer — travel time is also shown in hours and minutes. Keep the units consistent (kilometres with km/h, or miles with mph); the toggle sets both together.',
    note: 'This assumes a constant average speed, so real journeys — with traffic, stops, junctions and speed limits — usually take longer than the ideal time. For a rough road-trip estimate, use a realistic average well below your top cruising speed, and add time for breaks.',
    faqs: [
      { q: 'How do I calculate travel time?', a: 'Divide the distance by your average speed: time = distance ÷ speed. 300 km at 60 km/h takes 5 hours. The calculator also breaks the answer into hours and minutes.' },
      { q: 'How do I calculate average speed?', a: 'Divide the distance by the time taken: speed = distance ÷ time. Covering 150 miles in 3 hours is an average of 50 mph. Note this is average speed, including any slow sections, not your top speed.' },
      { q: 'How do I calculate distance from speed and time?', a: 'Multiply them: distance = speed × time. Two hours at 80 km/h covers 160 km. Make sure the speed and time units match (km/h with hours, mph with hours).' },
      { q: 'Why does my real journey take longer?', a: 'The formula uses a steady average speed, but real trips include acceleration, braking, traffic, junctions, rest stops and varying limits. Use a conservative average speed and add buffer time for a realistic arrival estimate.' },
      { q: 'What units should I use?', a: 'Keep them consistent: kilometres with km/h, or miles with mph, and time in hours (use decimals — 1.5 for an hour and a half). The km/mi toggle sets the distance and speed units together so they always match.' },
    ],
    keywords: ['speed distance time calculator', 'travel time calculator', 'average speed calculator', 'distance calculator speed time', 'how long will my drive take', 'journey time calculator', 'time from speed and distance'],
  },
];

export const getTravelTool = (slug: string) => TRAVEL_TOOLS.find((t) => t.slug === slug);
