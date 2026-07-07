/** Network & IT tools category registry. */

export interface NetworkToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'subnet' | 'ipv6-subnet' | 'cidr-range' | 'ip-converter' | 'ipv6-format' | 'chmod' | 'cron' | 'mac';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const NETWORK_TOOLS: NetworkToolDef[] = [
  {
    slug: 'subnet-calculator',
    name: 'IP Subnet Calculator',
    icon: '🌐',
    description:
      'IPv4 subnet calculator: enter an IP and prefix or mask to get network address, broadcast, usable host range, wildcard mask and a subnet split — all computed in your browser.',
    lead: 'Enter any IPv4 address with a prefix (/24) or mask (255.255.255.0) and get the network, broadcast, usable range and host count — plus an equal-split subnet plan.',
    widget: 'subnet',
    how: 'A subnet mask divides an IP address into a network part and a host part. The calculator applies the mask with bitwise AND to find the network address, sets all host bits to 1 for the broadcast address, and the usable hosts are everything in between (2^host-bits − 2, since network and broadcast addresses are reserved). It also shows the wildcard mask (the inverted mask, used in Cisco ACLs), the binary form so you can see where the boundary falls, the address class and whether the address is private (RFC 1918), and can split the network into equal smaller subnets for addressing plans. Your addressing plan never leaves the browser — relevant, since internal IP layouts are exactly the kind of information not to paste into random websites.',
    note: 'Two special cases trip people up: a /31 has no broadcast address — RFC 3021 allows both addresses to be used on point-to-point links — and a /32 is a single host route. Also remember the "subtract 2" rule applies per subnet, not per network: splitting a /24 into four /26s gives 4 × 62 = 248 usable hosts, not 254.',
    faqs: [
      { q: 'How many usable hosts are in a /24?', a: 'A /24 has 256 addresses, of which 254 are usable — one is the network address and one the broadcast. The general rule is 2^(32 − prefix) − 2.' },
      { q: 'What is a wildcard mask?', a: 'The bitwise inverse of the subnet mask — /24’s mask 255.255.255.0 has wildcard 0.0.0.255. Cisco access-control lists and OSPF configuration match addresses using wildcards rather than masks.' },
      { q: 'What does the /26 style notation mean?', a: 'CIDR prefix notation: the number counts the leading 1-bits in the mask. /26 means 26 network bits, i.e. mask 255.255.255.192, leaving 6 host bits (62 usable hosts).' },
      { q: 'Which IPv4 ranges are private?', a: 'RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 for private networks. The calculator flags these, plus loopback (127/8), link-local (169.254/16) and carrier-grade NAT (100.64/10).' },
      { q: 'Why do /31 subnets show 2 usable hosts?', a: 'RFC 3021 permits both addresses of a /31 on point-to-point links (router-to-router), where no broadcast is needed. Most vendors support it; it halves address consumption on links.' },
      { q: 'Is my IP or network plan uploaded?', a: 'No — all the bit math happens in your browser. Nothing you type is sent anywhere, which matters when you’re planning internal address space.' },
    ],
    keywords: ['subnet calculator', 'ip subnet calculator', 'ipv4 subnet calculator', 'cidr calculator', 'subnet mask calculator', 'network calculator', 'vlsm calculator', 'wildcard mask'],
  },
  {
    slug: 'ipv6-subnet-calculator',
    name: 'IPv6 Subnet Calculator',
    icon: '🛰️',
    description:
      'IPv6 subnet calculator: compressed and expanded forms, network range, total addresses and /64 counts for any prefix — computed locally with 128-bit precision.',
    lead: 'Paste any IPv6 address with a prefix and get its canonical compressed form, full expanded form, the network range, and how many addresses and /64 subnets it contains.',
    widget: 'ipv6-subnet',
    how: 'IPv6 addresses are 128 bits written as eight groups of hex. The calculator parses any valid form (including :: compression and embedded IPv4 tails), computes the network range for your prefix with exact 128-bit arithmetic, and shows both the RFC 5952 canonical compressed form and the fully expanded form. Because IPv6 subnetting is about counting subnets rather than hosts — a standard LAN is always a /64 — it also tells you how many /64s fit in your allocation: a /56 holds 256 of them, a /48 holds 65,536. With IPv6 now carrying more than half of Google’s user traffic, dual-stack addressing plans are routine work rather than a future project.',
    note: 'The habit to unlearn from IPv4: conserving addresses. An ISP handing you a /56 is giving you 256 whole LANs, each with 18 quintillion addresses — the design intent is one /64 per network segment, no matter how few devices it has. Subnet on nibble boundaries (multiples of 4 bits) where possible; it keeps the hex readable.',
    faqs: [
      { q: 'How many addresses are in a /64?', a: '2^64 — 18,446,744,073,709,551,616 addresses. It is the standard size for a single network segment; SLAAC address autoconfiguration requires exactly 64 host bits.' },
      { q: 'How many /64 subnets are in a /48 or /56?', a: 'A /48 contains 65,536 /64s; a /56 contains 256. Those are the two most common delegated-prefix sizes for sites and home connections respectively.' },
      { q: 'What is the canonical (RFC 5952) form?', a: 'Lowercase hex, leading zeros dropped in each group, and the longest run of two or more zero groups compressed to :: (leftmost run if tied). It exists so an address always has one comparable text form.' },
      { q: 'Why should I subnet on nibble boundaries?', a: 'Each hex digit is 4 bits, so prefixes at multiples of 4 (/48, /52, /56, /60, /64) align with whole hex digits — subnets then differ by one visible character, which makes plans much easier to read and delegate in DNS.' },
      { q: 'Does the math really use 128 bits?', a: 'Yes — the calculator uses arbitrary-precision integers (BigInt), not floating point, so every bit of the 128-bit address space is exact.' },
    ],
    keywords: ['ipv6 subnet calculator', 'ipv6 calculator', 'ipv6 prefix', 'ipv6 /64', 'ipv6 subnetting', 'ipv6 network range', 'ipv6 cidr'],
  },
  {
    slug: 'cidr-to-ip-range',
    name: 'CIDR to IP Range Converter',
    icon: '↔️',
    description:
      'Convert a CIDR block to its IP range, or an IP range to the minimal set of CIDR blocks — both directions, computed in your browser.',
    lead: 'Turn 192.168.0.0/22 into its first–last address range, or turn an arbitrary range into the smallest set of CIDR blocks that covers it exactly.',
    widget: 'cidr-range',
    how: 'CIDR notation and first–last ranges are two ways of writing the same thing, and different systems demand different forms: firewall rules and cloud security groups usually want CIDR, IPAM spreadsheets and WHOIS output often use ranges. CIDR-to-range is a simple mask expansion. The reverse is trickier: an arbitrary range rarely fits one CIDR block, so the tool computes the minimal covering set — repeatedly taking the largest power-of-two block that is aligned at the range start and still fits. For example 10.0.0.5–10.0.0.20 needs five blocks (/32, /31, /29, /30, /32), which is why hand-converting ranges to firewall rules goes wrong so often.',
    note: 'A range that starts and ends on "round" addresses is not necessarily one CIDR block — 10.0.1.0–10.0.2.255 looks tidy but is two blocks (10.0.1.0/24 and 10.0.2.0/24), because a single /23 must start on an even third octet. Alignment, not size, decides.',
    faqs: [
      { q: 'How do I read 192.168.0.0/22 as a range?', a: '/22 leaves 10 host bits, i.e. 1,024 addresses: 192.168.0.0 through 192.168.3.255. The calculator shows the range plus usable host count instantly.' },
      { q: 'Why does my range need multiple CIDR blocks?', a: 'A CIDR block must be a power-of-two size AND start at a multiple of its size. Any range that violates either rule splits into several blocks — the tool finds the provably minimal set.' },
      { q: 'Can I convert a range for AWS/Azure security groups?', a: 'Yes — paste the start and end address and copy out the CIDR list; cloud security rules accept only CIDR notation, one block per rule.' },
      { q: 'Does it handle single addresses?', a: 'Yes — a single address is a /32 in CIDR form, and any range where start equals end converts to exactly that.' },
    ],
    keywords: ['cidr to ip range', 'ip range to cidr', 'cidr converter', 'cidr calculator', 'ip range calculator', 'cidr notation'],
  },
  {
    slug: 'ip-address-converter',
    name: 'IP Address Converter',
    icon: '🔢',
    description:
      'Convert an IPv4 address between dotted-decimal, binary, hexadecimal and 32-bit integer forms — all four shown at once, computed locally.',
    lead: 'Type an IP in any form — dotted (192.168.1.1), decimal integer (3232235777), hex (0xC0A80101) or binary — and see all four representations at once.',
    widget: 'ip-converter',
    how: 'An IPv4 address is just a 32-bit number; the familiar dotted form is one of several encodings of it. The converter accepts dotted-decimal, a plain integer (0–4294967295), hex (with or without 0x) or 32 binary bits, and renders all the forms together, plus the per-octet binary breakdown. The integer form appears in database storage and log formats; hex shows up in packet captures and ARP output; binary is what subnet masks actually operate on — seeing the same address all four ways is the fastest route to understanding why 192.168.1.1 equals 3232235777.',
    note: 'Historical quirk worth knowing: many tools still accept "shortened" dotted forms like 192.168.257 or even a bare integer typed into a browser address bar — inetd-era parsing rules that map them onto the same 32-bit number. If a log shows an impossible-looking IP, converting via the integer form usually explains it.',
    faqs: [
      { q: 'Why would an IP address appear as a plain number?', a: 'Databases and some log formats store IPv4 addresses as their raw 32-bit integer — it’s compact and sortable. 3232235777 is 192.168.1.1: each dotted octet is one byte of the number.' },
      { q: 'How do I convert dotted decimal to integer by hand?', a: 'Multiply and add place values: a.b.c.d = a×16,777,216 + b×65,536 + c×256 + d. For 192.168.1.1: 192×2^24 + 168×2^16 + 1×256 + 1 = 3,232,235,777.' },
      { q: 'What is the binary form useful for?', a: 'Subnetting. Masks operate on bits, so seeing 192.168.1.1 as 11000000.10101000.00000001.00000001 makes it obvious which bits a /26 keeps and which it zeroes.' },
      { q: 'Does it work for IPv6?', a: 'IPv6 needs 128-bit handling and different notation rules — use the dedicated IPv6 subnet calculator and IPv6 expand/compress tools for that.' },
    ],
    keywords: ['ip address converter', 'ip to decimal', 'decimal to ip', 'ip to binary', 'ip to hex', 'ip integer converter', 'ipv4 converter'],
  },
  {
    slug: 'ipv6-expand-compress',
    name: 'IPv6 Expand / Compress',
    icon: '🪗',
    description:
      'Expand IPv6 addresses to their full eight-group form, or compress them to the RFC 5952 canonical short form — one address or a whole list at once.',
    lead: 'Paste one IPv6 address or a whole list: get the fully expanded form for databases and sorting, or the canonical RFC 5952 compressed form for configs and docs.',
    widget: 'ipv6-format',
    how: 'The same IPv6 address can be written many ways — 2001:db8:0:0:0:0:0:1, 2001:0db8::0001 and 2001:db8::1 are identical — which breaks naive string comparison in scripts, ACL reviews and log greps. This tool parses each line and outputs either the fully expanded form (eight 4-digit groups, fixed width, sorts correctly as text) or the canonical compressed form defined by RFC 5952 (lowercase, longest zero-run become ::, leading zeros dropped). Batch mode handles a pasted column of addresses in one go, which is the usual real-world job: normalizing a list pulled from logs or a spreadsheet before comparing it against a config.',
    note: 'RFC 5952 exists precisely because compression used to be ambiguous — 2001:db8:0:0:1:0:0:1 can legally be written with :: in two places. The canonical rule (compress the longest run; if tied, the leftmost) gives every address exactly one short form, so normalize both sides before diffing address lists.',
    faqs: [
      { q: 'Why do the same IPv6 addresses look different in different tools?', a: 'IPv6 text form allows dropping leading zeros and compressing zero runs with ::, so one address has many valid spellings. Tools emit whichever they like — normalizing to one form is the fix.' },
      { q: 'When should I use the expanded form?', a: 'Anywhere fixed-width text helps: database columns, sorting address lists as text, aligning columns in documentation, or regex matching in logs.' },
      { q: 'What does RFC 5952 actually require?', a: 'Lowercase hex; no leading zeros within groups; :: must replace the longest run of two or more all-zero groups (leftmost if tied); and a single zero group is never compressed with ::.' },
      { q: 'Can I paste a whole list?', a: 'Yes — one address per line, and the tool converts every line, flagging any that fail to parse.' },
    ],
    keywords: ['ipv6 expand', 'ipv6 compress', 'expand ipv6 address', 'ipv6 normalizer', 'rfc 5952', 'ipv6 canonical form', 'ipv6 formatter'],
  },
  {
    slug: 'chmod-calculator',
    name: 'Chmod Calculator',
    icon: '🔑',
    description:
      'Unix file-permissions calculator: click rwx checkboxes to get the octal chmod number and symbolic string — or type 755 and see what it grants. Includes setuid/setgid/sticky.',
    lead: 'Tick read/write/execute for owner, group and others — or type an octal like 755 — and get the matching chmod command, symbolic string, and special-bit handling.',
    widget: 'chmod',
    how: 'Unix permissions are three bits (read=4, write=2, execute=1) for each of owner, group and others; the familiar chmod numbers are just those sums — 755 is rwx for the owner (4+2+1) and r-x (4+1) for group and others. The calculator converts live in both directions: click the checkbox grid and read off the octal, or type an octal and watch the grid update. It also covers the fourth, often-forgotten digit — setuid (4), setgid (2) and the sticky bit (1) — showing how 4755 differs from 755, and renders the symbolic form (rwxr-xr-x) as it appears in ls -l output.',
    note: 'Practical defaults: 644 for files and 755 for directories covers most web content (the execute bit on a directory means "can enter it", not "can run it"). Being asked to chmod 777 is almost always a misdiagnosis — it makes the file world-writable, and the real problem is usually ownership, fixed with chown instead.',
    faqs: [
      { q: 'What does chmod 755 mean?', a: 'Owner: read+write+execute (7); group: read+execute (5); others: read+execute (5). In symbolic form rwxr-xr-x — the standard permission for directories and executables that others may use but not modify.' },
      { q: 'What is the difference between 644 and 755?', a: '644 (rw-r--r--) has no execute bits — right for ordinary files. 755 adds execute for everyone — needed for programs and for directories, where execute means permission to enter.' },
      { q: 'Why is chmod 777 a bad idea?', a: 'It lets any user on the system modify the file. On shared hosting or servers, that turns any other compromised account into a path to yours. If something "only works with 777", the actual problem is usually wrong ownership.' },
      { q: 'What do setuid, setgid and the sticky bit do?', a: 'Setuid (4xxx) runs an executable as its owner; setgid (2xxx) as its group — and on directories makes new files inherit the group. The sticky bit (1xxx) on a directory (like /tmp, mode 1777) lets only a file’s owner delete it.' },
      { q: 'How do I read rwxr-xr-- as a number?', a: 'Score each triplet: rwx = 4+2+1 = 7, r-x = 4+1 = 5, r-- = 4. So rwxr-xr-- is 754.' },
    ],
    keywords: ['chmod calculator', 'chmod 755', 'file permissions calculator', 'unix permissions', 'chmod generator', 'octal permissions', 'linux chmod'],
  },
  {
    slug: 'cron-expression-parser',
    name: 'Cron Expression Parser',
    icon: '⏲️',
    description:
      'Paste a cron expression and get a plain-English description plus the next run times, with a field-by-field breakdown — parsed entirely in your browser.',
    lead: 'Paste any 5-field cron expression — get what it means in plain English, the next 5 run times in your local timezone, and a field-by-field breakdown.',
    widget: 'cron',
    how: 'A cron expression is five fields — minute, hour, day-of-month, month, day-of-week — each accepting numbers, ranges (1-5), lists (1,15), steps (*/10) and names (MON, JAN). The parser expands each field to its matching values, explains the whole expression in plain English, and simulates the schedule forward to show the next run times in your local timezone — the fastest way to confirm a schedule does what you meant before it goes into a crontab or CI config. One subtlety it models correctly: when both day-of-month and day-of-week are restricted, classic cron fires when either matches (OR, not AND) — the single most common cause of jobs running more often than intended.',
    note: 'The classic footgun: "0 0 1 * 1" reads like "midnight on the 1st, if it’s a Monday" but actually fires on the 1st AND on every Monday — the two day fields OR together. If you need "the first Monday of the month", cron alone can’t say it; schedule Mondays and test the date in the job itself.',
    faqs: [
      { q: 'What do the five cron fields mean?', a: 'In order: minute (0–59), hour (0–23), day of month (1–31), month (1–12 or JAN–DEC), day of week (0–7 or SUN–SAT, where both 0 and 7 are Sunday).' },
      { q: 'What does */15 mean?', a: '"Every 15th value" — in the minute field it fires at :00, :15, :30 and :45. Steps combine with ranges too: 9-17/2 in the hour field means 9, 11, 13, 15 and 17.' },
      { q: 'Why does my job run more often than expected?', a: 'Usually the day-of-month/day-of-week OR rule: if both fields are restricted, matching either one triggers the job. "0 0 1 * 1" runs on the 1st and every Monday, not only when they coincide.' },
      { q: 'What timezone are the next-run times shown in?', a: 'Your browser’s local timezone. Remember the server running the real crontab uses its own timezone (often UTC) — a frequent source of off-by-hours surprises.' },
      { q: 'Does it support @daily and 6-field (seconds) syntax?', a: 'This parser covers the standard 5-field syntax that crontab, GitHub Actions and most schedulers use. @daily is shorthand for "0 0 * * *" — paste the long form to inspect it.' },
    ],
    keywords: ['cron expression parser', 'cron parser', 'crontab explained', 'cron next run time', 'cron schedule checker', 'cron expression tester', 'cron syntax'],
  },
  {
    slug: 'mac-address-formatter',
    name: 'MAC Address Formatter',
    icon: '🏷️',
    description:
      'Normalize MAC addresses between colon, hyphen, Cisco dotted and bare formats, upper or lower case — plus EUI-64 and the derived IPv6 link-local address.',
    lead: 'Paste a MAC in any format and get every standard notation — colon, hyphen, Cisco dotted, bare hex — plus its EUI-64 form and IPv6 link-local address.',
    widget: 'mac',
    how: 'Every vendor writes MAC addresses differently: Linux and macOS use colons (aa:bb:cc:dd:ee:ff), Windows uses hyphens (AA-BB-CC-DD-EE-FF), Cisco IOS uses dotted quads (aabb.ccdd.eeff), and databases often store bare hex. The formatter parses any of them and emits all four, in your choice of case — the everyday job when moving addresses between a switch console, a DHCP reservation form and a spreadsheet. It also computes the modified EUI-64 interface identifier (split the MAC, insert ff:fe, flip the universal/local bit) and from it the IPv6 link-local address (fe80::/64 + EUI-64) — which is how you can predict a device’s link-local IPv6 address from the MAC printed on its label.',
    note: 'The U/L bit flip is the step everyone forgets when deriving EUI-64 by hand: the second-least-significant bit of the first byte inverts, so a MAC starting aa: gives an EUI-64 starting a8:. Note that modern client OSes use random privacy addresses instead of EUI-64 for their routable IPv6 — but link-local EUI-64 derivation still works on most routers, switches and embedded gear.',
    faqs: [
      { q: 'Which MAC formats exist?', a: 'Four are common: colon-separated pairs (Unix), hyphen-separated pairs (Windows), Cisco’s three dotted groups of four, and bare 12-digit hex. All encode the same 48 bits.' },
      { q: 'What is EUI-64?', a: 'A 64-bit interface identifier derived from the 48-bit MAC: split it in half, insert ff:fe in the middle, and flip the universal/local bit of the first byte. IPv6 uses it to build interface IDs.' },
      { q: 'How is the IPv6 link-local address derived from a MAC?', a: 'Prefix fe80::/64 plus the EUI-64 interface identifier. For MAC aa:bb:cc:dd:ee:ff that gives fe80::a8bb:ccff:fedd:eeff — predictable from the label on the device.' },
      { q: 'Why doesn’t my laptop’s IPv6 address match its MAC?', a: 'Modern operating systems use randomized (privacy) interface identifiers rather than EUI-64 for exactly that reason — MAC-derived addresses would let websites track hardware. Routers and embedded devices still commonly use EUI-64.' },
      { q: 'Is the MAC I paste sent anywhere?', a: 'No — formatting happens locally. MAC addresses identify your hardware, so they’re not something to feed into random online tools that log requests.' },
    ],
    keywords: ['mac address formatter', 'mac address converter', 'mac address format', 'eui-64 calculator', 'ipv6 link local from mac', 'cisco mac format', 'normalize mac address'],
  },
];
