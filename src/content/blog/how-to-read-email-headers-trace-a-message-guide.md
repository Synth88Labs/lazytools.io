---
title: "How to Read Email Headers and Trace a Message's Path"
description: "Every email carries a hidden trail of headers showing exactly which servers handled it and whether it passed SPF, DKIM and DMARC. Here's how to read them, spot a spoof, and analyze the delivery path in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/how-to-read-email-headers-trace-a-message-guide.png
heroAlt: "An email's Received headers forming a delivery path with SPF, DKIM and DMARC authentication results"
tools: ["/dev/email-header-analyzer/"]
keywords:
  - how to read email headers
  - trace email path
  - received headers explained
  - spf dkim dmarc
  - is this email spoofed
  - email header analyzer
faqs:
  - q: "How do I see an email's full headers?"
    a: "It depends on the client. In Gmail, open the message, click the three-dot menu and choose 'Show original'. In Outlook, open the message and use File → Properties (or 'View message source'). In Apple Mail, use View → Message → Raw Source. Each shows the full headers plus the raw message; copy from the top down to the first blank line to get just the headers."
  - q: "What are Received headers?"
    a: "Each mail server that handles a message adds a 'Received' header at the very top recording where it got the message from and which server it is. Reading them from the bottom up traces the message's path from sender to your inbox. They're the most reliable part of the header for tracing, because each trusted server adds its own."
  - q: "Why are Received headers in reverse order?"
    a: "Because each server prepends its header to the top, the newest hop (the last server, closest to you) is listed first and the original sender's server is at the bottom. To read the delivery path chronologically, start at the bottom and work up — which is what an analyzer does for you."
  - q: "What do SPF, DKIM and DMARC results mean in the headers?"
    a: "They're the receiving server's verdict on whether the message is authentic. SPF checks the sending server was authorized for the domain; DKIM checks a cryptographic signature proving the message wasn't altered and came from the signing domain; DMARC ties those to the visible From address and says what to do on failure. 'pass' is good; 'fail' or 'softfail' on a message claiming to be from a real brand is a red flag."
  - q: "Can I tell if an email is spoofed from the headers?"
    a: "Often, yes. Check whether SPF, DKIM and DMARC passed, and whether the DKIM signing domain (d=) and the Return-Path match the visible From address. A From that says a bank but a Return-Path and failing DMARC pointing elsewhere is a classic spoof. Remember the From line itself is trivially forgeable — that's exactly why the authentication results matter."
  - q: "Is it safe to analyze email headers online?"
    a: "Headers contain addresses and sometimes internal hostnames, so prefer a tool that works locally. The LazyTools Email Header Analyzer parses everything in your browser and never uploads the headers, so that information stays on your device — unlike services that send your headers to a server."
draft: false
---

**Every email that reaches you carries a hidden audit trail — a stack of headers recording exactly which
servers handled it, when, and whether it passed authentication.** Learning to read them is how you trace
where a message really came from and tell a genuine email from a spoof. Here's the guide, plus the
[Email Header Analyzer](/dev/email-header-analyzer/) to do it for you.

## First, how to see the headers

The body of an email is only half of it. To see the headers:

- **Gmail:** open the message → three-dot menu → **Show original**.
- **Outlook:** open the message → **File → Properties**, or "View message source".
- **Apple Mail:** **View → Message → Raw Source**.

You'll get a block of `Name: value` lines ending at the first blank line (the body follows). That block is
what you analyze.

## The Received headers: the delivery path

The most useful headers are the **`Received`** lines. Each mail server that touches a message stamps one
on top, so they record the whole journey — but **newest first**. The last server (closest to you) is at
the top; the original sender's server is at the bottom.

```
Received: from mx.example.com by inbox.example.com … 14:30:20   ← last hop
Received: from relay.sender.net by mx.example.com … 14:30:05
Received: from user-pc.sender.net by relay.sender.net … 14:30:00 ← first hop
```

Read from the **bottom up** to follow the path in order. Each header says `from` one host `by` another,
with a timestamp — so you can also measure the **delay at each hop**. Most are near-instant; a gap of
minutes usually means **greylisting** or a queue backlog, not a problem with your message.

## SPF, DKIM, DMARC: is it really from who it says?

Because the visible **From** line is trivially forgeable, mail relies on three checks, and the receiving
server records their results in an **`Authentication-Results`** header:

| Check | What it proves |
|---|---|
| **SPF** | The sending server was authorized to send for the envelope domain |
| **DKIM** | A cryptographic signature proves the message wasn't altered and came from the signing domain (`d=`) |
| **DMARC** | Ties SPF/DKIM to the visible From address and sets the policy on failure |

A row like `spf=pass; dkim=pass; dmarc=pass` means the receiver believed the message. A **`fail`** on
something claiming to be from a bank or a colleague is a strong spoofing signal.

> **Key point:** these results are what the receiving server recorded **at delivery time**. Reading them
> from the headers is not the same as re-running a live DNS check now — and for investigating a message you
> already received, the recorded verdict is the one that matters.

## Spotting a spoof

Put it together to sanity-check a suspicious message:

- Did **SPF/DKIM/DMARC pass**? A failure on a "trusted brand" email is a red flag.
- Does the **DKIM `d=` domain** and the **Return-Path** match the visible **From**? Mismatches are
  suspicious.
- Follow the **Received chain** — but only trust it from your own infrastructure inward. A sender can forge
  the lower `Received` lines before the message reaches a server you control.

## Analyze headers privately

Email headers hold real names, addresses and internal hostnames, so you don't want to paste them into a
random website. The [Email Header Analyzer](/dev/email-header-analyzer/) reads them entirely in your
browser: paste the headers (or drop a `.eml`) and it lays out the delivery path with per-hop delays, shows
the SPF/DKIM/DMARC results the receiver recorded, and pulls out the From, Return-Path, Message-ID and DKIM
signing domain — with nothing uploaded.
