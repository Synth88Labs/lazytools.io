/** Codes & Ciphers category registry. */

export interface CipherToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'morse' | 'nato' | 'binary' | 'caesar' | 'rot13' | 'vigenere';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const CIPHER_TOOLS: CipherToolDef[] = [
  {
    slug: 'morse-code-translator',
    name: 'Morse Code Translator',
    icon: '📡',
    description:
      'Translate text to Morse code and back, with audio playback of the dots and dashes. Runs entirely in your browser — nothing uploaded.',
    lead: 'Text ↔ Morse code, both ways — and press play to hear the dots and dashes as real tones. All in your browser.',
    widget: 'morse',
    how: 'Morse code represents each letter and digit as a sequence of dots (short) and dashes (long). This translator maps between text and the International Morse Code standard: letters are separated by a space and words by a slash (/). The audio playback synthesises the standard timing with the Web Audio API — a dash is three times a dot, gaps between letters and words scale accordingly — at a 600 Hz tone, generated on your device.',
    note: 'A few conventions worth knowing: Morse is case-insensitive (there is no upper/lower distinction), and the famous distress signal SOS is three dots, three dashes, three dots (··· −−− ···) sent as one run. Characters with no Morse equivalent are shown as “#” so you can spot them. Morse remains in real use in aviation and marine navigation beacons and among amateur radio operators.',
    faqs: [
      { q: 'How do I read Morse code spacing?', a: 'A short gap separates the dots and dashes within one letter, a longer gap (shown here as a space) separates letters, and the longest gap (shown as “/”) separates words. Getting the spacing right is what makes Morse readable.' },
      { q: 'What is the Morse code for SOS?', a: '··· −−− ··· — three dots, three dashes, three dots. It was chosen as the international distress signal because the pattern is simple and unmistakable, not because the letters stand for anything.' },
      { q: 'Can I hear the Morse code?', a: 'Yes — press play and the translator sounds out the dots and dashes as timed tones using your browser\'s audio, so you can learn the rhythm. Nothing is recorded or uploaded.' },
      { q: 'Is Morse code still used?', a: 'Yes — aviation and marine navigation beacons still identify themselves in Morse, and amateur (ham) radio operators use it because it cuts through noise at very low power. It is no longer required for most maritime distress communication, which moved to satellite systems.' },
      { q: 'Is my text uploaded to translate it?', a: 'No — the translation and audio both run in your browser, so anything you type stays on your device.' },
    ],
    keywords: ['morse code translator', 'text to morse code', 'morse code to text', 'morse code converter', 'morse code audio', 'sos morse code'],
  },
  {
    slug: 'nato-phonetic-alphabet',
    name: 'NATO Phonetic Alphabet Converter',
    icon: '🔤',
    description:
      'Convert text to the NATO phonetic alphabet (Alfa, Bravo, Charlie…) and back. Spell anything unambiguously over the phone or radio. In your browser.',
    lead: 'Turn “ABC” into “Alfa Bravo Charlie” — the NATO spelling alphabet for reading letters aloud without confusion, and back again.',
    widget: 'nato',
    how: 'The NATO phonetic alphabet (formally the ICAO/NATO spelling alphabet) assigns an unambiguous code word to each letter — Alfa, Bravo, Charlie — so that letters that sound alike over a noisy phone or radio (B/P/T/V, M/N) can\'t be confused. This tool maps text to those code words and decodes them back, with word breaks shown as “|”. Digits map to their spoken forms (Zero, One, Two…).',
    note: 'Two spellings are deliberate, not typos: it is “Alfa” and “Juliett” (not Alpha/Juliet) in the official alphabet, spelled that way so speakers of any language pronounce them correctly. It\'s used well beyond the military — call centres, aviation, IT support and anyone reading a reference number or postcode aloud.',
    faqs: [
      { q: 'What is the NATO phonetic alphabet?', a: 'A set of code words — Alfa, Bravo, Charlie through Zulu — used to spell out letters clearly in voice communication. Officially the ICAO/NATO spelling alphabet, it prevents mishearing letters that sound similar over phone or radio.' },
      { q: 'Why is it spelled “Alfa” and “Juliett”?', a: 'Deliberately. “Alfa” avoids non-English speakers reading “ph” as an f-sound incorrectly, and “Juliett” has a double-t so French speakers don\'t leave the final t silent. They are the official spellings.' },
      { q: 'When should I use it?', a: 'Any time you read letters aloud where a mistake matters — a booking reference, postcode, email or serial number over the phone, radio calls, or IT support. Saying "S as in Sierra" removes the guesswork.' },
      { q: 'Does it cover numbers?', a: 'Yes — this converter spells digits as Zero, One, Two and so on, which is the spoken convention that accompanies the letter alphabet.' },
      { q: 'Is anything uploaded?', a: 'No — the conversion runs locally in your browser.' },
    ],
    keywords: ['nato phonetic alphabet', 'phonetic alphabet converter', 'alfa bravo charlie', 'military alphabet', 'spelling alphabet', 'text to nato'],
  },
  {
    slug: 'binary-text-translator',
    name: 'Binary Code Translator',
    icon: '💻',
    description:
      'Convert text to binary (8-bit, UTF-8) and binary back to text. Handles any character, emoji included. Computed in your browser.',
    lead: 'Text ↔ binary, both ways — every character as its 8-bit bytes, Unicode and emoji included. Local and instant.',
    widget: 'binary',
    how: 'Computers store text as numbers, and this translator shows those numbers in binary. Each character is encoded to its UTF-8 bytes, and each byte is written as eight bits (0s and 1s), space-separated. Plain English letters are one byte each; accented characters and emoji take two to four bytes, which is why they produce more binary. Decoding reverses it, reading whitespace-separated bytes back into text.',
    note: 'This is base-2 encoding, not encryption — anyone can read it back, as this tool does. If you\'re converting a number rather than text (say, decimal 42 to binary), the number base converter in Developer Tools is the right tool; this one is for turning readable text into its binary representation and back.',
    faqs: [
      { q: 'How is text turned into binary?', a: 'Each character is first encoded to bytes using UTF-8, then each byte is written as 8 binary digits. For example "A" is byte 65, which is 01000001. Spaces separate the bytes so the result can be read back.' },
      { q: 'Why do emoji produce so much binary?', a: 'Because UTF-8 uses one byte for basic Latin characters but two to four bytes for accented letters, other scripts and emoji — so a single emoji can be 32 bits (four bytes) of binary.' },
      { q: 'Is binary code a cipher?', a: 'No — it is an encoding, not encryption. Binary is just a different way of writing the same character codes, fully reversible by anyone, as this translator demonstrates.' },
      { q: 'What\'s the difference from a number-base converter?', a: 'This tool converts text (letters and symbols) to and from binary. To convert a numeric value between binary, decimal and hex, use the number base converter in Developer Tools.' },
      { q: 'Is my text sent anywhere?', a: 'No — encoding and decoding happen in your browser, on your device.' },
    ],
    keywords: ['binary translator', 'text to binary', 'binary to text', 'binary code translator', 'binary converter', 'ascii to binary'],
  },
  {
    slug: 'caesar-cipher',
    name: 'Caesar Cipher Encoder / Decoder',
    icon: '🏛️',
    description:
      'Encode and decode the Caesar cipher with any shift, and crack unknown shifts by trying all 25 at once. Classic letter-shift cipher, in your browser.',
    lead: 'Shift every letter by a fixed amount — the 2,000-year-old Caesar cipher — encode, decode, or crack an unknown shift by seeing all 25 at once.',
    widget: 'caesar',
    how: 'The Caesar cipher, named after Julius Caesar, replaces each letter with one a fixed number of places later in the alphabet — a shift of 3 turns A into D, B into E, and so on, wrapping Z back to C. Decoding shifts the other way. Because there are only 25 possible shifts, it offers no real security: the built-in "crack it" panel simply shows all 25 decodings so you can pick the readable one.',
    note: 'ROT13 is just the Caesar cipher with a shift of 13 — special because applying it twice returns the original, so the same operation encodes and decodes. The Caesar cipher is a teaching classic and a puzzle staple, not a way to protect real data; for that you want the AES file encryption in Privacy & Security.',
    faqs: [
      { q: 'What is the Caesar cipher?', a: 'One of the oldest known ciphers: each letter is shifted a fixed number of positions along the alphabet. With a shift of 3, "HELLO" becomes "KHOOR". Julius Caesar reportedly used it for military messages.' },
      { q: 'How do I crack a Caesar cipher without the shift?', a: 'Try all 25 possible shifts and look for the one that produces readable text — the "crack it" panel here does exactly that automatically. Because there are so few keys, it takes seconds.' },
      { q: 'Is the Caesar cipher secure?', a: 'Not at all — 25 keys is trivially brute-forced, and letter-frequency analysis breaks it even faster. It\'s valuable for learning and puzzles, not for protecting real information.' },
      { q: 'What is ROT13?', a: 'A Caesar cipher with a shift of 13. Since the alphabet has 26 letters, shifting by 13 twice returns the original, so ROT13 is its own inverse — handy for hiding spoilers or puzzle answers in plain sight.' },
      { q: 'Does this run locally?', a: 'Yes — the shifting is simple arithmetic done in your browser; nothing is uploaded.' },
    ],
    keywords: ['caesar cipher', 'caesar cipher decoder', 'caesar cipher encoder', 'shift cipher', 'crack caesar cipher', 'letter shift cipher'],
  },
  {
    slug: 'rot13',
    name: 'ROT13 Encoder / Decoder',
    icon: '🔁',
    description:
      'Apply ROT13 — the letter substitution that is its own inverse — to hide or reveal spoilers and puzzle answers. One click, in your browser.',
    lead: 'ROT13 rotates each letter halfway round the alphabet — the same click both hides and reveals, because doing it twice returns the original.',
    widget: 'rot13',
    how: 'ROT13 ("rotate by 13") replaces each letter with the one 13 places along the alphabet: A↔N, B↔O, and so on. Because 13 is exactly half of 26, applying it a second time restores the original text — so a single operation both encodes and decodes. Non-letters are left untouched.',
    note: 'ROT13 provides no security whatsoever; its purpose is to lightly obscure text that a reader shouldn\'t see by accident — spoilers, puzzle answers, joke punchlines, offensive words on old forums. It\'s a convention for "look only if you mean to", not a cipher for secrets.',
    faqs: [
      { q: 'What does ROT13 do?', a: 'It shifts every letter 13 positions along the alphabet (A becomes N, N becomes A). Since the alphabet is 26 letters, this is a half-rotation, and applying it twice returns the original text.' },
      { q: 'Why is the same button used to encode and decode?', a: 'Because ROT13 is its own inverse — rotating by 13 twice is a rotation by 26, which lands back where you started. So there is only one operation.' },
      { q: 'What is ROT13 used for?', a: 'Hiding text in plain sight where secrecy doesn\'t matter — spoilers, puzzle solutions, punchlines. It ensures you only read the hidden text if you deliberately decode it.' },
      { q: 'Is ROT13 secure?', a: 'No — it\'s a fixed, keyless substitution anyone can reverse instantly. It obscures, it doesn\'t protect. For real protection use encryption.' },
      { q: 'Is my text uploaded?', a: 'No — ROT13 is applied in your browser.' },
    ],
    keywords: ['rot13', 'rot13 decoder', 'rot13 encoder', 'rot13 converter', 'rotate 13', 'rot-13'],
  },
  {
    slug: 'vigenere-cipher',
    name: 'Vigenère Cipher Encoder / Decoder',
    icon: '🗝️',
    description:
      'Encode and decode the Vigenère cipher with a keyword — a polyalphabetic cipher that resisted codebreakers for 300 years. In your browser.',
    lead: 'Shift each letter by a different amount driven by a repeating keyword — the Vigenère cipher, far stronger than Caesar. Encode and decode locally.',
    widget: 'vigenere',
    how: 'The Vigenère cipher uses a keyword to vary the shift from letter to letter: the keyword is repeated across the message, and each of its letters gives the Caesar shift for the letter beneath it (A = shift 0, B = 1, and so on). Because the same plaintext letter encrypts differently depending on its position, simple letter-frequency analysis fails — which is why it was long nicknamed "le chiffre indéchiffrable" (the indecipherable cipher).',
    note: 'It held out for roughly three centuries until Friedrich Kasiski published a general method to break it in 1863, by finding the key length from repeated patterns. Vigenère is a beautiful step up from Caesar for learning how polyalphabetic ciphers work — but it is still not secure by modern standards; for real confidentiality, use proper encryption.',
    faqs: [
      { q: 'How does the Vigenère cipher work?', a: 'A keyword is repeated across your message, and each keyword letter sets the shift for the letter below it — A shifts by 0, B by 1, up to Z by 25. So the same letter encrypts to different letters depending on where it sits, unlike a simple Caesar shift.' },
      { q: 'Why is it stronger than the Caesar cipher?', a: 'Because it uses many shifts instead of one, the letter-frequency patterns that instantly break a Caesar cipher are smeared out. Without knowing the key length, it\'s far harder to crack — it resisted codebreakers for about 300 years.' },
      { q: 'How was the Vigenère cipher eventually broken?', a: 'Friedrich Kasiski published a method in 1863 (anticipated by Charles Babbage) that deduces the key length from repeated sequences in the ciphertext, after which each position reduces to a solvable Caesar cipher.' },
      { q: 'Is the Vigenère cipher secure today?', a: 'No — it\'s breakable with pen-and-paper techniques and trivially by computer. It\'s excellent for learning cryptographic ideas, but real secrets need modern encryption like AES.' },
      { q: 'Does this work locally?', a: 'Yes — encoding and decoding happen in your browser; the message and keyword never leave your device.' },
    ],
    keywords: ['vigenere cipher', 'vigenere decoder', 'vigenere encoder', 'polyalphabetic cipher', 'keyword cipher', 'vigenere cipher converter'],
  },
];
