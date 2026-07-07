/** Productivity category registry. Tools are added per build batch. */

export interface ProductivityToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'pomodoro' | 'countdown' | 'meeting-cost' | 'eisenhower' | 'habit';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const PRODUCTIVITY_TOOLS: ProductivityToolDef[] = [
  {
    slug: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    icon: '🍅',
    description:
      'A focus timer using the Pomodoro Technique — configurable work and break intervals, session tracking and a sound alert. Runs in your browser, no sign-up.',
    lead: 'Work in focused sprints: 25 minutes on, then a break. Configure the intervals, track your sessions, and stay off the notifications.',
    widget: 'pomodoro',
    how: 'The Pomodoro Technique breaks work into timed intervals — traditionally 25 minutes of focus followed by a 5-minute break, with a longer break after four rounds. This timer runs those cycles for you: it counts down, chimes when a phase ends, auto-starts the next, and keeps a tally of focus sessions completed today. The countdown even shows in the browser tab so you can glance at it from another window. Your interval settings and today\'s count are saved in your browser.',
    note: 'The point of the technique isn\'t the exact 25 minutes — it\'s the commitment to a single task for one unbounded-anxiety-free block, and a real break between blocks. Tune the lengths to your attention span (some prefer 50/10), name the task you\'re on, and let the breaks be actual breaks. Nothing here is uploaded, and it works offline.',
    faqs: [
      { q: 'What is the Pomodoro Technique?', a: 'A time-management method that splits work into focused intervals (classically 25 minutes) separated by short breaks, with a longer break after every four. The intervals are called "pomodoros" after the tomato-shaped kitchen timer its creator used.' },
      { q: 'Can I change the 25/5 lengths?', a: 'Yes — set any focus, short-break and long-break length, and how many focus rounds trigger the long break. The tool remembers your settings in this browser.' },
      { q: 'Will it alert me when a session ends?', a: 'It plays a short chime (toggleable) and, if you allow notifications, shows a desktop notification. The remaining time also appears in the browser-tab title so you can keep an eye on it from elsewhere.' },
      { q: 'Does it track my sessions?', a: 'It counts the focus sessions you complete today, stored locally in your browser. Nothing is sent anywhere; clearing your browser data resets it.' },
      { q: 'Does it work offline?', a: 'Yes — the timer is entirely client-side, so once the page has loaded it runs with no connection.' },
    ],
    keywords: ['pomodoro timer', 'focus timer', 'pomodoro technique', 'productivity timer', '25 minute timer', 'work break timer'],
  },
  {
    slug: 'countdown-timer',
    name: 'Countdown Timer & Stopwatch',
    icon: '⏱️',
    description:
      'A countdown to any date or event, a stopwatch with laps, and an interval (HIIT) timer — three timers in one, running in your browser.',
    lead: 'Count down to a big day, time a task with laps, or run work/rest interval rounds — all in one place, all on your device.',
    widget: 'countdown',
    how: 'Three timers share one tool. The countdown ticks down to any date and time you set (and counts up once it passes, so it doubles as a "time since"). The stopwatch times with centisecond precision and records laps. The interval timer runs configurable work/rest rounds with a beep at each switch — handy for focus sprints, workouts or timeboxing. The countdown target is saved in your browser so it\'s there next time.',
    note: 'The interval mode is the quiet workhorse: set 30 seconds work / 15 rest for a quick focus burst, or longer rounds for exercise. Because everything runs locally, the timers keep perfect time without any server — though a background browser tab may throttle timers, so keep the tab visible for exercise use.',
    faqs: [
      { q: 'What can I count down to?', a: 'Any date and time — a launch, a holiday, a deadline, a birthday. Once the moment passes, the display flips to counting up, so it also works as a "time since" counter.' },
      { q: 'Does the stopwatch record laps?', a: 'Yes — while running, each tap records a lap with both the split (since the last lap) and the total elapsed time, to centisecond precision.' },
      { q: 'What is the interval timer for?', a: 'Repeated work/rest cycles: focus sprints, HIIT workouts, timeboxed practice. Set the work seconds, rest seconds and number of rounds, and it beeps at each transition.' },
      { q: 'Is my countdown saved if I close the tab?', a: 'The countdown target and label are stored in your browser, so they return when you reopen the page. Nothing is uploaded.' },
      { q: 'Are the timers accurate in a background tab?', a: 'Browsers throttle timers in hidden tabs to save power, which can slow a background countdown. For exercise intervals where timing matters, keep the tab visible.' },
    ],
    keywords: ['countdown timer', 'online stopwatch', 'interval timer', 'hiit timer', 'countdown to date', 'stopwatch with laps'],
  },
  {
    slug: 'meeting-cost-calculator',
    name: 'Meeting Cost Calculator',
    icon: '💸',
    description:
      'Calculate what a meeting really costs — attendees × hourly rate × duration — including the annual cost of recurring meetings, plus a live cost meter. In your browser.',
    lead: 'Six people, one hour, decent salaries — that "quick sync" costs more than you think. See the number, and the annual bill for recurring ones.',
    widget: 'meeting-cost',
    how: 'The cost of a meeting is simply the number of attendees times their hourly rate times the duration — but seeing it as a figure changes how you run meetings. Enter the head count, an average hourly rate and the length, and the calculator shows the per-meeting cost, the cost per attendee, and — for recurring meetings — the annualised total. There\'s also a live meter: start it when a real meeting begins and watch the cost climb in real time.',
    note: 'Use a fully-loaded rate for realism: an employee\'s cost to the business is typically around 1.3–1.4× their salary once benefits, tax and overheads are included, so a £60k salary is closer to £40/hour loaded. The live meter is the persuasive part — sharing "this recurring meeting costs £30,000 a year" tends to shorten agendas fast. Everything is computed locally.',
    faqs: [
      { q: 'How is meeting cost calculated?', a: 'Attendees × average hourly rate × duration in hours. Six people at £50/hour for one hour is £300. For recurring meetings the tool multiplies by how often they happen to show the yearly cost.' },
      { q: 'What hourly rate should I use?', a: 'A "fully-loaded" rate is most honest — an employee costs the business roughly 1.3–1.4× their salary once benefits and overheads are counted. Divide the loaded annual cost by about 2,080 working hours to get the hourly figure.' },
      { q: 'What does the live meter do?', a: 'It runs a real-time counter: start it at the beginning of a meeting and watch the accumulating cost and elapsed time, based on your attendee and rate settings. It\'s a vivid way to keep meetings tight.' },
      { q: 'Why show the annual cost?', a: 'Because a recurring meeting\'s real cost is hidden in its repetition. A weekly one-hour meeting for six people can run to tens of thousands a year — a number worth seeing before you keep it on the calendar.' },
      { q: 'Is anything uploaded?', a: 'No — it\'s pure arithmetic in your browser, and your inputs are saved only in this browser.' },
    ],
    keywords: ['meeting cost calculator', 'cost of meeting', 'meeting price calculator', 'how much does a meeting cost', 'meeting roi', 'meeting time cost'],
  },
  {
    slug: 'eisenhower-matrix',
    name: 'Eisenhower Matrix',
    icon: '🎯',
    description:
      'Prioritise tasks with the Eisenhower urgent/important matrix — drag tasks between Do, Schedule, Delegate and Delete. Saved locally, exportable.',
    lead: 'Sort your to-dos by urgent vs important into four quadrants — Do, Schedule, Delegate, Delete — and finally see what actually deserves your time.',
    widget: 'eisenhower',
    how: 'The Eisenhower matrix (attributed to US president Dwight Eisenhower) sorts tasks along two axes — urgent or not, important or not — into four quadrants: Do first (urgent + important), Schedule (important, not urgent), Delegate (urgent, not important) and Delete (neither). Add your tasks, drop them into a quadrant, and drag them between quadrants as priorities shift. Each quadrant shows a count and a nudge about what to do with it. Your board is saved in your browser and can be exported as JSON.',
    note: 'The insight the matrix forces is that "urgent" and "important" are different things — and that the quadrant most people neglect, Schedule (important but not urgent), is exactly where meaningful work and prevention live. If your Do-first quadrant is always full, that\'s usually a sign the Schedule quadrant is being ignored until it becomes urgent.',
    faqs: [
      { q: 'What is the Eisenhower matrix?', a: 'A prioritisation tool that classifies tasks by two questions — is it urgent, and is it important — into four quadrants: Do first, Schedule, Delegate and Delete. It helps separate genuinely important work from merely urgent noise.' },
      { q: "What's the difference between urgent and important?", a: 'Urgent tasks demand attention now (a ringing phone, a deadline today); important tasks contribute to your goals and values. Many urgent things aren\'t important, and the most important things (planning, health, relationships) are rarely urgent — until they are.' },
      { q: 'How do I use the four quadrants?', a: 'Do the urgent-and-important now; schedule time for the important-but-not-urgent; delegate the urgent-but-unimportant if you can; and delete the rest. Drag tasks between quadrants here as things change.' },
      { q: 'Is my board saved?', a: 'Yes — it\'s stored in your browser, and you can export it as a JSON file to back up or move to another device. Nothing is uploaded.' },
      { q: 'Which quadrant do people neglect most?', a: 'Schedule — important but not urgent. It holds the high-value work (strategy, learning, prevention) that has no deadline, so it gets crowded out by urgent trivia until it, too, becomes a crisis.' },
    ],
    keywords: ['eisenhower matrix', 'urgent important matrix', 'priority matrix', 'task prioritization', 'eisenhower box', 'time management matrix'],
  },
  {
    slug: 'habit-tracker',
    name: 'Habit Tracker',
    icon: '✅',
    description:
      'Track daily habits on a monthly grid, build streaks and see your completion rate — saved in your browser, exportable, private.',
    lead: 'Tick off habits day by day, watch the streak grow, and don\'t break the chain. A private habit tracker that never leaves your browser.',
    widget: 'habit',
    how: 'Add the habits you want to build, and mark each day you do them on a month grid. The tracker keeps your current streak (consecutive days) and your completion rate for the month, and lets you page back and forth through months. It\'s the classic "don\'t break the chain" method — the visible run of ticks becomes its own motivation. Everything is stored in your browser and can be exported as JSON.',
    note: 'Two habits at a time is plenty to start — streaks are motivating but fragile, and tracking ten things at once usually ends with tracking none. The streak counter is forgiving about "today": it counts up to today if you\'ve done it, or up to yesterday if you haven\'t yet, so an unfinished today doesn\'t look like a broken chain until the day is actually over.',
    faqs: [
      { q: 'How does the streak work?', a: 'It counts the run of consecutive days you\'ve marked a habit done, ending today (if today is ticked) or yesterday (if today isn\'t yet). Miss a day and the streak resets — the visible chain is what keeps you honest.' },
      { q: 'How many habits should I track?', a: 'Start with one or two. Habit formation succeeds through consistency on a few things, not breadth; a long list of half-kept habits is demoralising. Add more once the first ones stick.' },
      { q: 'Can I track past or future months?', a: 'Yes — page back to fill in history or check a previous month\'s completion rate. Each day is stored by its date, so your record is preserved as you move around.' },
      { q: 'Is my data private?', a: 'Completely — habits and check-marks are saved only in this browser and never uploaded. Export a JSON backup if you want to keep it or move devices.' },
      { q: 'What does the % column mean?', a: 'Your completion rate for the visible month — days marked done out of the days in that month.' },
    ],
    keywords: ['habit tracker', 'daily habit tracker', 'streak tracker', 'dont break the chain', 'habit tracker online', 'monthly habit tracker'],
  },
];
