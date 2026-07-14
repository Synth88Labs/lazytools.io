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
  widget: 'transform' | 'hash' | 'llm-tokens' | 'eth-units' | 'keccak' | 'eip55';
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
];

export function getDevTool(slug: string): DevToolDef | undefined {
  return DEV_TOOLS.find((t) => t.slug === slug);
}
