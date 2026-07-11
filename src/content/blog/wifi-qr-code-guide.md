---
title: "WiFi QR Codes: How They Work, the WIFI: Format, and How to Make One Safely"
description: "A WiFi QR code encodes the string WIFI:T:WPA;S:network;P:password;; — scan it and a phone joins the network with no typing. How the format works, why special characters must be escaped, and why encoding it directly (not via a tracking redirect) matters."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/generate/wifi-qr-code-generator/", "/generate/vcard-qr-code-generator/", "/generate/qr-code-generator/"]
keywords:
  - wifi qr code
  - how to make a wifi qr code
  - wifi qr code format
  - share wifi qr code
  - guest wifi qr code
  - wifi qr code generator
heroImage: /blog/wifi-qr-code-guide.png
heroAlt: "How a WiFi QR code works — the WIFI: string format and the scan-to-join flow"
faqs:
  - q: "How do I make a WiFi QR code?"
    a: "Enter your network name (SSID), security type and password into a WiFi QR generator; it encodes the standard string WIFI:T:WPA;S:yourname;P:yourpassword;; into a QR code. Scanning that code with a phone camera offers to join the network automatically — no password typing."
  - q: "What is the WiFi QR code format?"
    a: "WIFI:T:<WPA|WEP|nopass>;S:<SSID>;P:<password>;H:<true|false>;; — where T is the security type, S the network name, P the password, and the optional H marks a hidden network. Special characters (\\ ; , : \") in the name or password must be escaped with a backslash."
  - q: "Do WiFi QR codes work on iPhone and Android?"
    a: "Yes. iPhones running iOS 11 or later and Android phones running Android 10 or later read WiFi QR codes with the built-in camera app — point, and a 'Join network?' prompt appears. Older phones may need a QR-scanner app."
  - q: "Is it safe to put my WiFi password in a QR code?"
    a: "The code does contain your password (that's how the phone can join), so treat a printed code like the password itself — anyone who can scan it can connect. But generating it safely matters: a good tool builds the code in your browser and never uploads the password. Consider a separate guest network for a code you'll display publicly."
  - q: "Why do some WiFi QR codes stop working?"
    a: "Because some 'free' generators encode a redirect through their own tracking domain instead of the WiFi credentials directly — the code pings their server on every scan and breaks if they shut the service down. A code that encodes the WIFI: string directly has no middleman and never expires."
  - q: "Can I make a QR code for a hidden network?"
    a: "Yes — set the hidden flag, which adds H:true to the string. This tells the phone the network won't appear in the normal list, so it should connect to it by name. For a visible network, leave it off."
draft: false
---

**A WiFi QR code simply encodes a plain-text string — `WIFI:T:WPA;S:MyNetwork;P:mypassword;;` — that
phones understand natively, so scanning it joins the network with no password typing.** Get the format
right (including escaping special characters) and encode it *directly* rather than through a tracking
redirect, and the code works forever. Make one privately with the
[WiFi QR code generator](/generate/wifi-qr-code-generator/); here's how it works.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Format:</strong> <code>WIFI:T:WPA;S:name;P:password;;</code> (T = security, S = SSID, P = password)</li>
<li><strong>Scan-to-join</strong> works natively on iOS 11+ and Android 10+ — no app</li>
<li><strong>Escape</strong> <code>\ ; , : "</code> in the name/password with a backslash</li>
<li>The code <strong>contains the password</strong> — treat a printed one like the password itself</li>
<li>Encode it <strong>directly</strong> (not via a redirect) so it never expires and isn't tracked</li>
</ul>
</aside>

## The format, decoded

<figure>
<img src="/blog/infographic-wifi-qr.svg" alt="Infographic: a WiFi QR code encodes the string WIFI:T:WPA;S:MyNetwork;P:s3cr3t-pass;; where T is the security type (WPA, WEP or nopass), S is the network name (SSID), P is the password, and an optional H:true marks a hidden network; special characters backslash, semicolon, comma, colon and quote must be escaped; scanning with an iOS 11+ or Android 10+ camera shows a 'Join network?' prompt and connects; encoding directly means no tracking redirect and nothing uploaded" width="1200" height="620" loading="lazy" />
<figcaption>One plain-text string, read natively by the phone camera.</figcaption>
</figure>

A WiFi QR code is nothing exotic — it's a QR code whose content is a short, structured string:

> `WIFI:T:WPA;S:MyNetwork;P:mypassword;H:false;;`

- **T** — the security type: `WPA` (use this for WPA, WPA2 and WPA3), `WEP` for old routers, or `nopass`
  for an open network.
- **S** — the SSID (network name).
- **P** — the password (omit for `nopass`).
- **H** — optional; `true` for a hidden network.

The two semicolons at the end close the record. Phones from iOS 11 and Android 10 onward recognise this
format and, when the camera sees it, offer to join the network.

## The detail most tools get wrong: escaping

If your network name or password contains any of `\ ; , : "`, those characters **must be escaped with a
backslash**, or the string breaks. For a password like `p;ass:word`, the correct encoding is
`P:p\;ass\:word`. Get this wrong and the code either fails to scan or joins with the wrong password —
which is maddening to debug because the QR *looks* fine. The
[WiFi QR generator](/generate/wifi-qr-code-generator/) escapes these automatically.

## Is it safe?

Two different questions hide here:

1. **Does the code contain my password?** Yes — it has to, so the phone can connect. Treat a *printed*
   WiFi QR code like the password written on the wall: anyone who can photograph it can join. For a code
   you'll display publicly (a café, an office lobby), use a **separate guest network** rather than your
   main one.
2. **Is it generated safely?** This is where the tool matters. A good generator builds the code **in
   your browser** and never sends your password anywhere. Pasting your WiFi password into a site that
   uploads it is the risk to avoid.

## Why some WiFi QR codes expire (and ours don't)

Here's a trap with "free WiFi QR" sites: some encode a **redirect through their own domain** instead of
the WiFi credentials directly. The QR points at `their-tracking-site.com/xyz`, which then hands over the
network details — so every scan pings their server, they can track usage, and **the code stops working
the day they shut the service down or change their pricing.**

Encoding the `WIFI:` string *directly* into the code avoids all of that: there's no middleman, nothing
to track, and the code can't expire. That's how the
[WiFi QR generator](/generate/wifi-qr-code-generator/) works — and the same principle applies to the
[vCard contact QR](/generate/vcard-qr-code-generator/) and the other data-type QR tools.

## Quick summary

A WiFi QR code encodes `WIFI:T:WPA;S:name;P:password;;`, which iOS 11+ and Android 10+ read to join a
network with no typing. Escape any `\ ; , : "` in the name or password, remember the code contains the
password (so use a guest network for public display), and prefer a tool that encodes the credentials
*directly* — generated in your browser — so the code never expires and your password is never uploaded.
Make one with the [WiFi QR code generator](/generate/wifi-qr-code-generator/).

*Sources: the de-facto `WIFI:` URI scheme supported by iOS and Android camera apps; general QR-code
(ISO/IEC 18004) and networking practice. Educational information — not a substitute for your network's
own security policy.*
