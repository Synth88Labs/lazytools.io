/** Privacy & Security tools registry. */

export interface SecurityToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'metadata' | 'encrypt' | 'strength' | 'file-hash';
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
    how: 'The checker estimates entropy from length and detected character sets (length × log₂ of alphabet size), then looks for the patterns that make real passwords weaker than the formula suggests: known most-cracked passwords, sequential runs (abc, 123, qwe), repeated characters, embedded years, and the classic Word+digits+! shape. Cracking tools encode exactly these patterns as mangling rules, so their presence caps the realistic strength regardless of raw length.',
    note: 'A checker can prove weakness, not safety — passing here doesn\'t certify a password, it just fails to find the obvious problems. The reliable route is skipping human invention entirely: a generated random password has exactly the entropy the math says. This page exists mostly to show you why your current ones need replacing.',
    faqs: [
      { q: 'Is it safe to type my real password here?', a: 'The check runs entirely in your browser — nothing is transmitted, stored or logged, verifiable by going offline. That said, the healthy habit is testing a password of the same shape rather than the exact one you use, and never typing real passwords into tools you don\'t trust.' },
      { q: 'Why does my "complex" password score badly?', a: 'Because complexity rules measure the wrong thing. Capital-first, digits-and-exclamation-last is the single most common password shape, and cracking software tries word+suffix mangles early. Patterns cost more strength than symbols add.' },
      { q: 'What score should I aim for?', a: 'For accounts behind rate-limited logins, roughly 60+ bits with no warnings. For anything crackable offline — master passwords, encrypted archives — 90+ bits, which in practice means a generated random password or a 5+ word random passphrase.' },
      { q: 'Can any checker know my password\'s true strength?', a: 'No — true strength depends on how the password was chosen, which no checker can see. A checker detects weakness signals; absence of warnings is not proof of strength. Random generation is the only password whose entropy you can actually know.' },
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
    how: 'The file is read into memory and digested with the Web Crypto API — the browser\'s native, correct implementation of the SHA-2 family. A hash is a fixed-size fingerprint: change one bit of a gigabyte file and the SHA-256 changes completely. Software publishers post checksums next to downloads precisely so you can verify that what you received is what they published — no corruption in transit, no swapped file.',
    note: 'SHA-1 is included because older sites still publish SHA-1 sums, but it is deprecated for security use — collisions are practical since 2017. For integrity verification against a trusted published value it still detects accidental corruption; for anything adversarial, use the SHA-256 value when offered. MD5 is omitted: Web Crypto deliberately excludes it.',
    faqs: [
      { q: 'What does comparing hashes actually prove?', a: 'That your copy of the file is bit-for-bit identical to the one whose hash the publisher posted. Any corruption in download, disk error or tampering produces a completely different hash. It does not prove the software is safe — only that it is unmodified.' },
      { q: 'Which algorithm should I use?', a: 'Whichever the publisher posted — SHA-256 is today\'s standard. If both are offered, prefer SHA-256 over SHA-1; SHA-1\'s collision resistance is broken (demonstrated practically in 2017), though it still catches accidental corruption.' },
      { q: 'Why do the same file\'s hashes differ between my machine and the site?', a: 'Either the download is corrupted/incomplete, the site posted the hash of a different version, or one side hashed a different file (e.g. the installer vs the archive). Re-download and check the version label first — that explains most mismatches.' },
      { q: 'Is there a size limit?', a: 'The file must fit in browser memory, so multi-gigabyte files depend on your device; hundreds of megabytes are routinely fine. Hashing happens locally either way.' },
      { q: 'Why no MD5?', a: 'The Web Crypto API excludes MD5 deliberately — its collision resistance has been broken for two decades. Any site still publishing only MD5 sums is overdue an update; SHA-256 is the drop-in replacement.' },
    ],
    keywords: ['sha256 checksum', 'file hash checker', 'verify file checksum', 'sha256 of file online', 'checksum verifier'],
  },
];
