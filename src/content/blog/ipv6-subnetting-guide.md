---
title: "IPv6 Crossed 50%: A Practical Subnetting Guide for the Dual-Stack Era"
description: "IPv6 now carries the majority of traffic to major services. What that means in practice: how IPv6 addresses are structured, why every LAN is a /64, how /48 and /56 allocations work, and the habits to unlearn from IPv4 subnetting."
pubDate: 2026-07-07
updatedDate: 2026-07-07
archetype: explainer
tools: ["/network/ipv6-subnet-calculator/", "/network/subnet-calculator/", "/network/ipv6-expand-compress/", "/network/cidr-to-ip-range/"]
keywords:
  - ipv6 subnetting
  - ipv6 subnet calculator
  - ipv6 /64
  - ipv6 prefix delegation
  - dual stack networking
  - ipv6 adoption 2026
  - ipv6 vs ipv4 subnetting
  - ipv6 address structure
heroImage: /blog/ipv6-subnetting-guide.png
heroAlt: "IPv6 subnetting for the dual-stack era — the 128-bit address structure explained"
faqs:
  - q: "How much of the internet actually uses IPv6 now?"
    a: "As of 2026, more than half of user traffic to Google arrives over IPv6 — the 50% milestone was crossed in March 2026, about 18 years after Google began measuring. Adoption varies widely by country: some ISPs and mobile networks are effectively IPv6-first, while others still lag."
  - q: "Why is every IPv6 LAN a /64?"
    a: "The 64-bit interface identifier is baked into the standards: SLAAC — the mechanism devices use to configure their own addresses — requires exactly 64 host bits. Subnetting a LAN smaller than /64 breaks address autoconfiguration, so the /64 is the universal unit of an IPv6 network segment."
  - q: "How many subnets do I get from a /56 or /48?"
    a: "Count the bits between your prefix and /64: a /56 has 8 subnet bits, so 256 possible /64 LANs; a /48 has 16, so 65,536. Nobody counts hosts per LAN in IPv6 — every /64 already holds 18.4 quintillion addresses."
  - q: "Do I still need NAT with IPv6?"
    a: "No — every device can have a globally routable address, which restores end-to-end connectivity. Security is handled where it belongs, at the firewall: a stateful firewall that blocks unsolicited inbound traffic gives the same protection people wrongly attribute to NAT."
  - q: "Why do the same IPv6 addresses look different in different tools?"
    a: "IPv6 text notation allows dropping leading zeros and compressing runs of zero groups with ::, so one address has many spellings. RFC 5952 defines a single canonical form (lowercase, longest zero-run compressed). Normalize both sides before comparing address lists."
  - q: "Should I abandon IPv4 subnetting skills?"
    a: "No — dual-stack means running both. IPv4 subnet math (masks, usable hosts, CIDR splits) still governs the v4 half of every network, and container platforms and VPNs are heavy CIDR users. The skill set is additive: keep the v4 bit math, add the v6 mindset of counting subnets instead of hosts."
draft: false
---

**IPv6 stopped being the future in March 2026, when it crossed 50% of user traffic to Google —
and subnetting it is genuinely easier than IPv4, once you unlearn one habit: stop counting hosts
and start counting subnets.** Every LAN is a /64, always; your job is only to decide how the bits
between your allocation and /64 divide into networks. Do the math with the
[IPv6 subnet calculator](/network/ipv6-subnet-calculator/), which handles the full 128 bits exactly.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>IPv6 majority:</strong> over half of Google user traffic since March 2026 — dual-stack is normal operations now</li>
<li><strong>The unit is the /64:</strong> one per LAN segment, required by SLAAC — never subnet smaller</li>
<li><strong>Count subnets, not hosts:</strong> a /56 home delegation = 256 LANs; a /48 site = 65,536</li>
<li><strong>Subnet on nibble boundaries</strong> (/52, /56, /60) so prefixes stay readable in hex</li>
<li><strong>Normalize before comparing:</strong> RFC 5952 gives every address one canonical spelling</li>
</ul>
</aside>

## The milestone, and why it matters for your network

Google has published the share of its users connecting over IPv6 since 2008. In late March 2026
that measurement [crossed 50%](https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/) —
eighteen years from under 1% to majority, as the
[Internet Society noted](https://pulse.internetsociety.org/en/blog/2026/04/18-years-later-ipv6-reaches-majority/).
Mobile networks drove much of it: many carriers are IPv6-only internally, translating to reach
legacy IPv4 services.

For anyone running a network, the practical consequence is that **dual-stack is no longer optional
hygiene** — a misconfigured IPv6 subnet is now a majority-of-traffic problem, and "we'll deal with
v6 later" means ignoring how most of your users actually connect.

## How an IPv6 address is structured

An IPv6 address is 128 bits, written as eight colon-separated groups of hex. In a typical global
unicast address, the bits split into three jobs:

| Bits | Part | Who controls it |
|---|---|---|
| First 48 | Global routing prefix | Your ISP / RIR — identifies your site |
| Next 16 | Subnet ID | **You** — 65,536 possible LANs |
| Last 64 | Interface identifier | The device — via SLAAC, DHCPv6 or manually |

<figure>
<img src="/blog/infographic-ipv6-subnetting.svg" alt="Infographic: the 128-bit IPv6 address splits into a 48-bit global routing prefix, 16-bit subnet ID and 64-bit interface identifier; a /48 site contains 65,536 LANs, a /56 home delegation 256 LANs, and every LAN is one /64; the mindset shift from IPv4 is counting subnets instead of hosts" width="1200" height="640" loading="lazy" />
<figcaption>Three jobs in 128 bits — and the only part you plan is the subnet ID.</figcaption>
</figure>

The last row of that table is the key fact: **the interface identifier is always 64 bits**,
because SLAAC — the mechanism that lets devices configure their own addresses from router
advertisements — requires it. That's why the /64 is the indivisible unit of IPv6 networking. A
"small" segment with two routers on it gets a /64. A point-to-point link gets a /64 (or /127 by
some operators' convention — a deliberate exception, not a habit). Your Wi-Fi with 40 devices
gets a /64. There is no host-count math, ever.

## Subnetting is just slicing the middle bits

If your ISP delegates a **/56** to your home or small office, you own bits 57–64: eight bits,
256 possible /64s. A business **/48** gives sixteen bits: 65,536 LANs. Planning a network is
choosing how those bits split:

| You receive | Subnet bits to /64 | You can build |
|---|---|---|
| /48 (site) | 16 | 65,536 LANs |
| /52 | 12 | 4,096 LANs |
| /56 (typical home delegation) | 8 | 256 LANs |
| /60 (some home ISPs) | 4 | 16 LANs |
| /64 | 0 | exactly one LAN |

Two working rules keep plans sane:

1. **Subnet on nibble boundaries.** Each hex digit is 4 bits, so prefixes at /52, /56, /60
   align with whole digits — subnets then differ by one visible character
   (`2001:db8:ab:10::/60`, `:20::`, `:30::`), which humans can read and DNS can delegate cleanly.
2. **Assign meaning to the subnet digits.** With 65,536 subnets in a /48 there's room for
   structure: a digit for the building, a digit for the VLAN type. Address plans can encode
   topology instead of rationing scraps — the [IPv6 subnet calculator](/network/ipv6-subnet-calculator/)
   shows exactly how many /64s each choice yields.

## The habits to unlearn from IPv4

**Conserving addresses.** IPv4 scarcity trained everyone to squeeze: /30s on links, /28s for
small VLANs, VLSM everywhere. In IPv6 that instinct produces broken networks (sub-/64 LANs break
SLAAC) and unreadable plans. The address space is the one resource you genuinely have in excess —
spend it on structure.

**Equating NAT with security.** IPv6 restores end-to-end addressing; there is no NAT to hide
behind, and none is needed. The security NAT appeared to provide was really its side effect of
statefulness — which your firewall does explicitly. Block unsolicited inbound by default, allow
what you mean to allow.

**Trusting text comparison.** `2001:db8::1`, `2001:0db8:0:0:0:0:0:1` and `2001:DB8::0001` are
the same address. Scripts that grep logs or diff ACLs against configs break on this constantly.
[RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952) defines one canonical form — lowercase,
longest zero-run compressed to `::` — and the
[expand/compress tool](/network/ipv6-expand-compress/) normalizes whole lists either way in one paste.

## What stays the same

The v4 half of a dual-stack network still runs on classic subnet math — masks, usable-host
counts, CIDR blocks — and it isn't going anywhere soon: private RFC 1918 space, container
networking and VPN configs are all heavy CIDR users. Keep the
[IPv4 subnet calculator](/network/subnet-calculator/) and
[CIDR-to-range converter](/network/cidr-to-ip-range/) in reach for that half; the bit-exact
answers matter precisely because subnet arithmetic is where mental math and language-model
guesses go quietly wrong.

## Quick summary

IPv6 crossing 50% of Google's user traffic makes dual-stack the operating norm, and its
subnetting model is simpler than IPv4's once inverted: the /64 LAN is fixed, so planning is
purely about slicing your delegated prefix (/48 → 65,536 LANs, /56 → 256) into readable,
nibble-aligned subnets. Unlearn address conservation, let the firewall do the security NAT never
really did, normalize addresses to RFC 5952 before comparing — and keep the v4 bit math for the
other half of the stack. All of it computes exactly, in your browser, with the
[network tools](/network/).

*Sources: [APNIC — Google hits 50% IPv6](https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/) ·
[Internet Society Pulse — IPv6 reaches majority](https://pulse.internetsociety.org/en/blog/2026/04/18-years-later-ipv6-reaches-majority/) ·
[RFC 5952 (canonical text form)](https://datatracker.ietf.org/doc/html/rfc5952) ·
[Google IPv6 statistics](https://www.google.com/intl/en/ipv6/statistics.html)*
