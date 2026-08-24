/** Privacy & Security tools registry. */

export interface SecurityToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'metadata' | 'encrypt' | 'strength' | 'file-hash' | 'piiredact' | 'totp' | 'bcrypt' | 'filetype' | 'certdecode';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const SECURITY_TOOLS: SecurityToolDef[] = [
  {
    slug: 'image-metadata-remover',
    name: 'Image Metadata Remover',
    icon: '🧹',
    description:
      'Strip EXIF, GPS location, XMP and other hidden metadata from photos before sharing — detection and removal happen in your browser; the photo is never uploaded.',
    lead: 'See what hidden data your photo carries — EXIF, GPS coordinates, editing history — and download a clean copy, without the image ever leaving your device.',
    widget: 'metadata',
    how: 'The tool scans the JPEG structure for metadata segments — EXIF (camera model, capture time and, if location was on, GPS coordinates), XMP (editing history), IPTC (captions and credits) and ICC profiles — and lists what it finds. Removal works by re-drawing the pixels onto a canvas and re-encoding: the new file contains image data only, because canvas encoding never copies metadata segments.',
    note: 'The privacy case is concrete: a phone photo with location services on embeds latitude and longitude precise to a few meters. Major social networks strip EXIF on upload, but email, cloud drives, messaging attachments and marketplace listings often pass files through untouched. Note that re-encoding lossy formats re-compresses pixels — use the quality slider to keep it visually lossless.',
    faqs: [
      { q: 'What metadata do photos actually contain?', a: 'JPEGs from phones and cameras typically carry EXIF (device model, capture date/time, exposure settings and — when location was enabled — GPS coordinates), and sometimes XMP editing history and IPTC caption data. This tool lists the segments it detects before you strip them.' },
      { q: 'Can photo metadata really reveal my home address?', a: 'If location services were on when the photo was taken, the embedded GPS coordinates identify the spot to within a few meters — enough to find a house. That is the single strongest reason to strip metadata from photos of your home, family or routine locations.' },
      { q: 'Don\'t Facebook and Instagram already strip EXIF?', a: 'Large social platforms do re-process uploads and drop most metadata. But email attachments, cloud-drive shares, classified-ad listings and many forums transmit the original file byte-for-byte, EXIF included. Strip before sharing through any channel you don\'t control.' },
      { q: 'Does removing metadata change image quality?', a: 'Stripping works by re-encoding the pixels, so lossy formats are re-compressed once. At the default high quality the difference is not visually detectable, and you can raise the slider further. PNG output is pixel-lossless.' },
      { q: 'Is my photo uploaded to check it?', a: 'No — the file is read, scanned and re-encoded entirely in your browser with the canvas API. It never touches a network connection, which you can verify offline.' },
    ],
    keywords: ['remove exif data', 'image metadata remover', 'strip exif', 'remove gps from photo', 'exif remover online'],
  },
  {
    slug: 'file-encryption',
    name: 'File Encryption Tool',
    icon: '🔐',
    description:
      'Encrypt any file with a password using AES-256-GCM in your browser — and decrypt it back. Real Web Crypto, no upload, no account.',
    lead: 'Password-protect any file with AES-256-GCM — the same cipher class protecting your bank connection — entirely on your device.',
    widget: 'encrypt',
    how: 'Your password is stretched into a 256-bit key with PBKDF2 (310,000 iterations of SHA-256, per current OWASP guidance) and a random 16-byte salt, then the file is encrypted with AES-256-GCM using a random nonce. GCM is authenticated encryption: decryption verifies integrity, so a tampered or corrupted file fails loudly instead of decrypting to garbage. Salt and nonce are stored in the output file header — they are not secrets; the password is.',
    note: 'The honest limits: this protects the file\'s contents, not its existence or size, and the protection is only as strong as the password — use a long random one from a generator. And there is no recovery: lose the password and the data is mathematically gone. That is the feature.',
    faqs: [
      { q: 'How strong is the encryption?', a: 'AES-256-GCM via the browser\'s Web Crypto API — the same primitive used in TLS 1.3. The practical attack is never the cipher; it is a guessable password. Pair this tool with a generated 16+ character password and the encryption is not the weak point.' },
      { q: 'Can I recover the file if I forget the password?', a: 'No. There is no back door, no reset, and LazyTools never sees the file or the password. Store the password in a password manager before you delete the original.' },
      { q: 'What is the .enc file it produces?', a: 'A small header (format marker, random salt, random nonce) followed by the AES-GCM ciphertext. Decrypt it with this same tool. The salt and nonce being visible is by design — their job is uniqueness, not secrecy.' },
      { q: 'Why PBKDF2 with 310,000 iterations?', a: 'Key stretching makes each password guess expensive: an attacker must repeat all 310,000 hash rounds per attempt. The figure follows OWASP\'s current recommendation for PBKDF2-HMAC-SHA256.' },
      { q: 'Is the file uploaded during encryption?', a: 'No — reading, key derivation, encryption and download all happen in browser memory. Disconnect from the internet and it works identically.' },
    ],
    keywords: ['encrypt file online', 'password protect file', 'aes file encryption', 'encrypt file in browser', 'decrypt enc file'],
  },
  {
    slug: 'password-strength-checker',
    name: 'Password Strength Checker',
    icon: '🛡️',
    description:
      'Check password strength honestly: entropy estimate, character-set analysis and the human patterns crackers exploit — evaluated locally, never transmitted.',
    lead: 'An honest strength check: entropy math plus the pattern warnings that matter — because "Summer2026!" passes complexity rules and falls in seconds.',
    widget: 'strength',
    how: 'The checker estimates entropy from length and detected character sets (length × log₂ of alphabet size), then looks for the patterns that make real passwords weaker than the formula suggests: known most-cracked passwords, sequential runs (abc, 123, qwe), repeated characters, embedded years, and the classic Word+digits+! shape. Cracking tools encode exactly these patterns as mangling rules, so their presence caps the realistic strength regardless of raw length. Concretely: each character drawn from a 26-letter set adds log₂(26) ≈ 4.7 bits, while a character from the full 95-printable-ASCII set adds log₂(95) ≈ 6.6 bits — so an 8-character all-lowercase password carries only about 38 bits, which is why length plus a mix of character types beats a short "complex" string.',
    note: 'A checker can prove weakness, not safety — passing here doesn\'t certify a password, it just fails to find the obvious problems. The reliable route is skipping human invention entirely: a generated random password has exactly the entropy the math says. This page exists mostly to show you why your current ones need replacing.',
    faqs: [
      { q: 'Is it safe to type my real password here?', a: 'The check runs entirely in your browser — nothing is transmitted, stored or logged, verifiable by going offline. That said, the healthy habit is testing a password of the same shape rather than the exact one you use, and never typing real passwords into tools you don\'t trust.' },
      { q: 'Why does my "complex" password score badly?', a: 'Because complexity rules measure the wrong thing. Capital-first, digits-and-exclamation-last is the single most common password shape, and cracking software tries word+suffix mangles early. Patterns cost more strength than symbols add.' },
      { q: 'What score should I aim for?', a: 'For accounts behind rate-limited logins, roughly 60+ bits with no warnings. For anything crackable offline — master passwords, encrypted archives — 90+ bits, which in practice means a generated random password or a 5+ word random passphrase.' },
      { q: 'Can any checker know my password\'s true strength?', a: 'No — true strength depends on how the password was chosen, which no checker can see. A checker detects weakness signals; absence of warnings is not proof of strength. Random generation is the only password whose entropy you can actually know.' },
      { q: 'What is password entropy, in plain terms?', a: 'A measure of how unpredictable a password is, in bits — each bit doubles the number of guesses needed. It\'s roughly the password length times log₂ of the size of the character set it\'s drawn from, so 40 bits means about a trillion possibilities. But that formula assumes each character is chosen randomly; a real word or a predictable pattern has far less true entropy than its length implies.' },
      { q: 'Is a long passphrase better than a short complex password?', a: 'Almost always. Length adds entropy faster than symbols do, and it\'s far easier to remember. Four or five random words (not a famous phrase) can reach 50–65 bits while staying memorable, whereas a short string peppered with symbols is both weaker and harder to recall. The catch is the words must be random, not a quote or lyric.' },
      { q: 'How long could my password take to crack?', a: 'It depends entirely on where it\'s attacked. Behind a rate-limited login only a handful of guesses per minute are possible, so even a modest password holds up. But if a password database leaks, an attacker can try billions of guesses per second offline against the hashes — which is why anything protecting a leakable hash (or an encrypted file) needs many more bits of entropy than a website login.' },
      { q: 'Should I change passwords regularly?', a: 'Not on a schedule — NIST dropped that advice because forced rotation produces Password1 → Password2. Change a password when it\'s weak, reused, or exposed in a breach.' },
    ],
    keywords: ['password strength checker', 'how strong is my password', 'test password strength', 'password checker online', 'is my password secure'],
  },
  {
    slug: 'file-hash-checker',
    name: 'File Hash Checker',
    icon: '🧾',
    description:
      'Compute SHA-256, SHA-512 or SHA-1 checksums of any file and compare against an expected hash — verify downloads without the file leaving your browser.',
    lead: 'Drop in a file, get its SHA-256 fingerprint, paste the publisher\'s checksum — matching hashes prove the download arrived bit-for-bit intact.',
    widget: 'file-hash',
    how: 'The file is read into memory and digested with the Web Crypto API — the browser\'s native, correct implementation of the SHA-2 family. A hash is a fixed-size fingerprint: SHA-256 always produces 256 bits (64 hexadecimal characters) no matter how large the input, and change a single bit of a gigabyte file and the whole digest changes unpredictably (the "avalanche" effect). That fixed length is why the comparison is trivial — you match 64 characters, not a whole file. Software publishers post checksums next to downloads precisely so you can verify that what you received is what they published — no corruption in transit, no swapped file. Paste the expected value and the tool compares it case-insensitively and flags a match or mismatch.',
    note: 'SHA-1 is included because older sites still publish SHA-1 sums, but it is deprecated for security use — collisions are practical since 2017. For integrity verification against a trusted published value it still detects accidental corruption; for anything adversarial, use the SHA-256 value when offered. MD5 is omitted: Web Crypto deliberately excludes it.',
    faqs: [
      { q: 'What does comparing hashes actually prove?', a: 'That your copy of the file is bit-for-bit identical to the one whose hash the publisher posted. Any corruption in download, disk error or tampering produces a completely different hash. It does not prove the software is safe — only that it is unmodified.' },
      { q: 'Which algorithm should I use?', a: 'Whichever the publisher posted — SHA-256 is today\'s standard. If both are offered, prefer SHA-256 over SHA-1; SHA-1\'s collision resistance is broken (demonstrated practically in 2017), though it still catches accidental corruption.' },
      { q: 'Why do the same file\'s hashes differ between my machine and the site?', a: 'Either the download is corrupted/incomplete, the site posted the hash of a different version, or one side hashed a different file (e.g. the installer vs the archive). Re-download and check the version label first — that explains most mismatches.' },
      { q: 'Is there a size limit?', a: 'The file must fit in browser memory, so multi-gigabyte files depend on your device; hundreds of megabytes are routinely fine. Hashing happens locally either way.' },
      { q: 'What are SHA-256, SHA-512 and SHA-1?', a: 'All are cryptographic hash functions that turn any input into a fixed-length fingerprint: SHA-256 outputs 256 bits (64 hex chars), SHA-512 outputs 512 bits (128 hex chars), and the older SHA-1 outputs 160 bits (40 hex chars). SHA-256 and SHA-512 are both from the SHA-2 family and considered secure; pick whichever the publisher listed so your hash matches theirs.' },
      { q: 'Do uppercase and lowercase hashes matter when comparing?', a: 'No — a hash is a hexadecimal number, so "A3FF" and "a3ff" are identical. Publishers print it in either case; this tool compares case-insensitively, so a match is a match regardless of how the expected value was formatted. Only the characters and their order matter.' },
      { q: 'Why no MD5?', a: 'The Web Crypto API excludes MD5 deliberately — its collision resistance has been broken for two decades. Any site still publishing only MD5 sums is overdue an update; SHA-256 is the drop-in replacement.' },
    ],
    keywords: ['sha256 checksum', 'file hash checker', 'verify file checksum', 'sha256 of file online', 'checksum verifier'],
  },
  {
    slug: 'pii-redactor',
    name: 'PII Redactor',
    icon: '🕵️',
    widget: 'piiredact',
    description: 'Detect and mask personal data — emails, phone numbers, SSNs, credit-card numbers, IP addresses and IBANs — in text before you paste it into a chatbot, ticket or forum. In your browser.',
    lead: 'Paste text and the tool finds and masks personal data — emails, phones, SSNs, cards, IPs and IBANs — so you can safely share it without leaking it.',
    how: 'The redactor scans your text with pattern matching for common kinds of personal data: email addresses, phone numbers, US Social Security numbers, credit-card numbers (validated with the Luhn checksum so random digit strings are ignored), IPv4 and IPv6 addresses, and IBANs (validated with the mod-97 check). It highlights what it found and produces a masked copy you can pick the style of — labels like [EMAIL], solid blocks, or a partial mask that keeps the last four digits — ready to copy.',
    note: 'This exists for one increasingly common moment: before you paste an error log, email or spreadsheet row into an AI chatbot, support ticket or public forum. Everything runs in your browser and nothing is uploaded. But detection is pattern-based and best-effort — it can miss names, street addresses, unusual formats or context-specific identifiers, so always review the output rather than trusting it blindly.',
    faqs: [
      { q: 'What does a PII redactor do?', a: 'It finds personally identifiable information — emails, phone numbers, SSNs, card numbers, IP addresses, IBANs — in a block of text and replaces it with a mask, so you can share the text without exposing the personal data. This one works entirely in your browser.' },
      { q: 'How do I remove personal data before using ChatGPT?', a: 'Paste the text here first, let the tool mask the emails, phone numbers, IDs and card numbers it detects, then copy the redacted version into the chatbot. It keeps the meaning while stripping the sensitive details — and nothing is uploaded in the process.' },
      { q: 'Is my text uploaded anywhere?', a: 'No. All the detection and masking happen locally in your browser with JavaScript; the text never leaves your device and the tool works offline. That is the whole point — you would not want to send data to a server just to scrub it.' },
      { q: 'How accurate is the detection?', a: 'Good for well-structured data (emails, card numbers via the Luhn check, IPs, IBANs via mod-97), but it is pattern-based, so it can miss names, addresses, dates of birth or unusual formats, and can occasionally over-match. Always review the highlighted results before relying on them.' },
      { q: 'Why validate credit cards with the Luhn algorithm?', a: 'So random 16-digit strings (like order numbers or IDs) are not flagged as cards. The Luhn checksum is the same check card networks use, so only genuinely card-shaped numbers are masked — cutting false positives sharply.' },
      { q: 'What masking styles are there?', a: 'Labels (replace with [EMAIL], [PHONE], etc. — clearest for a human reader), blocks (solid ████ characters), or partial (keep the last four digits, e.g. ••••1234 — useful when you still need to reference the item). Pick whichever suits where the text is going.' },
    ],
    keywords: ['pii redactor', 'redact personal information', 'remove pii from text', 'redact text before chatgpt', 'mask sensitive data', 'anonymize text', 'redact email phone ssn'],
  },
  {
    slug: 'totp-generator',
    name: 'TOTP Authenticator Code Generator',
    icon: '🔐',
    description:
      'Generate the current TOTP two-factor (2FA) code from a Base32 secret — RFC 6238, live countdown, in your browser. Your secret is never uploaded.',
    lead: 'Paste a Base32 TOTP secret to see the current 6-digit two-factor code with a live countdown — computed on your device, never sent anywhere.',
    widget: 'totp',
    how: 'A TOTP code is an HMAC of the current time step and your shared secret, truncated to 6 (or 8) digits — the exact scheme (RFC 6238) that Google Authenticator, Authy and 1Password use. The tool Base32-decodes your secret, computes the HMAC with the browser\'s Web Crypto API for the current 30-second window, and shows the code with a countdown, refreshing each second. It supports SHA-1 (the default), SHA-256 and SHA-512, 6 or 8 digits, and a verify mode that checks a code against the current and adjacent windows to allow for clock skew.',
    note: 'A word on trust: this computes codes locally and your secret never leaves the page — you can watch the network tab stay silent, or run it offline. Even so, a TOTP secret is a long-lived credential, so only ever paste one into a tool you trust and control. This is genuinely useful as a backup way to get a code when your phone isn\'t to hand, or to test a 2FA integration you\'re building — not a replacement for keeping the secret safe.',
    faqs: [
      { q: 'What is a TOTP code?', a: 'A Time-based One-Time Password (RFC 6238): a 6- or 8-digit code derived from a shared secret and the current time, rotating every 30 seconds. It\'s the second factor apps like Google Authenticator and Authy generate.' },
      { q: 'Will these codes match Google Authenticator?', a: 'Yes — for the same Base32 secret and settings (algorithm, digits, period), this produces identical codes, because it implements the same RFC 6238 standard. The default SHA-1 / 6 digits / 30 seconds matches almost every service.' },
      { q: 'Is it safe to paste my 2FA secret here?', a: 'The computation is entirely local — your secret never leaves your browser, and it works offline. That said, a TOTP secret is a sensitive long-lived credential, so only enter one into tools you trust and control, like this open, no-upload page.' },
      { q: 'What is the countdown for?', a: 'It shows how many seconds remain before the code rotates. Codes are valid for their 30-second window (and usually the adjacent one), so a code with only a second or two left may expire before you can use it — wait for the next one.' },
      { q: 'Why would I generate TOTP codes on a computer?', a: 'As a backup when your phone isn\'t available, to store a shared team secret you can access without a specific device, or to test a two-factor login you\'re developing. Keep the secret itself protected either way.' },
    ],
    keywords: ['totp generator', '2fa code generator', 'authenticator code', 'totp authenticator', 'generate 2fa code', 'rfc 6238', 'otp generator'],
  },
  {
    slug: 'bcrypt-generator',
    name: 'Bcrypt Hash Generator & Verifier',
    icon: '🧂',
    description:
      'Hash a password with bcrypt at a chosen cost, or verify a password against an existing bcrypt hash — in your browser, never uploaded.',
    lead: 'Generate a bcrypt password hash, or check a password against a $2b$ hash — computed locally, the password never leaves your device.',
    widget: 'bcrypt',
    how: 'Bcrypt is a deliberately slow password-hashing function with a built-in random salt and a tunable cost factor. The tool runs bcryptjs in your browser: in hash mode it produces a $2b$ hash at the cost you choose; in verify mode it checks a password against an existing hash. Because the salt is random, hashing the same password twice gives different hashes — and both still verify, which is exactly how bcrypt is meant to work.',
    note: 'Bcrypt is for storing passwords, not for general hashing or checksums — it is intentionally slow so that guessing passwords is expensive, and the cost factor lets you keep it slow as hardware speeds up (each +1 roughly doubles the time). It is not reversible: you never "decrypt" a bcrypt hash, you only verify a candidate password against it. Everything runs on your device, so the password is never transmitted.',
    faqs: [
      { q: 'What is bcrypt used for?', a: 'Storing passwords securely. It is a slow, salted, one-way hashing function designed so that even if the hash database leaks, brute-forcing the original passwords is expensive. It\'s not for file checksums or general hashing.' },
      { q: 'What is the cost factor?', a: 'A number (commonly 10–12) that sets how much work each hash takes — each increment roughly doubles the time. Higher is more resistant to brute-force but slower to compute; pick the highest your server can tolerate.' },
      { q: 'Why does the same password produce different hashes?', a: 'Bcrypt generates a new random salt each time and stores it inside the hash, so two hashes of the same password differ — yet both verify correctly against that password. This is intended and improves security.' },
      { q: 'Can I decrypt a bcrypt hash?', a: 'No — bcrypt is one-way. You can\'t recover the password from the hash; you can only check whether a given password matches it, which is what verify mode does.' },
      { q: 'Is my password uploaded?', a: 'No — hashing and verification run entirely in your browser with bcryptjs. The password and hash never leave your device, and it works offline.' },
    ],
    keywords: ['bcrypt generator', 'bcrypt hash', 'bcrypt password hash', 'bcrypt verify', 'generate bcrypt hash', 'bcrypt online', 'password hash generator'],
  },
  {
    slug: 'file-type-identifier',
    name: 'File Type Identifier (Magic Bytes)',
    icon: '🔬',
    description:
      'Identify a file\'s true type from its magic bytes — regardless of its extension — and detect files disguised with the wrong extension. In your browser, never uploaded.',
    lead: 'Drop in a file to see what it really is from its signature bytes — and get a warning when a file\'s extension doesn\'t match its actual content.',
    widget: 'filetype',
    how: 'Almost every binary format begins with a fixed "magic number" — a signature at the start of the file. A PNG always starts with the bytes 89 50 4E 47, a PDF with %PDF, a ZIP (and the Office and EPUB formats built on it) with PK. This tool reads just the first bytes of your file, matches them against a table of well-documented signatures, and reports the real format and MIME type. If you supply the file (so it knows the name), it also compares the detected type to the extension and flags a mismatch. You can also paste the leading bytes as hex.',
    note: 'The extension on a file is just a label — it can be wrong by accident (a mislabelled download) or changed on purpose to disguise what something is. What actually determines how a file opens is its content, and the magic bytes reveal that. This is a genuine security check: an attachment named invoice.pdf whose bytes are actually a Windows executable is a classic trick. The signature table is a frozen set of published format signatures, so results are exact and don\'t depend on any server. Note that plain-text formats (CSV, JSON, HTML, source code) have no magic number and read as "unrecognized" — that\'s expected, not an error.',
    faqs: [
      { q: 'What are magic bytes (a file signature)?', a: 'A fixed sequence of bytes at the very start of a file that identifies its format — like 89 50 4E 47 for PNG or %PDF for a PDF. Programs read these to know how to open a file, independent of its extension.' },
      { q: 'How do I find a file\'s real type if the extension is wrong?', a: 'Read its magic bytes. This tool does that: drop the file in and it reports the true format from the signature, and warns you when that doesn\'t match the file\'s extension.' },
      { q: 'Why does it say a .docx or .jar is a ZIP?', a: 'Because they genuinely are ZIP archives underneath — Office documents (docx/xlsx/pptx), JARs and EPUBs are all ZIP containers, so they share the PK signature. The tool lists those possibilities.' },
      { q: 'Why is my text file "unrecognized"?', a: 'Plain-text formats — CSV, JSON, HTML, XML, source code — have no magic number, so there\'s nothing to match. That\'s expected. Only binary formats carry a signature.' },
      { q: 'Is my file uploaded?', a: 'No — only the first 512 bytes are read, entirely in your browser, and nothing is transmitted. You can even paste just the leading hex bytes instead of a file.' },
    ],
    keywords: ['file type identifier', 'magic bytes checker', 'file signature checker', 'identify file type', 'check file real type', 'file extension spoof detector', 'what type of file is this'],
  },
  {
    slug: 'certificate-decoder',
    name: 'X.509 Certificate Decoder (PEM)',
    icon: '📜',
    description:
      'Decode a PEM / X.509 SSL certificate to read its subject, issuer, validity dates, key, SAN domains and extensions — entirely in your browser, never uploaded.',
    lead: 'Paste a PEM certificate to see who it\'s for, who issued it, when it expires, its key and its SAN domains — parsed locally on your device.',
    widget: 'certdecode',
    how: 'An X.509 certificate is a binary ASN.1/DER structure wrapped in Base64 between -----BEGIN CERTIFICATE----- lines (the PEM format). This tool Base64-decodes the block to raw DER bytes and walks the ASN.1 tree itself — no server, no library upload — to pull out the fields: version and serial number, the signature algorithm, the issuer and subject distinguished names, the notBefore / notAfter validity window, the public-key algorithm and size (RSA bit length or EC curve), and the standard extensions including Subject Alternative Names, key usage, extended key usage and basic constraints. It then compares the validity dates to now and tells you whether the certificate is currently valid, not yet valid, or expired.',
    note: 'This is handy for checking exactly what a certificate covers — which hostnames are in its SAN list, when it expires, whether it\'s a CA — without trusting an online decoder with it. Certificates are public by design (they\'re sent in the clear during every TLS handshake), so decoding one isn\'t sensitive, but doing it locally means an internal or not-yet-deployed certificate never leaves your machine. It decodes the certificate only; it does not verify the signature, check revocation, or validate the chain to a trusted root — those require the issuer\'s key and live network checks. Paste a single certificate; for a full chain, decode each block in turn.',
    faqs: [
      { q: 'How do I decode a PEM certificate?', a: 'Copy the block that starts with -----BEGIN CERTIFICATE----- and ends with -----END CERTIFICATE----- (or load a .pem/.crt file) and paste it in. The tool shows the subject, issuer, validity dates, public key and extensions immediately.' },
      { q: 'What do notBefore and notAfter mean?', a: 'They are the start and end of the certificate\'s validity window. The certificate is only trusted between those two UTC timestamps; the tool compares them to the current time and labels the certificate valid, not-yet-valid or expired, and shows how many days remain.' },
      { q: 'What are Subject Alternative Names (SANs)?', a: 'The SAN extension lists every hostname (and sometimes IP) the certificate is valid for. Modern browsers use the SAN list, not the Common Name, to decide whether a certificate matches a site — so if a domain isn\'t in the SAN list, it won\'t be trusted for that domain.' },
      { q: 'Does this verify the certificate or just decode it?', a: 'It decodes only. It reads and displays the certificate\'s contents but does not check the signature, the revocation status (CRL/OCSP), or whether it chains to a trusted root — those need the issuer\'s public key and network access. Use it to inspect fields, not to prove trust.' },
      { q: 'Is the certificate uploaded anywhere?', a: 'No — the ASN.1/DER parsing runs entirely in your browser and nothing is transmitted, so even an internal or pre-deployment certificate stays on your device. It works offline too.' },
      { q: 'Can I paste raw Base64 or DER hex instead of a PEM block?', a: 'Yes. If you paste the Base64 body without the BEGIN/END lines, or the DER bytes as hex, the tool detects the format and decodes it the same way.' },
    ],
    keywords: ['certificate decoder', 'x509 decoder', 'pem decoder', 'ssl certificate decoder', 'decode certificate online', 'read pem certificate', 'certificate expiry checker', 'san domains certificate'],
  },
];
