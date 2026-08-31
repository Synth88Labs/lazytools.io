/** Date & Time tools registry. */

export interface TimeToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'epoch' | 'age' | 'date-diff' | 'date-add' | 'week-number' | 'timezone' | 'business-days' | 'time-duration' | 'day-of-year' | 'weekday' | 'add-business-days';
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
      'Convert Unix timestamps (epoch seconds or milliseconds) to human-readable dates and back, with automatic unit detection, local time and UTC. Runs in your browser.',
    lead: 'Epoch to date and back, paste 1720224000 or 1720224000000, get the human-readable moment in your timezone and UTC instantly.',
    widget: 'epoch',
    how: 'Unix time counts seconds since 00:00:00 UTC on 1 January 1970 (the "epoch"), ignoring leap seconds. The converter auto-detects the unit: values above 100 billion are treated as milliseconds, the JavaScript convention, since 100 billion seconds wouldn\'t occur until the year 5138. Conversion happens with the browser\'s own Date engine, in your local timezone and UTC side by side.',
    note: 'The classic debugging trap: a timestamp that renders as 1970 means you passed seconds where milliseconds were expected (or a date 50,000 years out means the reverse). The auto-detection here shows which unit was assumed so you can spot exactly that mismatch.',
    faqs: [
      { q: 'What is Unix time?', a: 'The number of seconds elapsed since 00:00:00 UTC on 1 January 1970, excluding leap seconds. It is the near-universal machine representation of a moment in time, databases, APIs and logs all speak it.' },
      { q: 'Seconds or milliseconds, how do I tell?', a: 'Length: current Unix time is 10 digits in seconds and 13 in milliseconds. JavaScript uses milliseconds; most Unix tools and APIs use seconds. This converter auto-detects and tells you which it assumed.' },
      { q: 'What is the year 2038 problem?', a: 'Systems storing Unix time as a signed 32-bit integer overflow on 19 January 2038 at 03:14:07 UTC. Modern 64-bit systems are unaffected, their range extends billions of years.' },
      { q: 'Does Unix time include leap seconds?', a: 'No, by definition every Unix day is exactly 86,400 seconds. When a leap second occurs, Unix time repeats or smears a second rather than counting it. For civil timekeeping this almost never matters.' },
      { q: 'Is the timestamp converted locally?', a: 'Yes, the browser\'s own Date engine does the conversion on your device. Nothing you paste is transmitted.' },
    ],
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'epoch to date', 'unix time'],
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    icon: '🎂',
    description:
      'Calculate exact age from a date of birth, years, months and days, plus total days lived and days until the next birthday. Client-side and private.',
    lead: 'Exact age in years, months and days, plus total days lived and a countdown to the next birthday.',
    widget: 'age',
    how: 'The calculation walks the calendar rather than dividing day counts: full years from birthday to birthday, then full months, then leftover days, the same way age is legally reckoned. That handles unequal month lengths and leap years correctly: someone born 29 February completes a year of age on 1 March in non-leap years in most jurisdictions. Concretely, if the target date\'s month-and-day is still before your birthday this year, the tool counts one fewer full year and borrows the remaining months and days from the preceding calendar months, the same borrowing you\'d do by hand, which is why the day figure never comes out negative.',
    note: 'Dividing days-lived by 365.25 gives a decimal "age" that drifts a day or two around birthdays, fine for estimates, wrong for forms and eligibility rules, which use the calendar walk this tool performs.',
    faqs: [
      { q: 'How is exact age calculated?', a: 'Calendar-style: count complete years first (has this year\'s birthday passed?), then complete months, then remaining days. This matches how ages are used legally and administratively.' },
      { q: 'What about leap-year birthdays (29 February)?', a: 'In common years the birthday is generally observed on 1 March for legal purposes (e.g. UK law), though some jurisdictions use 28 February. This calculator counts the year as complete once the calendar reaches 1 March.' },
      { q: 'Why does "total days" not equal years × 365?', a: 'Leap years: roughly one year in four has 366 days. Thirty years of life spans about 10,957 days, not 10,950.' },
      { q: 'Can I calculate age at a date other than today?', a: 'Yes, set the "age at" date to anything: a form deadline, a school cutoff, a historical date.' },
      { q: 'Why can\'t I just divide the days by 365?', a: 'Because a calendar year is 365 or 366 days, so dividing by 365 slowly overstates age, by roughly a day every four years, and the result drifts across each birthday. For casual estimates it\'s close, but forms, eligibility rules and legal age all use the calendar-walk method this tool performs, which lands on the exact birthday every time.' },
      { q: 'How do I work out age in months or weeks?', a: 'Total complete months is years × 12 plus the leftover months from the breakdown; weeks are the total days lived divided by seven. Age in months is common for babies and toddlers, while total days and weeks are handy for milestones, all shown here alongside the years-months-days figure.' },
      { q: 'Is my date of birth sent anywhere?', a: 'No, the calculation runs entirely in your browser. A birthdate is personal data; that is exactly why this tool is client-side.' },
    ],
    keywords: ['age calculator', 'exact age', 'age in days', 'how old am i', 'age from date of birth'],
  },
  {
    slug: 'days-between-dates',
    name: 'Days Between Dates Calculator',
    icon: '📅',
    description:
      'Count the days between two dates, total days, weekdays only, weeks + days, and the years/months/days breakdown. All computed locally.',
    lead: 'Pick two dates, get the gap four ways: total days, weekdays only, complete weeks, and the calendar years-months-days breakdown.',
    widget: 'date-diff',
    how: 'Total days are computed from UTC day numbers, immune to daylight-saving shifts that make naive millisecond subtraction land on 23- or 25-hour "days". The weekday count covers the span excluding the end date, the convention for counting working days until a deadline. The calendar breakdown counts complete years, then months, then days, handling unequal month lengths correctly.',
    note: 'Off-by-one is the classic trap: 1 July to 3 July is two days elapsed but three days touched. This tool reports elapsed days (end date excluded); add one if your use case counts both endpoints, as some contract-day conventions do. The weekday count also ignores public holidays, subtract those for your country manually.',
    faqs: [
      { q: 'Is the end date included in the count?', a: 'No, the tool counts elapsed days, so Monday to Friday of one week is 4 days (and 4 weekdays). If your context counts both endpoints inclusively, add one.' },
      { q: 'How are weekdays counted?', a: 'Every Monday, Friday in the span, excluding the end date. Public holidays are not subtracted. They vary by country and year, so check your local calendar for those.' },
      { q: 'Does daylight saving time affect the count?', a: 'Not here: dates are compared as calendar days via UTC day numbers, so 23- and 25-hour DST days still count as exactly one day.' },
      { q: 'Can I count days between dates years apart?', a: 'Yes, any range the browser date picker accepts, with leap years handled by the calendar arithmetic. Century-spanning ranges are fine.' },
      { q: 'Are my dates uploaded?', a: 'No, the arithmetic runs on your device. Nothing is transmitted or logged.' },
    ],
    keywords: ['days between dates', 'date difference calculator', 'weekdays between dates', 'working days calculator', 'date duration'],
  },
  {
    slug: 'date-add-subtract',
    name: 'Date Add / Subtract Calculator',
    icon: '➕',
    description:
      'Add or subtract days, weeks, months or years from any date, "what is 90 days from today?" answered instantly, with correct month-end handling. Client-side.',
    lead: '"What date is 90 days from today?", pick a start date, add or subtract days, weeks, months or years, and see the result with its weekday.',
    widget: 'date-add',
    how: 'Days and weeks are exact arithmetic. Months and years follow the calendar convention: the day-of-month is preserved where possible and clamped to the month\'s end where not, 31 January + 1 month gives 28 (or 29) February, not 2 or 3 March. That matches how billing cycles, notice periods and subscriptions roll dates. Order matters too: the tool applies whole years and months first (with that clamping), then adds or subtracts the exact number of days, so a mixed span like "1 year 2 months 10 days" resolves the calendar parts before the day count. The result also shows the day of the week it lands on.',
    note: 'The month-clamping rule is where hand-counting goes wrong most: "three months from 30 November" is 28 February, not 2 March. Deadlines defined in days (e.g. "within 30 days") and in months ("one month\'s notice") can differ by a day or three, check which your contract actually says.',
    faqs: [
      { q: 'What does adding a month to 31 January give?', a: 'The last day of February, the 28th or 29th. The convention preserves the day-of-month and clamps to the target month\'s end when it doesn\'t exist, which is how billing and legal date rolls work.' },
      { q: 'How do I subtract days instead of adding?', a: 'Switch the direction toggle to "before", the same arithmetic runs backwards, e.g. 45 days before a deadline for a reminder date.' },
      { q: 'Is "30 days" the same as "one month"?', a: 'No, months are 28 to 31 days long, so a 30-day deadline and a one-month deadline diverge for most start dates. Use the unit your document specifies.' },
      { q: 'Does the result account for leap years?', a: 'Yes, the browser\'s calendar arithmetic knows every leap day. Adding one year to 29 February 2024 clamps to 28 February 2025.' },
      { q: 'What date is 90 days from today?', a: 'Set the start to today, add 90 days, and read off the result, for a mid-year start that\'s roughly three months ahead, though not exactly, since 90 days spans months of different lengths. Day-based deadlines like "within 90 days" are counted in exact days, which is what this mode gives, rather than in calendar months.' },
      { q: 'Should I count in days or in months for a deadline?', a: 'Use whichever unit the source specifies, because they diverge. "30 days" is always exactly 30 days, but "one month" is 28-31 depending on the start date, so the two can land days apart. Contracts, notice periods and warranties often hinge on this distinction, the tool handles both units separately so you can match the wording.' },
      { q: 'Does this run locally?', a: 'Yes, pure calendar arithmetic in your browser; nothing is sent anywhere.' },
    ],
    keywords: ['date calculator', '90 days from today', 'add days to date', 'date plus days', 'subtract days from date'],
  },
  {
    slug: 'week-number',
    name: 'Week Number Calculator',
    icon: '🗓️',
    description:
      'Find the ISO 8601 week number of any date, the standard used across European business planning, with the week\'s Monday-to-Sunday range. Local computation.',
    lead: 'Any date → its ISO 8601 week number, with the week\'s exact Monday, Sunday range. Today\'s week number shown by default.',
    widget: 'week-number',
    how: 'ISO 8601 weeks start on Monday, and week 1 is the week containing the year\'s first Thursday (equivalently, the week containing 4 January). This means the days around New Year can belong to the other year\'s week numbering: 29-31 December can fall in week 1 of the next year, and 1-3 January in week 52 or 53 of the previous one. Years have 52 or 53 ISO weeks.',
    note: 'ISO is not the only convention: the US system starts weeks on Sunday and calls the week containing 1 January "week 1", so a US planner and a European one can disagree by one on the same date. This tool computes the ISO standard, the one meant when a supplier says "delivery in week 34".',
    faqs: [
      { q: 'How is week 1 of a year defined?', a: 'Under ISO 8601, week 1 is the week (Monday, Sunday) containing the year\'s first Thursday, equivalently the week containing 4 January. 1 January can therefore sit in week 52/53 of the previous year.' },
      { q: 'Can a year have 53 weeks?', a: 'Yes, years starting on a Thursday, and leap years starting on a Wednesday, have 53 ISO weeks. It happens roughly every 5-6 years; 2026 has 53.' },
      { q: 'Why does my US calendar show a different week number?', a: 'The US convention starts weeks on Sunday and numbers the week containing 1 January as week 1. The two systems disagree for part of most years. European business and manufacturing use ISO.' },
      { q: 'What day does an ISO week start?', a: 'Monday, always. The tool shows each week\'s full Monday-to-Sunday date range so there is no ambiguity.' },
      { q: 'Is the date I enter transmitted?', a: 'No, the week number is computed in your browser with a few lines of calendar arithmetic.' },
    ],
    keywords: ['week number', 'iso week number', 'what week is it', 'current week number', 'calendar week'],
  },
  {
    slug: 'timezone-converter',
    name: 'Time Zone Converter',
    icon: '🌍',
    description:
      'Convert a time between world time zones, meeting-friendly, DST-aware via the browser\'s IANA timezone database, with UTC offsets shown. No server involved.',
    lead: '9:00 in New York is what time in Kathmandu? Pick a time and two zones, DST rules applied automatically from the browser\'s own timezone database.',
    widget: 'timezone',
    how: 'The browser ships the full IANA time zone database, the canonical registry of every zone\'s UTC offset and daylight-saving rules, past and future. The converter resolves your chosen wall-clock time in the source zone to an absolute instant, then renders that instant in the target zone. DST transitions, half-hour offsets (India, +5:30) and 45-minute offsets (Nepal, +5:45) are all handled by the same database your OS clock uses.',
    note: 'The classic scheduling failure is converting the offset instead of the moment: "New York is UTC−5" is only true in winter. It\'s UTC−4 under daylight saving. Because two regions change DST on different dates, the gap between them shifts twice a year; always convert a specific date\'s time, never a remembered offset.',
    faqs: [
      { q: 'Does this handle daylight saving time?', a: 'Yes, automatically. The browser\'s IANA database knows each zone\'s DST rules and transition dates, so converting a July time and a January time between the same two zones can correctly give different gaps.' },
      { q: 'Why do some zones differ by 30 or 45 minutes?', a: 'Not all offsets are whole hours: India is UTC+5:30, Iran +3:30, and Nepal +5:45. The IANA database encodes these exactly, and the converter shows the resolved offsets so you can verify.' },
      { q: 'What is the IANA time zone database?', a: 'The open registry (also called tz or zoneinfo) of the world\'s time zone rules, maintained under IANA and used by every major operating system and programming language. Zones are named Region/City, like Asia/Kolkata.' },
      { q: 'Which zone should I store times in?', a: 'The engineering convention: store instants in UTC, convert to local zones only for display. That way a stored time never shifts meaning when DST rules change.' },
      { q: 'Is anything sent to a server?', a: 'No, the timezone database ships inside your browser, so conversion is entirely local and even works offline.' },
    ],
    keywords: ['time zone converter', 'timezone converter', 'utc to ist', 'est to gmt', 'world clock converter'],
  },
  {
    slug: 'business-days-calculator',
    name: 'Business Days Calculator',
    icon: '📆',
    widget: 'business-days',
    description: 'Count the working days (Monday, Friday) between two dates, excluding weekends and optional public holidays. In your browser.',
    lead: 'Pick a start and end date to count the business days between them, weekends excluded, with an option to subtract public holidays.',
    how: 'The tool counts every Monday-to-Friday day from the start date to the end date, including both endpoints, and skips Saturdays and Sundays. Because many deadlines are quoted in "working days", this is what you need for delivery estimates, project timelines, notice periods and leave planning rather than a raw calendar-day count. It also shows the weekday total, the weekend days and the total calendar days. Enter the number of public holidays that fall on weekdays within the range to subtract them.',
    note: 'It doesn\'t know any country\'s holiday calendar, so add the count of weekday public holidays yourself for an exact working-day figure. Both the start and end dates are counted, which matches how most "business days" deadlines work, check whether your specific contract counts the start day if precision matters.',
    faqs: [
      { q: 'How do I count business days between two dates?', a: 'Count only the Monday-to-Friday days in the range. This calculator does it automatically from your start and end dates (including both), excluding weekends, and lets you subtract public holidays for a true working-day total.' },
      { q: 'Are weekends included in business days?', a: 'No, business (working) days are Monday to Friday. Saturdays and Sundays are excluded. The tool shows the weekend-day count separately so you can see the difference from the calendar total.' },
      { q: 'Does this account for public holidays?', a: 'Not automatically, because holidays differ by country and region. Enter the number of public holidays that fall on weekdays within your date range and the tool subtracts them from the business-day count.' },
      { q: 'Are the start and end dates both counted?', a: 'Yes. This calculator counts both endpoints (inclusive), which is how most working-day deadlines are stated. If your situation excludes the start date, subtract one working day.' },
      { q: 'What are business days used for?', a: 'Delivery and shipping estimates, payment and settlement terms, contractual notice periods, court and government deadlines, and planning annual leave, all commonly measured in working days rather than calendar days.' },
    ],
    keywords: ['business days calculator', 'working days calculator', 'weekdays between dates', 'business days between dates', 'workday calculator', 'net working days', 'days excluding weekends'],
  },
  {
    slug: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    icon: '⏱️',
    widget: 'time-duration',
    description: 'Calculate the hours and minutes between two times of day, with overnight support and an optional break, for timesheets and shifts. In your browser.',
    lead: 'Enter a start and end time to get the duration in hours and minutes, decimal hours and total minutes, with a break deduction.',
    how: 'The calculator finds the elapsed time from the start clock time to the end clock time. If the end is earlier than the start it assumes the period runs past midnight (an overnight shift) and adds 24 hours. It returns the duration as hours and minutes, as decimal hours (so 8 h 30 m reads as 8.5 for payroll), and as total minutes. Enter an unpaid break in minutes to subtract it and get the net worked time.',
    note: 'Both times are 24-hour clock values. Decimal hours are what most timesheets and payroll systems expect, multiply by an hourly rate directly. For durations spanning multiple days, use the days-between or business-days calculators instead; this one is for times within a single day (or one overnight crossing).',
    faqs: [
      { q: 'How do I calculate hours between two times?', a: 'Subtract the start time from the end time. For 9:00 to 17:30 that\'s 8 hours 30 minutes. If the end is before the start (e.g., 22:00 to 06:00), it crosses midnight and is 8 hours. The tool handles both automatically.' },
      { q: 'How do I convert hours and minutes to decimal?', a: 'Divide the minutes by 60 and add to the hours: 8 h 30 m = 8 + 30/60 = 8.5 hours. The calculator shows decimal hours directly, which is what payroll and timesheets use.' },
      { q: 'Does it handle overnight shifts?', a: 'Yes. If the end time is earlier than the start time, it assumes the shift runs past midnight and adds 24 hours, so 22:00 to 06:00 correctly gives 8 hours.' },
      { q: 'How do I subtract a lunch break?', a: 'Enter the break length in minutes and the tool deducts it from the total to show net worked time. A 9:00-17:30 day with a 30-minute break is 8 hours worked.' },
      { q: 'What if my shift spans more than 24 hours?', a: 'This tool is for a duration within a day or a single overnight crossing. For multi-day spans, use a days-between-dates calculator and add the leftover hours, or track each day separately.' },
    ],
    keywords: ['time duration calculator', 'hours between two times', 'time calculator', 'work hours calculator', 'time card calculator', 'hours and minutes calculator', 'overnight shift hours', 'decimal hours calculator'],
  },
  {
    slug: 'day-of-year-calculator',
    name: 'Day of the Year Calculator',
    icon: '📆',
    description:
      'Find the day-of-year (ordinal date) for any date, day N of 365 or 366, plus days remaining and the percentage of the year elapsed. In your browser.',
    lead: 'Enter a date to get its day-of-year number (Jan 1 = 1), how many days are left in the year, and how much of the year has passed.',
    widget: 'day-of-year',
    how: 'The tool counts whole days from January 1 (day 1) to your chosen date to give the ordinal day-of-year, sometimes called the Julian day in everyday (non-astronomical) use. It also reports the days remaining until December 31 and the share of the year elapsed. Leap years are handled automatically, so any date in a leap year counts up to 366.',
    note: 'The ordinal day-of-year shows up in logistics, manufacturing lot codes, spreadsheets and scientific data, where dates are recorded as “day 213” rather than a calendar date. Note this is the plain ordinal day, not the astronomical Julian Day Number (a continuous count since 4713 BC). Everything is computed locally in your browser.',
    faqs: [
      { q: 'What is the day of the year for a date?', a: 'It’s the ordinal count from January 1. For example March 1 is day 60 in a common year and day 61 in a leap year, because February has an extra day.' },
      { q: 'How many days are in a leap year?', a: '366, leap years add February 29. A year is a leap year if it’s divisible by 4, except century years, which must be divisible by 400 (so 2000 was a leap year but 1900 was not).' },
      { q: 'Is this the same as a Julian date?', a: 'In casual use “Julian date” often means exactly this ordinal day-of-year (e.g. day 045). It is not the astronomical Julian Day Number, which is a continuous day count used in astronomy.' },
      { q: 'How many days are left in the year?', a: 'The tool subtracts the day-of-year from the year’s total (365 or 366) to show the days remaining through December 31, and the percentage of the year that has elapsed.' },
      { q: 'Is my date uploaded?', a: 'No, the calculation runs entirely in your browser and works offline.' },
    ],
    keywords: ['day of year calculator', 'what day of the year is it', 'ordinal date', 'julian date calculator', 'day number of year', 'days left in the year'],
  },
  {
    slug: 'day-of-week-calculator',
    name: 'Day of the Week Calculator',
    icon: '🗓️',
    description:
      'Find what day of the week any date falls on, past or future, plus whether it’s a weekend and how far it is from today. In your browser, nothing uploaded.',
    lead: 'Enter any date and instantly see which day of the week it is (or was), whether it’s a weekend, and how many days from today.',
    widget: 'weekday',
    how: 'The tool determines the weekday for your date using the proleptic Gregorian calendar, reports whether it’s a weekend (Saturday or Sunday), gives the ISO weekday number (Monday = 1 through Sunday = 7), and, comparing against today, tells you whether it’s in the past or future and by how many days.',
    note: 'Knowing the weekday of a date is handy for planning events and deadlines, checking a historical or future date, or settling the “what day was I born?” question. The ISO weekday number (Monday = 1) is the convention used by spreadsheets and many programming libraries, which differs from the US convention of Sunday as the first day. It all runs locally in your browser.',
    faqs: [
      { q: 'What day of the week was a given date?', a: 'Enter the date and the tool shows the weekday, for example January 1, 2000 was a Saturday. It works for past and future dates alike.' },
      { q: 'Which day is day 1 of the week?', a: 'This tool reports the ISO weekday number, where Monday = 1 and Sunday = 7, the convention used by ISO 8601, spreadsheets and most programming libraries. Some US calendars instead treat Sunday as the first day.' },
      { q: 'Does it tell me if a date is a weekend?', a: 'Yes. It flags Saturday and Sunday as weekend days, which is useful when planning deadlines or deliveries that only count working days.' },
      { q: 'Is it accurate for very old or far-future dates?', a: 'It uses the proleptic Gregorian calendar (today’s calendar projected backward and forward), which is the standard for date arithmetic. Historical dates that were recorded under the Julian calendar may differ.' },
      { q: 'Is my date uploaded?', a: 'No, the weekday is computed entirely in your browser and the tool works offline.' },
    ],
    keywords: ['day of the week calculator', 'what day of the week', 'what day was i born', 'weekday finder', 'day of week for date', 'what day is a date'],
  },
  {
    slug: 'add-business-days-calculator',
    name: 'Add Business Days Calculator',
    icon: '📅',
    description:
      'Add or subtract business (working) days to a date, skipping weekends, to find the resulting date, for SLAs, deadlines and delivery estimates. In your browser.',
    lead: 'Pick a start date and a number of business days to add (or subtract), the tool skips Saturdays and Sundays and gives the resulting date.',
    widget: 'add-business-days',
    how: 'Starting from your date, the tool steps forward one calendar day at a time, counting only Monday, Friday, until it has counted the number of business days you entered; enter a negative number to step backward instead. The start day itself isn’t counted, so “add 1 business day” to a Friday lands on the following Monday.',
    note: 'This answers the “what date is X working days from now?” question behind service-level agreements, payment terms (net-10 business days), notice periods and shipping estimates. It skips weekends but not public holidays. Those vary by country and region, so check your local calendar and subtract any holidays that fall in the range. Unlike a business-days *counter* (which measures the gap between two dates), this projects a new date forward or backward. Everything runs locally.',
    faqs: [
      { q: 'How do I add business days to a date?', a: 'Enter the start date and the number of business days to add; the tool skips Saturdays and Sundays and returns the resulting weekday date. Use a negative number to count backward.' },
      { q: 'Is the start date counted?', a: 'No, counting begins the next day. So adding one business day to a Friday gives the following Monday, and adding one to a Wednesday gives Thursday.' },
      { q: 'Does it account for public holidays?', a: 'No. It excludes weekends only, because holidays differ by country, region and year. Check your local holiday calendar and subtract any that fall within the range.' },
      { q: 'What’s the difference from a business-days counter?', a: 'A counter tells you how many working days lie between two dates you already have. This tool does the reverse. It takes a start date and a count, and finds the new date.' },
      { q: 'Is my data uploaded?', a: 'No, the calculation runs entirely in your browser and works offline.' },
    ],
    keywords: ['add business days', 'business days calculator', 'add working days to date', 'sla deadline calculator', 'net business days date', 'working days from today'],
  },
];
