import { analyzeEmail, parseHeaders, formatDelay } from '../src/lib/email-headers.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// Realistic 3-hop email (Received headers are newest-first, as in a real message).
const raw = `Delivered-To: alice@example.com
Received: from mx.example.com (mx.example.com [10.0.0.9])
        by inbox.example.com with ESMTPS id def456
        for <alice@example.com>; Wed, 21 Aug 2024 14:30:20 -0700 (PDT)
Received: from relay.sender.net (relay.sender.net [203.0.113.5])
        by mx.example.com with ESMTP id abc123
        for <alice@example.com>; Wed, 21 Aug 2024 14:30:05 -0700 (PDT)
Received: from user-pc.sender.net (user-pc.sender.net [198.51.100.7])
        by relay.sender.net with ESMTPSA id xyz789; Wed, 21 Aug 2024 14:30:00 -0700 (PDT)
Authentication-Results: mx.example.com;
        spf=pass smtp.mailfrom=bob@sender.net;
        dkim=pass header.d=sender.net;
        dmarc=pass action=none header.from=sender.net
Received-SPF: pass (mx.example.com: domain of bob@sender.net designates 203.0.113.5 as permitted sender)
DKIM-Signature: v=1; a=rsa-sha256; d=sender.net; s=selector1; h=from:to:subject; bh=abc; b=xyz
From: Bob <bob@sender.net>
To: Alice <alice@example.com>
Subject: Quarterly report
Date: Wed, 21 Aug 2024 14:29:58 -0700
Message-ID: <CADveryLong@sender.net>
Return-Path: <bob@sender.net>
X-Mailer: SuperMail 3.2
Content-Type: text/plain; charset="utf-8"

Body starts here and should be ignored.
From: this is body text not a header`;

const a = analyzeEmail(raw);

// ---- header parsing (unfolding) ----
ok('from parsed', a.from === 'Bob <bob@sender.net>');
ok('subject parsed', a.subject === 'Quarterly report');
ok('messageId', a.messageId === '<CADveryLong@sender.net>');
ok('return-path', a.returnPath === '<bob@sender.net>');
ok('mailer', a.mailer === 'SuperMail 3.2');
ok('body not parsed as header', !a.headers.some((h) => h.value.startsWith('this is body text')));

// ---- Received hops chronological with delays ----
ok('3 hops', a.hops.length === 3);
ok('hop1 oldest = user-pc', a.hops[0]!.from === 'user-pc.sender.net');
ok('hop3 newest = mx', a.hops[2]!.from === 'mx.example.com');
ok('hop1 by relay', a.hops[0]!.by === 'relay.sender.net');
ok('hop1 no delay (first)', a.hops[0]!.delaySec === null);
ok('hop2 delay 5s', a.hops[1]!.delaySec === 5);   // 14:30:00 → 14:30:05
ok('hop3 delay 15s', a.hops[2]!.delaySec === 15);  // 14:30:05 → 14:30:20
ok('total transit 20s', a.totalTransitSec === 20);
ok('hop with ESMTP', a.hops[1]!.with === 'ESMTP');
ok('hop id parsed', a.hops[0]!.id === 'xyz789');

// ---- authentication results (already present, not re-checked) ----
ok('spf pass', a.auth.spf === 'pass');
ok('dkim pass', a.auth.dkim === 'pass');
ok('dmarc pass', a.auth.dmarc === 'pass');
ok('received-spf present', a.receivedSpf!.startsWith('pass'));
ok('dkim signature domain', a.dkimSignatures[0]!.domain === 'sender.net');
ok('dkim selector', a.dkimSignatures[0]!.selector === 'selector1');

// ---- formatDelay ----
ok('formatDelay 5s', formatDelay(5) === '5s');
ok('formatDelay 90s', formatDelay(90) === '1m 30s');
ok('formatDelay null', formatDelay(null) === '—');
ok('formatDelay negative = skew', formatDelay(-3).includes('skew'));

// ---- fail results detected ----
const failRaw = `Authentication-Results: mx.x.com; spf=fail; dkim=none; dmarc=fail\nFrom: x@y.com\nSubject: t\n\nbody`;
const fa = analyzeEmail(failRaw);
ok('spf fail detected', fa.auth.spf === 'fail');
ok('dkim none detected', fa.auth.dkim === 'none');

// ---- empty rejection ----
let threw = false; try { analyzeEmail('\n\njust a body, no headers'); } catch { threw = true; }
ok('rejects no headers', threw);
ok('parseHeaders count', parseHeaders(raw).length >= 12);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
