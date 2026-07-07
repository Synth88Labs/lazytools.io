/** Calendars category registry. */

export interface CalendarToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'multi' | 'single' | 'retail-454' | 'leap-year' | 'bikram';
  /** Intl `ca` id for single-system converter pages */
  system?: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const CALENDAR_TOOLS: CalendarToolDef[] = [
  {
    slug: 'calendar-converter',
    name: 'Calendar Converter',
    icon: '🗓️',
    description:
      'Convert any Gregorian date into the Islamic (Hijri), Hebrew, Persian, Indian, Buddhist, Julian and other calendars at once — and back again. Powered by your browser\'s own calendar data.',
    lead: 'One date, every calendar: see today (or any date) in the Hijri, Hebrew, Persian, Indian, Buddhist, Julian and more — and convert any of them back to Gregorian.',
    widget: 'multi',
    how: 'Forward conversion uses the calendar data built into your browser — the same ICU/CLDR database your operating system uses — so a Gregorian date is expressed in each system exactly as the standard defines it, with no hand-written calendar maths to get wrong. Reverse conversion (a Hijri or Persian date back to Gregorian) inverts that mapping precisely, since each calendar\'s year-month-day advances strictly with time. Everything is computed on your device.',
    note: 'A note on the Hijri date: the Umm al-Qura calendar shown here is the Saudi civil calendar, the usual answer to "what is the Islamic date", but religious observances often depend on the actual sighting of the moon and can differ by a day. The Hebrew and Chinese calendars have leap months, which is why they are shown for reference but not offered for reverse conversion here — enter those the other way (Gregorian in) instead.',
    faqs: [
      { q: 'Which calendars does this convert between?', a: 'Gregorian to and from Islamic/Hijri (Umm al-Qura and tabular), Persian (Solar Hijri/Jalali), Indian National (Saka), Buddhist, Coptic, Ethiopian, Minguo (ROC), Julian and Julian Day Number — plus display of the Hebrew, Japanese-era and Chinese calendars.' },
      { q: 'How accurate is the Hijri conversion?', a: 'It uses the Umm al-Qura (Saudi civil) calendar from your browser\'s ICU data, which is the standard civil answer. Because some Islamic dates are fixed by moon sighting rather than calculation, a religious date may fall a day either side of the civil one.' },
      { q: 'Why can\'t I convert a Hebrew or Chinese date back to Gregorian here?', a: 'Both are lunisolar calendars with leap months, so a plain month number is ambiguous. This tool shows them forward (Gregorian in) reliably; for the reverse it offers the solar and lunar calendars that have a fixed twelve months.' },
      { q: 'Is the conversion done on a server?', a: 'No — every calendar system here ships inside your browser. Conversion runs locally and works offline; nothing you enter is transmitted.' },
      { q: 'What is a Julian Day Number?', a: 'A continuous count of days used in astronomy, starting from 1 January 4713 BC. It has no months — just a single number that increases by one each day (changing at noon universal time), which makes date arithmetic across any calendar trivial.' },
    ],
    keywords: ['calendar converter', 'date converter', 'hijri to gregorian', 'convert date between calendars', 'islamic date converter', 'gregorian to hijri'],
  },
  {
    slug: 'hijri-date-converter',
    name: 'Hijri (Islamic) Date Converter',
    icon: '☪️',
    description:
      'Convert Gregorian dates to the Hijri (Islamic) calendar and back, using the Umm al-Qura civil calendar from your browser. Private and offline-capable.',
    lead: 'Gregorian ↔ Hijri in both directions — today\'s Islamic date, or any date, using the Umm al-Qura civil calendar. Computed on your device.',
    widget: 'single',
    system: 'islamic-umalqura',
    how: 'The Hijri calendar is lunar: twelve months of 29 or 30 days, about 354 days a year, so it moves roughly 11 days earlier against the Gregorian calendar annually. This converter uses the Umm al-Qura calendar — the civil Hijri calendar of Saudi Arabia — from your browser\'s built-in ICU data, and inverts it exactly for Hijri-to-Gregorian conversions. The year is marked AH (Anno Hegirae), counted from the Prophet\'s migration to Medina in 622 CE.',
    note: 'Civil vs religious dates: the Umm al-Qura calendar is calculated in advance and is what governments and civil records use. Religious dates — the start of Ramadan, the two Eids — are traditionally fixed by the physical sighting of the crescent moon, so they can fall a day before or after the civil date and vary by country. Use this for civil/administrative dates, and defer to local moon-sighting announcements for observances.',
    faqs: [
      { q: 'What is the Umm al-Qura calendar?', a: 'The official civil Hijri calendar of Saudi Arabia, calculated in advance rather than by moon sighting. It is the standard reference for "what is the Islamic date today" and what this tool uses via your browser\'s ICU data.' },
      { q: 'Why does the Islamic date move earlier each year?', a: 'The Hijri year is purely lunar — about 354 days, roughly 11 days shorter than the solar year — so Islamic months drift earlier against the Gregorian calendar, completing a full cycle in about 33 years. That\'s why Ramadan gradually moves through the seasons.' },
      { q: 'Will this give the exact date of Ramadan or Eid?', a: 'It gives the civil Umm al-Qura date, which is usually right but can differ by a day from the observed religious date, since Ramadan and Eid are traditionally confirmed by moon sighting and vary between countries. Treat it as the civil answer, not a religious ruling.' },
      { q: 'What does AH mean?', a: 'Anno Hegirae — "in the year of the Hijra". Year 1 AH began with the Prophet Muhammad\'s migration from Mecca to Medina in 622 CE.' },
      { q: 'Is my date sent anywhere?', a: 'No — the Hijri calendar data is inside your browser, so conversion is entirely local and works offline.' },
    ],
    keywords: ['hijri date converter', 'islamic date converter', 'gregorian to hijri', 'hijri to gregorian', 'islamic calendar today', 'umm al-qura'],
  },
  {
    slug: 'persian-calendar-converter',
    name: 'Persian (Solar Hijri) Calendar Converter',
    icon: '🌅',
    description:
      'Convert between Gregorian and the Persian (Solar Hijri / Jalali) calendar both ways — the official calendar of Iran and Afghanistan. Runs in your browser.',
    lead: 'Gregorian ↔ Persian (Jalali) in both directions — the solar calendar whose new year, Nowruz, falls on the spring equinox. Computed locally.',
    widget: 'single',
    system: 'persian',
    how: 'The Persian, or Solar Hijri, calendar is one of the most astronomically accurate in use: its year begins at the exact moment of the spring equinox (Nowruz, around 20–21 March), and its leap-year pattern tracks the tropical year more closely than the Gregorian rule. This converter uses the calendar from your browser\'s ICU data and inverts it exactly. Years are marked AP (Anno Persico) or SH, counted, like the Hijri calendar, from 622 CE — but solar, so it stays fixed against the seasons.',
    note: 'Don\'t confuse it with the Islamic (Hijri) calendar: both count years from 622 CE, but the Persian calendar is solar (365/366 days, fixed seasons) while the Islamic one is lunar (354 days, drifting). That is why their year numbers differ by hundreds — a Persian year is currently around 1404, an Islamic year around 1447.',
    faqs: [
      { q: 'What is the Persian calendar also called?', a: 'The Solar Hijri calendar, or Jalali calendar. It is the official calendar of Iran and Afghanistan, and among the most accurate solar calendars in use.' },
      { q: 'When does the Persian year start?', a: 'At the vernal (spring) equinox — Nowruz — which falls on 20 or 21 March in the Gregorian calendar. The year is astronomically anchored to the equinox, not a fixed date.' },
      { q: 'How is it different from the Islamic Hijri calendar?', a: 'Both count from 622 CE, but the Persian calendar is solar (365–366 days, seasons fixed) and the Islamic calendar is lunar (about 354 days, drifting ~11 days earlier a year). Their year numbers differ by several decades and grow apart over time.' },
      { q: 'What does AP mean?', a: 'Anno Persico — the Persian year count. It shares its epoch (622 CE) with the Hijri calendar but, being solar, its year number differs.' },
      { q: 'Is this computed locally?', a: 'Yes — the Persian calendar ships in your browser\'s ICU data, so the conversion is local and works offline.' },
    ],
    keywords: ['persian calendar converter', 'solar hijri converter', 'jalali calendar', 'shamsi to gregorian', 'gregorian to shamsi', 'iranian calendar converter'],
  },
  {
    slug: 'julian-date-converter',
    name: 'Julian Calendar & Julian Day Converter',
    icon: '📜',
    description:
      'Convert between the Julian calendar and Gregorian, and compute Julian Day Numbers (JDN) for astronomy. Exact integer algorithms, in your browser.',
    lead: 'Julian ↔ Gregorian for historical dates, plus the astronomical Julian Day Number — two different "Julian" dates, both handled precisely and locally.',
    widget: 'single',
    system: 'julian',
    how: 'Two things share the name "Julian". The Julian calendar is the Roman calendar used across the West until 1582, with a simple leap year every four years; it has drifted about 13 days behind the Gregorian calendar. The Julian Day Number is unrelated — a continuous count of days used in astronomy since 4713 BC. This tool converts Gregorian to and from the Julian calendar using the standard integer (Fliegel) algorithm, and also shows the Julian Day Number, both computed exactly on your device.',
    note: 'Watch the 1582 changeover: when the Gregorian calendar was introduced, Thursday 4 October 1582 (Julian) was followed directly by Friday 15 October 1582 (Gregorian) — ten days were skipped. Different countries adopted the reform in different years (Britain and its colonies not until 1752, skipping 11 days), so a "date" in an old document depends on which calendar the writer used.',
    faqs: [
      { q: 'What is the difference between the Julian calendar and Julian Day Number?', a: 'The Julian calendar is a calendar system (months and years, leap year every 4 years) used before the Gregorian reform. The Julian Day Number is a continuous count of days used in astronomy, with no months. They share a name but are otherwise unrelated; this tool handles both.' },
      { q: 'How many days is the Julian calendar behind the Gregorian?', a: 'Currently 13 days, because the Julian calendar has a leap year every four years with no century exception, so it gains about three days every four centuries. The gap grows by a day roughly each century.' },
      { q: 'What happened in October 1582?', a: 'The Gregorian reform skipped ten days: 4 October 1582 (Julian) was followed by 15 October 1582 (Gregorian). Catholic countries adopted it then; others later — Britain in 1752, skipping eleven days.' },
      { q: 'What is a Julian Day Number used for?', a: 'Astronomers use it to give every day a single increasing number, so intervals between events in any calendar are a simple subtraction. It starts from 1 January 4713 BC and changes at noon universal time.' },
      { q: 'Is this accurate for ancient dates?', a: 'Yes — it uses exact integer arithmetic that works for any year, including proleptic (extrapolated) Julian dates before the calendar was introduced. Everything is computed locally.' },
    ],
    keywords: ['julian calendar converter', 'julian to gregorian', 'gregorian to julian', 'julian day number', 'jdn calculator', 'julian date'],
  },
  {
    slug: 'bikram-sambat-converter',
    name: 'Nepali Date Converter (BS ⇄ AD)',
    icon: '🇳🇵',
    description:
      'Convert dates between Bikram Sambat (BS), the official Nepali calendar, and Gregorian (AD), both directions. Uses validated official calendar data, in your browser.',
    lead: 'Bikram Sambat ⇄ Gregorian, both ways — today\'s Nepali date, or convert any BS or AD date. Computed on your device.',
    widget: 'bikram',
    how: 'Bikram Sambat (BS) is the official solar calendar of Nepal, running about 56 years and 8 months ahead of the Gregorian (AD) calendar — so mid-2026 AD is 2083 BS. Its twelve months (Baishakh through Chaitra) have variable lengths of 29 to 32 days, fixed each year by astronomical calculation rather than a simple rule, and published in official almanacs. Because there is no formula, this converter uses a validated table of month lengths (covering BS 1975–2099, roughly AD 1918–2043) and computes both directions on your device.',
    note: 'The Nepali new year falls on 1 Baishakh, around the middle of April. Note the supported range is BS 1975–2099 (AD 1918–2043): dates outside it can\'t be converted reliably because the official month-length data doesn\'t extend there. Nepal also uses this calendar for its fiscal year (Shrawan to Ashadh) and for festivals like Dashain and Tihar, whose Gregorian dates shift each year.',
    faqs: [
      { q: 'What is Bikram Sambat?', a: 'The official calendar of Nepal, a solar calendar about 56 years and 8 months ahead of the Gregorian (AD) calendar. Its year begins on 1 Baishakh, around mid-April, and it is used for civil dates, the fiscal year and festivals throughout Nepal.' },
      { q: 'How many years ahead of AD is BS?', a: 'About 56 years and 8 months. Because the offset includes a partial year, the exact difference depends on the date: for most of a Gregorian year the BS year is 57 ahead, dropping to 56 before the Nepali new year in April.' },
      { q: 'Why can\'t BS dates be converted with a simple formula?', a: 'Unlike the Gregorian calendar, Bikram Sambat month lengths (29–32 days) are not fixed by a rule — they are set each year by astronomical calculation and published in official almanacs. Accurate conversion therefore needs a data table, which is what this tool uses.' },
      { q: 'What date range does this support?', a: 'BS 1975 to 2099, which is roughly AD 1918 to 2043 — the range for which validated official month-length data exists. Dates outside it return an out-of-range message rather than a guess.' },
      { q: 'When is Nepali New Year?', a: 'On 1 Baishakh, which falls around 13–14 April in the Gregorian calendar. For example, 1 Baishakh 2081 BS was 13 April 2024 AD.' },
      { q: 'Is my date sent to a server?', a: 'No — the calendar data is bundled into your browser, so the conversion runs entirely on your device and works offline.' },
    ],
    keywords: ['nepali date converter', 'bs to ad', 'ad to bs', 'bikram sambat converter', 'nepali calendar', 'bs to ad converter', 'english to nepali date'],
  },
  {
    slug: 'hebrew-calendar-converter',
    name: 'Hebrew Calendar Converter',
    icon: '✡️',
    description:
      'Convert Gregorian dates to the Hebrew (Jewish) calendar — the lunisolar calendar with leap months — using your browser\'s built-in calendar data.',
    lead: 'See any Gregorian date in the Hebrew calendar — the lunisolar Jewish calendar whose leap years add a 13th month. Computed on your device.',
    widget: 'single',
    system: 'hebrew',
    how: 'The Hebrew calendar is lunisolar: months follow the moon (29 or 30 days) but an extra month (Adar I) is inserted in 7 of every 19 years to keep the festivals aligned with the seasons — so a common year has 12 months and a leap year 13. This converter expresses any Gregorian date in the Hebrew calendar using your browser\'s ICU data. Years are counted AM (Anno Mundi) from the traditional date of creation, currently around 5786.',
    note: 'Because of the leap-month system, the Hebrew calendar\'s months don\'t map to a fixed number the way a 12-month calendar does — which is why this page converts Gregorian dates into Hebrew ones rather than the reverse. Note too that the Hebrew day begins at sunset, so a date here corresponds to the daytime; the preceding evening already belongs to that Hebrew date.',
    faqs: [
      { q: 'How does the Hebrew calendar handle leap years?', a: 'It adds a thirteenth month (Adar I) in 7 years out of every 19-year cycle. This keeps Passover in spring and the other festivals in their seasons, reconciling the lunar months with the solar year.' },
      { q: 'What does AM (Anno Mundi) mean?', a: '"In the year of the world" — the Hebrew year count from the traditional date of creation. The current Hebrew year is around 5786.' },
      { q: 'Why does this tool only convert Gregorian to Hebrew?', a: 'The leap-month system means a Hebrew month number alone is ambiguous, so a reliable reverse conversion needs the month by name. This page focuses on the common direction — Gregorian date in, Hebrew date out — done exactly via your browser\'s calendar data.' },
      { q: 'Does the Hebrew day start at midnight?', a: 'No — the Hebrew day begins at sunset the evening before. A Gregorian date shown here maps to the daytime portion; the evening beforehand is already the same Hebrew date.' },
      { q: 'Is the conversion local?', a: 'Yes — the Hebrew calendar ships in your browser, so it runs on your device and works offline.' },
    ],
    keywords: ['hebrew calendar converter', 'jewish calendar converter', 'gregorian to hebrew date', 'hebrew date today', 'jewish date converter'],
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
  {
    slug: 'leap-year-calculator',
    name: 'Leap Year Calculator',
    icon: '📆',
    description:
      'Check whether any year is a leap year, with the reason, plus the previous and next leap years and how the Gregorian and Julian rules differ. Instant and local.',
    lead: 'Is it a leap year? Get a yes/no for any year with the rule explained — plus the surrounding leap years and where the Julian calendar disagrees.',
    widget: 'leap-year',
    how: 'The Gregorian rule has three parts: a year is a leap year if it is divisible by 4, except that century years are not leap years unless they are divisible by 400. So 2024 is leap, 1900 is not (divisible by 100 but not 400), and 2000 is (divisible by 400). This tool applies the rule, states which clause decided it, and shows the previous and next leap years — all computed instantly on your device.',
    note: 'The century exception is the whole point of the Gregorian reform. The older Julian calendar made every fourth year a leap year with no exception, which added slightly too many days and let the calendar drift against the seasons. The 400-year correction removes three leap days every four centuries, keeping the calendar aligned — which is why the Julian and Gregorian calendars disagree on years like 1700, 1800 and 1900.',
    faqs: [
      { q: 'What makes a year a leap year?', a: 'Under the Gregorian calendar: it must be divisible by 4, but century years (divisible by 100) are only leap years if also divisible by 400. So 2024 and 2000 are leap years; 1900 and 2100 are not.' },
      { q: 'Why isn\'t 1900 a leap year but 2000 is?', a: 'Both are divisible by 4 and by 100, so the century rule applies. 2000 is also divisible by 400, so it stays a leap year; 1900 is not divisible by 400, so it becomes a common year. This 400-year correction is what the Gregorian reform added.' },
      { q: 'How often is a leap year?', a: 'Almost every four years — 97 times in every 400 years. Three century years per four centuries are skipped, which makes the average year 365.2425 days, very close to the true solar year.' },
      { q: 'Do other calendars have leap years?', a: 'Yes, but differently: the Julian calendar leaps every 4 years with no exception; the Hebrew and Chinese calendars add a whole leap month in some years; the Islamic calendar has leap days in a 30-year cycle. This calculator covers the Gregorian rule (and shows the Julian one for comparison).' },
      { q: 'Is February 29 a real birthday?', a: 'Yes — "leaplings" born on 29 February have a birthday only in leap years; in common years they typically observe it on 28 February or 1 March, depending on jurisdiction and preference.' },
    ],
    keywords: ['leap year calculator', 'is it a leap year', 'leap year checker', 'leap year rule', 'next leap year', 'why is 1900 not a leap year'],
  },
];
