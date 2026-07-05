/** Generators registry. */

export interface GenToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'password' | 'uuid' | 'qr' | 'random-number' | 'lorem';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const GEN_TOOLS: GenToolDef[] = [
  {
    slug: 'password-generator',
    name: 'Password Generator',
    icon: '🔑',
    description:
      'Generate strong random passwords with length and character-set control, entropy shown honestly, using the browser’s cryptographic randomness. Never transmitted.',
    lead: 'Cryptographically random passwords, generated on your device — with the entropy math shown, because length beats complexity.',
    widget: 'password',
    how: 'Characters are drawn with crypto.getRandomValues — the browser’s cryptographically secure random source, not Math.random() — using rejection sampling so every character is exactly equally likely. The entropy display is the honest strength measure: log₂(alphabet size) × length, in bits. Each additional character adds more strength than any symbol requirement does.',
    note: 'The counterintuitive truth the entropy meter makes visible: a 16-character lowercase-only password (~75 bits) is far stronger than an 8-character everything-enabled one (~52 bits). Length is the lever. And the only sane way to use unique random passwords everywhere is a password manager — generate here, store there.',
    faqs: [
      { q: 'How long should a password be?', a: 'For accounts guarded by rate-limited logins, 12–14 random characters is ample. For anything offline-crackable (password managers, disk encryption), 16+ characters or ~90+ bits of entropy. The meter on this page shows the bits live.' },
      { q: 'What do the entropy bits mean?', a: 'log₂ of the number of equally likely possibilities: each bit doubles the guessing work. ~50 bits resists casual attack; 80+ bits is strong against serious offline cracking; 100+ is overkill in the good way.' },
      { q: 'Is this really random?', a: 'Yes — crypto.getRandomValues taps the operating system\'s CSPRNG (the same source TLS keys use), with rejection sampling to avoid modulo bias. Math.random(), which weaker generators use, is predictable by design.' },
      { q: 'Should I exclude ambiguous characters like l, 1, O, 0?', a: 'Only if a human must read or retype the password (WiFi keys, printed codes). It slightly reduces entropy per character — compensate with two extra characters.' },
      { q: 'Is the password sent anywhere?', a: 'No — generation happens in your browser\'s memory and nothing is transmitted or stored. Generate offline if you want the proof.' },
    ],
    keywords: ['password generator', 'strong random password', 'secure password', 'password entropy', 'random password generator'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    icon: '🆔',
    description:
      'Generate UUID v4 identifiers — single or in bulk, uppercase or lowercase — using crypto.randomUUID. In-browser, instant.',
    lead: 'Random v4 UUIDs like 8f14e45f-… — one click, up to 1,000 at a time, from the browser’s native generator.',
    widget: 'uuid',
    how: 'UUIDs come from crypto.randomUUID(), the browser’s built-in RFC 4122 version-4 generator: 122 random bits plus 6 fixed version/variant bits, formatted as the familiar 8-4-4-4-12 hex groups. With 2¹²² possibilities, collisions are not a practical concern — you could generate a billion per second for centuries without an expected duplicate.',
    note: 'The digit to check when someone asks "is this really a v4?": the third group starts with 4, and the fourth group starts with 8, 9, a or b — the fixed version and variant bits. Databases and APIs use v4 as the default "no coordination needed" identifier; for time-sortable IDs, v7 exists but browser support for generating it natively hasn\'t landed, so we generate the universally supported v4.',
    faqs: [
      { q: 'What is a version 4 UUID?', a: 'A 128-bit identifier where 122 bits are random (RFC 4122). The "4" in the third group is the version marker. It needs no central authority — randomness alone makes collisions negligible.' },
      { q: 'Can two generated UUIDs collide?', a: 'Theoretically yes, practically no: with 2¹²² values, generating billions per second for the age of the universe still leaves collision odds negligible. That is the design point.' },
      { q: 'Uppercase or lowercase?', a: 'RFC 4122 outputs lowercase and recommends case-insensitive comparison. Some ecosystems (Microsoft GUIDs) display uppercase — the toggle covers both, same value either way.' },
      { q: 'What about sortable UUIDs (v7)?', a: 'UUID v7 embeds a timestamp for index-friendly ordering — great for database keys. Browsers\' native generator only does v4 today, so that is what this tool produces; v4 remains the correct general-purpose choice.' },
      { q: 'Are these generated locally?', a: 'Yes — crypto.randomUUID() runs on your device; nothing is requested from or sent to any server.' },
    ],
    keywords: ['uuid generator', 'uuid v4', 'guid generator', 'bulk uuid', 'random uuid online'],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    icon: '📱',
    description:
      'Generate QR codes for URLs, text or WiFi — downloadable PNG, size and error-correction control. Generated locally; the content never leaves your browser.',
    lead: 'Type a URL or any text, get a scannable QR code instantly — downloadable as PNG, generated entirely on your device.',
    widget: 'qr',
    how: 'The code is rendered by the open-source qrcode library in your browser: your text is encoded into the QR symbol’s data modules with Reed–Solomon error correction, then drawn to a canvas you can download as PNG. Error-correction level trades capacity for damage tolerance — level M (15%) suits screens; use Q or H (25/30%) for print that might get scuffed or overlay a logo.',
    note: 'Privacy is unusually relevant for QR generation: many "free QR generators" don’t encode your URL at all — they encode a redirect through their own tracking domain, so every scan pings them (and the code dies if they do). This generator encodes exactly your content, directly, with no middleman to break later.',
    faqs: [
      { q: 'Does this QR code expire or stop working?', a: 'Never — the content is encoded directly into the image with no server involved. Codes from services that route through their own short-links stop working when the service does; this one can\'t.' },
      { q: 'What does error correction level mean?', a: 'How much of the symbol can be damaged and still scan: L=7%, M=15%, Q=25%, H=30%. Higher levels make denser codes. M is the everyday default; H tolerates logos and print wear.' },
      { q: 'How much text fits in a QR code?', a: 'Up to ~4,296 alphanumeric characters at level L — but density grows with content, and dense codes scan poorly when small. Keep URLs short; for long content, encode a link to it.' },
      { q: 'What size should I print a QR code?', a: 'Rule of thumb: minimum 2×2 cm for close-range scanning, and scanning distance ÷ 10 for posters (a code scanned from 1 m should be ≥10 cm wide). Always test with a phone before mass printing.' },
      { q: 'Is my URL or text uploaded?', a: 'No — encoding happens in your browser. The content of your QR (which can be a private link or WiFi password) never touches a server.' },
    ],
    keywords: ['qr code generator', 'free qr code', 'qr code png', 'url to qr code', 'qr code without expiration'],
  },
  {
    slug: 'random-number-generator',
    name: 'Random Number Generator',
    icon: '🎲',
    description:
      'Generate random numbers in any range — single draws, multiple, with or without repeats — using cryptographic randomness. Fair and local.',
    lead: 'True random numbers in any range — one or many, unique or repeating — from the browser’s cryptographic source, so draws are actually fair.',
    widget: 'random-number',
    how: 'Numbers come from crypto.getRandomValues with rejection sampling, which guarantees every value in your range is exactly equally likely (naive modulo arithmetic skews toward low numbers). "Unique" mode performs a draw-without-replacement — a partial Fisher–Yates shuffle — so no value repeats, which is what raffles and assignments need.',
    note: 'For picking contest winners, the fairness details matter: cryptographic source (unpredictable), rejection sampling (unbiased), without-replacement (no duplicate winners). That combination is what "we drew winners randomly" should mean — and it runs verifiably on your device.',
    faqs: [
      { q: 'Are these truly random or pseudo-random?', a: 'Cryptographically secure pseudo-random: seeded from the operating system\'s entropy (hardware noise, timing), unpredictable in practice — the same class used for encryption keys. Distinct from Math.random(), which is reproducible and unsuitable for anything fair.' },
      { q: 'Is every number in the range equally likely?', a: 'Yes — rejection sampling discards raw values that would bias the mapping (the classic modulo-bias flaw in naive generators). 1 and the maximum have exactly equal probability.' },
      { q: 'How do I draw raffle winners without duplicates?', a: 'Set the range to your entry count, choose how many winners, and enable unique. Each entrant can win at most once; order of results is the draw order.' },
      { q: 'Can I generate negative numbers or decimals?', a: 'Negative ranges work (set min below zero). For decimals, generate integers at 10× or 100× scale and divide — which also makes the precision explicit.' },
      { q: 'Can anyone verify or influence the draw?', a: 'It runs locally with OS-grade randomness — nothing external influences it, and no server logs it. For public drawings, generate on screen in front of the audience.' },
    ],
    keywords: ['random number generator', 'rng', 'random number picker', 'raffle number generator', 'random between 1 and 100'],
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    icon: '📃',
    description:
      'Generate lorem ipsum placeholder text — by paragraphs, sentences or words, starting with the classic phrase or fully shuffled. In-browser.',
    lead: 'Placeholder text on demand — paragraphs, sentences or a word count, with the traditional "Lorem ipsum dolor sit amet" opening when you want it.',
    widget: 'lorem',
    how: 'The generator assembles sentences from the traditional lorem ipsum vocabulary — the scrambled Latin derived from Cicero’s De Finibus Bonorum et Malorum (45 BC) that printers have used as filler since the 1500s. Sentence and paragraph lengths vary naturally so the texture resembles real prose, which is the entire point: realistic shape, zero meaning.',
    note: 'Why designers still use meaningless Latin: readable placeholder text hijacks attention ("why does the homepage talk about pizza?") while lorem ipsum lets reviewers see layout, type and spacing. One caution — replace it before shipping; "lorem ipsum" appearing on production pages is common enough to be a genre of bug.',
    faqs: [
      { q: 'What does lorem ipsum actually mean?', a: 'Nothing readable — it\'s deliberately scrambled Latin based on a passage from Cicero (De Finibus, 45 BC). Fragments of real words remain ("dolor" = pain), but the text as a whole is intentionally nonsense.' },
      { q: 'Why not just use real placeholder sentences?', a: 'Because readable text steals the review: people critique the words instead of the design. Meaningless-but-natural-shaped text keeps eyes on layout and typography.' },
      { q: 'How much text is one "paragraph"?', a: 'Here, 3–6 sentences of 6–14 words — proportions resembling web prose. Generate by exact word count when a design spec demands it.' },
      { q: 'Does it always start with "Lorem ipsum dolor sit amet"?', a: 'By default yes (the recognizable convention); toggle it off for fully shuffled output when repeated blocks shouldn\'t all match.' },
      { q: 'Local generation?', a: 'Yes — instant, offline-capable, no request made.' },
    ],
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator', 'filler text', 'lorem ipsum paragraphs'],
  },
];

export function getGenTool(slug: string): GenToolDef | undefined {
  return GEN_TOOLS.find((t) => t.slug === slug);
}
