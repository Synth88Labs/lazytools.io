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
  /** 'counter' renders the stats tool; 'transform' renders input→output with options */
  widget: 'counter' | 'transform';
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
];

export function getTextTool(slug: string): TextToolDef | undefined {
  return TEXT_TOOLS.find((t) => t.slug === slug);
}
