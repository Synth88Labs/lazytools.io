/** Date & Time tools registry. */

export interface TimeToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'epoch' | 'age' | 'date-diff' | 'date-add' | 'week-number' | 'timezone' | 'retail-454';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const TIME_TOOLS: TimeToolDef[] = [
  {
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    icon: '⏱️',
    description:
      'Convert Unix timestamps (epoch seconds or milliseconds) to human-readable dates and back — with automatic unit detection, local time and UTC. Runs in your browser.',
    lead: 'Epoch to date and back — paste 1720224000 or 1720224000000, get the human-readable moment in your timezone and UTC instantly.',
    widget: 'epoch',
    how: 'Unix time counts seconds since 00:00:00 UTC on 1 January 1970 (the "epoch"), ignoring leap seconds. The converter auto-detects the unit: values above 100 billion are treated as milliseconds — the JavaScript convention — since 100 billion seconds wouldn\'t occur until the year 5138. Conversion happens with the browser\'s own Date engine, in your local timezone and UTC side by side.',
    note: 'The classic debugging trap: a timestamp that renders as 1970 means you passed seconds where milliseconds were expected (or a date 50,000 years out means the reverse). The auto-detection here shows which unit was assumed so you can spot exactly that mismatch.',
    faqs: [
      { q: 'What is Unix time?', a: 'The number of seconds elapsed since 00:00:00 UTC on 1 January 1970, excluding leap seconds. It is the near-universal machine representation of a moment in time — databases, APIs and logs all speak it.' },
      { q: 'Seconds or milliseconds — how do I tell?', a: 'Length: current Unix time is 10 digits in seconds and 13 in milliseconds. JavaScript uses milliseconds; most Unix tools and APIs use seconds. This converter auto-detects and tells you which it assumed.' },
      { q: 'What is the year 2038 problem?', a: 'Systems storing Unix time as a signed 32-bit integer overflow on 19 January 2038 at 03:14:07 UTC. Modern 64-bit systems are unaffected — their range extends billions of years.' },
      { q: 'Does Unix time include leap seconds?', a: 'No — by definition every Unix day is exactly 86,400 seconds. When a leap second occurs, Unix time repeats or smears a second rather than counting it. For civil timekeeping this almost never matters.' },
      { q: 'Is the timestamp converted locally?', a: 'Yes — the browser\'s own Date engine does the conversion on your device. Nothing you paste is transmitted.' },
    ],
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'epoch to date', 'unix time'],
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    icon: '🎂',
    description:
      'Calculate exact age from a date of birth — years, months and days, plus total days lived and days until the next birthday. Client-side and private.',
    lead: 'Exact age in years, months and days — plus total days lived and a countdown to the next birthday.',
    widget: 'age',
    how: 'The calculation walks the calendar rather than dividing day counts: full years from birthday to birthday, then full months, then leftover days — the same way age is legally reckoned. That handles unequal month lengths and leap years correctly: someone born 29 February completes a year of age on 1 March in non-leap years in most jurisdictions.',
    note: 'Dividing days-lived by 365.25 gives a decimal "age" that drifts a day or two around birthdays — fine for estimates, wrong for forms and eligibility rules, which use the calendar walk this tool performs.',
    faqs: [
      { q: 'How is exact age calculated?', a: 'Calendar-style: count complete years first (has this year\'s birthday passed?), then complete months, then remaining days. This matches how ages are used legally and administratively.' },
      { q: 'What about leap-year birthdays (29 February)?', a: 'In common years the birthday is generally observed on 1 March for legal purposes (e.g. UK law), though some jurisdictions use 28 February. This calculator counts the year as complete once the calendar reaches 1 March.' },
      { q: 'Why does "total days" not equal years × 365?', a: 'Leap years: roughly one year in four has 366 days. Thirty years of life spans about 10,957 days, not 10,950.' },
      { q: 'Can I calculate age at a date other than today?', a: 'Yes — set the "age at" date to anything: a form deadline, a school cutoff, a historical date.' },
      { q: 'Is my date of birth sent anywhere?', a: 'No — the calculation runs entirely in your browser. A birthdate is personal data; that is exactly why this tool is client-side.' },
    ],
    keywords: ['age calculator', 'exact age', 'age in days', 'how old am i', 'age from date of birth'],
  },
  {
    slug: 'days-between-dates',
    name: 'Days Between Dates Calculator',
    icon: '📅',
    description:
      'Count the days between two dates — total days, weekdays only, weeks + days, and the years/months/days breakdown. All computed locally.',
    lead: 'Pick two dates, get the gap four ways: total days, weekdays only, complete weeks, and the calendar years-months-days breakdown.',
    widget: 'date-diff',
    how: 'Total days are computed from UTC day numbers, immune to daylight-saving shifts that make naive millisecond subtraction land on 23- or 25-hour "days". The weekday count covers the span excluding the end date — the convention for counting working days until a deadline. The calendar breakdown counts complete years, then months, then days, handling unequal month lengths correctly.',
    note: 'Off-by-one is the classic trap: 1 July to 3 July is two days elapsed but three days touched. This tool reports elapsed days (end date excluded); add one if your use case counts both endpoints, as some contract-day conventions do. The weekday count also ignores public holidays — subtract those for your country manually.',
    faqs: [
      { q: 'Is the end date included in the count?', a: 'No — the tool counts elapsed days, so Monday to Friday of one week is 4 days (and 4 weekdays). If your context counts both endpoints inclusively, add one.' },
      { q: 'How are weekdays counted?', a: 'Every Monday–Friday in the span, excluding the end date. Public holidays are not subtracted — they vary by country and year, so check your local calendar for those.' },
      { q: 'Does daylight saving time affect the count?', a: 'Not here: dates are compared as calendar days via UTC day numbers, so 23- and 25-hour DST days still count as exactly one day.' },
      { q: 'Can I count days between dates years apart?', a: 'Yes — any range the browser date picker accepts, with leap years handled by the calendar arithmetic. Century-spanning ranges are fine.' },
      { q: 'Are my dates uploaded?', a: 'No — the arithmetic runs on your device. Nothing is transmitted or logged.' },
    ],
    keywords: ['days between dates', 'date difference calculator', 'weekdays between dates', 'working days calculator', 'date duration'],
  },
  {
    slug: 'date-add-subtract',
    name: 'Date Add / Subtract Calculator',
    icon: '➕',
    description:
      'Add or subtract days, weeks, months or years from any date — "what is 90 days from today?" answered instantly, with correct month-end handling. Client-side.',
    lead: '"What date is 90 days from today?" — pick a start date, add or subtract days, weeks, months or years, and see the result with its weekday.',
    widget: 'date-add',
    how: 'Days and weeks are exact arithmetic. Months and years follow the calendar convention: the day-of-month is preserved where possible and clamped to the month\'s end where not — 31 January + 1 month gives 28 (or 29) February, not 2 or 3 March. That matches how billing cycles, notice periods and subscriptions roll dates.',
    note: 'The month-clamping rule is where hand-counting goes wrong most: "three months from 30 November" is 28 February, not 2 March. Deadlines defined in days (e.g. "within 30 days") and in months ("one month\'s notice") can differ by a day or three — check which your contract actually says.',
    faqs: [
      { q: 'What does adding a month to 31 January give?', a: 'The last day of February — the 28th or 29th. The convention preserves the day-of-month and clamps to the target month\'s end when it doesn\'t exist, which is how billing and legal date rolls work.' },
      { q: 'How do I subtract days instead of adding?', a: 'Switch the direction toggle to "before" — the same arithmetic runs backwards, e.g. 45 days before a deadline for a reminder date.' },
      { q: 'Is "30 days" the same as "one month"?', a: 'No — months are 28 to 31 days long, so a 30-day deadline and a one-month deadline diverge for most start dates. Use the unit your document specifies.' },
      { q: 'Does the result account for leap years?', a: 'Yes — the browser\'s calendar arithmetic knows every leap day. Adding one year to 29 February 2024 clamps to 28 February 2025.' },
      { q: 'Does this run locally?', a: 'Yes — pure calendar arithmetic in your browser; nothing is sent anywhere.' },
    ],
    keywords: ['date calculator', '90 days from today', 'add days to date', 'date plus days', 'subtract days from date'],
  },
  {
    slug: 'week-number',
    name: 'Week Number Calculator',
    icon: '🗓️',
    description:
      'Find the ISO 8601 week number of any date — the standard used across European business planning — with the week\'s Monday-to-Sunday range. Local computation.',
    lead: 'Any date → its ISO 8601 week number, with the week\'s exact Monday–Sunday range. Today\'s week number shown by default.',
    widget: 'week-number',
    how: 'ISO 8601 weeks start on Monday, and week 1 is the week containing the year\'s first Thursday (equivalently, the week containing 4 January). This means the days around New Year can belong to the other year\'s week numbering: 29–31 December can fall in week 1 of the next year, and 1–3 January in week 52 or 53 of the previous one. Years have 52 or 53 ISO weeks.',
    note: 'ISO is not the only convention: the US system starts weeks on Sunday and calls the week containing 1 January "week 1", so a US planner and a European one can disagree by one on the same date. This tool computes the ISO standard — the one meant when a supplier says "delivery in week 34".',
    faqs: [
      { q: 'How is week 1 of a year defined?', a: 'Under ISO 8601, week 1 is the week (Monday–Sunday) containing the year\'s first Thursday — equivalently the week containing 4 January. 1 January can therefore sit in week 52/53 of the previous year.' },
      { q: 'Can a year have 53 weeks?', a: 'Yes — years starting on a Thursday, and leap years starting on a Wednesday, have 53 ISO weeks. It happens roughly every 5–6 years; 2026 has 53.' },
      { q: 'Why does my US calendar show a different week number?', a: 'The US convention starts weeks on Sunday and numbers the week containing 1 January as week 1. The two systems disagree for part of most years. European business and manufacturing use ISO.' },
      { q: 'What day does an ISO week start?', a: 'Monday, always. The tool shows each week\'s full Monday-to-Sunday date range so there is no ambiguity.' },
      { q: 'Is the date I enter transmitted?', a: 'No — the week number is computed in your browser with a few lines of calendar arithmetic.' },
    ],
    keywords: ['week number', 'iso week number', 'what week is it', 'current week number', 'calendar week'],
  },
  {
    slug: 'timezone-converter',
    name: 'Time Zone Converter',
    icon: '🌍',
    description:
      'Convert a time between world time zones — meeting-friendly, DST-aware via the browser\'s IANA timezone database, with UTC offsets shown. No server involved.',
    lead: '9:00 in New York is what time in Kathmandu? Pick a time and two zones — DST rules applied automatically from the browser\'s own timezone database.',
    widget: 'timezone',
    how: 'The browser ships the full IANA time zone database — the canonical registry of every zone\'s UTC offset and daylight-saving rules, past and future. The converter resolves your chosen wall-clock time in the source zone to an absolute instant, then renders that instant in the target zone. DST transitions, half-hour offsets (India, +5:30) and 45-minute offsets (Nepal, +5:45) are all handled by the same database your OS clock uses.',
    note: 'The classic scheduling failure is converting the offset instead of the moment: "New York is UTC−5" is only true in winter — it\'s UTC−4 under daylight saving. Because two regions change DST on different dates, the gap between them shifts twice a year; always convert a specific date\'s time, never a remembered offset.',
    faqs: [
      { q: 'Does this handle daylight saving time?', a: 'Yes — automatically. The browser\'s IANA database knows each zone\'s DST rules and transition dates, so converting a July time and a January time between the same two zones can correctly give different gaps.' },
      { q: 'Why do some zones differ by 30 or 45 minutes?', a: 'Not all offsets are whole hours: India is UTC+5:30, Iran +3:30, and Nepal +5:45. The IANA database encodes these exactly, and the converter shows the resolved offsets so you can verify.' },
      { q: 'What is the IANA time zone database?', a: 'The open registry (also called tz or zoneinfo) of the world\'s time zone rules, maintained under IANA and used by every major operating system and programming language. Zones are named Region/City, like Asia/Kolkata.' },
      { q: 'Which zone should I store times in?', a: 'The engineering convention: store instants in UTC, convert to local zones only for display. That way a stored time never shifts meaning when DST rules change.' },
      { q: 'Is anything sent to a server?', a: 'No — the timezone database ships inside your browser, so conversion is entirely local and even works offline.' },
    ],
    keywords: ['time zone converter', 'timezone converter', 'utc to ist', 'est to gmt', 'world clock converter'],
  },
  {
    slug: '4-5-4-retail-calendar',
    name: '4-5-4 Retail Calendar',
    icon: '🛍️',
    description:
      'Convert any date to its NRF 4-5-4 retail calendar period — fiscal year, quarter, retail month and week — or view a full fiscal year\'s 4-5-4 breakdown. Computed in your browser.',
    lead: 'What retail week is today? Map any date to its NRF 4-5-4 fiscal year, quarter, month and week — or lay out a whole retail year, 53-week years included.',
    widget: 'retail-454',
    how: 'The 4-5-4 calendar is the National Retail Federation standard that lets retailers compare like-for-like periods: the year is split into four 13-week quarters, each quarter into months of 4, 5 and 4 weeks, so every retail month ends on the same weekday and contains the same number of weekends year over year. This tool computes it from first principles — retail weeks run Sunday–Saturday, the retail year ends on the Saturday nearest 31 January, and quarters map to Feb-Mar-Apr, May-Jun-Jul, Aug-Sep-Oct and Nov-Dec-Jan. No lookup table is shipped; the dates are derived, so it works for any year.',
    note: '52 weeks is only 364 days, so the calendar drifts a day a year against the Gregorian one. When the 52-week layout would leave four or more days of January uncovered, a 53rd week is added to the final retail month (January), making that year 53 weeks — most recently fiscal 2012, 2017 and 2023. This tool flags those years automatically. Note the 4-5-4 calendar is a planning convention, not a legal fiscal year: many retailers use it, but some adopt 4-4-5 or their own variant, so confirm which your organisation follows.',
    faqs: [
      { q: 'What is the 4-5-4 retail calendar?', a: 'A planning calendar from the National Retail Federation that divides the year into four quarters of 13 weeks, each split into retail months of 4, 5 and 4 weeks. Because every month always ends on a Saturday and holds a fixed number of weekends, sales this March compare cleanly to last March — which a Gregorian calendar, with its shifting weekday and weekend counts, can\'t guarantee.' },
      { q: 'When does the retail year start?', a: 'The retail year ends on the Saturday nearest to 31 January and begins the following Sunday — so it starts on the Sunday closest to 1 February. Fiscal 2026, for example, runs Sunday 1 February 2026 to Saturday 30 January 2027.' },
      { q: 'What is a 53-week year?', a: 'Fifty-two seven-day weeks is 364 days, one short of a year, so the calendar slips a day annually. Roughly every five to six years — when the 52-week layout would leave four or more days of January uncovered — a 53rd week is added to the last retail month to realign. Recent 53-week years are fiscal 2012, 2017 and 2023; the tool marks them automatically.' },
      { q: 'Which months are the 5-week months?', a: 'In the standard 4-5-4 pattern the middle month of each quarter has five weeks: March, June, September and December. In a 53-week year January (the final retail month) also becomes five weeks, so the fourth quarter reads 4-5-5.' },
      { q: 'How is 4-5-4 different from 4-4-5?', a: 'They shuffle where the 5-week month sits in each quarter. 4-5-4 (the NRF default) puts it in the middle; 4-4-5 puts it at the end. Both give 13-week quarters and 52/53-week years — pick the one your finance team standardised on. This tool computes the NRF 4-5-4 variant.' },
      { q: 'Is this calculated locally?', a: 'Yes — the periods are derived from the 4-5-4 rules in your browser, with no lookup table and no server call. It works offline and for any fiscal year you enter.' },
    ],
    keywords: ['4-5-4 calendar', 'retail calendar', 'nrf calendar', 'fiscal calendar 4-5-4', 'retail week number', '454 calendar', 'retail fiscal year'],
  },
];
