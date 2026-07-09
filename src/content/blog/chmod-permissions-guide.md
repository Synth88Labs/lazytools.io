---
title: "chmod 755 Explained: Unix File Permissions Without the Guesswork"
description: "What chmod 755 actually means, how the numbers work (read=4, write=2, execute=1), the difference between 644 and 755, when to use 600, and why chmod 777 is almost always the wrong fix. With the setuid/setgid/sticky bits explained."
pubDate: 2026-07-10
updatedDate: 2026-07-10
archetype: explainer
tools: ["/network/chmod-calculator/", "/network/cron-expression-parser/"]
keywords:
  - chmod 755
  - chmod calculator
  - unix file permissions
  - chmod 644 vs 755
  - what does chmod 777 do
  - linux permissions explained
  - file permissions octal
heroImage: /blog/chmod-permissions-guide.png
heroAlt: "chmod 755 explained — Unix file permissions and the octal numbers"
faqs:
  - q: "What does chmod 755 mean?"
    a: "It sets read+write+execute for the owner (7 = 4+2+1), and read+execute for the group and everyone else (5 = 4+1). In symbolic form that's rwxr-xr-x. It's the standard permission for directories and for programs that others may run but not modify."
  - q: "How do the chmod numbers work?"
    a: "Each of the three digits is a sum of three permission bits: read = 4, write = 2, execute = 1. So 7 is all three (rwx), 6 is read+write (rw-), 5 is read+execute (r-x), 4 is read only (r--), 0 is none. The three digits set permissions for owner, group and others in that order."
  - q: "What's the difference between 644 and 755?"
    a: "644 (rw-r--r--) has no execute bit — right for ordinary files like documents, images and config. 755 (rwxr-xr-x) adds execute for everyone — needed for programs and for directories, where the execute bit means 'permission to enter the directory', not 'permission to run it'."
  - q: "What does chmod 777 do, and should I use it?"
    a: "777 grants read, write and execute to everyone — the file becomes world-writable. It's almost always the wrong fix: on a shared server it lets any other account modify your file, and 'it only works with 777' usually means the real problem is ownership, solved with chown rather than loosening permissions for all."
  - q: "When should I use chmod 600?"
    a: "For private files that only the owner should read or write, with no access for anyone else — most importantly SSH private keys, which SSH refuses to use if they're readable by others. 600 is rw------- : read+write for you, nothing for group or others."
  - q: "What are the setuid, setgid and sticky bits?"
    a: "An optional fourth leading digit. Setuid (4) runs an executable as its owner; setgid (2) runs it as its group, and on a directory makes new files inherit that group. The sticky bit (1) on a shared directory like /tmp (mode 1777) lets only a file's owner delete it. So 4755 is 755 plus setuid."
draft: false
---

**`chmod 755` sets `rwxr-xr-x` — full control for the owner, read-and-execute for everyone else —
and once you know that each digit is just read (4) + write (2) + execute (1) added up, every chmod
number reads itself.** Build any permission by clicking the read/write/execute boxes, or type a
number and see what it grants, with the
[chmod calculator](/network/chmod-calculator/); here's the whole system in five minutes.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>read = 4, write = 2, execute = 1</strong> — each digit is their sum</li>
<li><strong>Three digits</strong> = owner, group, others (in that order)</li>
<li><strong>755</strong> = rwxr-xr-x (directories, programs) · <strong>644</strong> = rw-r--r-- (files) · <strong>600</strong> = private</li>
<li><strong>On a directory, execute means "enter",</strong> not "run"</li>
<li><strong>777 is a smell</strong> — the real fix is usually <code>chown</code>, not world-write</li>
</ul>
</aside>

## The number is a sum

Unix gives every file three sets of permissions — for the **owner**, the **group**, and **others**
(everyone else) — and each set has three bits: read, write, execute. The chmod number encodes them
with a simple trick: read is worth 4, write 2, execute 1, and each digit is whatever you add up.

<figure>
<img src="/blog/infographic-chmod.svg" alt="Infographic: read equals 4, write equals 2, execute equals 1, and each chmod digit is their sum; 7 is rwx, 5 is r-x, 6 is rw-, 4 is r--, 0 is none; chmod 755 breaks into 7 for the owner (rwx), 5 for group (r-x) and 5 for others (r-x), shown as -rwxr-xr-x in ls -l; common values are 644 for files, 755 for directories and programs, 600 for private files, and 777 world-writable to avoid; on a directory execute means enter not run, and 'only works with 777' usually means the real fix is chown" width="1200" height="640" loading="lazy" />
<figcaption>Every chmod number is read+write+execute, summed per user class.</figcaption>
</figure>

So the digit tells you the permissions at a glance:

| Digit | Bits | Meaning |
|---|---|---|
| 7 | 4+2+1 | rwx — read, write, execute |
| 6 | 4+2 | rw- — read, write |
| 5 | 4+1 | r-x — read, execute |
| 4 | 4 | r-- — read only |
| 0 | — | --- — no access |

Read `chmod 755` left to right: owner `7` (rwx), group `5` (r-x), others `5` (r-x) → `-rwxr-xr-x`,
which is exactly what `ls -l` prints. The [calculator](/network/chmod-calculator/) converts both
ways live — tick the boxes to get the number, or type the number to light up the boxes.

## The values you'll actually type

In practice a handful of modes cover almost everything:

- **`644` (rw-r--r--)** — ordinary files: documents, images, HTML, config. Owner can edit; everyone
  can read; nobody executes. The sensible default for content.
- **`755` (rwxr-xr-x)** — directories and executables. Owner has full control; others can read and
  execute. **Directories need the execute bit** — on a directory, "execute" means *permission to
  enter it and access what's inside*, not "run it as a program".
- **`600` (rw-------)** — private files. Only the owner can read or write; nobody else sees it. This
  is mandatory for **SSH private keys** — `ssh` refuses to use a key file that others can read.
- **`700` (rwx------)** — a private directory, entering and listing restricted to the owner.

## Why `chmod 777` is a red flag

`777` grants read, write *and* execute to everyone — the file is now world-writable. It's the
classic "just make it work" move, and it's almost always wrong:

- On any shared host, world-writable means *any other account* — including a compromised one — can
  overwrite your file. It's a genuine security hole, and it's why web servers and many tools refuse
  to run scripts that are group- or world-writable.
- When something "only works with 777", the actual problem is usually **ownership**, not
  permissions. The web server runs as a different user than the one who uploaded the files, so the
  right fix is `chown` (change the owner to the service account) with a tight mode like `644`/`755`,
  not opening the file to the entire machine.

If you're reaching for 777, pause and ask *who* needs access — the answer is usually one specific
user or group, which `chown`/`chgrp` plus 644/755 handles cleanly.

## The fourth digit: setuid, setgid, sticky

chmod modes sometimes have a **leading fourth digit** for special bits:

- **Setuid (4)** — an executable runs with the permissions of its *owner*, not the user launching
  it. `passwd` uses this so ordinary users can update the root-owned password file. `4755` is 755
  plus setuid.
- **Setgid (2)** — runs as the file's *group*; on a directory, new files inside inherit that group,
  which is handy for shared project folders.
- **Sticky bit (1)** — on a shared-writable directory like `/tmp` (mode `1777`), it restricts
  deletion so **only a file's owner can remove it**, even though everyone can write there.

These are powerful and occasionally dangerous (a setuid-root binary with a bug is a privilege
escalation), so use them deliberately. The [chmod calculator](/network/chmod-calculator/) includes
the special bits and shows how, say, `4755` differs from `755` in the symbolic string (the `x`
becomes `s`).

## Quick summary

chmod permissions are three sets — owner, group, others — of read (4), write (2), execute (1),
summed into each digit. `755` (rwxr-xr-x) is the norm for directories and programs, `644` for files,
`600` for private keys; the execute bit on a directory means "enter", not "run". Treat `777` as a
warning sign that the real fix is ownership. Convert any mode both ways, special bits included, with
the [chmod calculator](/network/chmod-calculator/) — and while you're automating server tasks, the
[cron expression parser](/network/cron-expression-parser/) does the same demystifying for schedules.

*Sources: [GNU coreutils — chmod manual](https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html) ·
[Linux man-pages — chmod(1) and chmod(2)](https://man7.org/linux/man-pages/man1/chmod.1.html) ·
[Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html).*
