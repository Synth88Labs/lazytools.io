import type { Quantity } from './types.ts';

export const time: Quantity = {
  id: 'time',
  name: 'Time',
  slug: 'time',
  baseUnit: 's',
  icon: '⏱️',
  description:
    'Convert between seconds, minutes, hours, days, weeks, months and years. Month and year conversions use calendar averages (1 year = 365.2425 days in the Gregorian calendar).',
  units: [
    {
      id: 'ns', name: 'Nanosecond', plural: 'nanoseconds', symbol: 'ns', slug: 'nanoseconds', factor: 1e-9, system: 'si',
      definition: 'A nanosecond (ns) is one billionth of a second. CPU clock cycles and memory latencies are measured in nanoseconds.',
    },
    {
      id: 'us', name: 'Microsecond', plural: 'microseconds', symbol: 'µs', slug: 'microseconds', factor: 1e-6, system: 'si',
      definition: 'A microsecond (µs) is one millionth of a second, used for network latencies and high-speed electronics timing.',
    },
    {
      id: 'ms', name: 'Millisecond', plural: 'milliseconds', symbol: 'ms', slug: 'ms', factor: 0.001, system: 'si',
      definition: 'A millisecond (ms) is one thousandth of a second. Web response times, video frame timing and reaction times are measured in milliseconds.',
    },
    {
      id: 's', name: 'Second', plural: 'seconds', symbol: 's', slug: 'seconds', factor: 1, system: 'si',
      definition: 'The second (s) is the SI base unit of time, defined by the radiation frequency of the cesium-133 atom. All other time units derive from it.',
    },
    {
      id: 'min', name: 'Minute', plural: 'minutes', symbol: 'min', slug: 'minutes', factor: 60, system: 'other',
      definition: 'A minute (min) is 60 seconds. The 60-based division of hours dates back to Babylonian mathematics.',
    },
    {
      id: 'h', name: 'Hour', plural: 'hours', symbol: 'h', slug: 'hours', factor: 3600, system: 'other',
      definition: 'An hour (h) is 60 minutes or 3,600 seconds — one 24th of a day. Work time, travel time and billing commonly use hours.',
    },
    {
      id: 'd', name: 'Day', plural: 'days', symbol: 'd', slug: 'days', factor: 86400, system: 'other',
      definition: 'A day (d) is 24 hours or 86,400 seconds — one rotation of the Earth. Calendar calculations and durations build on days.',
    },
    {
      id: 'wk', name: 'Week', plural: 'weeks', symbol: 'wk', slug: 'weeks', factor: 604800, system: 'other',
      definition: 'A week (wk) is 7 days or 168 hours. Schedules, pregnancy tracking and project planning commonly count in weeks.',
    },
    {
      id: 'mo', name: 'Month (average)', plural: 'months', symbol: 'mo', slug: 'months', factor: 2629746, system: 'other',
      definition: 'An average Gregorian month is 30.44 days (2,629,746 seconds) — one twelfth of the average year. Individual calendar months range from 28 to 31 days.',
    },
    {
      id: 'yr', name: 'Year (Gregorian)', plural: 'years', symbol: 'yr', slug: 'years', factor: 31556952, system: 'other',
      definition: 'A Gregorian calendar year averages 365.2425 days (31,556,952 seconds), accounting for leap years. Common years have 365 days; leap years 366.',
    },
  ],
  popularPairs: [
    ['min', 'h'], ['h', 'min'],
    ['h', 'd'], ['d', 'h'],
    ['s', 'min'], ['min', 's'],
    ['d', 'wk'], ['wk', 'd'],
    ['ms', 's'], ['s', 'ms'],
    ['d', 'mo'], ['mo', 'd'],
    ['d', 'yr'],
  ],
  pairMeta: {
    'minutes-to-hours': {
      slug: 'minutes-to-hours',
      exampleValue: 90,
      note: 'Minutes-to-hours converts durations for timesheets, payroll and planning. 90 minutes is 1.5 hours; 100 minutes is 1.667 hours (1 h 40 min). For payroll, decimal hours are what timesheet systems expect — 7 h 45 min is 7.75 hours.',
      faqs: [
        { q: 'How do I convert minutes to decimal hours for payroll?', a: 'Divide the minutes by 60. Example: 7 hours 45 minutes = 7 + 45/60 = 7.75 decimal hours.' },
      ],
    },
    'hours-to-minutes': {
      slug: 'hours-to-minutes',
      exampleValue: 2.5,
      note: 'Multiply hours by 60 to get minutes: 2.5 hours is 150 minutes. Useful for cooking timers, meeting lengths and converting decimal hours back to clock time.',
    },
    'days-to-hours': {
      slug: 'days-to-hours',
      exampleValue: 3,
      note: 'One day is 24 hours, so 3 days is 72 hours — the classic deadline arithmetic ("within 72 hours" = 3 days). A 30-day month is 720 hours.',
    },
  },
};
