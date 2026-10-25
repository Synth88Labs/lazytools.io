/** Typing & Reflex Tests registry — interactive, measured, 100% client-side. */

export type TestWidget = 'typing' | 'reaction' | 'cps' | 'memory';

export interface TestToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: TestWidget;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const TEST_TOOLS: TestToolDef[] = [
  {
    slug: 'typing-speed-test',
    name: 'Typing Speed Test',
    icon: '⌨️',
    description:
      'Free typing speed test — measure your words per minute (WPM), accuracy and raw speed on a 15, 30 or 60 second test. Runs in your browser, nothing uploaded.',
    lead: 'Type the passage as fast and accurately as you can. Your WPM, accuracy and raw speed are measured live, entirely in your browser.',
    widget: 'typing',
    how: 'Words per minute (WPM) is the standard way of measuring typing speed, and it does not literally count words. The accepted convention, used by typing tests everywhere, defines one "word" as 5 characters including spaces. So net WPM = (correct characters ÷ 5) ÷ minutes elapsed. This test shows the running total live: as you type, each character is checked against the passage and coloured green (correct) or red (wrong), the timer counts down from your chosen length (15, 30 or 60 seconds), and at the end you get net WPM, raw WPM (before mistakes are subtracted), accuracy as a percentage, and the character counts. Everything is computed on your device with JavaScript; the words you type are never sent anywhere.',
    note: 'Accuracy matters as much as raw speed: a fast run riddled with errors scores a low net WPM because wrong characters do not count toward it. The passage is built from a list of the most common English words, so the test measures general typing fluency rather than your familiarity with one fixed sentence.',
    faqs: [
      { q: 'What is a good typing speed?', a: 'The average typing speed is roughly 40 WPM. Around 50–60 WPM is solidly above average, 70–80 WPM is fast, and professional typists and transcriptionists often sustain 90–120 WPM. For most office and everyday work, anything above about 50 WPM with high accuracy is comfortably productive.' },
      { q: 'How is WPM calculated?', a: 'WPM uses the standard "5 characters = 1 word" convention: net WPM = (correct characters typed ÷ 5) ÷ minutes. Dividing by 5 rather than counting actual words keeps scores comparable regardless of how long the words are. Raw WPM counts every character you typed; net WPM counts only the correct ones.' },
      { q: 'What is the difference between WPM and CPM?', a: 'CPM is characters per minute and WPM is words per minute. They measure the same thing at different scales: WPM = CPM ÷ 5, because one "word" is defined as 5 characters. A speed of 250 CPM is therefore 50 WPM.' },
      { q: 'Why does accuracy lower my WPM?', a: 'Net WPM only counts characters you typed correctly, so every mistake is a character that does not contribute to your score, and it costs the time you spent typing it. That is why a careful 95%-accurate run usually beats a frantic 80%-accurate one. Accuracy is shown separately so you can see the trade-off.' },
      { q: 'Is my typing recorded or uploaded?', a: 'No. The whole test runs in your browser with JavaScript. What you type is compared against the passage locally and nothing, not your keystrokes, not your score, is sent to LazyTools or anyone else. It works offline.' },
      { q: 'How can I type faster?', a: 'Prioritise accuracy first, then speed: touch-type with all ten fingers, keep your eyes on the text rather than the keyboard, and let speed build from consistent, correct repetition. Short, regular practice sessions improve WPM far more than occasional long ones.' },
    ],
    keywords: ['typing speed test', 'typing test', 'words per minute test', 'wpm test', 'how fast can i type', 'typing speed wpm'],
  },
  {
    slug: 'reaction-time-test',
    name: 'Reaction Time Test',
    icon: '⚡',
    description:
      'Test your reaction time in milliseconds. Click the moment the screen turns green, over five trials, and see your average and best. In-browser, nothing uploaded.',
    lead: 'When the red box turns green, click as fast as you can. Five trials give your average and best reaction time in milliseconds.',
    widget: 'reaction',
    how: 'Reaction time is the gap between a stimulus appearing and your response to it. This test measures simple visual reaction time: the box waits a random amount of time (so you cannot anticipate it), turns green, and records the milliseconds until you click or tap. It runs five trials and reports your average and your best, discarding any false start where you clicked before the colour changed. The timing uses the browser\'s high-resolution clock, so it is accurate to well under a millisecond; the small, unavoidable overhead is your display\'s refresh rate and input latency, which affect everyone equally.',
    note: 'A typical result includes your screen and mouse/touch latency, so the absolute number is best used to compare yourself against yourself over time, rather than as a lab-grade measurement. Clicking before green is a false start and does not count, guessing the timing does not help.',
    faqs: [
      { q: 'What is the average human reaction time?', a: 'For a simple visual reaction (click when you see a colour change), the average is roughly 200–250 milliseconds. Reactions to sound are slightly faster, around 150–200 ms, and touch is in a similar range. Anything consistently under about 200 ms for a visual test is quick.' },
      { q: 'What is a good reaction time?', a: 'Around 250 ms is average, 200–220 ms is good, and consistently under 200 ms is fast. Elite athletes and competitive gamers often average in the 150–200 ms range on simple reaction tasks. Consistency across trials matters as much as a single quick result.' },
      { q: 'Why is my reaction time slower than I expect?', a: 'The number includes more than your brain and muscles: your monitor\'s refresh rate, the mouse or touchscreen\'s input lag, and the browser all add a few milliseconds each. These are the same for every click, so the test is still a fair way to track your own improvement or compare trials.' },
      { q: 'What affects reaction time?', a: 'Alertness, fatigue, caffeine, age, and whether you were anticipating the signal all matter. Reaction time tends to be fastest in early adulthood and slows gradually with age. Being warmed up and focused on the box, rather than distracted, gives your truest result.' },
      { q: 'Does clicking early help?', a: 'No. If you click before the box turns green it counts as a false start and that trial is voided, so you cannot game the test by anticipating. The test deliberately randomises the delay to prevent guessing.' },
      { q: 'Is anything uploaded?', a: 'No. The timing and scoring happen entirely in your browser; nothing about your results leaves your device.' },
    ],
    keywords: ['reaction time test', 'reaction speed test', 'test reaction time', 'average reaction time', 'click reaction test', 'reflex test'],
  },
  {
    slug: 'click-speed-test',
    name: 'Click Speed Test (CPS)',
    icon: '🖱️',
    description:
      'Click speed test — how many clicks per second (CPS) can you do? Click as fast as you can in 5 or 10 seconds and see your CPS and total. In-browser, nothing uploaded.',
    lead: 'Click as fast as you can for the chosen time. Your clicks per second (CPS) and total clicks are counted live, in your browser.',
    widget: 'cps',
    how: 'Clicks per second (CPS) measures how rapidly you can click a mouse button (or tap). Pick a duration, then click the box as many times as possible; the timer starts on your first click, counts every click until time runs out, and divides the total by the number of seconds to give your CPS. The count and timer update live. Because the clock starts on your first click rather than a countdown, you are measured only on active clicking, not reaction time.',
    note: 'Different clicking techniques give very different results: steady "regular" clicking, "jitter" clicking (tensing the arm to vibrate the finger), and "butterfly" clicking (alternating two fingers) can roughly double the raw number. The test counts genuine pointer clicks; held buttons or auto-clickers are not clicks and will not register as faster legitimate scores.',
    faqs: [
      { q: 'What is a good CPS (clicks per second)?', a: 'A typical person clicks around 6–7 CPS with normal clicking. Above about 8 CPS is fast, and practised players using jitter or butterfly techniques can reach 10–14+ CPS over short bursts. Over longer windows (10+ seconds) sustainable rates are lower because the hand tires.' },
      { q: 'What is the average clicks per second?', a: 'For ordinary clicking, roughly 6–7 CPS is average over a short 5-second test. The average drops over longer tests as your hand fatigues, which is why 5-second and 10-second scores are not directly comparable.' },
      { q: 'What is jitter clicking and butterfly clicking?', a: 'Jitter clicking is tensing your forearm so your finger vibrates on the button, pushing CPS into the 10–14 range. Butterfly clicking alternates two fingers on one button to roughly double your rate. Both can strain the hand, so warm up and stop if anything hurts.' },
      { q: 'How is CPS calculated?', a: 'CPS = total clicks ÷ seconds elapsed. The timer begins on your first click, so a 24-click run over 4 seconds is 6 CPS. Picking a longer duration gives a steadier, more realistic average than a short burst.' },
      { q: 'Do auto-clickers work on this test?', a: 'The test counts real pointer clicks you make, so legitimate scores come from actual clicking. Auto-clickers defeat the point of measuring your own speed, and the goal here is to test and improve your real click rate.' },
      { q: 'Is my score sent anywhere?', a: 'No. Clicks are counted in your browser and the result stays on your device; nothing is uploaded.' },
    ],
    keywords: ['click speed test', 'cps test', 'clicks per second', 'click test', 'how fast can i click', 'cps counter'],
  },
  {
    slug: 'number-memory-test',
    name: 'Number Memory Test',
    icon: '🧠',
    description:
      'Number memory test — how many digits can you remember? A number flashes, then you type it back. Each level adds a digit. In-browser, nothing uploaded.',
    lead: 'A number appears for a moment, then disappears. Type it back from memory. Each level adds one more digit, how far can you get?',
    widget: 'memory',
    how: 'This measures your short-term memory span for digits. A number is shown briefly, then hidden; you type what you remember. Get it right and the next number is one digit longer; get it wrong and the test ends with your highest cleared level as your score. The display time scales slightly with length so each number is readable. It is a classic "digit span" task, the same idea used in cognitive assessments, run entirely in your browser.',
    note: 'Most people land around a span of 7 digits, the famous "seven, plus or minus two" range, though chunking (grouping digits, like a phone number) and rehearsal can push it higher. The numbers are randomly generated each attempt, so you cannot memorise a fixed answer; every run is a fresh test.',
    faqs: [
      { q: 'How many numbers can the average person remember?', a: 'About 7 digits, give or take two, which is the well-known "magical number seven" range described by psychologist George Miller. Many people manage 7–9 with focus; getting much beyond that usually means you are grouping digits into chunks rather than holding them individually.' },
      { q: 'What is digit span?', a: 'Digit span is the longest sequence of numbers you can recall in order immediately after seeing or hearing it. It is a standard measure of short-term (working) memory capacity, and this test is a self-serve version of it.' },
      { q: 'How can I remember more digits?', a: 'Chunk them: group a long number into pairs or triples, the way phone numbers are written, so your memory holds a few chunks instead of many single digits. Saying the number to yourself (subvocal rehearsal) and visualising it also help. With practice and mnemonic techniques, spans well into the teens are achievable.' },
      { q: 'What is the difference between short-term and working memory?', a: 'Short-term memory is the brief holding of information, like a number you just saw. Working memory is holding and actively manipulating it, like adding those digits in your head. This test targets short-term/working memory capacity for numbers specifically.' },
      { q: 'Is this a real cognitive test?', a: 'It uses the same digit-span idea as clinical and research memory assessments, but it is a casual self-test for fun and practice, not a diagnostic tool. A single score is not a medical measurement; use it to track yourself or challenge friends.' },
      { q: 'Are the numbers or my answers stored?', a: 'No. Numbers are generated and checked in your browser, and nothing about your attempts is uploaded. It works offline.' },
    ],
    keywords: ['number memory test', 'digit span test', 'memory test numbers', 'short term memory test', 'how many numbers can you remember', 'working memory test'],
  },
];
