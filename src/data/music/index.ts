/** Music & Audio calculator registry. One entry drives a /music/ page. */

export interface MusicToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'notefreq' | 'delay' | 'tap' | 'metronome' | 'interval' | 'transpose' | 'filesize' | 'timesig' | 'chordscale';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const MUSIC_TOOLS: MusicToolDef[] = [
  {
    slug: 'note-frequency-calculator',
    name: 'Note Frequency Calculator',
    icon: '🎵',
    widget: 'notefreq',
    description: 'Convert musical notes to frequencies (Hz) and back, with MIDI numbers — equal temperament, A4 = 440 Hz by default and adjustable for A=432 or historical tunings. In your browser.',
    lead: 'Convert any note to its frequency in hertz (and MIDI number), or find the nearest note for a frequency — with an adjustable reference pitch.',
    how: 'In equal temperament, each note\'s frequency is f = A4 × 2^((n − 69)⁄12), where n is the MIDI note number and A4 (MIDI 69) is the reference, standardised at 440 Hz. The tool computes the frequency for any note and octave, or works backwards from a frequency to the nearest note and how many cents sharp or flat it is. Change the reference to tune to A=432 or older pitch standards.',
    note: 'Middle C is C4 = MIDI 60 (scientific pitch notation). Each octave doubles the frequency, and there are 100 cents to a semitone. The 440 Hz standard is ISO 16; some orchestras and genres use 442, 443 or the alternative 432 Hz.',
    faqs: [
      { q: 'What is the frequency of A4?', a: 'A4 (the A above middle C) is 440 Hz by the modern standard (ISO 16). Every other note is derived from it: f = 440 × 2^((MIDI − 69)⁄12).' },
      { q: 'How do I convert a note to a frequency?', a: 'Use equal temperament: f = 440 × 2^((n − 69)⁄12), where n is the note\'s MIDI number. Middle C (C4, MIDI 60) is about 261.63 Hz; A5 is 880 Hz (an octave above A4). The tool does it for any note.' },
      { q: 'What is A=432 tuning?', a: 'An alternative reference pitch of 432 Hz for A4 instead of 440, favoured by some for its supposed warmer sound. Set the reference to 432 and the tool retunes every note accordingly.' },
      { q: 'What are cents in music?', a: 'A cent is 1⁄100 of a semitone — 1,200 cents to an octave. They measure fine tuning differences: a note 10 cents sharp is slightly, but audibly, higher than in tune. The tool shows how many cents a frequency is off the nearest note.' },
      { q: 'What is a MIDI note number?', a: 'A number from 0 to 127 identifying a pitch, where 69 is A4 (440 Hz) and 60 is middle C. MIDI numbers make it easy to compute frequencies and transpose by simple addition.' },
    ],
    keywords: ['note frequency calculator', 'note to frequency', 'frequency to note', 'musical note hz', 'a440 calculator', 'midi note frequency', 'pitch frequency calculator'],
  },
  {
    slug: 'bpm-delay-calculator',
    name: 'BPM to Delay Time Calculator',
    icon: '🎛️',
    widget: 'delay',
    description: 'Convert tempo (BPM) into delay and echo times in milliseconds for every note value — straight, dotted and triplet — plus Hz for tempo-synced LFOs. For producers. In your browser.',
    lead: 'Enter your track\'s tempo to get delay, echo and reverb pre-delay times in milliseconds for each note value — straight, dotted and triplet.',
    how: 'A quarter-note beat lasts 60,000 ÷ BPM milliseconds. From that, every note division follows: an eighth is half, a sixteenth a quarter, and so on. Dotted values are 1.5× as long and triplets are ⅔ as long. The tool builds the full table so you can dial tempo-synced delay and modulation by ear or by number.',
    note: 'Setting a delay to a note value locks the echoes to the groove instead of muddying it. Dotted-eighth delays are a classic rhythmic effect; the Hz column converts the same timings for tempo-synced LFOs and tremolo. If your plugin syncs to host tempo, you may not need the numbers — but they\'re essential for hardware and free-running units.',
    faqs: [
      { q: 'How do I calculate delay time from BPM?', a: 'A quarter note is 60,000 ÷ BPM milliseconds. At 120 BPM that\'s 500 ms; an eighth note is 250 ms, a sixteenth 125 ms. Dotted values ×1.5, triplets ×⅔. The tool lists them all.' },
      { q: 'What delay time should I use at 120 BPM?', a: 'It depends on the effect: a quarter-note delay is 500 ms, an eighth 250 ms, a dotted-eighth 375 ms (a popular rhythmic delay). Match the note value to the feel you want.' },
      { q: 'What is a dotted-eighth delay?', a: 'A delay set to 1.5× an eighth note — 375 ms at 120 BPM. It creates an offbeat, galloping echo made famous on many guitar and synth parts. The tool gives the dotted time for every division.' },
      { q: 'How do I sync an LFO to tempo?', a: 'Convert the note value\'s period (in ms) to a frequency: Hz = 1,000 ÷ ms. A quarter note at 120 BPM (500 ms) is 2 Hz. The Hz column does this for you.' },
      { q: 'What about reverb pre-delay?', a: 'Setting reverb pre-delay to a small note value (like a sixteenth or thirty-second) separates the dry sound from the tail in time with the track, keeping things clear. Use the shorter divisions in the table.' },
    ],
    keywords: ['bpm to delay calculator', 'delay time calculator', 'bpm to ms', 'delay time chart', 'tempo delay calculator', 'reverb pre-delay calculator', 'bpm milliseconds'],
  },
  {
    slug: 'tap-tempo',
    name: 'Tap Tempo (BPM Counter)',
    icon: '👆',
    widget: 'tap',
    description: 'Find the tempo of any song by tapping along — a live BPM counter that averages your taps. Tap with the mouse or the spacebar. In your browser.',
    lead: 'Tap the button (or press the spacebar) in time with the music, and read the tempo in BPM — averaged over your last few taps.',
    how: 'The tool records the exact time of each tap and measures the intervals between them. The tempo is 60,000 divided by the average interval in milliseconds. It uses a rolling window of your recent taps, so the reading settles as you keep a steady beat, and it resets automatically if you pause for a couple of seconds.',
    note: 'Tap on the strong beats (usually the quarter-note pulse you\'d clap to) for a musical BPM. The more taps you give and the steadier they are, the more accurate the average. It\'s the quickest way to find a song\'s tempo without any analysis.',
    faqs: [
      { q: 'How do I find the BPM of a song?', a: 'Tap along with the beat — the tool averages the time between your taps and shows the tempo in BPM. Tap the quarter-note pulse (the beat you\'d naturally clap to) for the standard tempo.' },
      { q: 'How does a tap tempo counter work?', a: 'It times the gaps between your taps and converts the average gap to beats per minute: BPM = 60,000 ÷ average interval in milliseconds. More taps give a steadier, more accurate result.' },
      { q: 'Can I use the keyboard to tap?', a: 'Yes — press the spacebar (or Enter) in time with the music instead of clicking. Some people find a key easier to tap steadily than the mouse.' },
      { q: 'Why does the BPM keep changing as I tap?', a: 'It\'s averaging your recent taps, so small timing variations shift the number slightly. Keep a steady beat and it converges; the reading resets if you pause for more than about two seconds.' },
      { q: 'How many taps do I need?', a: 'A couple gives a first estimate, but 4–8 steady taps give a reliable average. Tapping through a full bar or two irons out any unevenness.' },
    ],
    keywords: ['tap tempo', 'bpm counter', 'bpm tapper', 'tap bpm', 'find song bpm', 'tempo tapper', 'beats per minute counter'],
  },
  {
    slug: 'metronome',
    name: 'Online Metronome',
    icon: '🎼',
    widget: 'metronome',
    description: 'A free, precise online metronome with adjustable tempo and time signature, and an accented downbeat. Uses sample-accurate Web Audio timing. In your browser.',
    lead: 'Set a tempo and time signature and practise to a steady click — with the first beat of each bar accented, and precise Web Audio timing.',
    how: 'The metronome schedules each click ahead of time using the Web Audio clock, which is sample-accurate and doesn\'t drift the way ordinary timers do. You set the tempo (40–240 BPM) and the number of beats per bar; the first beat of each bar gets a higher-pitched accent so you can feel the downbeat, with a visual indicator that follows along.',
    note: 'Practising with a metronome is one of the most effective ways to build steady timing. Start slow enough to play cleanly, then raise the tempo gradually. Audio only starts when you press Start, and everything runs locally in your browser.',
    faqs: [
      { q: 'How do I use a metronome?', a: 'Set the tempo to match your piece (or slower to learn it), choose the beats per bar to match the time signature, and press Start. Play along with the click, keeping the accented downbeat aligned with the start of each bar.' },
      { q: 'What tempo should I practise at?', a: 'Start slow enough to play every note cleanly and evenly, then increase the tempo in small steps once it\'s comfortable. Building accuracy slowly beats rushing and reinforcing mistakes.' },
      { q: 'Is this metronome accurate?', a: 'Yes — it uses the Web Audio clock to schedule clicks with sample accuracy, so it stays rock-steady rather than drifting like a simple timer. Timing is as reliable as a hardware metronome.' },
      { q: 'What does the accented beat mean?', a: 'The higher click marks beat one, the downbeat of each bar. It helps you feel the metre — for example the strong-weak-weak pattern of 3/4 — instead of a featureless stream of clicks.' },
      { q: 'Does it work offline?', a: 'Yes. Like all LazyTools, the metronome runs entirely in your browser and keeps working with no internet connection once the page has loaded.' },
    ],
    keywords: ['online metronome', 'free metronome', 'metronome online', 'web metronome', 'digital metronome', 'metronome with time signature', 'practice metronome'],
  },
  {
    slug: 'interval-calculator',
    name: 'Musical Interval Calculator',
    icon: '🎹',
    widget: 'interval',
    description: 'Find the interval between two notes — its name, the number of semitones and cents, and the frequency ratio. In your browser.',
    lead: 'Pick two notes and get the interval between them — its name, semitones, cents and the frequency ratio.',
    how: 'The tool converts each note to a frequency (equal temperament), then measures the distance: semitones = 12 × log₂(f₂/f₁), cents = 1,200 × log₂(f₂/f₁), and the frequency ratio is 2^(semitones⁄12). It names the interval (major third, perfect fifth, and so on) from the number of semitones.',
    note: 'Equal-temperament ratios are close to, but not exactly, the pure whole-number ratios of just intonation — a perfect fifth is 1.4983 rather than exactly 3:2 = 1.5. That tiny compromise is what lets keyboards play in every key.',
    faqs: [
      { q: 'How many semitones is a perfect fifth?', a: 'Seven semitones — for example C to G. Its frequency ratio in equal temperament is 2^(7⁄12) ≈ 1.498, very close to the pure 3:2 ratio of 1.5.' },
      { q: 'How do I calculate the interval between two notes?', a: 'Count the semitones between them, or compute it from frequencies: semitones = 12 × log₂(f₂/f₁). The tool names the interval and also gives the cents and frequency ratio.' },
      { q: 'What is the frequency ratio of an octave?', a: 'Exactly 2:1 — the higher note is double the frequency. An octave is 12 semitones or 1,200 cents.' },
      { q: 'What\'s the difference between cents and semitones?', a: 'A semitone is the smallest step on a piano; a cent is 1⁄100 of a semitone, used for fine tuning. There are 12 semitones or 1,200 cents in an octave.' },
      { q: 'Why isn\'t a perfect fifth exactly 3:2?', a: 'Equal temperament divides the octave into 12 identical steps so music sounds in tune in every key. That makes most intervals slightly off the pure just-intonation ratios — a fifth is 1.4983 instead of 1.5, a difference of about 2 cents.' },
    ],
    keywords: ['interval calculator music', 'musical interval calculator', 'semitones between notes', 'cents calculator music', 'frequency ratio interval', 'note interval calculator', 'music interval finder'],
  },
  {
    slug: 'transpose-calculator',
    name: 'Chord & Note Transposer',
    icon: '🎸',
    widget: 'transpose',
    description: 'Transpose notes and chords up or down by any number of semitones — with capo guidance for guitar. Keeps chord qualities intact. In your browser.',
    lead: 'Enter notes or chords and shift them up or down by semitones — with a capo hint for guitarists.',
    how: 'The tool moves each note or chord root by the number of semitones you choose, wrapping around the 12-note chromatic scale (12 semitones is a full octave). Chord qualities like m, 7 and maj7 are preserved. You can spell the result with sharps or flats, and it shows the equivalent guitar capo position.',
    note: 'Transposing changes the key without changing the tune — handy for matching a singer\'s range or an easier set of chord shapes. On guitar, a capo on fret N raises everything N semitones, so you can keep familiar open-chord shapes while playing in a higher key.',
    faqs: [
      { q: 'How do I transpose a song to a different key?', a: 'Shift every chord and note by the same number of semitones. To go from C to D, move up 2 semitones: C→D, G→A, Am→Bm, F→G. Enter your chords and set the semitones and the tool rewrites them.' },
      { q: 'How does a capo change the key?', a: 'A capo on fret N raises the pitch by N semitones, so the same shapes sound higher. To play in a key that\'s N semitones up while using easy open chords, capo on fret N and play the original shapes.' },
      { q: 'How many semitones between keys?', a: 'Count up the chromatic scale: C to D is 2 semitones, C to E is 4, C to G is 7. An octave is 12. The transposer handles the counting and wrapping for you.' },
      { q: 'Does transposing keep the chord type?', a: 'Yes — only the root moves. A minor chord stays minor, a 7th stays a 7th. So Am transposed up 2 semitones becomes Bm, and G7 becomes A7.' },
      { q: 'Should I use sharps or flats?', a: 'It depends on the target key\'s key signature, but for a quick transpose either spelling is fine. Toggle flats if the result reads more naturally that way (e.g. B♭ rather than A♯).' },
    ],
    keywords: ['transpose calculator', 'chord transposer', 'music transposer', 'transpose chords', 'capo calculator', 'key transposer', 'transpose notes semitones'],
  },
  {
    slug: 'audio-file-size-calculator',
    name: 'Audio File Size Calculator',
    icon: '💾',
    widget: 'filesize',
    description: 'Calculate the size of uncompressed audio (WAV/PCM) from sample rate, bit depth, channels and duration — and the data rate. In your browser.',
    lead: 'Choose the sample rate, bit depth, channels and length to get the uncompressed audio file size and data rate.',
    how: 'Uncompressed PCM audio (WAV, AIFF) stores every sample directly, so its size is simply sample rate × (bit depth ÷ 8 bytes) × channels × seconds. The tool computes the total size and the data rate (sample rate × bit depth × channels), which is how many bits per second the format uses.',
    note: 'CD quality — 44,100 Hz, 16-bit, stereo — works out to about 10 MB per minute. Higher sample rates and bit depths (used in studios) multiply that quickly, which is why recording projects grow so large. Lossy formats (MP3, AAC) are a fraction of the size but discard some data.',
    faqs: [
      { q: 'How do I calculate audio file size?', a: 'Size = sample rate × (bit depth ÷ 8) × channels × seconds. For 44,100 Hz, 16-bit, stereo, 3 minutes (180 s): 44,100 × 2 × 2 × 180 ≈ 31.75 MB.' },
      { q: 'How big is a minute of CD-quality audio?', a: 'About 10 MB — 44,100 Hz × 16-bit × 2 channels × 60 s = 10,584,000 bytes. So a 3-minute song is roughly 30 MB uncompressed.' },
      { q: 'What is the bitrate of CD audio?', a: '1,411 kbps — sample rate (44,100) × bit depth (16) × channels (2) = 1,411,200 bits per second. MP3s are typically 128–320 kbps, a fraction of that.' },
      { q: 'Why are studio files so large?', a: 'Studios often record at 48 kHz or 96 kHz and 24-bit, sometimes with many channels. Each of those multiplies the size — 96 kHz/24-bit stereo is over three times the size of CD quality per minute.' },
      { q: 'Does this apply to MP3 files?', a: 'No — this is for uncompressed PCM (WAV/AIFF). MP3, AAC and similar are compressed and much smaller; their size depends on the chosen bitrate, not the raw sample maths.' },
    ],
    keywords: ['audio file size calculator', 'wav file size calculator', 'pcm size calculator', 'audio bitrate calculator', 'recording file size', 'wav size per minute', 'audio storage calculator'],
  },
  {
    slug: 'time-signature-calculator',
    name: 'Bar & Time Signature Calculator',
    icon: '🥁',
    widget: 'timesig',
    description: 'Calculate how long a bar lasts (and any number of bars) from the tempo and time signature — for arranging song sections to a target length. In your browser.',
    lead: 'Enter the tempo and time signature to get the length of one bar — and of any number of bars — in seconds.',
    how: 'BPM counts quarter-notes per minute, so a quarter-note beat is 60 ÷ BPM seconds. One bar lasts beats-per-bar × (4 ÷ denominator) × (60 ÷ BPM) seconds — the (4 ÷ denominator) term adjusts for time signatures whose beat isn\'t a quarter note. Multiply by the number of bars for a section\'s total length.',
    note: 'This is handy for arranging: working out how many bars fit a 30-second ad, or how long an 8-bar intro runs. A bar of 4/4 at 120 BPM is 2 seconds; the same tempo in 6/8 gives 1.5-second bars.',
    faqs: [
      { q: 'How long is one bar of music?', a: 'It depends on tempo and time signature: bar = beats-per-bar × (4 ÷ denominator) × (60 ÷ BPM) seconds. A 4/4 bar at 120 BPM is 2 seconds; at 90 BPM it\'s about 2.67 seconds.' },
      { q: 'How do I work out how many bars fit in a time?', a: 'Divide the target time by the length of one bar. At 120 BPM in 4/4 (2-second bars), a 30-second section is 15 bars. The tool shows bars-per-minute to make this easy.' },
      { q: 'How does the time signature affect bar length?', a: 'The bottom number sets which note gets the beat, and the top sets how many. Since BPM counts quarter-notes, the (4 ÷ denominator) factor accounts for eighth-note or half-note beats — 6/8 bars are shorter than 6/4 at the same BPM.' },
      { q: 'How long is a 4/4 bar at 120 BPM?', a: 'Exactly 2 seconds — four quarter-note beats at 0.5 seconds each (60 ÷ 120). Eight bars would be 16 seconds.' },
      { q: 'Why calculate bar lengths?', a: 'For arranging and syncing: fitting a song section to a video cue, planning an intro of a set length, or lining up loops. Knowing the seconds-per-bar turns musical structure into clock time.' },
    ],
    keywords: ['time signature calculator', 'bar length calculator', 'bars to seconds', 'song length calculator bpm', 'measures to time', 'how long is a bar', 'music bar duration'],
  },
  {
    slug: 'chord-scale-finder',
    name: 'Chord & Scale Finder',
    icon: '🎹',
    widget: 'chordscale',
    description: 'Build any chord or scale from a root note, or identify the chord from a set of notes — with a piano diagram, in your browser.',
    lead: 'Pick a root and a chord or scale to see its notes on a keyboard — or tap the notes you\'re playing and let the tool name the chord.',
    how: 'Every chord and scale is a fixed pattern of semitone steps from a root: a major triad is the root plus 4 and 7 semitones, a major scale is 0-2-4-5-7-9-11. In "Build" mode you choose a root and a chord or scale and the tool lays out the notes (spelled with sharps or flats) and lights them on a one-octave keyboard. In "Identify" mode you tap the notes you have and it matches your exact set — regardless of octave or inversion — to every named chord that fits.',
    note: 'Because a set of pitch classes can belong to more than one chord, symmetric shapes return several names: a diminished 7th (every note three semitones apart) is spelled four ways, one from each of its notes. The spellings are equal-tempered and enharmonic (A♯ = B♭) — the tool doesn\'t pick a key-correct spelling, just the pitches.',
    faqs: [
      { q: 'What notes are in a C major chord?', a: 'C, E and G — the root plus the notes 4 and 7 semitones above it. A major triad is always root, major third and perfect fifth; the tool builds it for any root you pick.' },
      { q: 'How do I find the notes of a scale?', a: 'Apply the scale\'s semitone formula to the root. A major scale is 0-2-4-5-7-9-11 semitones, so C major is C D E F G A B; G major (same pattern from G) is G A B C D E F♯. Choose the root and scale and the tool spells it out.' },
      { q: 'How do I identify a chord from its notes?', a: 'Switch to "Identify", tap the notes you\'re playing, and the tool matches that exact set of pitch classes to every named chord that fits — ignoring octave and inversion. Tap C, E and G and it returns C major.' },
      { q: 'Why does one set of notes match several chords?', a: 'Some chords are symmetric, so the same pitches spell more than one chord. The diminished 7th stacks minor thirds evenly, so C-E♭-G♭-A is also E♭, G♭ and A diminished 7th — the tool lists all the valid names.' },
      { q: 'What is the difference between a chord and a scale here?', a: 'A chord is a small set of notes played together (usually 3–5); a scale is the ordered set of 5–12 notes a melody or key draws from. Both are built from semitone formulas — the tool covers common chords and scales/modes.' },
      { q: 'Does it spell chords in the correct key?', a: 'No — it gives the correct pitches but a single enharmonic spelling (choosing sharps or flats by your toggle), not a key-signature-aware spelling. So it may show A♯ where a score in the key would write B♭; the sounding notes are identical.' },
    ],
    keywords: ['chord finder', 'scale finder', 'chord calculator', 'what notes are in a chord', 'chord identifier', 'scale notes', 'chord spelling', 'guitar piano chord finder'],
  },
];

export const getMusicTool = (slug: string) => MUSIC_TOOLS.find((t) => t.slug === slug);
