/** Text-tools registry: one entry drives page, widget config, search index and schema. */

export interface TextToolOption {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
}

export interface TextToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** 'counter' = live stats; 'transform' = input→output; others = custom islands */
  widget: 'counter' | 'transform' | 'invisible' | 'homoglyph' | 'diff' | 'readability' | 'unicode' | 'frequency' | 'bionic';
  computeId?: string;
  options?: TextToolOption[];
  /** sample text preloaded so the tool demonstrates itself */
  sample?: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

const LINES_SAMPLE = 'banana\napple\ncherry\napple\nBanana\ndate';

export const TEXT_TOOLS: TextToolDef[] = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    icon: '🔤',
    description:
      'Count words, characters, sentences, paragraphs and reading time instantly as you type or paste. Free, private — your text never leaves the browser.',
    lead: 'Paste or type below — words, characters, sentences, paragraphs, reading time and speaking time update live.',
    widget: 'counter',
    how: 'Counting happens on every keystroke: words are runs of characters separated by whitespace; sentences split on ending punctuation; paragraphs on blank lines. Reading time uses 225 words per minute (typical adult silent reading) and speaking time 130 wpm (comfortable presentation pace) — both are averages, not verdicts.',
    note: 'Word counts differ slightly between tools because "a word" is a convention: hyphenated pairs, numbers and URLs can each count as one or several. This counter uses the same whitespace rule as most word processors, so it will normally match what an editor or teacher sees.',
    faqs: [
      { q: 'How is a word counted?', a: 'Any run of non-space characters counts as one word — the same convention word processors use. "state-of-the-art" is one word; "3.14" is one word.' },
      { q: 'What reading speed is the estimate based on?', a: '225 words per minute for silent reading and 130 wpm for speaking aloud — commonly used averages for adult native readers. Slides and speeches usually aim at the speaking figure.' },
      { q: 'How long is a 500-word text?', a: 'About 2.2 minutes of reading or 3.8 minutes of speaking; roughly one single-spaced page in a standard document.' },
      { q: 'Does the counter store or send my text?', a: 'No — counting runs entirely in your browser. Nothing you paste is transmitted, logged or stored; the page also works offline.' },
      { q: 'Do essay word counts include the title and references?', a: 'Institutions differ — most exclude the reference list and count everything else. Paste exactly the portion your requirement covers.' },
    ],
    keywords: ['word counter', 'word count online', 'character count', 'sentence counter', 'reading time calculator', 'paragraph counter'],
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    icon: '🔡',
    description:
      'Count characters with and without spaces, live, with limits for X/Twitter, SMS, meta titles and more. Private — runs in your browser.',
    lead: 'Type or paste to count characters instantly — with a live check against common platform limits (X posts, SMS, meta descriptions).',
    widget: 'counter',
    how: 'The count updates per keystroke, both including and excluding spaces. The limits panel compares your text against widely used platform caps — 280 characters for a standard X/Twitter post, 160 for a single GSM SMS, about 60 characters before Google typically truncates a title, and about 155–160 for meta descriptions.',
    note: 'Two caveats worth knowing: platforms count some characters specially (X counts every URL as 23 characters; emoji often count as 2), and SMS switches from 160-character GSM encoding to 70-character Unicode the moment you include an emoji or special symbol. Treat the limits as guidance and the platform’s own composer as the referee.',
    faqs: [
      { q: 'Do spaces count as characters?', a: 'Yes, in virtually every platform limit (X, SMS, meta tags). This counter shows both figures — with and without spaces — because style guides sometimes ask for the latter.' },
      { q: 'How long can an X (Twitter) post be?', a: '280 characters for standard accounts (URLs count as 23 regardless of length; most emoji count as 2). Premium subscribers can post far longer — but only the first 280 show before "Show more".' },
      { q: 'Why did my SMS split after adding an emoji?', a: 'An emoji forces the message from GSM-7 encoding (160 characters) to UCS-2 (70 characters). Multi-part messages then carry 153 or 67 characters per segment.' },
      { q: 'How long should a meta description be?', a: 'Google truncates by pixel width, not characters — about 155–160 characters usually fits on desktop. Front-load the important words; there is no penalty for longer text, it just gets cut visually.' },
      { q: 'Is my text uploaded to count it?', a: 'No — everything runs locally in your browser and works offline. Nothing is transmitted or stored.' },
    ],
    keywords: ['character counter', 'character count online', 'twitter character limit', 'sms character limit', 'meta description length', 'letter counter'],
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    icon: 'Aa',
    description:
      'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more — instantly, in your browser.',
    lead: 'Paste text, pick a case, copy the result — from shouty caps-lock fixes to code-ready camelCase.',
    widget: 'transform',
    computeId: 'case',
    options: [
      {
        id: 'mode', label: 'Convert to', type: 'select', defaultValue: 'title',
        options: [
          { value: 'upper', label: 'UPPERCASE' },
          { value: 'lower', label: 'lowercase' },
          { value: 'title', label: 'Title Case' },
          { value: 'sentence', label: 'Sentence case' },
          { value: 'camel', label: 'camelCase' },
          { value: 'pascal', label: 'PascalCase' },
          { value: 'snake', label: 'snake_case' },
          { value: 'kebab', label: 'kebab-case' },
          { value: 'constant', label: 'CONSTANT_CASE' },
          { value: 'alternating', label: 'aLtErNaTiNg' },
          { value: 'inverse', label: 'iNVERSE CASE' },
        ],
      },
    ],
    sample: 'accidentally typed this WITH CAPS LOCK on',
    how: 'Title Case capitalizes the first letter of every word; Sentence case capitalizes after ending punctuation; the developer cases (camel, Pascal, snake, kebab, CONSTANT) first split your text on spaces, hyphens, underscores and existing capital-letter boundaries, then rejoin it in the target style.',
    note: 'The classic use is rescuing a paragraph typed with caps lock on — paste, choose Sentence case, done. The developer cases are just as handy in reverse: paste a camelCase identifier and convert to snake_case when moving between languages, without retyping.',
    faqs: [
      { q: 'What is the difference between Title Case and Sentence case?', a: 'Title Case Capitalizes Every Word (headings); Sentence case capitalizes only the first word of each sentence (normal prose). Editorial styles like AP additionally lowercase short words in titles — review titles manually for publication.' },
      { q: 'What are camelCase, snake_case and kebab-case for?', a: 'Programming conventions: camelCase for JavaScript/Java variables, snake_case for Python, kebab-case for URLs and CSS classes, CONSTANT_CASE for constants. The converter splits words on spaces, dashes, underscores and capital boundaries.' },
      { q: 'Can it fix text typed with caps lock on?', a: 'Yes — that is the top use. Choose Sentence case to restore normal prose, or iNVERSE CASE to flip every letter if you were mid-sentence when you noticed.' },
      { q: 'Does converting case change my text otherwise?', a: 'No — only letter casing changes. Spacing, punctuation and characters stay untouched (except the developer cases, which by design replace separators).' },
      { q: 'Is the text I paste kept private?', a: 'Yes — the conversion runs in your browser; nothing is uploaded, logged or stored.' },
    ],
    keywords: ['case converter', 'uppercase to lowercase', 'title case converter', 'sentence case', 'camelcase converter', 'snake case', 'text case changer'],
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    icon: '🧹',
    description:
      'Delete duplicate lines from any list instantly, keeping first occurrences — with ignore-case and trim options. Private, in-browser.',
    lead: 'Paste a list, get it back with duplicates removed — first occurrence kept, order preserved.',
    widget: 'transform',
    computeId: 'dedupe',
    options: [
      { id: 'ignoreCase', label: 'Ignore case (Apple = apple)', type: 'checkbox' },
      { id: 'trim', label: 'Ignore leading/trailing spaces', type: 'checkbox', defaultValue: 'true' },
    ],
    sample: LINES_SAMPLE,
    how: 'Each line is compared against every line seen before it; repeats are dropped and the first occurrence kept, so your original order survives. "Ignore case" treats Apple and apple as the same line; "ignore spaces" disregards invisible leading/trailing whitespace — the most common reason two identical-looking lines both survive.',
    note: 'Typical jobs: cleaning email lists, keyword lists, log extracts and spreadsheet columns pasted as text. For a sorted unique list, run this tool first, then the sort-lines tool — or vice versa; the result is the same set.',
    faqs: [
      { q: 'Does it keep the first or last occurrence?', a: 'The first — everything after a line’s first appearance is removed, and the surviving lines keep their original order.' },
      { q: 'Why do two identical-looking lines both remain?', a: 'Almost always invisible trailing spaces or different capitalization. Enable both options and they will merge.' },
      { q: 'Can I deduplicate comma-separated values?', a: 'Put each value on its own line first — the find & replace tool converts ", " to line breaks in one step — then dedupe.' },
      { q: 'Is there a size limit?', a: 'Practically no — tens of thousands of lines process instantly, since everything runs locally in your browser.' },
      { q: 'Is my list uploaded anywhere?', a: 'No. Lists often contain emails or customer data — exactly why this tool never transmits anything.' },
    ],
    keywords: ['remove duplicate lines', 'delete duplicates from list', 'unique lines online', 'deduplicate text', 'remove repeated lines'],
  },
  {
    slug: 'sort-lines',
    name: 'Sort Lines',
    icon: '🔃',
    description:
      'Sort lines alphabetically (A–Z, Z–A), by length, in natural number order, reversed or shuffled — instantly in your browser.',
    lead: 'Paste lines, choose an order — alphabetical, by length, reversed or random shuffle.',
    widget: 'transform',
    computeId: 'sort',
    options: [
      {
        id: 'mode', label: 'Order', type: 'select', defaultValue: 'az',
        options: [
          { value: 'az', label: 'A → Z (natural)' },
          { value: 'za', label: 'Z → A' },
          { value: 'lengthAsc', label: 'Shortest first' },
          { value: 'lengthDesc', label: 'Longest first' },
          { value: 'reverse', label: 'Reverse current order' },
          { value: 'random', label: 'Random shuffle' },
        ],
      },
    ],
    sample: 'item 10\nitem 2\nItem 1\nitem 20',
    how: 'Alphabetical modes use natural, case-insensitive ordering — so "item 2" correctly sorts before "item 10" (a plain character sort would reverse them). Length modes compare character counts; shuffle applies an unbiased Fisher–Yates permutation.',
    note: 'Natural ordering is the quiet superpower here: filenames, version numbers and numbered lists sort the way humans expect instead of the way ASCII does.',
    faqs: [
      { q: 'Why does "item 10" sort after "item 2" here but not in other tools?', a: 'This tool uses natural ordering, which compares embedded numbers by value. Plain character sorting puts "10" before "2" because the character 1 precedes 2.' },
      { q: 'Is the sort case-sensitive?', a: 'No — "apple" and "Apple" sort together. Case is preserved in the output, just not used to separate entries.' },
      { q: 'Is the shuffle really random?', a: 'It uses the Fisher–Yates algorithm with the browser’s random source — unbiased for everyday use (raffles, random orders), though not cryptographic-grade.' },
      { q: 'Can I sort and deduplicate together?', a: 'Run remove-duplicate-lines first, then sort — two clicks, and the pair of tools link to each other.' },
      { q: 'Does my list leave the browser?', a: 'No — sorting is local, instant and works offline.' },
    ],
    keywords: ['sort lines alphabetically', 'sort list online', 'sort az', 'natural sort', 'shuffle lines', 'reverse line order'],
  },
  {
    slug: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    icon: '📄',
    description:
      'Remove line breaks and extra whitespace from text — join broken lines into flowing paragraphs. Instant and private.',
    lead: 'Fix text that arrives with a break at the end of every line — PDFs, emails, OCR output — in one click.',
    widget: 'transform',
    computeId: 'whitespace',
    options: [
      {
        id: 'mode', label: 'Clean-up', type: 'select', defaultValue: 'breaks-space',
        options: [
          { value: 'breaks-space', label: 'Replace breaks with spaces (join lines)' },
          { value: 'breaks-none', label: 'Remove breaks entirely' },
          { value: 'collapse', label: 'Collapse repeated spaces/tabs' },
          { value: 'empty-lines', label: 'Remove empty lines only' },
        ],
      },
    ],
    sample: 'This paragraph arrived\nwith a line break after\nevery few words.',
    how: 'The default mode replaces every run of line breaks with a single space and collapses doubled spaces, turning hard-wrapped text back into a flowing paragraph. The other modes handle the narrower cases: deleting breaks outright, tidying repeated spaces and tabs, or removing only the blank lines between paragraphs.',
    note: 'The classic sources of broken text: copying out of PDFs (hard-wrapped at the column width), plain-text emails wrapped at 72 characters, and OCR output. Paste, join, and the paragraph reflows naturally wherever you drop it.',
    faqs: [
      { q: 'Why does text copied from a PDF have a break on every line?', a: 'PDFs store text as positioned lines, not paragraphs — copying preserves the visual line ends as hard breaks. Joining them with spaces restores the paragraph.' },
      { q: 'Will joining lines merge my paragraphs too?', a: 'The default mode joins everything. If your text has real paragraphs separated by blank lines, first use "remove empty lines only" in reverse — or join per paragraph. For most PDF/email cleanups, plain joining is what you want.' },
      { q: 'What is the difference between removing breaks with a space vs entirely?', a: 'With a space keeps words separated ("line one line two"); entirely fuses them ("line oneline two") — only right for reassembling split URLs or code.' },
      { q: 'Can it clean up double spaces after sentences?', a: 'Yes — the collapse mode reduces any run of spaces or tabs to a single space and trims line edges.' },
      { q: 'Is anything sent to a server?', a: 'No — the cleanup runs in your browser, instantly, even offline.' },
    ],
    keywords: ['remove line breaks', 'join lines online', 'remove whitespace', 'fix pdf line breaks', 'remove empty lines', 'unwrap text'],
  },
  {
    slug: 'find-and-replace',
    name: 'Find and Replace',
    icon: '🔍',
    description:
      'Find and replace text online with case-sensitivity and regex support, plus a live replacement count. Private, in-browser.',
    lead: 'Search-and-replace like your editor’s Ctrl+H — with regex when you need it, and a count of what changed.',
    widget: 'transform',
    computeId: 'replace',
    options: [
      { id: 'find', label: 'Find', type: 'text', placeholder: 'text or pattern' },
      { id: 'replace', label: 'Replace with', type: 'text', placeholder: 'replacement (can be empty)' },
      { id: 'caseSensitive', label: 'Match case', type: 'checkbox' },
      { id: 'regex', label: 'Regular expression', type: 'checkbox' },
    ],
    sample: 'Replace colour with color: colour charts, colourful.',
    how: 'Plain mode replaces every occurrence of the exact text (case-insensitive unless "Match case" is on) and reports how many replacements were made. Regex mode treats the find field as a JavaScript regular expression — capture groups work in the replacement as $1, $2 — and invalid patterns report the error instead of silently failing.',
    note: 'The replacement count is the quiet safety feature: 0 replacements usually means a typo in the search text; a surprisingly large number warns you before you paste the result somewhere important. Leaving "replace with" empty deletes every match — the quickest bulk-remove there is.',
    faqs: [
      { q: 'How do I delete every occurrence of something?', a: 'Put it in Find and leave Replace empty — every match is removed, and the count tells you how many.' },
      { q: 'What can I do with the regex option?', a: 'Pattern-based edits: \\d+ matches any number, ^ and $ anchor line starts/ends, and capture groups reorder text — find "(\\w+), (\\w+)" replace "$2 $1" swaps "Doe, Jane" to "Jane Doe".' },
      { q: 'Why does my regex say invalid?', a: 'Characters like ( ) [ ] + ? have special meaning in regex — escape them with a backslash (\\() or switch off regex mode for literal text.' },
      { q: 'Can I replace line breaks?', a: 'Yes — in regex mode find \\n (or \\n{2,} for blank lines). For simple joining, the remove-line-breaks tool is one click.' },
      { q: 'Is my text kept private?', a: 'Yes — everything runs locally; the tool works with your connection off.' },
    ],
    keywords: ['find and replace online', 'search and replace text', 'regex replace online', 'bulk replace text', 'replace all occurrences'],
  },
  {
    slug: 'slug-generator',
    name: 'URL Slug Generator',
    icon: '🔗',
    description:
      'Convert any title to a clean URL slug — lowercase, hyphenated, accents removed. Instant, private, with custom separators.',
    lead: 'Turn "10 Café Recipes You’ll Love!" into 10-cafe-recipes-youll-love — the URL-safe version of any title.',
    widget: 'transform',
    computeId: 'slug',
    options: [
      {
        id: 'separator', label: 'Separator', type: 'select', defaultValue: '-',
        options: [
          { value: '-', label: 'hyphen-style (recommended)' },
          { value: '_', label: 'underscore_style' },
        ],
      },
    ],
    sample: '10 Café Recipes You’ll Love!',
    how: 'The text is lowercased, accented characters are transliterated to plain ASCII (café → cafe), everything that isn’t a letter or digit becomes the separator, and repeated or edge separators are trimmed. The result is safe for URLs, filenames and IDs.',
    note: 'Hyphens are the conventional separator for URLs — Google has long documented that it treats hyphens as word boundaries, while underscores join words. Keep slugs short, descriptive, and never change them after publishing (that is what redirects are for).',
    faqs: [
      { q: 'Hyphens or underscores for SEO?', a: 'Hyphens. Google’s documentation treats hyphenated words as separate terms, while underscores can join them. Underscores remain common for filenames and code identifiers.' },
      { q: 'What happens to accents and special characters?', a: 'Accented letters map to their plain equivalents (café → cafe, señor → senor); symbols and punctuation become separators or vanish. The output is pure a–z, 0–9 and separators.' },
      { q: 'Should stop words like "a" and "the" be removed?', a: 'Optional — shorter slugs are tidier, but clarity beats brevity. "the-office" and "office" are different topics; keep words that carry meaning.' },
      { q: 'Can I change a slug after publishing?', a: 'Only with a 301 redirect from the old URL — otherwise links and rankings break. Best practice is choosing a stable slug once.' },
      { q: 'Is anything uploaded?', a: 'No — slug generation is local and instant.' },
    ],
    keywords: ['slug generator', 'url slug', 'title to url', 'seo friendly url', 'permalink generator', 'text to slug'],
  },
  {
    slug: 'reverse-text',
    name: 'Reverse Text',
    icon: '🔁',
    description:
      'Reverse text by characters, words or lines — instantly in your browser. Mirror writing, palindrome checks and list flipping.',
    lead: 'Flip text three ways: character-by-character (mirror), word order, or line order.',
    widget: 'transform',
    computeId: 'reverse',
    options: [
      {
        id: 'mode', label: 'Reverse', type: 'select', defaultValue: 'chars',
        options: [
          { value: 'chars', label: 'Characters (mirror text)' },
          { value: 'words', label: 'Word order' },
          { value: 'lines', label: 'Line order' },
        ],
      },
    ],
    sample: 'was it a car or a cat I saw',
    how: 'Character mode mirrors the entire string (the last letter becomes the first); word mode keeps each word intact but reverses their order; line mode flips a list top-to-bottom — handy for chronological lists pasted newest-first.',
    note: 'Beyond the fun uses (mirror writing, checking palindromes like the sample), line reversal is the practically useful one: chat exports, logs and feeds often arrive newest-first when you need oldest-first.',
    faqs: [
      { q: 'How do I check if a phrase is a palindrome?', a: 'Reverse by characters and compare — ignoring spaces, punctuation and case. The sample text reads the same both ways once you ignore spacing.' },
      { q: 'What is reversing word order useful for?', a: 'Reordering name lists ("Doe Jane" → "Jane Doe" patterns), constructing reversed phrases, and language-play; each word itself stays readable.' },
      { q: 'And line order?', a: 'Flipping newest-first exports into chronological order — chat logs, bank statements, feed exports — without a spreadsheet.' },
      { q: 'Does it handle emoji correctly?', a: 'Common emoji reverse cleanly; a few complex multi-part emoji (family sequences, flags) may split when mirrored character-by-character — a limitation of how they are encoded.' },
      { q: 'Is the text processed locally?', a: 'Yes — nothing leaves your browser.' },
    ],
    keywords: ['reverse text', 'mirror text', 'backwards text generator', 'reverse words', 'reverse line order', 'palindrome checker'],
  },
  {
    slug: 'extract-email-addresses',
    name: 'Email & URL Extractor',
    icon: '📧',
    description:
      'Extract all email addresses, URLs or numbers from any pasted text — deduplicated, one per line. Private, in-browser.',
    lead: 'Paste anything messy — a webpage, a thread, a document — and pull out just the email addresses, links or numbers.',
    widget: 'transform',
    computeId: 'extract',
    options: [
      {
        id: 'mode', label: 'Extract', type: 'select', defaultValue: 'emails',
        options: [
          { value: 'emails', label: 'Email addresses' },
          { value: 'urls', label: 'URLs (http/https)' },
          { value: 'numbers', label: 'Numbers' },
        ],
      },
    ],
    sample: 'Contact ana@example.com or sales@example.org — details at https://example.com/pricing (from $29).',
    how: 'A pattern scan finds every email address (name@domain.tld), web URL or number in the pasted text, removes duplicates, and returns one result per line ready for a spreadsheet. The counter reports unique and total matches.',
    note: 'Contact lists deserve a privacy note more than most data: this extractor runs entirely on your device, which matters when the text you are mining contains other people’s addresses. Handle the output under the same care as any personal data.',
    faqs: [
      { q: 'Does it catch every email format?', a: 'It matches the practical standard form (name@domain.tld) including dots, plus-tags and subdomains — covering the overwhelming majority of real addresses. Exotic quoted-string addresses permitted by the RFC are rare enough to check manually.' },
      { q: 'Why is a URL cut short?', a: 'Trailing punctuation like ")" or "," is excluded by design since it usually belongs to the sentence, not the link. URLs without http(s):// (bare domains) are not matched — that avoids false positives like file names.' },
      { q: 'Are results deduplicated?', a: 'Yes — each address or URL appears once, with the total occurrence count shown above the output.' },
      { q: 'Can I extract phone numbers?', a: 'The numbers mode pulls all numeric values. Phone formats vary too wildly for one safe pattern — extract numbers, then eyeball, is the honest approach.' },
      { q: 'Is pasted text uploaded?', a: 'No — extraction is local. That is the point: harvesting emails through someone else’s server would leak the very data you are organizing.' },
    ],
    keywords: ['extract email addresses from text', 'email extractor', 'url extractor', 'get all links from text', 'extract numbers from text'],
  },
  {
    slug: 'invisible-character-detector',
    name: 'Invisible Character Detector & Remover',
    icon: '👻',
    description: 'Detect and remove hidden characters — zero-width spaces, non-breaking spaces, bidi controls and the tag characters used to watermark AI text. Private, in-browser.',
    lead: 'Reveal and strip the invisible characters hiding in pasted text — zero-width spaces, non-breaking spaces, and the tag characters increasingly used to secretly watermark AI-generated text.',
    widget: 'invisible',
    how: 'The tool walks your text code point by code point and flags every character that renders as nothing or as a deceptive space: zero-width spaces and joiners, the byte-order mark, bidirectional controls, non-breaking and exotic spaces, and the Unicode tag / variation-selector characters that some systems use to embed an invisible watermark. It lists what it found and gives you a cleaned copy with the hidden characters removed and odd spaces normalised.',
    note: 'This is exactly the kind of thing a chatbot cannot help with — an LLM literally cannot see or reliably emit invisible characters. It matters because pasted text from PDFs, websites and AI tools often carries hidden characters that break code, search, and form validation, or that fingerprint the text.',
    faqs: [
      { q: 'What are invisible / hidden characters?', a: 'Unicode code points that take up no visible space or masquerade as a normal space — zero-width spaces (U+200B), the word joiner, non-breaking spaces, the byte-order mark (U+FEFF), bidirectional controls, and tag characters. They are invisible on screen but very real in the bytes.' },
      { q: 'Does AI-generated text contain hidden watermarks?', a: 'It can. Some systems embed invisible tag or variation-selector characters to fingerprint AI output. This tool flags those ranges specifically, so you can see and remove them.' },
      { q: 'Why does hidden text break things?', a: 'A zero-width space inside a keyword stops a search or an if-statement from matching; a non-breaking space can break CSV parsing or number formatting; bidi overrides can make a filename display deceptively. Removing them makes text behave predictably.' },
      { q: 'What does the cleaner do to spaces?', a: 'Exotic spaces (non-breaking, narrow no-break, ideographic) are converted to a normal space, line/paragraph separators become newlines, and zero-width and control characters are dropped entirely.' },
      { q: 'Is my text uploaded?', a: 'No — the scan and clean run entirely in your browser, which matters because the text you are checking may be sensitive.' },
    ],
    keywords: ['invisible character detector', 'remove zero width space', 'hidden character remover', 'zero width space', 'ai text watermark remover', 'non breaking space remover'],
  },
  {
    slug: 'homoglyph-detector',
    name: 'Homoglyph / Lookalike Character Detector',
    icon: '🕵️',
    description: 'Detect non-ASCII characters that look like ASCII — Cyrillic а, Greek ο, fullwidth letters — used in domain spoofing and phishing. Private, in-browser.',
    lead: 'Find the deceptive lookalike (homoglyph) characters in text — a Cyrillic “а” or Greek “ο” hiding among Latin letters — the classic trick behind spoofed domains and brand impersonation.',
    widget: 'homoglyph',
    how: 'The tool checks each character against a curated set of Unicode confusables — characters from other scripts that are visually identical to ASCII letters. It reports every lookalike with its code point, script and the ASCII letter it imitates, warns when a single piece of text mixes scripts (a strong spoofing signal), and offers an ASCII-normalised version.',
    note: 'A live, marketable security angle: homoglyph attacks register domains like “pаypal.com” (with a Cyrillic а) that are indistinguishable to the eye. An LLM will happily read the spoofed text as legitimate; a deterministic script catches the substitution.',
    faqs: [
      { q: 'What is a homoglyph?', a: 'A character from one script that looks identical to a character in another — for example Cyrillic “а” (U+0430) versus Latin “a” (U+0061). They render the same but are different code points, which is what makes them useful for deception.' },
      { q: 'How are homoglyphs used in attacks?', a: 'To spoof domains, email addresses and brand names — “аpple.com” with a Cyrillic first letter looks real but points elsewhere. This is called an IDN homograph attack.' },
      { q: 'What does “mixed scripts” mean?', a: 'That a single word or text contains letters from more than one writing system (say Latin + Cyrillic). Legitimate text rarely does this within a word, so it is a red flag the tool highlights.' },
      { q: 'What does the normalized output do?', a: 'It replaces each detected lookalike with the ASCII letter it imitates, so you can see the “real” intended string.' },
      { q: 'Is my text uploaded?', a: 'No — the check runs entirely in your browser.' },
    ],
    keywords: ['homoglyph detector', 'confusable characters', 'lookalike characters', 'idn homograph attack', 'unicode spoofing detector', 'phishing character checker'],
  },
  {
    slug: 'text-diff',
    name: 'Text Diff & Compare',
    icon: '🔀',
    description: 'Compare two texts line by line and see exactly what was added, removed or changed — an exact, private diff in your browser. No upload.',
    lead: 'Paste two versions of any text and see exactly what changed — added, removed and unchanged lines, highlighted, with an exact line-by-line diff.',
    widget: 'diff',
    how: 'The tool computes a longest-common-subsequence diff between the two texts, the same algorithm behind version-control diffs. It aligns matching lines, marks insertions in green and deletions in red, and counts the changes. Options let you ignore case and whitespace so trivial differences do not clutter the result.',
    note: 'Sensitive by nature — contracts, code, and drafts are exactly what people compare, and pasting them into an online diff that uploads to a server is a real risk. This runs entirely on your device, and unlike asking a chatbot, the diff is exact rather than a summary.',
    faqs: [
      { q: 'How does text comparison work?', a: 'It uses a longest-common-subsequence (LCS) diff — the classic algorithm that finds the minimal set of additions and deletions to turn one text into another, then aligns and colour-codes them. It is exact, not an approximation.' },
      { q: 'Can it ignore case or whitespace?', a: 'Yes — toggle “ignore case” and “ignore whitespace” to treat lines that differ only in capitalisation or spacing as unchanged, so you see only meaningful differences.' },
      { q: 'Is it better than asking an AI to compare?', a: 'For anything precise, yes. A chatbot summarises differences and can miss or invent changes; an LCS diff shows every changed line exactly, every time.' },
      { q: 'Does it do word-level diffs?', a: 'The main view is line-level, which is what most comparisons need. The underlying engine also supports word-level diffing within a line.' },
      { q: 'Is my text uploaded?', a: 'No — both texts are compared in your browser and never sent anywhere, which is important for contracts, code and private documents.' },
    ],
    keywords: ['text diff', 'text compare', 'compare two texts', 'diff checker', 'find differences between text', 'online diff tool'],
  },
  {
    slug: 'readability-checker',
    name: 'Readability Score Checker',
    icon: '📖',
    description: 'Score text readability with Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI — exact grade levels, in your browser.',
    lead: 'Measure how readable your writing is with six standard formulas — Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI — and get the target reading grade level.',
    widget: 'readability',
    how: 'The tool counts words, sentences, syllables and complex (three-or-more-syllable) words, then applies the six published readability formulas exactly. Flesch Reading Ease gives a 0–100 score (higher is easier); the other five give a US grade level. It reports each score, a plain-English band, and the average grade so you know the education level your text demands.',
    note: 'Deterministic formulas that never go out of date — and a case where a tool beats a chatbot, which only estimates readability by feel. Aim for Flesch Reading Ease of 60 or more (roughly grade 8–9) for a general audience.',
    faqs: [
      { q: 'What is a good readability score?', a: 'For a general audience, aim for a Flesch Reading Ease of 60–70 (grade 8–9). Marketing and web copy often target 60+, while academic or legal writing scores lower (more difficult). Higher Reading Ease = easier to read.' },
      { q: 'What is the Flesch-Kincaid grade level?', a: 'It converts sentence length and syllable count into a US school grade — a score of 8.0 means an eighth-grader can understand the text. It uses 0.39×(words/sentence) + 11.8×(syllables/word) − 15.59.' },
      { q: 'Why do the six scores differ?', a: 'Each formula weights different features — sentence length, syllables, complex words, or letters per word. Reporting all six (and their average) gives a more robust picture than any single index.' },
      { q: 'How are syllables counted?', a: 'With the standard vowel-group heuristic used by readability tools: count contiguous vowel groups, adjust for silent endings, minimum one per word. It is highly accurate across normal prose.' },
      { q: 'Is my text uploaded?', a: 'No — every count and formula runs in your browser.' },
    ],
    keywords: ['readability checker', 'flesch reading ease', 'flesch kincaid grade level', 'gunning fog', 'smog index', 'reading level calculator', 'readability score'],
  },
  {
    slug: 'unicode-character-inspector',
    name: 'Unicode Character Inspector',
    icon: '🔡',
    description: 'Inspect every character’s exact Unicode code point, decimal value, UTF-8 bytes, HTML entity and category. Deterministic, in-browser.',
    lead: 'See the exact Unicode details of every character in your text — code point, decimal value, UTF-8 byte encoding, HTML entity and category.',
    widget: 'unicode',
    how: 'For each character the inspector shows its Unicode code point (U+XXXX), decimal value, the exact bytes it becomes in UTF-8, its HTML numeric entity, and its Unicode general category (letter, number, punctuation, symbol, mark, space or control). It handles the full range including emoji and astral-plane characters.',
    note: 'A precise reference tool that a chatbot approximates and often gets wrong — LLMs routinely misreport code points and byte encodings. Useful for developers, encoding debugging, and understanding exactly what a piece of text contains.',
    faqs: [
      { q: 'What is a Unicode code point?', a: 'The unique number assigned to a character, written U+ followed by hexadecimal — for example “A” is U+0041 and “🎉” is U+1F389. It identifies the character independent of how it is stored.' },
      { q: 'What are UTF-8 bytes?', a: 'UTF-8 is how the character is stored as bytes: ASCII characters take one byte, accented Latin two, most other scripts three, and emoji four. The inspector shows the exact byte sequence.' },
      { q: 'What is the HTML entity?', a: 'A way to write the character in HTML by its number, like &#233; for “é”. Useful when a character can’t be typed directly or must be escaped.' },
      { q: 'Does it handle emoji and rare characters?', a: 'Yes — it iterates by code point, so multi-byte emoji and astral-plane characters are inspected correctly rather than split into surrogate halves.' },
      { q: 'Is my text uploaded?', a: 'No — the inspection is done entirely in your browser.' },
    ],
    keywords: ['unicode character inspector', 'unicode code point lookup', 'utf-8 bytes', 'character code point', 'html entity lookup', 'unicode inspector'],
  },
  {
    slug: 'word-frequency-counter',
    name: 'Word Frequency Counter',
    icon: '📊',
    description: 'Count how often each word appears, sorted by frequency, with keyword density and CSV export. Private, in-browser.',
    lead: 'Count how often each word appears in your text — sorted by frequency, with percentages and a keyword-density bar, ready to export as CSV.',
    widget: 'frequency',
    how: 'The tool tokenises your text into words, tallies each one, and sorts them by count. Options let you fold case together, set a minimum word length, and ignore common stop words (the, and, of…) so the meaningful terms rise to the top. Each word shows its count, its share of the total, and a bar; you can copy the whole table as CSV.',
    note: 'Exact and sortable in a way a chatbot cannot match on longer text — useful for SEO keyword density, writing analysis, and quick text mining. Runs on your device, so even confidential documents stay private.',
    faqs: [
      { q: 'What is keyword density?', a: 'The percentage of total words that a given term makes up. It is a rough SEO signal — this tool shows each word’s count and its percentage of the text so you can gauge density at a glance.' },
      { q: 'What are stop words?', a: 'Very common words like “the”, “and”, “of” and “to” that carry little meaning. Turn on “ignore common words” to exclude them and surface the substantive vocabulary.' },
      { q: 'Can I export the results?', a: 'Yes — “Copy CSV” puts the word, count and percentage table on your clipboard, ready to paste into a spreadsheet.' },
      { q: 'Does case matter?', a: 'By default “The” and “the” are counted together (case-insensitive). Turn that off to count each capitalisation separately.' },
      { q: 'Is my text uploaded?', a: 'No — the counting runs entirely in your browser, so confidential text stays private.' },
    ],
    keywords: ['word frequency counter', 'keyword density', 'word count frequency', 'most common words', 'word frequency analyzer', 'count word occurrences'],
  },
  {
    slug: 'text-cleaner',
    name: 'Text Cleaner (Em-dash, Smart Quotes, Spaces)',
    icon: '🧹',
    description: 'Clean pasted or AI-generated text — convert em-dashes and smart quotes to plain ASCII, fix non-breaking spaces, and strip hidden characters.',
    lead: 'Clean up messy pasted or AI-generated text: convert em-dashes and curly quotes to plain ASCII, normalise exotic spaces, and remove hidden characters.',
    widget: 'transform',
    computeId: 'cleaner',
    options: [
      { id: 'dashes', label: 'Em/en dashes → hyphen (- )', type: 'checkbox', defaultValue: 'true' },
      { id: 'quotes', label: 'Curly quotes → straight', type: 'checkbox', defaultValue: 'true' },
      { id: 'ellipsis', label: 'Ellipsis … → ...', type: 'checkbox', defaultValue: 'true' },
      { id: 'spaces', label: 'Exotic spaces → normal space', type: 'checkbox', defaultValue: 'true' },
      { id: 'invisible', label: 'Remove hidden / zero-width characters', type: 'checkbox', defaultValue: 'true' },
      { id: 'collapse', label: 'Collapse repeated spaces & trim lines', type: 'checkbox', defaultValue: 'false' },
    ],
    sample: '“Smart quotes” — an em‑dash, a non‑breaking space, and a hidden​ character…',
    how: 'The cleaner replaces typographic characters that often come from word processors, PDFs and AI tools with their plain-ASCII equivalents: em- and en-dashes become hyphens, curly quotes become straight quotes, the ellipsis character becomes three dots, non-breaking and other exotic spaces become normal spaces, and zero-width / format characters are removed. Each fix is a toggle so you keep exactly the ones you want.',
    note: 'This targets the very real “clean up pasted text” and “remove the em-dash” need — honestly framed as normalising typography and whitespace, not as a way to disguise or “humanize” AI writing.',
    faqs: [
      { q: 'Why does pasted text have weird dashes and quotes?', a: 'Word processors and many websites auto-convert straight quotes to curly ones and hyphens to en/em-dashes (“smart” typography). Pasting that into code, a form or plain-text often causes problems — this tool converts them back to plain ASCII.' },
      { q: 'What is a non-breaking space and why remove it?', a: 'A non-breaking space (U+00A0) looks like a normal space but behaves differently — it can break CSV parsing, search and number formatting. The cleaner converts it to a regular space.' },
      { q: 'Does this “humanize” AI text or bypass detectors?', a: 'No — and it is not meant to. It normalises typography and removes hidden characters so text is clean and portable. It does not rewrite your writing or attempt to evade detection.' },
      { q: 'Can I choose which fixes to apply?', a: 'Yes — every transformation is an independent toggle, so you can, for example, straighten quotes but keep em-dashes.' },
      { q: 'Is my text uploaded?', a: 'No — all cleaning happens in your browser.' },
    ],
    keywords: ['text cleaner', 'remove em dash', 'smart quotes to straight quotes', 'clean pasted text', 'remove non breaking space', 'normalize text'],
  },
  {
    slug: 'unicode-normalizer',
    name: 'Unicode Normalizer & Accent Remover',
    icon: '🔤',
    description: 'Normalize text to Unicode NFC/NFD/NFKC/NFKD form, or strip accents and diacritics (é → e). Deterministic, in-browser.',
    lead: 'Normalize text to a canonical Unicode form (NFC, NFD, NFKC or NFKD), or strip accents and diacritics so “café” becomes “cafe”.',
    widget: 'transform',
    computeId: 'normalize',
    options: [
      { id: 'form', label: 'Normalization form', type: 'select', defaultValue: 'NFC', options: [
        { value: 'NFC', label: 'NFC — canonical composed' },
        { value: 'NFD', label: 'NFD — canonical decomposed' },
        { value: 'NFKC', label: 'NFKC — compatibility composed' },
        { value: 'NFKD', label: 'NFKD — compatibility decomposed' },
      ] },
      { id: 'stripDiacritics', label: 'Strip accents / diacritics (é → e)', type: 'checkbox', defaultValue: 'false' },
    ],
    sample: 'Café — ﬁ ligature, ² superscript, and é as e + combining accent.',
    how: 'Unicode normalization brings text to a canonical form so that visually identical strings compare equal. NFC composes characters (e + ´ → é); NFD decomposes them; the NFK forms additionally fold compatibility characters (the ﬁ ligature → fi, ² → 2). With accent-stripping on, the text is decomposed and its combining marks removed, turning accented letters into their base letters.',
    note: 'Pure algorithm via the browser’s built-in Unicode data — never rots. Essential for search, deduplication and creating ASCII-safe identifiers from accented text.',
    faqs: [
      { q: 'What is Unicode normalization?', a: 'A process that converts text to a standard form so that strings which look the same are stored the same way. “é” can be one code point or an “e” plus a combining accent — normalization makes them consistent so they compare and search correctly.' },
      { q: 'What is the difference between NFC and NFD?', a: 'NFC composes characters into single code points (é as U+00E9); NFD decomposes them (e + combining acute). NFC is the common storage form; NFD is useful for stripping accents.' },
      { q: 'What do NFKC and NFKD do differently?', a: 'They also fold “compatibility” characters — turning ligatures like ﬁ into “fi”, full-width letters into normal ones, and ² into 2. Use them to simplify text, but note they change some characters’ meaning.' },
      { q: 'How does accent removal work?', a: 'The text is decomposed (NFD) and the combining marks are removed, so “café” becomes “cafe” and “naïve” becomes “naive”. Handy for URLs, IDs and ASCII-only systems.' },
      { q: 'Is my text uploaded?', a: 'No — normalization uses your browser’s built-in Unicode support and runs locally.' },
    ],
    keywords: ['unicode normalizer', 'remove accents', 'strip diacritics', 'nfc nfd nfkc nfkd', 'normalize unicode', 'remove accents from text'],
  },
  {
    slug: 'delimiter-converter',
    name: 'Delimiter Converter & Column Transposer',
    icon: '↔️',
    description: 'Convert text between delimiters (comma, tab, newline, pipe, semicolon) and transpose rows to columns. Private, in-browser.',
    lead: 'Convert a list or table from one delimiter to another — comma, tab, newline, pipe, semicolon — and optionally transpose rows into columns.',
    widget: 'transform',
    computeId: 'delimiter',
    options: [
      { id: 'from', label: 'Split each line by', type: 'select', defaultValue: 'comma', options: [
        { value: 'comma', label: 'Comma ,' }, { value: 'tab', label: 'Tab' }, { value: 'semicolon', label: 'Semicolon ;' }, { value: 'pipe', label: 'Pipe |' }, { value: 'space', label: 'Space' },
      ] },
      { id: 'to', label: 'Join with', type: 'select', defaultValue: 'newline', options: [
        { value: 'newline', label: 'Newline' }, { value: 'comma', label: 'Comma ,' }, { value: 'tab', label: 'Tab' }, { value: 'semicolon', label: 'Semicolon ;' }, { value: 'pipe', label: 'Pipe |' }, { value: 'space', label: 'Space' },
      ] },
      { id: 'transpose', label: 'Transpose rows ⇄ columns', type: 'checkbox', defaultValue: 'false' },
    ],
    sample: 'apple,banana,cherry\ndog,cat,bird',
    how: 'The converter splits each line by the chosen delimiter and re-joins the fields with another — turning a comma-separated list into one-per-line, a CSV row into tab-separated, and so on. With transpose enabled, the grid is flipped so rows become columns, which is handy for reshaping small tables.',
    note: 'A fast, deterministic reshaping tool for lists and small tables — the kind of exact structural transform that is tedious by hand and unreliable to ask an AI for.',
    faqs: [
      { q: 'What can I convert between?', a: 'Any pair of common delimiters: comma, tab, semicolon, pipe, space and newline. For example, paste a comma-separated list and output it one item per line, or turn newline-separated values into a CSV row.' },
      { q: 'What does transpose do?', a: 'It swaps rows and columns — the first field of every line becomes the first row of output, and so on. Useful for flipping a small table’s orientation.' },
      { q: 'Can it turn a list into CSV?', a: 'Yes — split by newline and join with commas to build a single comma-separated row, or the reverse to break a CSV row into a list.' },
      { q: 'Does it handle quoted CSV fields?', a: 'It does simple delimiter splitting, which covers most lists and clean tables. For quoted fields with embedded commas, use the dedicated CSV tools in File Converters.' },
      { q: 'Is my text uploaded?', a: 'No — the conversion runs entirely in your browser.' },
    ],
    keywords: ['delimiter converter', 'comma to newline', 'newline to comma', 'transpose columns', 'convert delimiter', 'list to csv'],
  },
  {
    slug: 'fancy-text-decoder',
    name: 'Fancy Text Decoder (Unicode → Plain Text)',
    icon: '🔠',
    description: 'Convert stylish “fancy” Unicode text — 𝓼𝓬𝓻𝓲𝓹𝓽, 𝔤𝔬𝔱𝔥𝔦𝔠, ⓒⓘⓡⓒⓛⓔ⓭, ｆｕｌｌｗｉｄｔｈ — back to normal, readable plain text.',
    lead: 'Turn stylish “fancy” Unicode text (𝓯𝓪𝓷𝓬𝔂, 𝔤𝔬𝔱𝔥𝔦𝔠, 𝕕𝕠𝕦𝕓𝕝𝕖, ⓒⓘⓡⓒⓛⓔ⓭, ｆｕｌｌｗｉｄｔｈ) back into normal, searchable plain text.',
    widget: 'transform',
    computeId: 'defancy',
    options: [
      { id: 'zalgo', label: 'Also strip zalgo / stacked accent marks', type: 'checkbox', defaultValue: 'true' },
    ],
    sample: '𝓣𝓱𝓲𝓼 𝓲𝓼 𝓯𝓪𝓷𝓬𝔂 𝓼𝓬𝓻𝓲𝓹𝓽, 𝔤𝔬𝔱𝔥𝔦𝔠, and ⓝⓞⓡⓜⓐⓛ text.',
    how: 'Those bold, italic, script, gothic, double-struck, monospace, circled and full-width “fonts” you see on social media aren’t fonts at all — they’re separate Unicode characters that look styled. Because they’re distinct code points, they break search, screen readers and copy-paste. This decoder applies Unicode compatibility normalisation (NFKC) to map every styled variant back to its plain letter, and optionally strips stacked “zalgo” accent marks, giving you clean, readable text.',
    note: 'The honest, useful direction of the “fancy text” trend: decoding it back to plain text. Styled Unicode is inaccessible to screen readers and unsearchable — converting it back makes it usable again.',
    faqs: [
      { q: 'How do I convert fancy text back to normal?', a: 'Paste the styled text here and it is decoded to plain letters automatically. It works for bold, italic, script, gothic (fraktur), double-struck, monospace, circled and full-width Unicode styles.' },
      { q: 'Why is “fancy” text a problem?', a: 'Those styles are separate Unicode characters, not real fonts, so screen readers often read them incorrectly or not at all, search engines and Ctrl-F don’t match them, and they can break forms and databases. Decoding restores normal, accessible text.' },
      { q: 'What is zalgo text?', a: 'Text with many combining accent marks stacked on each letter to create a “glitchy” dripping effect. Turn on “strip zalgo” to remove those marks and recover the base letters.' },
      { q: 'How does the decoding work?', a: 'It uses Unicode NFKC (compatibility) normalisation, which maps styled and full-width characters to their standard equivalents — so 𝓯𝓪𝓷𝓬𝔂 becomes “fancy” and ｆｕｌｌ becomes “full”.' },
      { q: 'Is my text uploaded?', a: 'No — the conversion runs entirely in your browser.' },
    ],
    keywords: ['fancy text to normal', 'unicode to plain text', 'decode fancy text', 'convert fancy text back', 'remove fancy font', 'unfancy text'],
  },
  {
    slug: 'strip-html-tags',
    name: 'Strip HTML Tags (HTML → Plain Text)',
    icon: '🏷️',
    description: 'Remove HTML tags and decode entities to get clean plain text from pasted markup or scraped web content. Private, in-browser.',
    lead: 'Strip the HTML tags out of pasted markup or scraped content and get clean, readable plain text — entities decoded, whitespace tidied.',
    widget: 'transform',
    computeId: 'striphtml',
    options: [],
    sample: '<h1>Hello &amp; welcome</h1>\n<p>This is <strong>bold</strong> and&nbsp;spaced.</p>',
    how: 'The tool removes script and style blocks entirely, turns block-level tags (paragraphs, list items, line breaks, headings) into newlines, strips the remaining tags, decodes HTML entities like &amp;, &nbsp; and numeric references, and collapses leftover whitespace. What’s left is the readable text content.',
    note: 'A fast, deterministic way to get plain text out of rich-text or scraped HTML — the kind of exact cleanup that is tedious by hand and unreliable to ask an AI for.',
    faqs: [
      { q: 'How do I remove HTML tags from text?', a: 'Paste the HTML and the tool returns the text with all tags removed, entities decoded, and whitespace tidied. Block elements become line breaks so the structure stays readable.' },
      { q: 'Does it decode HTML entities?', a: 'Yes — named entities like &amp;, &lt;, &nbsp; and numeric references like &#233; and &#x1F389; are converted back to the characters they represent.' },
      { q: 'What happens to scripts and styles?', a: 'Everything inside <script> and <style> tags is removed entirely, so you don’t get JavaScript or CSS in your output.' },
      { q: 'Will it keep the text structure?', a: 'Paragraphs, headings, list items and <br> become line breaks, so the plain text keeps a sensible layout rather than collapsing into one blob.' },
      { q: 'Is my content uploaded?', a: 'No — the stripping runs entirely in your browser.' },
    ],
    keywords: ['strip html tags', 'remove html tags', 'html to text', 'html to plain text', 'extract text from html', 'clean html'],
  },
  {
    slug: 'line-tools',
    name: 'Line Tools (Number, Prefix, Suffix, Pad)',
    icon: '📋',
    description: 'Number lines, add a prefix or suffix to every line, or pad lines to a fixed width. Fast, deterministic, in-browser.',
    lead: 'Operate on every line at once — number them, add a prefix or suffix, or pad them to a fixed width.',
    widget: 'transform',
    computeId: 'lineops',
    options: [
      { id: 'mode', label: 'Operation', type: 'select', defaultValue: 'number', options: [
        { value: 'number', label: 'Number lines' },
        { value: 'prefix', label: 'Add prefix' },
        { value: 'suffix', label: 'Add suffix' },
        { value: 'padRight', label: 'Pad right to width' },
        { value: 'padLeft', label: 'Pad left to width' },
      ] },
      { id: 'value', label: 'Value (start number, prefix/suffix text, or width)', type: 'text', defaultValue: '1', placeholder: '1  ·  "- "  ·  20' },
    ],
    sample: 'apple\nbanana\ncherry\ndate',
    how: 'Choose an operation and it is applied to every line: “Number lines” prepends an incrementing, right-aligned number from your chosen start; “Add prefix/suffix” wraps each line with the text you enter; and the pad options align every line to a fixed width. Handy for building lists, code, and aligned columns.',
    note: 'Several small per-line transforms bundled into one deterministic page — the kind of bulk text surgery that is tedious to do by hand across hundreds of lines.',
    faqs: [
      { q: 'How do I number a list of lines?', a: 'Choose “Number lines” and set the starting number in the value box. Each line gets a right-aligned number and a period, so the list stays neatly aligned even into the hundreds.' },
      { q: 'How do I add the same text to every line?', a: 'Choose “Add prefix” or “Add suffix” and type the text in the value box — for example a “- ” prefix to make a bullet list, or a “,” suffix to build a comma-ended list.' },
      { q: 'What does padding do?', a: 'It makes every line the same width by adding spaces, either on the right (left-aligned) or the left (right-aligned) — useful for aligning columns in monospace text.' },
      { q: 'Does it change blank lines?', a: 'Blank lines are treated like any other line — they get numbered or padded too, which keeps the line count in sync with your original.' },
      { q: 'Is my text uploaded?', a: 'No — every operation runs in your browser.' },
    ],
    keywords: ['number lines', 'add prefix to each line', 'add suffix to each line', 'pad text', 'line numbering tool', 'bulk edit lines'],
  },
  {
    slug: 'fast-reading-bold',
    name: 'Fast-Reading Bold Converter',
    icon: '⚡',
    description: 'Bold the first part of each word to create a fast-reading fixation aid — an accessibility formatting many readers with ADHD or dyslexia find helpful. Copy as rich text.',
    lead: 'Add fast-reading emphasis by bolding the first part of every word, giving your eyes a fixation point — then copy it as rich text.',
    widget: 'bionic',
    how: 'The converter bolds the first portion of each word — roughly the first 40%, scaled by word length — which many readers use as a visual anchor to move through text more quickly. The preview shows the result, and “Copy formatted” places rich text on your clipboard so the bold styling pastes into documents and email.',
    note: 'A generic implementation of the fixation-bolding idea, offered as an accessibility aid. It is not affiliated with, and does not use, the trademarked “Bionic Reading” method.',
    faqs: [
      { q: 'What is fast-reading bold formatting?', a: 'A reading aid that bolds the first few letters of each word to create fixation points for your eyes. Many readers, including some with ADHD or dyslexia, find it helps them read faster and stay focused.' },
      { q: 'How much of each word is bolded?', a: 'Roughly the first 40%, adjusted by word length — one letter for short words, more for longer ones. This gives a consistent visual anchor without over-bolding.' },
      { q: 'Can I paste the bold formatting into a document?', a: 'Yes — “Copy formatted” copies rich text (HTML), so the bold styling is preserved when you paste into a word processor, email or notes app that accepts formatting.' },
      { q: 'Is this the same as Bionic Reading?', a: 'It applies the same general idea — bolding word beginnings as fixation points — but it is an independent, generic implementation and is not affiliated with the trademarked “Bionic Reading” method.' },
      { q: 'Is my text uploaded?', a: 'No — the formatting is generated entirely in your browser.' },
    ],
    keywords: ['fast reading bold', 'bionic reading alternative', 'bold first letters', 'fixation reading', 'speed reading text', 'reading aid bold'],
  },
];

export function getTextTool(slug: string): TextToolDef | undefined {
  return TEXT_TOOLS.find((t) => t.slug === slug);
}
