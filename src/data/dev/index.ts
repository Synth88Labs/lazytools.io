/** Developer-tools registry. */

export interface DevToolOption {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
}

export interface DevToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** 'transform' uses DevTransformTool; 'hash' uses HashTool; 'llm-tokens' uses LlmTokenCounterTool */
  widget: 'transform' | 'hash' | 'llm-tokens' | 'eth-units' | 'keccak' | 'eip55' | 'har' | 'sqlformat' | 'jsondiff' | 'hmac' | 'jwtenc' | 'utm';
  computeId?: string;
  options?: DevToolOption[];
  sample?: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const DEV_TOOLS: DevToolDef[] = [
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encoder / Decoder',
    icon: '🅱️',
    description:
      'Encode text to Base64 or decode Base64 to text — UTF-8-safe, with URL-safe variant. Runs in your browser; tokens and payloads never leave your machine.',
    lead: 'Base64 turns any bytes into 64 safe characters — encode or decode instantly, with correct UTF-8 handling and the URL-safe variant.',
    widget: 'transform',
    computeId: 'base64',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode (text → Base64)' },
          { value: 'decode', label: 'Decode (Base64 → text)' },
        ],
      },
      { id: 'urlSafe', label: 'URL-safe alphabet (- and _ instead of + and /)', type: 'checkbox' },
    ],
    sample: 'Hello, LazyTools! 🔒',
    how: 'Encoding converts the text to UTF-8 bytes first, then maps every 3 bytes to 4 characters from the 64-character alphabet (A–Z, a–z, 0–9, +, /), padding with =. That UTF-8 step matters: the browser’s raw btoa() corrupts anything beyond Latin-1 — emoji, accents, most languages. Decoding accepts both standard and URL-safe alphabets and tolerates missing padding.',
    note: 'Base64 is encoding, not encryption — anyone can decode it. Its job is transport: making binary or special-character data safe for JSON, URLs, headers and email. The output is ~33% larger than the input, which is the price of the safety. The URL-safe variant (RFC 4648 §5) is what JWTs and URL parameters use.',
    faqs: [
      { q: 'Is Base64 encryption?', a: 'No — it is a reversible transport encoding with zero secrecy. Anyone can decode it instantly. If you need confidentiality, encrypt first; Base64 is only for making bytes safe to transmit.' },
      { q: 'Why does Base64 output end with = signs?', a: 'Padding: input not divisible by 3 bytes leaves a partial final group, padded with one or two =. The URL-safe convention drops the padding, which decoders (including this one) reconstruct.' },
      { q: 'Why did my emoji break in other Base64 tools?', a: 'They used btoa() directly, which only handles Latin-1. Correct encoding converts to UTF-8 bytes first — this tool does, so emoji and non-Latin scripts round-trip cleanly.' },
      { q: 'What is the URL-safe variant?', a: 'The same encoding with + → - and / → _ (and padding dropped), so the result survives inside URLs and filenames. JWTs use it for all three segments.' },
      { q: 'How much bigger does Base64 make my data?', a: 'Exactly 4/3 of the byte length (~33% overhead), plus padding. The tool reports the ratio live.' },
    ],
    keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'url safe base64', 'base64 utf-8'],
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encoder / Decoder',
    icon: '🔗',
    description:
      'Percent-encode text for URLs or decode %XX sequences back — with the encodeURI vs encodeURIComponent distinction handled. In-browser.',
    lead: 'Spaces become %20, & becomes %26 — encode text safely into URLs, or decode percent-encoding back to readable text.',
    widget: 'transform',
    computeId: 'urlCodec',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' },
        ],
      },
      { id: 'component', label: 'Component mode (also encode / ? & = — for query values)', type: 'checkbox', defaultValue: 'true' },
    ],
    sample: 'price=100&currency=€ (50% off!)',
    how: 'Percent-encoding replaces unsafe bytes with %XX hex escapes per RFC 3986. The crucial choice is scope: component mode (encodeURIComponent) escapes everything including /, ?, & and = — right for a single query-string value; whole-URI mode (encodeURI) preserves those structural characters — right for encoding a complete URL. Decoding also converts + to space, the historical form-encoding convention.',
    note: 'The classic bug this tool prevents: putting an unencoded & inside a query value ("Tom & Jerry") and silently truncating the parameter at the ampersand. Encode values in component mode before assembling the URL, not after.',
    faqs: [
      { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'Scope. encodeURIComponent escapes everything unsafe including /?&=# — use it on individual values. encodeURI leaves URL structure intact — use it only on a complete URL. Wrong choice in either direction is the top URL-encoding bug.' },
      { q: 'Why does a space become %20 sometimes and + other times?', a: 'Two conventions: %20 is the RFC 3986 standard everywhere in URLs; + means space only in the query string under the older form-encoding rules. This decoder accepts both.' },
      { q: 'Do I need to encode Unicode like é or 中?', a: 'Yes for maximum compatibility — they become their UTF-8 bytes percent-encoded (é → %C3%A9). Browsers often display the decoded form, but the wire format is encoded.' },
      { q: 'Why did decoding fail with "malformed"?', a: 'A % not followed by two hex digits — usually a raw % sign in text that was never meant as encoding. Encode the raw text first, or fix the stray %.' },
      { q: 'Is my URL data kept private?', a: 'Yes — URLs often contain tokens and IDs, and this tool never transmits them; everything runs locally.' },
    ],
    keywords: ['url encode', 'url decode', 'percent encoding', 'encodeuricomponent', 'query string encoding'],
  },
  {
    slug: 'html-entities-encode-decode',
    name: 'HTML Entities Encoder / Decoder',
    icon: '📜',
    description:
      'Escape text for safe HTML display (& < > " \') or decode entities like &amp; back to characters. In-browser.',
    lead: 'Turn < into &lt; so it displays instead of rendering — or decode &amp;-style entities back to plain text.',
    widget: 'transform',
    computeId: 'htmlEntities',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode (escape for HTML)' },
          { value: 'decode', label: 'Decode (entities → text)' },
        ],
      },
    ],
    sample: 'if (a < b && b > c) { alert("done"); }',
    how: 'Encoding escapes the five characters with special meaning in HTML — & < > " \' — into their entities, making arbitrary text safe to display inside markup. Decoding uses the browser’s own HTML parser, so it understands every named entity (&nbsp;, &mdash;, &hellip;…) and numeric form (&#8212;), not just the common five.',
    note: 'This escaping is the last-line defense pattern against HTML injection when displaying user text — though in real applications, use your framework’s templating (which escapes by default) rather than manual encoding. For showing code snippets in a blog or CMS, encode-then-paste is exactly the right manual workflow.',
    faqs: [
      { q: 'Which characters must be escaped in HTML?', a: 'The essential five: & (first!), <, >, and in attributes also " and \'. Everything else can appear literally in UTF-8 documents.' },
      { q: 'Why must & be escaped first?', a: 'Because entities themselves contain & — escaping < after & would double-escape into &amp;lt;. This tool applies the correct order automatically.' },
      { q: 'What is the difference between &amp;#8212; and &amp;mdash;?', a: 'The same em-dash: one numeric reference, one named entity. Decoding handles both, plus every other named entity the HTML spec defines.' },
      { q: 'Is encoding enough to prevent XSS?', a: 'For text content and quoted attributes, escaping these five characters neutralizes injection. But context matters (URLs, CSS, script blocks have different rules) — in applications, rely on framework auto-escaping and use this tool for manual/editorial tasks.' },
      { q: 'Is my content uploaded?', a: 'No — both directions run in your browser.' },
    ],
    keywords: ['html encode', 'html entities', 'escape html', 'html decode', 'ampersand lt gt'],
  },
  {
    slug: 'hash-generator',
    name: 'SHA Hash Generator',
    icon: '#️⃣',
    description:
      'Compute SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text using the browser’s native Web Crypto — nothing leaves your machine.',
    lead: 'One input, four hashes — SHA-1, SHA-256, SHA-384 and SHA-512, computed by your browser’s built-in crypto engine.',
    widget: 'hash',
    sample: 'The quick brown fox jumps over the lazy dog',
    how: 'Hashes are computed with the Web Crypto API (crypto.subtle.digest) — the same audited implementation your browser uses for TLS, not a JavaScript reimplementation. The text is UTF-8 encoded, digested, and shown as lowercase hex. A hash is one-way: identical input always gives the identical digest, but the digest cannot be reversed to the input.',
    note: 'MD5 is deliberately absent: Web Crypto does not implement it because it has been cryptographically broken for two decades. If you need to match a legacy MD5 checksum, treat it only as an integrity spot-check, never as security. For verifying downloads, compare the published SHA-256 against the file’s hash character-for-character (the first and last 8 are usually enough to eyeball).',
    faqs: [
      { q: 'Which SHA should I use?', a: 'SHA-256 is the modern default — checksums, signatures, content addressing. SHA-512 offers a larger digest (and is faster on some 64-bit systems). SHA-1 survives only for legacy comparisons: collisions have been demonstrated, so avoid it for anything security-relevant.' },
      { q: 'Why is MD5 not offered?', a: 'The browser’s Web Crypto API deliberately excludes it — MD5 collisions are practical to generate, so shipping it invites misuse. SHA-256 replaces it everywhere that matters.' },
      { q: 'Can a hash be decrypted?', a: 'No — hashing is one-way by construction. "Cracking" a hash means guessing inputs until one matches, which is why short passwords hash-crack quickly but long ones don\'t.' },
      { q: 'Is this suitable for hashing passwords?', a: 'No — password storage needs slow, salted algorithms (bcrypt, scrypt, Argon2). Plain SHA is for integrity and identification, not credential storage.' },
      { q: 'Does my text leave the browser?', a: 'No — hashing is local via crypto.subtle. That matters when the input is an API secret or private text.' },
    ],
    keywords: ['sha256 generator', 'hash generator online', 'sha1 hash', 'sha512', 'checksum text', 'web crypto hash'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    icon: '🎫',
    description:
      'Decode JWT header and payload locally, with expiry check — the signature is never verified and the token never leaves your browser.',
    lead: 'Paste a JWT and read its header and payload instantly — with the expiry (exp) checked — all locally, which is the only safe way to inspect tokens.',
    widget: 'transform',
    computeId: 'jwt',
    sample:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    how: 'A JWT is three Base64URL segments separated by dots: header (algorithm), payload (claims) and signature. The first two are just encoded JSON — decoding them requires no key, which this tool does locally, pretty-printing both and evaluating the exp claim against the current time. The signature is NOT verified: that requires the signing secret or public key and belongs on your server, not in a web page.',
    note: 'The privacy point is not optional here: a JWT often IS a live credential. Pasting one into a random website’s "JWT decoder" hands your session to that server. This decoder runs entirely in your browser — verify with the network tab, or go offline first.',
    faqs: [
      { q: 'Does decoding a JWT require the secret?', a: 'No — header and payload are Base64URL-encoded JSON, readable by anyone. The secret is only needed to VERIFY the signature (i.e., prove the token wasn\'t tampered with), which this tool intentionally does not do.' },
      { q: 'Why does it say "signature NOT verified"?', a: 'Honesty: without your signing key, no client-side tool can check authenticity. Decoding shows what the token claims; verification (server-side, with the key) proves the claims are genuine.' },
      { q: 'What are iat, exp and sub?', a: 'Registered claims: iat = issued-at, exp = expiry, sub = subject (user id) — all Unix timestamps where relevant. The tool converts exp to a date and flags expired tokens.' },
      { q: 'Is it safe to paste a production token here?', a: 'Here, yes — nothing is transmitted (the page works offline). As a rule though, treat live tokens like passwords: prefer expired or test tokens when debugging, wherever the tool runs.' },
      { q: 'Why does my token fail to decode?', a: 'Check for the three-part dot structure and complete copying — truncated middles are the usual culprit. Opaque (non-JWT) session tokens also exist and won\'t decode.' },
    ],
    keywords: ['jwt decoder', 'decode jwt online', 'jwt payload', 'jwt exp check', 'json web token'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    icon: '🧩',
    description:
      'Test JavaScript regular expressions live: matches with positions and capture groups, flags support, clear error messages. In-browser.',
    lead: 'Type a pattern, paste test text, see every match with its position and capture groups — updated on every keystroke.',
    widget: 'transform',
    computeId: 'regex',
    options: [
      { id: 'pattern', label: 'Pattern', type: 'text', placeholder: '\\b\\w+@\\w+\\.\\w+\\b', defaultValue: '\\b(\\w+)@(\\w+\\.\\w+)\\b' },
      { id: 'flags', label: 'Flags', type: 'text', placeholder: 'gi', defaultValue: 'gi' },
    ],
    sample: 'Contact ana@example.com or SALES@corp.example.org for details.',
    how: 'The pattern runs as a real JavaScript RegExp against your text, listing each match with its index and any capture groups — the exact behavior your JS code will see, because it is the same engine. Flags work as in code: g (all matches — applied automatically), i (case-insensitive), m (multiline ^ $), s (dot matches newline), u (unicode).',
    note: 'Testing here mirrors JavaScript exactly, which is both the feature and the caveat: JS regex differs from PCRE/Python in places (lookbehind support, named groups syntax, no possessive quantifiers). For patterns destined for another language, verify in that ecosystem too.',
    faqs: [
      { q: 'Which regex flavor is this?', a: 'JavaScript (ECMAScript) — the same engine as your browser and Node code. Most syntax is shared with PCRE/Python, but edge features differ; test in the target language for anything exotic.' },
      { q: 'What do the flags mean?', a: 'g = all matches, i = ignore case, m = ^ and $ match per line, s = . matches newlines, u = full Unicode. This tester always applies g so you see every match.' },
      { q: 'How do capture groups show up?', a: 'Parentheses create groups, listed per match in order — the sample splits emails into user and domain. Use (?:…) for grouping without capturing.' },
      { q: 'Why does my pattern error?', a: 'Unbalanced parentheses/brackets or a dangling quantifier, usually. The error message is the engine\'s own. Escape literal special characters with a backslash.' },
      { q: 'Is my test data private?', a: 'Yes — matching runs locally. Paste logs and real data freely; nothing is transmitted.' },
    ],
    keywords: ['regex tester', 'regular expression tester', 'javascript regex', 'regex capture groups', 'test regex online'],
  },
  {
    slug: 'number-base-converter',
    name: 'Number Base Converter',
    icon: '🔟',
    description:
      'Convert numbers between binary, octal, decimal and hex — arbitrary precision (BigInt), so 64-bit values don’t silently corrupt. In-browser.',
    lead: '255 = 0xff = 0o377 = 0b11111111 — convert any number between bases 2, 8, 10 and 16, at any size, exactly.',
    widget: 'transform',
    computeId: 'numberBase',
    options: [
      {
        id: 'from', label: 'Input base', type: 'select', defaultValue: '10',
        options: [
          { value: '2', label: 'Binary (base 2)' },
          { value: '8', label: 'Octal (base 8)' },
          { value: '10', label: 'Decimal (base 10)' },
          { value: '16', label: 'Hex (base 16)' },
        ],
      },
    ],
    sample: '3735928559',
    how: 'The input parses digit-by-digit into a BigInt — JavaScript’s arbitrary-precision integer — then re-renders in all four bases. BigInt is the point: ordinary JS numbers lose precision past 2⁵³, so a 64-bit value like a database ID or bitmask converts wrongly in naive tools. Prefixes (0x, 0b, 0o), spaces and _ separators in the input are accepted and ignored.',
    note: 'The sample decodes to a classic: 3735928559 = 0xDEADBEEF. Everyday uses: reading hex color/memory values, building permission bitmasks, converting Unix file modes (octal), and checking what a flag register means in binary.',
    faqs: [
      { q: 'Why do other converters corrupt large numbers?', a: 'They use floating-point numbers, exact only to 2⁵³ (about 9×10¹⁵). Beyond that, trailing digits silently change. This tool uses BigInt — exact at any length.' },
      { q: 'What are the 0x, 0o and 0b prefixes?', a: 'Standard literal markers: 0x = hex, 0o = octal, 0b = binary — the same notation JS, Python and C-family languages use. The converter accepts and outputs them.' },
      { q: 'How do I read a binary number quickly?', a: 'Group bits in fours from the right — each group is exactly one hex digit (1101 = D). That is why programmers think in hex: it is compressed binary.' },
      { q: 'Does it handle negative numbers?', a: 'It converts magnitudes; interpretation of negatives (two\'s complement width) depends on your context — an 8-bit -1 and a 64-bit -1 differ. Convert the unsigned pattern and apply your width\'s convention.' },
      { q: 'Octal still exists?', a: 'Unix file permissions keep it alive: chmod 755 is octal for rwxr-xr-x. Otherwise you\'ll mostly meet hex and binary.' },
    ],
    keywords: ['binary to decimal', 'hex converter', 'number base converter', 'decimal to binary', 'hex to decimal', '0xdeadbeef'],
  },
  {
    slug: 'llm-token-counter',
    name: 'LLM Token Counter & Cost Calculator',
    icon: '🪙',
    description:
      'Count tokens for GPT, Claude and Gemini — exact OpenAI counts via the real o200k tokenizer running in your browser, honestly-labelled estimates for the rest — plus per-request and monthly API cost with dated pricing. Nothing uploaded.',
    lead: 'Paste a prompt, count its tokens, see the cost per model — exact OpenAI counts (the real tokenizer runs locally), clearly-labelled estimates for Claude and Gemini, a context-window fit bar, and cost math with a visible "prices last verified" date.',
    widget: 'llm-tokens',
    how: 'Language models don\'t read words — they read tokens, sub-word chunks produced by each vendor\'s tokenizer, and API bills are denominated in them. For OpenAI models this tool runs the genuine o200k_base tokenizer (via the gpt-tokenizer library) in your browser, so those counts are exact, not approximations. Anthropic and Google do not publish browser-runnable tokenizers, so Claude and Gemini counts are estimates from the ~4-characters-per-token heuristic — multiplied by 1.3 for Anthropic\'s newer models (Opus 4.7+, Fable 5, Sonnet 5), which Anthropic documents as using a tokenizer that "produces approximately 30% more tokens for the same text". Every number is badged EXACT or ESTIMATE so you always know which you\'re looking at. The cost panel multiplies your counted input tokens and expected output tokens by each model\'s per-million-token price, and scales to a monthly figure from your requests-per-day.',
    note: 'Two honesty notes built into the tool: prices carry a visible "last verified" date with links to the official pricing pages, because API prices change often (Claude Sonnet 5\'s move from $2/$10 to $3/$15 on 1 September 2026 is already pre-announced); and there is deliberately no "exact" badge on Claude or Gemini — any tool claiming exact counts for those models without calling the vendor\'s API is guessing. The privacy angle matters here more than most tools: the text people paste into token counters is precisely their confidential prompts and documents, and this one never transmits a byte.',
    faqs: [
      { q: 'Are the token counts exact?', a: 'For OpenAI models, yes — the real o200k_base tokenizer runs in your browser via the gpt-tokenizer library, the same encoding GPT-5.x-era models use. For Claude and Gemini the counts are labelled estimates: those vendors don\'t publish browser-runnable tokenizers, so exact counts are only available from their APIs.' },
      { q: 'Why do Claude models show more tokens than GPT for the same text?', a: 'Anthropic documents that Opus 4.7 and later, Fable/Mythos 5 and Sonnet 5 use a newer tokenizer that "produces approximately 30% more tokens for the same text" than their previous one. This tool\'s Claude estimates apply that factor for the newer models — a per-token price cut can therefore cost more than it appears if token counts rise.' },
      { q: 'How is the cost calculated?', a: '(input tokens ÷ 1,000,000 × input price) + (output tokens ÷ 1,000,000 × output price), per request — then × requests/day × 30 for the monthly figure. Standard API list prices; batch and caching discounts (often 50% and 90% respectively) are not included, so treat results as the ceiling.' },
      { q: 'Are the prices current?', a: 'The table shows the date the prices were last verified against the official OpenAI, Anthropic and Google pricing pages, with links so you can check. API pricing changes frequently — Claude Sonnet 5\'s increase to $3/$15 on 1 September 2026 is already scheduled — so always confirm before committing to a budget.' },
      { q: 'What is the context-window fit bar?', a: 'It shows what fraction of a chosen context size (128k to 1M tokens) your text occupies, using the exact o200k count. Remember the context window must also hold the system prompt, conversation history and the model\'s reply — filling it to 100% with input leaves no room to answer.' },
      { q: 'Is my text uploaded to count tokens?', a: 'No — tokenization and all cost math run in your browser, and the page works offline after loading. What people paste into token counters is usually their actual confidential prompts and documents; that\'s exactly why this one has no server side.' },
    ],
    keywords: ['llm token counter', 'token counter', 'gpt token counter', 'claude token counter', 'llm cost calculator', 'openai api cost', 'tokenizer online', 'count tokens', 'llm api pricing calculator'],
  },
  {
    slug: 'ethereum-unit-converter',
    name: 'Ethereum Unit Converter (Wei, Gwei, Ether)',
    icon: '⟠',
    description: 'Convert between Ethereum units — wei, gwei, ether and more — exactly, using BigInt fixed-point math (no floating-point error). Plus satoshi ⇄ BTC. In-browser.',
    lead: 'Convert between Ethereum units — wei, kwei, mwei, gwei, szabo, finney and ether — exactly, plus satoshi ⇄ BTC. No floating-point rounding, ever.',
    widget: 'eth-units',
    how: 'Ethereum amounts are integers of wei (1 ether = 10¹⁸ wei), and gas prices are quoted in gwei (10⁹ wei). Enter a value in any unit and every other unit is computed with BigInt fixed-point arithmetic, so an 18-decimal value like 0.000000000000000001 ether converts to exactly 1 wei — something floating-point maths cannot represent without error. A separate section converts Bitcoin between BTC and satoshi (1 BTC = 100,000,000 sats).',
    note: 'A developer utility, not a price tool: it converts *units*, never fetches an exchange rate, price, or gas oracle. It handles no keys or funds and gives no financial advice.',
    faqs: [
      { q: 'How many wei are in one ether?', a: 'Exactly 1,000,000,000,000,000,000 — that is 10¹⁸ wei. Ether is the human unit; wei is the smallest indivisible unit that the Ethereum protocol actually counts in.' },
      { q: 'What is gwei used for?', a: 'Gwei (10⁹ wei, also called “nanoether” or “shannon”) is the standard unit for gas prices. A gas price of “30 gwei” means 30 × 10⁹ wei per unit of gas.' },
      { q: 'Why use BigInt instead of normal numbers?', a: 'Because 10¹⁸ exceeds JavaScript’s safe-integer range and 18-decimal fractions can’t be stored exactly as floating-point. This tool uses BigInt fixed-point maths, so conversions are exact to the last wei.' },
      { q: 'Does it show live prices or gas fees?', a: 'No — it is purely a unit converter. It never fetches a price, exchange rate or live gas fee, and it gives no financial advice. For a “gas cost in ether” figure you supply the gas price yourself.' },
      { q: 'Can it convert satoshi and BTC?', a: 'Yes — the Bitcoin section converts between BTC and satoshi, where 1 BTC = 100,000,000 satoshi (8 decimal places).' },
      { q: 'Is anything uploaded?', a: 'No — all conversion runs in your browser.' },
    ],
    keywords: ['ethereum unit converter', 'wei to ether', 'gwei to wei', 'ether to wei', 'wei converter', 'gwei to ether', 'satoshi to btc'],
  },
  {
    slug: 'keccak-256-generator',
    name: 'Keccak-256 / SHA-3 Hash & Function Selector',
    icon: '#️⃣',
    description: 'Generate a Keccak-256 hash (Ethereum’s hash) or a SHA3-256 hash — clearly distinguished — and compute 4-byte function selectors from a signature. In-browser.',
    lead: 'Hash text with Keccak-256 (the hash Ethereum actually uses) or NIST SHA3-256 — shown side by side so you never confuse them — and compute a contract’s 4-byte function selector.',
    widget: 'keccak',
    how: 'Ethereum uses Keccak-256, the original Keccak submission, which is NOT the same as the finalised NIST SHA3-256 standard — they use a different internal padding byte and produce different digests for the same input. This tool computes both and labels each, so you use the right one. The function-selector mode takes a canonical function signature like transfer(address,uint256) and returns the first 4 bytes of its Keccak-256 hash — the selector that prefixes calldata.',
    note: 'The exactness wedge: most “SHA-3” tools quietly give you one or the other. This shows both, correctly labelled. It is a hashing/dev utility — no keys, no funds, no financial advice.',
    faqs: [
      { q: 'Is Keccak-256 the same as SHA3-256?', a: 'No — and this is a common, costly confusion. Ethereum uses Keccak-256 (the original submission, padding byte 0x01). NIST later standardised SHA3-256 with a different padding byte (0x06), so the two produce different hashes for the same input. This tool shows both, labelled.' },
      { q: 'What does Ethereum use?', a: 'Keccak-256 — for address checksums (EIP-55), function selectors, event topics, storage slots and more. When Solidity code calls keccak256(), it means the Keccak variant, not NIST SHA3-256.' },
      { q: 'What is a 4-byte function selector?', a: 'The first 4 bytes of the Keccak-256 hash of a function’s canonical signature (e.g. transfer(address,uint256) → 0xa9059cbb). It prefixes the calldata so a contract knows which function to run.' },
      { q: 'What is a “canonical” signature?', a: 'The function name and parameter types with no spaces and no parameter names — transfer(address,uint256), not transfer(address to, uint256 amount). The selector is computed from that canonical form.' },
      { q: 'Is my input uploaded?', a: 'No — hashing runs entirely in your browser.' },
    ],
    keywords: ['keccak-256 generator', 'keccak256 online', 'sha3 hash generator', 'ethereum hash', 'function selector', '4 byte selector', 'keccak vs sha3'],
  },
  {
    slug: 'eip55-address-checksum',
    name: 'EIP-55 Ethereum Address Checksum',
    icon: '✅',
    description: 'Validate an Ethereum address’s EIP-55 checksum and convert any address to its correct mixed-case checksummed form. Catches typos. Public addresses only, in-browser.',
    lead: 'Check whether an Ethereum address has a valid EIP-55 checksum, and convert any address to its correct mixed-case form — the standard way wallets catch mistyped addresses.',
    widget: 'eip55',
    how: 'EIP-55 hides a checksum in the letter casing of a hex address: each alphabetic character is uppercased when the corresponding nibble of the address’s Keccak-256 hash is 8 or greater. Paste an address and the tool tells you whether its casing is a valid checksum (a strong signal it wasn’t mistyped) and gives you the correctly-checksummed version to copy.',
    note: 'A safety-oriented developer utility for PUBLIC addresses only. It never handles private keys, seed phrases or funds, performs no transactions, and gives no financial advice — never paste a private key or seed phrase into any tool.',
    faqs: [
      { q: 'What is an EIP-55 checksum?', a: 'A way of encoding a checksum into the upper/lowercase pattern of an Ethereum address’s hex letters, defined in EIP-55. A wallet can then detect a single mistyped character, because the casing would no longer match the address’s Keccak-256 hash.' },
      { q: 'How do I know if an address is valid?', a: 'Paste it here: if the mixed-case matches EIP-55, it’s a valid checksum (unlikely to be mistyped). An all-lowercase or all-uppercase address has no checksum to verify — this tool will give you the correct checksummed form.' },
      { q: 'Does a valid checksum mean the address is “safe”?', a: 'It only means the address is well-formed and probably not mistyped. It says nothing about who controls the address or whether it’s trustworthy — always verify the recipient through a trusted channel.' },
      { q: 'Why are some letters uppercase?', a: 'Each hex letter (a–f) is uppercased when the matching nibble of the address’s Keccak-256 hash is ≥ 8. That pattern is the checksum; digits (0–9) are unaffected.' },
      { q: 'Do you ever handle private keys?', a: 'Never. This works only with public addresses, entirely in your browser. Do not paste a private key or seed phrase into this or any online tool.' },
    ],
    keywords: ['eip-55 checksum', 'ethereum address checksum', 'checksum address', 'validate ethereum address', 'ethereum address validator', 'eip55'],
  },
  {
    slug: 'query-string-parser',
    name: 'Query String Parser',
    icon: '🔗',
    description:
      'Parse a URL query string into readable key/value JSON, or build a query string from JSON — URL-decoding handled, repeated keys become arrays. Runs in your browser.',
    lead: 'Paste a URL or query string to see its parameters as clean JSON — or switch to build mode to turn JSON into a query string.',
    widget: 'transform',
    computeId: 'querystring',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'parse',
        options: [
          { value: 'parse', label: 'Parse (query string → JSON)' },
          { value: 'build', label: 'Build (JSON → query string)' },
        ],
      },
    ],
    sample: 'https://example.com/search?q=hello+world&page=2&tag=a&tag=b',
    how: 'In parse mode the tool takes a full URL or a bare query string, keeps only the part after "?" (and drops any "#fragment"), splits it on "&", and decodes each key and value with percent-decoding (and "+" → space). Repeated keys — like tag=a&tag=b — are collected into an array, and the result is shown as formatted JSON. In build mode it does the reverse: a JSON object of key → value (or key → array) is encoded back into a properly percent-encoded query string.',
    note: 'Everything runs locally, so URLs with tokens or personal data stay in your browser. Parsing is lenient — it tolerates a missing "?", a leading "&", and values without an "=". Build mode expects a JSON object; use an array value to repeat a key.',
    faqs: [
      { q: 'How do I parse a URL query string?', a: 'Paste the URL or just the part after "?". The tool splits on "&", decodes each key and value, and shows them as JSON. For example ?q=hello+world&page=2 becomes {"q": "hello world", "page": "2"}.' },
      { q: 'What happens with repeated parameters?', a: 'Keys that appear more than once — like tag=a&tag=b&tag=c — are grouped into an array: {"tag": ["a", "b", "c"]}. That preserves every value rather than keeping only the last.' },
      { q: 'Does it handle URL-encoded characters?', a: 'Yes. Percent-encoded sequences (%20, %C3%A9, etc.) and "+" for spaces are decoded, so "S%C3%A3o+Paulo" reads back as "São Paulo". Build mode re-encodes them correctly.' },
      { q: 'How do I build a query string from values?', a: 'Switch to build mode and enter a JSON object, e.g. {"q":"hello world","page":2}. The tool percent-encodes it into q=hello%20world&page=2. Array values repeat the key.' },
      { q: 'Is my URL sent anywhere?', a: 'No — parsing and building happen entirely in your browser with the standard encode/decode functions. URLs containing tokens, IDs or personal data never leave your device.' },
    ],
    keywords: ['query string parser', 'url parameter parser', 'parse query string', 'query string to json', 'url query decoder', 'build query string', 'url params to json'],
  },
  {
    slug: 'http-status-code-lookup',
    name: 'HTTP Status Code Lookup',
    icon: '🚦',
    description:
      'Look up what an HTTP status code means — 200, 301, 404, 500 and more — with a plain-English description and its class. Type one or several codes.',
    lead: 'Enter one or more HTTP status codes to see their names, meanings and class (2xx success, 4xx client error, and so on).',
    widget: 'transform',
    computeId: 'httpstatus',
    sample: '301 404 500',
    how: 'HTTP responses carry a three-digit status code whose first digit sets the class: 1xx informational, 2xx success, 3xx redirection, 4xx client error and 5xx server error. The tool pulls any three-digit codes out of what you type — so you can paste "what does 502 mean" or a list like "301 404 500" — and returns each code\'s standard name, a plain-English description, and its class.',
    note: 'Covers the common standard codes from the IANA registry (RFC 9110 and related). A valid but unlisted code still gets labelled by its class. Some codes are used loosely in the wild — 401 really means "unauthenticated", and many APIs return 422 for validation errors — so also check the specific API\'s documentation.',
    faqs: [
      { q: 'What does HTTP 404 mean?', a: '404 Not Found means the server could not find the requested resource — usually a broken or mistyped URL, or a page that has been moved or deleted. It is a client-side (4xx) error.' },
      { q: 'What is the difference between 301 and 302?', a: '301 Moved Permanently says the resource has a new permanent URL (and passes SEO value), while 302 Found is a temporary redirect — keep using the original URL for future requests. Use 301 for permanent moves.' },
      { q: 'What does a 500 error mean?', a: '500 Internal Server Error is a generic server-side failure: something went wrong on the server that it cannot describe more specifically. It is not a problem with your request format — check server logs.' },
      { q: 'What do the status code classes mean?', a: 'The first digit sets the class: 1xx informational, 2xx success (200 OK, 201 Created), 3xx redirection (301, 304), 4xx client errors (400, 401, 403, 404), and 5xx server errors (500, 502, 503).' },
      { q: 'What is the difference between 401 and 403?', a: '401 Unauthorized means you are not authenticated (no or invalid credentials), while 403 Forbidden means you are authenticated but not allowed to access the resource. 401 is "who are you?"; 403 is "you can\'t".' },
    ],
    keywords: ['http status code', 'http status code lookup', 'what does 404 mean', 'http error codes', '500 error meaning', '301 vs 302', 'http response codes list'],
  },
  {
    slug: 'json-string-escape',
    name: 'JSON String Escaper / Unescaper',
    icon: '🔧',
    description:
      'Escape any text so it fits inside a JSON string (quotes, backslashes, newlines, control chars) — or unescape a JSON string body back to plain text. In-browser.',
    lead: 'Turn raw text into a safe JSON string value — escaping ", \\, newlines and tabs — or paste an escaped value to get the original text back.',
    widget: 'transform',
    computeId: 'jsonEscape',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Escape (text → JSON string)' },
          { value: 'decode', label: 'Unescape (JSON string → text)' },
        ],
      },
    ],
    sample: 'Line 1\nHe said "hi"\tC:\\temp',
    how: 'Escaping runs the text through the same rules a JSON serializer uses: the double quote, backslash, newline, carriage return, tab and other control characters are replaced with their backslash escapes (\\", \\\\, \\n, \\r, \\t, \\uXXXX), so the result can be dropped between the quotes of a JSON string. Unescaping does the reverse by parsing the text as a JSON string literal, turning \\n back into a real newline and \\uXXXX back into its character.',
    note: 'Paste the text that goes *between* the quotes, not including the surrounding quotation marks. Unescaping fails if the text contains a bare (unescaped) double quote or a lone backslash, because that is not a valid JSON string body — escape it first, or fix the stray character.',
    faqs: [
      { q: 'How do I escape a string for JSON?', a: 'Replace the special characters — double quote, backslash, newline, carriage return, tab and other control characters — with their backslash escapes (\\", \\\\, \\n, \\r, \\t). This tool does it for you: paste the raw text and choose Escape.' },
      { q: 'Which characters must be escaped in a JSON string?', a: 'The double quote (") and backslash (\\) must always be escaped, along with the control characters U+0000–U+001F (newline, tab, etc.). Forward slashes and non-ASCII characters may be escaped but do not have to be.' },
      { q: 'How do I unescape a JSON string?', a: 'Choose Unescape and paste the escaped body (without the surrounding quotes). The tool parses it as a JSON string literal, so \\n becomes a real newline, \\" becomes a quote and \\uXXXX becomes its character.' },
      { q: 'Why does unescaping fail?', a: 'A JSON string body cannot contain a bare double quote or a lone backslash — those must be escaped. If unescaping errors, the input has a stray " or \\; escape it or remove it and try again.' },
      { q: 'Does it handle newlines and tabs?', a: 'Yes. Escaping converts real newlines to \\n, carriage returns to \\r and tabs to \\t; unescaping turns them back into the actual whitespace characters.' },
    ],
    keywords: ['json escape', 'json string escape', 'escape json', 'json unescape', 'escape quotes for json', 'json string escaper', 'escape newline json'],
  },
  {
    slug: 'unicode-escape-converter',
    name: 'Unicode Escape Converter',
    icon: '🔤',
    description:
      'Convert non-ASCII text to \\uXXXX Unicode escape sequences — or decode \\uXXXX (and \\u{...}) escapes back to characters. Great for JSON, Java, JS and config files. In-browser.',
    lead: 'Turn accented letters, emoji and other non-ASCII characters into \\uXXXX escapes — or paste \\u escapes to get the readable text back.',
    widget: 'transform',
    computeId: 'unicodeEscape',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode (text → \\uXXXX)' },
          { value: 'decode', label: 'Decode (\\uXXXX → text)' },
        ],
      },
    ],
    sample: 'café ☕ – naïve',
    how: 'Encoding replaces every character outside the basic ASCII range (code point above 127) with a \\uXXXX escape — the four-hex-digit UTF-16 code unit used by JSON, JavaScript, Java and many config formats. Characters above the Basic Multilingual Plane (like most emoji) become a surrogate pair of two \\u escapes. Decoding turns \\uXXXX back into its character, and also understands the \\u{...} form used in modern JavaScript and Rust.',
    note: 'ASCII characters (plain English letters, digits and common punctuation) are left untouched — only non-ASCII characters are escaped, which is what makes text safe for ASCII-only channels while staying readable. To escape absolutely everything, this isn’t the tool; it targets the common "keep it ASCII-safe" use case.',
    faqs: [
      { q: 'What is a Unicode escape sequence?', a: 'A way of writing a character using its code point in hexadecimal, like \\u00e9 for é. It lets you include any character in source code or data files that only safely handle ASCII.' },
      { q: 'How do I convert text to \\u escapes?', a: 'Choose Encode and paste your text; every non-ASCII character becomes a \\uXXXX sequence. For example café becomes caf\\u00e9. Plain ASCII characters are left as-is.' },
      { q: 'Why does an emoji become two \\u escapes?', a: 'Characters above U+FFFF (including most emoji) are stored as a UTF-16 surrogate pair, so they encode as two \\uXXXX units. Decoding the pair together reproduces the original emoji.' },
      { q: 'Does it support the \\u{...} form?', a: 'For decoding, yes — the tool understands both the fixed four-digit \\uXXXX form and the braced \\u{1F600} form used in modern JavaScript and Rust. Encoding produces the widely compatible \\uXXXX form.' },
      { q: 'Is this the same as URL or HTML encoding?', a: 'No. URL encoding uses %XX bytes and HTML uses &#...; entities. \\uXXXX is the escape used inside string literals in JSON, JavaScript, Java and similar languages — use the matching tool for each context.' },
    ],
    keywords: ['unicode escape', 'unicode to text', 'u+ to character', 'unicode escape converter', 'text to unicode', 'decode unicode escape', 'javascript unicode escape'],
  },
  {
    slug: 'text-to-hex-converter',
    name: 'Text to Hex Converter',
    icon: '🔡',
    description:
      'Convert text to hexadecimal (UTF-8 byte values) or decode hex back to text. Handles spaces, 0x prefixes and colons on decode. In-browser.',
    lead: 'Turn any text into its UTF-8 hex bytes — or paste hex (with or without spaces and 0x) to decode it back to readable text.',
    widget: 'transform',
    computeId: 'textHex',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Text → hex' },
          { value: 'decode', label: 'Hex → text' },
        ],
      },
    ],
    sample: 'Hello, world!',
    how: 'Encoding first converts the text to UTF-8 bytes (so accented letters and emoji become their multi-byte sequences), then writes each byte as two hexadecimal digits, space-separated. Decoding strips out any spaces, 0x prefixes, colons or commas, pairs the remaining hex digits into bytes, and decodes them back as UTF-8 — rejecting input that isn’t valid UTF-8 so you know the hex was wrong.',
    note: 'The output is UTF-8, the modern default. A plain ASCII character is one byte (e.g. A = 41), but characters like é or emoji take two to four bytes, so the hex is longer than the character count. For raw byte values in another encoding, this tool assumes UTF-8.',
    faqs: [
      { q: 'How do I convert text to hex?', a: 'Encode the text as UTF-8 bytes and write each byte as two hex digits. "Hi" is 48 69. This tool does it automatically — choose Text → hex and paste your text.' },
      { q: 'How do I convert hex to text?', a: 'Choose Hex → text and paste the hex. Spaces, 0x prefixes and colons are ignored, so "48 69", "4869" and "0x48 0x69" all decode to "Hi". The bytes are read as UTF-8.' },
      { q: 'Why is the hex longer than my text?', a: 'Because non-ASCII characters take more than one byte in UTF-8. A plain letter is one byte (two hex digits), but é is two bytes and most emoji are four, so the hex grows accordingly.' },
      { q: 'What if decoding fails?', a: 'An odd number of hex digits, or bytes that don’t form valid UTF-8, will error. Check that every byte has two digits and that the hex is complete and correct.' },
      { q: 'Is this the same as ASCII codes?', a: 'For plain English text, yes — ASCII characters have the same one-byte hex values in UTF-8 (A = 41, space = 20). They differ only for non-ASCII characters, which UTF-8 encodes as multiple bytes.' },
    ],
    keywords: ['text to hex', 'hex to text', 'string to hex', 'hex to string', 'text to hexadecimal', 'ascii to hex', 'hex converter'],
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript',
    icon: '🟦',
    description:
      'Convert JSON into TypeScript interfaces (or types) instantly — nested objects, arrays, optional keys and unions inferred. Paste JSON, get typed interfaces. In-browser, private.',
    lead: 'Paste a JSON object or array and get ready-to-use TypeScript interfaces — nested shapes become their own interfaces, missing keys become optional, and mixed arrays become unions.',
    widget: 'transform',
    computeId: 'jsonToTypescript',
    options: [
      { id: 'rootName', label: 'Root name', type: 'text', defaultValue: 'Root', placeholder: 'Root' },
      {
        id: 'kind', label: 'Output', type: 'select', defaultValue: 'interface',
        options: [
          { value: 'interface', label: 'interface' },
          { value: 'type', label: 'type alias' },
        ],
      },
    ],
    sample: '{\n  "id": 1,\n  "name": "Ada",\n  "active": true,\n  "roles": ["admin", "user"],\n  "address": { "city": "London", "zip": null },\n  "orders": [{ "sku": "X1", "qty": 2 }, { "sku": "X2", "qty": 3, "gift": true }]\n}',
    how: 'The generator parses your JSON and walks the structure, inferring a TypeScript type for every value: strings, numbers and booleans map directly; null becomes null; arrays become T[]; and each nested object becomes its own named interface. When an array holds objects, their keys are merged — a key missing from some elements is marked optional (?), and a key with more than one shape becomes a union. Everything runs in your browser, so API responses you paste are never uploaded.',
    note: 'Names are derived from your keys (an "orders" array of objects yields an Order interface, singularised and PascalCased). Because types are inferred from a sample, they reflect only what that sample contains — an always-present field that is sometimes null will be typed null; widen it by hand if it can also hold other values. Empty arrays infer any[], since there is nothing to infer an element type from.',
    faqs: [
      { q: 'How do I convert JSON to a TypeScript interface?', a: 'Paste your JSON and the tool generates interfaces for it, with nested objects broken out into their own named interfaces. Copy the result straight into your .ts file. It runs locally — nothing is sent to a server.' },
      { q: 'Are optional and union types detected?', a: 'Yes. In an array of objects, a key that is absent from some elements is marked optional with ?, and a key that appears with different value types becomes a union (e.g. string | number).' },
      { q: 'Can I output type aliases instead of interfaces?', a: 'Yes — switch the Output option to "type alias" to get `type X = { … }` instead of `interface X { … }`. Both describe the same shape; pick whichever your codebase prefers.' },
      { q: 'Why is a field typed as null or any?', a: 'A field whose only sample value is null is typed null — widen it manually if it can hold other values too. Empty arrays become any[] because there is no element to infer from. Inference reflects the sample you paste, not every possible response.' },
      { q: 'Is my JSON kept private?', a: 'Yes. Parsing and generation happen entirely in your browser; the JSON you paste (which may be a real API response) never leaves your device.' },
    ],
    keywords: ['json to typescript', 'json to interface', 'generate typescript types from json', 'json to ts', 'typescript interface generator', 'json to type'],
  },
  {
    slug: 'har-viewer',
    name: 'HAR File Viewer',
    icon: '🌐',
    description:
      'Open and analyse a .har network capture — request waterfall, status, sizes and timings — with a scan for cookies and tokens. Private, in your browser, never uploaded.',
    lead: 'Drop a HAR file to see every request with its method, status, size and timing — plus a warning for any request that carries cookies, auth headers or token-like parameters.',
    widget: 'har',
    how: 'A HAR (HTTP Archive) file is a JSON export of a browser\'s network activity. The viewer parses it in your browser and lists each request — method, status code, URL, transferred size and load time — with totals for the whole capture. It also scans every request and response for sensitive data: Authorization and Cookie headers, API-key headers, and query parameters whose names look like tokens or secrets, flagging the requests that carry them.',
    note: 'HAR files are a notorious privacy hazard: because they record full requests and responses, they routinely contain live session cookies, bearer tokens and API keys that can be used to impersonate you. That is exactly why this tool parses everything locally and never uploads the file — and why you should scrub or avoid sharing HARs that the scan flags. The table shows up to 500 requests; filter by URL to narrow a large capture.',
    faqs: [
      { q: 'How do I open a HAR file?', a: 'Choose the .har file here and it\'s parsed in your browser into a readable table of requests with statuses, sizes and timings. Nothing is uploaded, which matters because HAR files often contain credentials.' },
      { q: 'How do I create a HAR file?', a: 'In your browser\'s DevTools, open the Network tab, reload the page or reproduce the issue, then right-click the request list and choose "Save all as HAR". That file is what you open here.' },
      { q: 'Why are HAR files a security risk?', a: 'They capture complete requests and responses, so they frequently include session cookies, authorization tokens and API keys — anyone with the file could reuse those to access your accounts. This viewer flags requests that carry such data so you know what\'s in there.' },
      { q: 'Is my HAR file uploaded anywhere?', a: 'No. It\'s read and analysed entirely in your browser and never sent to a server, so even a HAR full of tokens stays on your device. It also works offline once loaded.' },
    ],
    keywords: ['har viewer', 'har file viewer', 'open har file', 'analyze har', 'har analyzer online', 'read har file'],
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    icon: '🗃️',
    description:
      'Format and beautify SQL queries with proper indentation and keyword casing, for MySQL, PostgreSQL, SQL Server, BigQuery and more. Private, in your browser.',
    lead: 'Paste messy or minified SQL and get it pretty-printed with consistent indentation, line breaks and keyword casing — for the database dialect you choose.',
    widget: 'sqlformat',
    how: 'The formatter parses your SQL for the chosen dialect and re-prints it with each clause on its own line, nested expressions indented, and keywords cased consistently (upper, lower or preserved). It understands dialect-specific syntax for MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), BigQuery, Snowflake, Spark and standard SQL. Everything runs in your browser, so queries — which can reveal your schema and data — are never uploaded.',
    note: 'Formatting only changes whitespace and keyword casing; it never alters what your query does. Pick the dialect that matches your database for the most accurate results, especially with vendor-specific functions and syntax. It\'s ideal for tidying up ORM-generated or one-line queries before code review, or making a complex query readable while you debug it.',
    faqs: [
      { q: 'How do I format SQL?', a: 'Paste your query, choose the database dialect and keyword casing, and click Format SQL. You get a clean, indented version you can copy — all done locally in your browser.' },
      { q: 'Does formatting change my query\'s results?', a: 'No. It only adjusts whitespace, line breaks and the letter case of keywords. The logic and results of the query are completely unchanged.' },
      { q: 'Which SQL dialects are supported?', a: 'Standard SQL plus MySQL, PostgreSQL, SQLite, MariaDB, SQL Server (T-SQL), BigQuery, Snowflake and Spark SQL. Choosing the right one handles dialect-specific syntax correctly.' },
      { q: 'Is my SQL sent to a server?', a: 'No — the formatting runs entirely in your browser, so your queries and the schema they reveal never leave your device. It works offline once loaded.' },
    ],
    keywords: ['sql formatter', 'format sql', 'sql beautifier', 'sql pretty print', 'format sql online', 'sql formatter online', 'beautify sql'],
  },
  {
    slug: 'base32-encode-decode',
    name: 'Base32 Encoder / Decoder',
    icon: '3️⃣',
    description:
      'Encode text to Base32 or decode Base32 to text — RFC 4648 standard and base32hex variants. Runs in your browser; nothing is uploaded.',
    lead: 'Base32 encodes bytes using 32 case-insensitive characters (A–Z, 2–7) — encode or decode instantly, with the base32hex variant.',
    widget: 'transform',
    computeId: 'base32',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode (text → Base32)' },
          { value: 'decode', label: 'Decode (Base32 → text)' },
        ],
      },
      {
        id: 'variant', label: 'Alphabet', type: 'select', defaultValue: 'standard',
        options: [
          { value: 'standard', label: 'Standard (A–Z, 2–7)' },
          { value: 'hex', label: 'base32hex (0–9, A–V)' },
        ],
      },
    ],
    sample: 'foobar',
    how: 'Encoding groups the UTF-8 bytes into 5-bit chunks and maps each to one of 32 characters — A–Z and 2–7 in the standard alphabet (RFC 4648), padding to a multiple of 8 with =. Base32 is case-insensitive and avoids easily-confused characters (no 0/O or 1/I), which is why it is used where humans type or read the value: TOTP two-factor secrets, some file hashes and identifiers. Decoding accepts either alphabet and tolerates missing padding and whitespace.',
    note: 'Base32 is encoding, not encryption — it is fully reversible with no secrecy. Compared with Base64 it is ~20% larger (5 bits per character vs 6) but case-insensitive and safer to transcribe by hand or read aloud. If you are working with a two-factor authentication secret, it is Base32 — pair this with the TOTP generator.',
    faqs: [
      { q: 'What is Base32 used for?', a: 'Anywhere a value must survive being typed, read aloud or written down: TOTP/2FA secrets, some content hashes and identifiers. Its case-insensitive alphabet (A–Z, 2–7) avoids characters that look alike, unlike Base64.' },
      { q: 'How is Base32 different from Base64?', a: 'Base32 uses 32 characters (5 bits each) and is case-insensitive; Base64 uses 64 (6 bits) and is case-sensitive. Base32 output is about 20% larger but far easier to transcribe without errors.' },
      { q: 'What is the base32hex variant?', a: 'An alternative alphabet (0–9 then A–V) defined in RFC 4648 §7 that preserves sort order of the encoded data. Pick it only if your target system specifies it; most uses want the standard alphabet.' },
      { q: 'Is Base32 encryption?', a: 'No — it is a reversible transport encoding with zero secrecy. Anyone can decode it. Encrypt first if you need confidentiality.' },
      { q: 'Is my text uploaded?', a: 'No — encoding and decoding run entirely in your browser. Nothing is transmitted and it works offline.' },
    ],
    keywords: ['base32 encode', 'base32 decode', 'base32 encoder', 'base32 converter', 'rfc 4648 base32', 'base32hex'],
  },
  {
    slug: 'iban-validator',
    name: 'IBAN Validator & Formatter',
    icon: '🏦',
    description:
      'Validate an IBAN with the ISO 13616 mod-97 checksum, check the country length, and pretty-print it in groups of four — in your browser, never uploaded.',
    lead: 'Paste an IBAN to check its ISO 13616 checksum and length and format it correctly — the number never leaves your device.',
    widget: 'transform',
    computeId: 'iban',
    sample: 'GB82 WEST 1234 5698 7654 32',
    how: 'An IBAN carries its own checksum. The tool moves the first four characters (country code + two check digits) to the end, converts every letter to two digits (A=10 … Z=35), and takes the whole number modulo 97 — a valid IBAN gives a remainder of exactly 1. It also verifies the length against the fixed length for that country (where known) and formats the IBAN in the standard groups of four.',
    note: 'This checks structure and the check digits only — it confirms an IBAN is well-formed and not mistyped, not that the account exists or is open. That is exactly what you want before saving a payee or sending a payment: catching a transposed digit locally, without sending the account number to a third-party server.',
    faqs: [
      { q: 'How is an IBAN validated?', a: 'By the ISO 13616 mod-97 checksum: rearrange so the country code and check digits move to the end, replace letters with numbers (A=10 … Z=35), and compute the whole value modulo 97 — a valid IBAN yields 1. This tool also checks the country-specific length.' },
      { q: 'Does this confirm the bank account exists?', a: 'No — it validates the format and check digits only, which catches typos and transpositions. Whether the account is real and open can only be confirmed by the bank during a payment.' },
      { q: 'Why is my IBAN flagged as the wrong length?', a: 'Each country has a fixed IBAN length (Germany 22, UK 22, France 27, and so on). A different length means a digit is missing or extra — re-check the number against your bank statement.' },
      { q: 'Is my IBAN uploaded anywhere?', a: 'No — the checksum runs in your browser, so the account number stays on your device. It works offline.' },
    ],
    keywords: ['iban validator', 'iban checker', 'validate iban', 'iban format', 'iban check digit', 'check iban number'],
  },
  {
    slug: 'isbn-converter',
    name: 'ISBN-10 ↔ ISBN-13 Converter & Validator',
    icon: '📚',
    description:
      'Validate an ISBN-10 or ISBN-13 check digit and convert between the two formats — in your browser, never uploaded.',
    lead: 'Paste an ISBN to verify its check digit and convert ISBN-10 ↔ ISBN-13 — computed locally on your device.',
    widget: 'transform',
    computeId: 'isbn',
    sample: '978-0-306-40615-7',
    how: 'The tool checks the ISBN\'s check digit — ISBN-10 uses a modulo-11 weighted sum (weights 10 down to 1, with X meaning 10), ISBN-13 uses a modulo-10 alternating 1-3 weighting. To convert an ISBN-10 to ISBN-13 it prefixes 978 and recomputes the mod-10 check digit; to go the other way it drops the 978 prefix and recomputes the mod-11 digit. Hyphens and spaces are ignored.',
    note: 'ISBN-13 has been the standard since 2007; older books carry ISBN-10. The 979-prefixed ISBN-13s have no ISBN-10 equivalent, so those convert one way only. This validates the check digit — it confirms the number is well-formed, not that the book exists in a catalogue.',
    faqs: [
      { q: 'How do I convert ISBN-10 to ISBN-13?', a: 'Prefix the first nine digits with 978 and recompute the final check digit using the ISBN-13 (mod-10, alternating 1-3) formula. This tool does it automatically and validates the result.' },
      { q: 'What does the X in an ISBN-10 mean?', a: 'It is a check digit of 10, written as X because ISBN-10 uses modulo 11 which can produce a value of 10. It only ever appears in the last position.' },
      { q: 'Why can\'t my ISBN-13 convert to ISBN-10?', a: 'Only 978-prefixed ISBN-13s have an ISBN-10 equivalent. A 979 prefix has no ISBN-10, so the conversion is one-directional for those.' },
      { q: 'Does this check the book exists?', a: 'No — it validates the check digit and converts formats. It confirms the ISBN is structurally valid and not mistyped, not that it maps to a real title.' },
      { q: 'Is my input uploaded?', a: 'No — validation and conversion run in your browser and nothing is transmitted.' },
    ],
    keywords: ['isbn converter', 'isbn 10 to 13', 'isbn 13 to 10', 'isbn validator', 'isbn check digit', 'convert isbn'],
  },
  {
    slug: 'punycode-converter',
    name: 'Punycode / IDN Converter',
    icon: '🌍',
    description:
      'Convert internationalised domain names between Unicode and ASCII Punycode (xn--…) — RFC 3492 / IDNA, in your browser, never uploaded.',
    lead: 'Convert a Unicode domain (münchen.de) to its ASCII xn-- form and back — useful for DNS, email and spotting look-alike domains.',
    widget: 'transform',
    computeId: 'punycode',
    options: [
      {
        id: 'mode', label: 'Direction', type: 'select', defaultValue: 'to-ascii',
        options: [
          { value: 'to-ascii', label: 'Unicode → ASCII (xn--)' },
          { value: 'to-unicode', label: 'ASCII (xn--) → Unicode' },
        ],
      },
    ],
    sample: 'münchen.de',
    how: 'The Domain Name System only allows ASCII letters, digits and hyphens, so internationalised domain names (IDNs) with accents or non-Latin scripts are encoded with Punycode (RFC 3492): each affected label is transformed into an ASCII string and prefixed with xn--. The tool converts each dot-separated label — münchen.de becomes xn--mnchen-3ya.de — and decodes xn-- labels back to their original Unicode.',
    note: 'Punycode is also a security tool: attackers register look-alike domains using characters that resemble Latin letters (a Cyrillic "а" for a Latin "a"), and the only reliable way to see the real domain is its xn-- form. Decoding a suspicious xn-- domain here shows what it actually contains, on your device — no lookup, no tracking.',
    faqs: [
      { q: 'What is Punycode?', a: 'The ASCII encoding (RFC 3492) that lets internationalised domain names with non-ASCII characters work in the DNS. Each affected label is converted and prefixed with xn--, e.g. münchen → xn--mnchen-3ya.' },
      { q: 'Why do some domains start with xn--?', a: 'That prefix marks a Punycode-encoded label — the ASCII representation of a domain containing accents or non-Latin characters. Your browser shows the Unicode version but sends the xn-- form to DNS.' },
      { q: 'How does this help spot phishing?', a: 'Look-alike (homograph) attacks use characters that resemble Latin letters. Decoding the domain\'s xn-- form reveals the real characters, so you can tell a genuine site from an impostor.' },
      { q: 'Does it convert whole domains or single labels?', a: 'Whole domains — it processes each dot-separated label independently, encoding only those with non-ASCII characters and leaving plain labels (like com) unchanged.' },
      { q: 'Is my domain uploaded?', a: 'No — the conversion runs locally in your browser with no DNS lookup, so nothing is transmitted.' },
    ],
    keywords: ['punycode converter', 'idn converter', 'punycode decode', 'xn-- decoder', 'unicode to punycode', 'internationalized domain name'],
  },
  {
    slug: 'json-diff',
    name: 'JSON Diff / Compare',
    icon: '🔀',
    description:
      'Compare two JSON documents structurally — see added, removed and changed keys, ignoring formatting and key order. In your browser, never uploaded.',
    lead: 'Paste two JSON documents to see exactly what changed — a key-aware diff that ignores reformatting and key order.',
    widget: 'jsondiff',
    how: 'The tool parses both JSON documents and walks them recursively, comparing by key rather than by line. It reports each difference as added (a key or element only in the second), removed (only in the first) or changed (different values), with the path to each. Because it compares the parsed data, reordering an object\'s keys or reformatting the whitespace is correctly reported as no change — unlike a plain text diff.',
    note: 'A line-based text diff of two JSON files is noisy: pretty-printing or reordering keys shows up as dozens of false changes. A structural (semantic) diff cuts through that to the differences that actually matter — which is what you want when comparing an API response before and after a change, or two config files. Arrays are compared by position, so element order does matter there.',
    faqs: [
      { q: 'How is this different from a normal text diff?', a: 'A text diff compares lines, so reformatting or reordering keys creates false differences. This compares the parsed JSON by key, so only real structural changes — added, removed or changed values — are reported.' },
      { q: 'Does key order matter?', a: 'No for object keys — {"a":1,"b":2} and {"b":2,"a":1} are identical. Yes for arrays: elements are compared by position, so reordering a list is reported as changes.' },
      { q: 'What does it show for each difference?', a: 'The path to the value (e.g. user.roles[2]) and whether it was added, removed or changed, with the old and new values for changes. There\'s a plain-text summary you can copy.' },
      { q: 'What if my JSON is invalid?', a: 'The tool tells you which side failed to parse so you can fix it. Both must be valid JSON before it can compare them.' },
      { q: 'Is my data uploaded?', a: 'No — both documents are parsed and compared in your browser. Nothing is transmitted, so even sensitive API payloads stay on your device.' },
    ],
    keywords: ['json diff', 'compare json', 'json compare', 'json difference', 'diff two json', 'semantic json diff', 'json patch'],
  },
  {
    slug: 'hmac-generator',
    name: 'HMAC Generator',
    icon: '🔏',
    description:
      'Generate an HMAC (keyed hash) of a message with a secret key — HMAC-SHA1/256/384/512, hex or base64. In your browser; the key never leaves your device.',
    lead: 'Sign a message with a secret key to get its HMAC — the keyed hash used to verify webhooks and API requests, computed locally.',
    widget: 'hmac',
    how: 'HMAC combines a message with a secret key and a hash function (SHA-1, SHA-256, SHA-384 or SHA-512) to produce a fixed-length signature that only someone with the key can reproduce. The tool computes it with the browser\'s Web Crypto API and shows the result as hexadecimal or base64. Unlike a plain hash, HMAC needs a key — it proves the message came from someone who holds the secret and wasn\'t altered in transit.',
    note: 'This is exactly how webhook providers sign their payloads: Stripe, GitHub and others HMAC the request body with a secret you share, and you recompute the HMAC on your side to confirm the request is genuine and untampered. HMAC is authentication, not encryption — it doesn\'t hide the message, it proves its origin and integrity. Everything runs on your device, so the secret is never transmitted.',
    faqs: [
      { q: 'What is an HMAC?', a: 'A Hash-based Message Authentication Code: a keyed hash of a message that proves it came from someone who knows the secret key and hasn\'t been changed. It uses a standard hash (SHA-256 and friends) combined with the key.' },
      { q: 'How is HMAC different from a normal hash?', a: 'A plain hash (like SHA-256) needs only the message, so anyone can compute it. HMAC also requires a secret key, so only holders of the key can produce or verify the value — which is what makes it useful for authentication.' },
      { q: 'How do I verify a webhook signature?', a: 'Take the raw request body and your shared signing secret, compute the HMAC with the algorithm the provider specifies (usually SHA-256), and compare it to the signature header they sent. A match means the request is genuine.' },
      { q: 'Should the output be hex or base64?', a: 'Whichever your system expects — both represent the same bytes. Many APIs use hex for signatures; some use base64. The tool gives you either.' },
      { q: 'Is my secret key uploaded?', a: 'No — the HMAC is computed with Web Crypto in your browser. The message and key never leave your device, and it works offline.' },
    ],
    keywords: ['hmac generator', 'hmac sha256', 'hmac calculator', 'generate hmac', 'hmac signature', 'webhook signature', 'hmac sha512'],
  },
  {
    slug: 'jwt-encoder',
    name: 'JWT Encoder / Signer',
    icon: '🎟️',
    description:
      'Build and HMAC-sign a JSON Web Token (JWT) from a payload and secret — HS256/384/512. The companion to the JWT decoder, in your browser, never uploaded.',
    lead: 'Create a signed JWT from your payload and secret — HS256/384/512, computed locally so the secret never leaves your browser.',
    widget: 'jwtenc',
    how: 'A JWT has three parts joined by dots: a header ({"alg","typ"}), your payload of claims, and a signature. The tool base64url-encodes the header and payload, signs "header.payload" with your secret using HMAC (HS256, HS384 or HS512) via Web Crypto, and appends the base64url signature. The result is a token you can drop into an Authorization header or a test — and read back with the JWT decoder.',
    note: 'This signs with HMAC (HS*) algorithms, which use one shared secret to both sign and verify — ideal for testing, internal services and learning how JWTs are built. Public-key algorithms (RS256, ES256) sign with a private key and verify with a public one; those need key material this tool intentionally doesn\'t handle. Remember a JWT payload is only base64-encoded, not encrypted — never put secrets in it. Everything runs on your device.',
    faqs: [
      { q: 'How do I create a JWT?', a: 'Enter your payload as JSON, pick an algorithm (HS256 is standard), and provide the signing secret — the tool outputs the signed three-part token. Header {alg, typ:"JWT"} is generated for you.' },
      { q: 'What\'s the difference between HS256 and RS256?', a: 'HS256 uses one shared secret for both signing and verifying (HMAC). RS256 uses a private key to sign and a public key to verify. This tool does HS* (shared-secret) signing; RS/ES need key pairs.' },
      { q: 'Is the JWT payload encrypted?', a: 'No — the header and payload are only base64url-encoded and can be read by anyone with the token. The signature guarantees they weren\'t altered, but it doesn\'t hide them, so never put secrets in a JWT.' },
      { q: 'How do I read a token back?', a: 'Use the JWT decoder to inspect any token\'s header and payload. This encoder is the reverse — it builds and signs a token from a payload you provide.' },
      { q: 'Is my secret sent anywhere?', a: 'No — the token is signed with Web Crypto in your browser. The payload and secret never leave your device, and it works offline.' },
    ],
    keywords: ['jwt encoder', 'jwt signer', 'create jwt', 'sign jwt', 'generate jwt token', 'jwt hs256', 'make jwt'],
  },
  {
    slug: 'iso-8601-duration-converter',
    name: 'ISO 8601 Duration Converter',
    icon: '⏱️',
    description:
      'Parse an ISO 8601 duration like PT1H30M into seconds and HH:MM:SS, or build a duration string from seconds. In your browser, nothing uploaded.',
    lead: 'ISO 8601 durations look like PT1H30M (1 hour 30 minutes) — this converts them to seconds and HH:MM:SS, or turns seconds back into the string.',
    widget: 'transform',
    computeId: 'isoDuration',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'parse',
        options: [
          { value: 'parse', label: 'Parse (ISO 8601 → seconds)' },
          { value: 'build', label: 'Build (seconds → ISO 8601)' },
        ],
      },
    ],
    sample: 'PT1H30M',
    how: 'An ISO 8601 duration starts with P (period) and lists years, months, weeks and days, then a T separator before hours, minutes and seconds — so PT1H30M is 1 hour 30 minutes, P1DT2H is 1 day 2 hours, and P1W is one week. Parse mode reads that grammar and reports the total in seconds, HH:MM:SS and a human-readable form. Build mode does the reverse, turning a number of seconds into the shortest equivalent duration string (using days and time components).',
    note: 'This format appears all over: YouTube’s Data API returns video lengths as ISO 8601 durations (PT4M13S), and it is used in scheduling, XML/JSON schemas and workflow tools. One ambiguity is deliberate: a bare duration has no anchor date, so calendar years and months have no exact length — this tool uses the common convention of 1 year = 365 days and 1 month = 30 days for the Y and M (before the T) components, and is exact for weeks, days, hours, minutes and seconds. Everything runs locally.',
    faqs: [
      { q: 'What does PT1H30M mean?', a: 'One hour and thirty minutes. The P starts the duration, the T separates the date part from the time part, and H/M/S are hours, minutes and seconds — so PT1H30M = 5400 seconds.' },
      { q: 'What is the T in an ISO 8601 duration for?', a: 'It separates date components (years, months, weeks, days) from time components (hours, minutes, seconds). It matters because M means months before the T but minutes after it: P1M is one month, PT1M is one minute.' },
      { q: 'How are years and months handled?', a: 'A standalone duration has no start date, so Y and M have no fixed length. This converter uses 1 year = 365 days and 1 month = 30 days for those, and is exact for weeks/days/hours/minutes/seconds.' },
      { q: 'Where are these durations used?', a: 'The YouTube Data API returns video durations in this format (e.g. PT4M13S), and it appears in XML Schema, JSON Schema, scheduling systems and many APIs.' },
      { q: 'Is my input uploaded?', a: 'No — parsing and formatting run entirely in your browser and work offline.' },
    ],
    keywords: ['iso 8601 duration', 'iso 8601 duration converter', 'pt1h30m to seconds', 'parse iso 8601 duration', 'duration to seconds', 'youtube duration converter'],
  },
  {
    slug: 'utm-builder',
    name: 'UTM Campaign URL Builder',
    icon: '🎯',
    description:
      'Build a tagged campaign URL with utm_source, utm_medium, utm_campaign and more — correctly URL-encoded, copy-ready. In your browser, nothing uploaded.',
    lead: 'Add utm_source, utm_medium and utm_campaign tags to any link so analytics can attribute the traffic — assembled and encoded correctly, live.',
    widget: 'utm',
    how: 'You enter your destination URL and the standard UTM fields — source (where the click comes from), medium (the channel like email or cpc), campaign (the promotion name), plus optional term and content. The tool appends them as query parameters, URL-encoding every value so spaces and symbols are safe, and preserves any parameters already on your URL. An optional lowercase toggle avoids the classic reporting split where "Email" and "email" show up as two different sources.',
    note: 'UTM parameters are the de-facto standard (originally from Urchin, now used by GA4 and virtually every analytics tool) for tracking which campaigns drive traffic. The two things people get wrong are inconsistent casing — analytics treats utm_source=Facebook and utm_source=facebook as separate sources — and forgetting to encode values, which breaks the link. This builder handles both. It runs entirely in your browser, so your URLs and campaign names are never sent anywhere.',
    faqs: [
      { q: 'What are UTM parameters?', a: 'Tags added to a link\'s query string — utm_source, utm_medium, utm_campaign, and optionally utm_term and utm_content — that let analytics tools attribute a visit to a specific source, channel and campaign. GA4 reads them automatically.' },
      { q: 'Which UTM parameters are required?', a: 'Source, medium and campaign are the three you should always set for meaningful reports. Term and content are optional — term is mainly for paid-search keywords, content for distinguishing two links in the same campaign.' },
      { q: 'Why does casing matter?', a: 'Analytics treats UTM values as case-sensitive, so utm_source=Newsletter and utm_source=newsletter appear as two different sources and split your data. The lowercase toggle keeps everything consistent.' },
      { q: 'Does it encode special characters?', a: 'Yes — every value is URL-encoded, so spaces, ampersands and other symbols in a campaign name won\'t break the link. Parameters already on your URL are kept intact.' },
      { q: 'Is my URL uploaded?', a: 'No — the campaign URL is built entirely in your browser and works offline, so nothing about your links or campaigns is transmitted.' },
    ],
    keywords: ['utm builder', 'utm url builder', 'campaign url builder', 'utm parameter generator', 'utm link builder', 'ga4 campaign url', 'utm tag generator'],
  },
  {
    slug: 'json-schema-generator',
    name: 'JSON Schema Generator',
    icon: '🧬',
    description:
      'Generate a JSON Schema (draft-07) from a JSON sample — types, properties and required fields inferred automatically. In your browser, nothing uploaded.',
    lead: 'Paste a JSON example and get a draft-07 JSON Schema describing it — types, nested objects, arrays and required fields inferred for you.',
    widget: 'transform',
    computeId: 'jsonSchema',
    options: [
      { id: 'minify', label: 'Minify output (single line)', type: 'checkbox' },
    ],
    sample: '{\n  "id": 42,\n  "name": "Ada",\n  "active": true,\n  "roles": ["admin", "editor"],\n  "profile": { "city": "London", "age": 36 }\n}',
    how: 'The generator parses your JSON sample and walks it to infer a JSON Schema (draft-07). Whole numbers become "integer" and other numbers "number"; strings, booleans, arrays and nested objects are each described in place. For an array of objects it merges the elements into one item schema, marking a property as required only when it appears in every element. Every object lists its always-present keys under "required". The result is valid draft-07 you can drop into validation, an OpenAPI spec, or a form generator.',
    note: 'A JSON Schema inferred from one example is a strong starting point, not a finished contract — you will usually tighten it by hand: adding formats (date-time, email), min/max constraints, enums, and descriptions, and relaxing "required" where a field is genuinely optional. Because inference sees only the sample you give it, a richer example (covering optional fields and edge cases) produces a better schema. Everything runs locally, so proprietary payloads never leave your browser.',
    faqs: [
      { q: 'How do I generate a JSON Schema from JSON?', a: 'Paste a representative JSON example and the tool infers a draft-07 schema — object properties, array item types, and which fields are required. Copy the result and refine it as needed.' },
      { q: 'Which JSON Schema version does it produce?', a: 'Draft-07, the most widely supported version across validators, OpenAPI tooling and form libraries. The output includes the $schema declaration so validators recognise it.' },
      { q: 'How does it decide what is "required"?', a: 'For a single object, every key present is marked required. For an array of objects, a property is required only if it appears in all of them — so optional fields (missing from some elements) are left out of "required".' },
      { q: 'Why should I refine the generated schema?', a: 'Inference only knows the sample you gave it. It can’t guess string formats (email, date-time), numeric ranges, enums, or which fields are truly optional. Treat the output as a scaffold and add those constraints yourself.' },
      { q: 'Is my JSON uploaded?', a: 'No — parsing and schema generation run entirely in your browser and work offline, so sensitive payloads stay on your device.' },
    ],
    keywords: ['json schema generator', 'generate json schema', 'json to json schema', 'json schema draft-07', 'infer json schema', 'json schema from example'],
  },
  {
    slug: 'json-to-go',
    name: 'JSON to Go Struct Converter',
    icon: '🐹',
    description:
      'Convert a JSON sample into Go struct definitions with json tags — types and nested structs inferred automatically. In your browser, never uploaded.',
    lead: 'Paste JSON and get Go structs with the right field types and json:"…" tags — nested objects and slices handled for you.',
    widget: 'transform',
    computeId: 'jsonToGo',
    options: [
      { id: 'rootName', label: 'Root struct name', type: 'text', defaultValue: 'Root', placeholder: 'Root' },
    ],
    sample: '{\n  "id": 42,\n  "user_name": "ada",\n  "is_active": true,\n  "scores": [10, 20],\n  "profile": { "city": "London" }\n}',
    how: 'The converter parses your JSON and emits idiomatic Go struct definitions. Field names are PascalCased (so user_name becomes UserName) while the original key is preserved in a json:"user_name" tag. Types are inferred: whole numbers become int, other numbers float64, booleans bool, strings string, null and empty arrays interface{}, arrays become slices of the element type, and nested objects become their own named structs referenced from the parent.',
    note: 'This gives you the boilerplate for unmarshalling JSON into typed Go structs in seconds. A couple of things to check by hand: a JSON number with no decimals is typed as int, but if the field can exceed 32-bit or you need decimals you may want int64 or float64; and fields that are sometimes null may need pointer types (*string) or omitempty tags. It’s a fast scaffold you refine, not a substitute for knowing your API. Everything runs locally in your browser.',
    faqs: [
      { q: 'How do I convert JSON to a Go struct?', a: 'Paste a JSON sample and the tool generates Go struct definitions with json tags. Set the root struct name if you like, then copy the output straight into your Go file.' },
      { q: 'Does it keep the original JSON field names?', a: 'Yes — the Go field is PascalCased (as Go requires for exported fields) and the original key is preserved in a json:"original_key" tag, so json.Unmarshal maps correctly.' },
      { q: 'How are numbers typed?', a: 'Whole numbers become int and numbers with a decimal point become float64. If your values can be large or must always be floating-point, adjust to int64 or float64 after generating — inference can only go on the sample.' },
      { q: 'What about null or optional fields?', a: 'null and empty arrays are typed as interface{}. For fields that may be absent or null in real data, consider pointer types (e.g. *string) or the omitempty tag, which the tool leaves for you to add deliberately.' },
      { q: 'Is my JSON uploaded?', a: 'No — the conversion runs entirely in your browser and works offline, so your data never leaves your device.' },
    ],
    keywords: ['json to go', 'json to go struct', 'json to golang struct', 'go struct generator', 'json to struct', 'golang json tags'],
  },
  {
    slug: 'curl-to-code',
    name: 'curl to JavaScript fetch Converter',
    icon: '🔁',
    description:
      'Convert a curl command into an equivalent JavaScript fetch() call — method, headers and body parsed automatically. In your browser, never uploaded.',
    lead: 'Paste a curl command and get the equivalent JavaScript fetch() call — method, headers, body and basic auth translated for you.',
    widget: 'transform',
    computeId: 'curlToCode',
    sample: `curl -X POST https://api.example.com/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"user":"ada","pass":"secret"}'`,
    how: 'The converter tokenizes the curl command with a shell-aware parser (honouring single and double quotes, escapes and \\-newline line continuations), then reads the common flags: -X/--request for the method, -H/--header for headers, -d/--data (and its variants) for the body, and -u/--user for HTTP basic auth (turned into an Authorization header). It infers POST when a body is present without an explicit method, adds a default Content-Type for form data, and emits a ready-to-run fetch() call with .then() handlers.',
    note: 'This handles the flags in the vast majority of copy-pasted curl commands — the ones you get from API docs, browser "Copy as cURL", and Stripe/GitHub examples. A few advanced cases are intentionally out of scope: multipart -F file uploads, cookie jars, and client certificates don’t map cleanly to a one-line fetch and are better handled deliberately. Because the parsing is local, any tokens or secrets in the command never leave your browser.',
    faqs: [
      { q: 'How do I convert a curl command to fetch?', a: 'Paste the curl command and the tool outputs an equivalent JavaScript fetch() call, translating the method, headers and body. Copy it straight into your code.' },
      { q: 'Does it handle the request body and headers?', a: 'Yes — -H/--header become the headers object, and -d/--data (including --data-raw and --data-binary) become the body. Multiple -d flags are joined with & as curl does, and a default Content-Type is added for form data.' },
      { q: 'What about authentication?', a: 'The -u/--user flag is converted into an Authorization: Basic header (base64-encoded), which is how curl sends basic auth. Bearer tokens passed via -H "Authorization: Bearer …" are carried through unchanged.' },
      { q: 'Which curl features are not supported?', a: 'Multipart file uploads (-F), cookie jars and client certificates aren’t translated, because they don’t map cleanly onto a single fetch() call. The common flags from API docs and "Copy as cURL" all work.' },
      { q: 'Is my curl command uploaded?', a: 'No — parsing happens entirely in your browser, so any API keys or tokens in the command stay on your device. The tool works offline.' },
    ],
    keywords: ['curl to fetch', 'curl to javascript', 'curl to code', 'convert curl command', 'curl to js', 'curl converter'],
  },
  {
    slug: 'json-to-python',
    name: 'JSON to Python Dataclass Converter',
    icon: '🐍',
    description:
      'Convert a JSON sample into Python dataclasses with type hints — nested classes and List/Optional types inferred. In your browser, never uploaded.',
    lead: 'Paste JSON and get Python @dataclass definitions with type hints — nested objects, lists and optional fields handled for you.',
    widget: 'transform',
    computeId: 'jsonToPython',
    options: [
      { id: 'rootName', label: 'Root class name', type: 'text', defaultValue: 'Root', placeholder: 'Root' },
    ],
    sample: '{\n  "id": 42,\n  "user_name": "ada",\n  "is_active": true,\n  "scores": [10, 20],\n  "profile": { "city": "London" }\n}',
    how: 'The converter parses your JSON and emits Python @dataclass definitions with PEP 484 type hints. Whole numbers become int, decimals float, booleans bool, strings str, arrays List[...] and nested objects their own dataclass. Fields that are missing from some elements of an array of objects are typed Optional[...]. Classes are emitted deepest-first so each is defined before it is referenced, and the needed imports (dataclass, List, Optional, Any) are included.',
    note: 'This gives you typed models ready for json parsing, IDE autocompletion and static checkers like mypy in seconds. A couple of things you may refine by hand: a value with no decimals is typed int (widen to float if it can be fractional), and fields that can be null are marked Optional — but you may also want a default of None so the dataclass field is truly optional at construction. It is a scaffold to build on, not a substitute for knowing your data. Everything runs locally in your browser.',
    faqs: [
      { q: 'How do I convert JSON to a Python dataclass?', a: 'Paste a JSON sample and the tool outputs @dataclass definitions with type hints. Set the root class name if you like, then copy the code into your project.' },
      { q: 'Does it add type hints?', a: 'Yes — each field is annotated (int, float, bool, str, List[...], or a nested dataclass), which powers editor autocompletion and type-checkers like mypy. Optional fields are typed Optional[...].' },
      { q: 'How does it handle nested objects?', a: 'Each nested object becomes its own @dataclass, defined before the class that references it, so the code is valid top-to-bottom. Arrays of objects are merged into a single element dataclass.' },
      { q: 'Why is a number typed as int?', a: 'Whole numbers infer to int and numbers with a decimal point to float, based on the sample. If a field can be fractional, widen it to float after generating — inference only sees the example you provide.' },
      { q: 'Is my JSON uploaded?', a: 'No — the conversion runs entirely in your browser and works offline, so your data never leaves your device.' },
    ],
    keywords: ['json to python', 'json to dataclass', 'json to python class', 'python dataclass generator', 'json to python dict', 'json to pydantic'],
  },
  {
    slug: 'json-to-rust',
    name: 'JSON to Rust Struct Converter',
    icon: '🦀',
    description:
      'Convert a JSON sample into Rust structs with serde derives — types, Vec, Option and nested structs inferred. In your browser, never uploaded.',
    lead: 'Paste JSON and get Rust structs deriving Serialize/Deserialize — types, Vec, nested structs and serde renames handled for you.',
    widget: 'transform',
    computeId: 'jsonToRust',
    options: [
      { id: 'rootName', label: 'Root struct name', type: 'text', defaultValue: 'Root', placeholder: 'Root' },
    ],
    sample: '{\n  "id": 42,\n  "userName": "ada",\n  "isActive": true,\n  "scores": [10, 20],\n  "profile": { "city": "London" }\n}',
    how: 'The converter parses your JSON and emits Rust structs that derive serde’s Serialize and Deserialize. Whole numbers become i64, decimals f64, booleans bool, strings String, arrays Vec<...> and nested objects their own struct. Field names are converted to snake_case; when that differs from the JSON key (e.g. userName → user_name) a #[serde(rename = "…")] attribute is added so (de)serialization still matches the original key. Optional fields (absent in some array elements) are wrapped in Option<...>.',
    note: 'This is the boilerplate for deriving typed Rust models from an API in seconds, ready to use with serde_json. Refine as needed: a whole number is typed i64 (use u64/i32 where appropriate), and fields that may be missing are Option<...> — you can also add #[serde(default)] where a sensible default exists. Because parsing is local, nothing about your data leaves the browser.',
    faqs: [
      { q: 'How do I convert JSON to a Rust struct?', a: 'Paste a JSON sample and the tool generates Rust structs deriving Serialize and Deserialize. Copy the output and use it with serde_json to parse the same JSON.' },
      { q: 'Does it handle camelCase JSON keys?', a: 'Yes — field names are converted to Rust’s snake_case convention, and when that differs from the JSON key a #[serde(rename = "originalKey")] attribute is added so deserialization still matches.' },
      { q: 'What number types does it use?', a: 'Whole numbers become i64 and decimals f64. Adjust to u64, i32 or f32 as your data requires — the tool picks safe defaults from the sample.' },
      { q: 'How are optional or null fields handled?', a: 'Fields missing from some elements of an array are wrapped in Option<...>. A JSON null is typed Option<serde_json::Value>; tighten it once you know the real type.' },
      { q: 'Is my JSON uploaded?', a: 'No — generation runs entirely in your browser and works offline, so your data stays on your device.' },
    ],
    keywords: ['json to rust', 'json to rust struct', 'rust serde struct generator', 'json to serde', 'rust struct from json', 'json to rust serde'],
  },
  {
    slug: 'json-to-csharp',
    name: 'JSON to C# Class Converter',
    icon: '💠',
    description:
      'Convert a JSON sample into C# classes with System.Text.Json attributes — types, List and nested classes inferred. In your browser, never uploaded.',
    lead: 'Paste JSON and get C# classes with properties and JsonPropertyName attributes — nested classes and List types handled for you.',
    widget: 'transform',
    computeId: 'jsonToCsharp',
    options: [
      { id: 'rootName', label: 'Root class name', type: 'text', defaultValue: 'Root', placeholder: 'Root' },
    ],
    sample: '{\n  "id": 42,\n  "user_name": "ada",\n  "is_active": true,\n  "scores": [10, 20],\n  "profile": { "city": "London" }\n}',
    how: 'The converter parses your JSON and emits C# classes with auto-properties. Whole numbers become int, decimals double, booleans bool, strings string, arrays List<...> and nested objects their own class. Property names are PascalCased (C# convention); when that differs from the JSON key a [JsonPropertyName("original_key")] attribute (System.Text.Json) is added so serialization round-trips correctly. The needed using directives are included.',
    note: 'This produces model classes ready for System.Text.Json’s JsonSerializer.Deserialize in seconds. Refine to taste: a whole number is typed int (use long or decimal where needed), reference types are non-nullable by default (add ? for nullable fields under nullable reference types), and you can switch the attribute to Newtonsoft’s [JsonProperty] if your project uses Json.NET instead. Everything runs locally in your browser.',
    faqs: [
      { q: 'How do I convert JSON to a C# class?', a: 'Paste a JSON sample and the tool generates C# classes with properties. Copy them into your project and deserialize with System.Text.Json’s JsonSerializer.' },
      { q: 'Does it map snake_case JSON to C# properties?', a: 'Yes — properties are PascalCased (e.g. user_name → UserName) and a [JsonPropertyName("user_name")] attribute is added so System.Text.Json maps them back to the original keys.' },
      { q: 'Which JSON library are the attributes for?', a: 'System.Text.Json (the built-in .NET serializer), using [JsonPropertyName]. If you use Newtonsoft Json.NET, swap in [JsonProperty("…")] — the property names and types stay the same.' },
      { q: 'What number types does it use?', a: 'Whole numbers become int and decimals double. For large integers or money values, change to long or decimal after generating — inference goes on the sample only.' },
      { q: 'Is my JSON uploaded?', a: 'No — the conversion runs entirely in your browser and works offline, so your data never leaves your device.' },
    ],
    keywords: ['json to c#', 'json to csharp', 'json to c# class', 'c# class generator', 'json to csharp class', 'system.text.json class'],
  },
];

export function getDevTool(slug: string): DevToolDef | undefined {
  return DEV_TOOLS.find((t) => t.slug === slug);
}
