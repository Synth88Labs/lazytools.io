---
title: "How to Convert a curl Command to JavaScript fetch()"
description: "A curl command maps cleanly onto fetch(): -X becomes method, each -H becomes a headers entry, and -d becomes the body. Here's the mapping, the gotchas, and a converter that does it in your browser — nothing uploaded."
pubDate: 2026-08-01
updatedDate: 2026-08-01
archetype: explainer
heroImage: /blog/curl-to-javascript-fetch-guide.png
heroAlt: "How a curl command maps to a JavaScript fetch call — -X to method, -H to headers, -d to body"
tools: ["/dev/curl-to-code/"]
keywords:
  - curl to fetch
  - curl to javascript
  - convert curl to fetch
  - curl command to fetch
  - curl -d to fetch body
  - curl headers to fetch
  - copy as curl to javascript
faqs:
  - q: "How do I convert a curl command to fetch()?"
    a: "Map each curl flag to its fetch equivalent: -X/--request becomes the method option, every -H/--header becomes an entry in the headers object, and -d/--data becomes the body. If there's a body but no -X, the method is POST. The LazyTools curl to fetch converter does this automatically in your browser — paste the command and copy the fetch() call."
  - q: "What does curl -d become in fetch?"
    a: "The request body. curl -d 'a=1&b=2' becomes body: \"a=1&b=2\" in fetch, and the presence of -d makes the method POST unless you set another with -X. Multiple -d flags are joined with & just as curl does. For form data, a Content-Type of application/x-www-form-urlencoded is assumed unless you set one with -H."
  - q: "How do curl headers map to fetch?"
    a: "Each -H \"Name: value\" becomes a key/value pair in the fetch headers object: -H \"Authorization: Bearer abc\" becomes headers: { \"Authorization\": \"Bearer abc\" }. The header name is everything before the first colon and the value is everything after it, trimmed."
  - q: "How does curl -u (basic auth) translate to fetch?"
    a: "curl -u user:pass sends HTTP Basic authentication, which in fetch is an Authorization header: Authorization: Basic <base64 of user:pass>. The converter base64-encodes the credentials and adds that header for you, since fetch has no direct -u equivalent."
  - q: "Which curl features don't convert to fetch?"
    a: "Multipart file uploads (-F), cookie jars (-c/-b to files), and client certificates don't map cleanly onto a single fetch() call and are left out deliberately. The everyday flags from API docs and the browser's Copy as cURL — method, headers, JSON or form body, and basic auth — all convert."
  - q: "Is my curl command uploaded when I convert it?"
    a: "Not with the LazyTools converter. It parses the command entirely in your browser, so any API keys, bearer tokens or credentials in the command never leave your device. It also works offline."
draft: false
---

**A curl command maps almost one-to-one onto a JavaScript `fetch()` call: `-X` sets the `method`,
each `-H` becomes an entry in the `headers` object, and `-d` becomes the `body` — with the method
defaulting to `POST` whenever a body is present.** Once you know that mapping, translating the curl
snippets in API docs (or your browser's "Copy as cURL") into `fetch()` is mechanical. Paste one into
the [curl to fetch converter](/dev/curl-to-code/) and it does the translation in your browser, so any
tokens in the command stay on your machine.

## The core mapping

| curl flag | fetch equivalent |
|---|---|
| `-X POST` / `--request POST` | `method: "POST"` |
| `-H "Name: value"` | an entry in `headers: { … }` |
| `-d '…'` / `--data '…'` | `body: "…"` (and implies `POST`) |
| `-u user:pass` | `Authorization: Basic <base64>` header |
| the URL | first argument to `fetch()` |
| (no `-X`, but has `-d`) | `method: "POST"` |
| (no `-X`, no `-d`) | `method: "GET"` |

Everything else in a typical command — `-L`, `--compressed`, `-s`, `-k` — is about how curl itself
behaves and has no bearing on the request `fetch()` makes, so it's dropped.

## A worked example

Take a command straight from an API doc:

```bash
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"user":"ada","pass":"secret"}'
```

Applying the mapping gives:

```js
fetch("https://api.example.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: "{\"user\":\"ada\",\"pass\":\"secret\"}"
})
  .then((res) => res.json())
  .then(console.log);
```

The URL moves to the first argument, the header becomes a `headers` entry, and the `-d` payload
becomes the `body` string.

<figure class="my-8">
<svg viewBox="0 0 1200 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="curl flags map to fetch options: -X to method, -H to headers, -d to body, URL to the first argument" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" fill="#0f172a">curl → fetch(), flag by flag</text>

  <!-- left: curl -->
  <rect x="60" y="110" width="480" height="360" rx="16" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
  <text x="300" y="152" text-anchor="middle" font-family="ui-monospace,monospace" font-size="26" font-weight="800" fill="#334155">curl</text>
  <text x="90" y="215" font-family="ui-monospace,monospace" font-size="24" fill="#0f172a">-X POST</text>
  <text x="90" y="285" font-family="ui-monospace,monospace" font-size="24" fill="#0f172a">-H "Accept: …"</text>
  <text x="90" y="355" font-family="ui-monospace,monospace" font-size="24" fill="#0f172a">-d '{ … }'</text>
  <text x="90" y="425" font-family="ui-monospace,monospace" font-size="24" fill="#0f172a">https://api…</text>

  <!-- arrows -->
  <text x="575" y="215" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#10b981">→</text>
  <text x="575" y="285" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#10b981">→</text>
  <text x="575" y="355" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#10b981">→</text>
  <text x="575" y="425" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" fill="#10b981">→</text>

  <!-- right: fetch -->
  <rect x="660" y="110" width="480" height="360" rx="16" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="900" y="152" text-anchor="middle" font-family="ui-monospace,monospace" font-size="26" font-weight="800" fill="#047857">fetch()</text>
  <text x="690" y="215" font-family="ui-monospace,monospace" font-size="24" fill="#065f46">method: "POST"</text>
  <text x="690" y="285" font-family="ui-monospace,monospace" font-size="24" fill="#065f46">headers: { … }</text>
  <text x="690" y="355" font-family="ui-monospace,monospace" font-size="24" fill="#065f46">body: "{ … }"</text>
  <text x="690" y="425" font-family="ui-monospace,monospace" font-size="24" fill="#065f46">fetch("https://api…")</text>
</svg>
</figure>

## The gotchas worth knowing

- **A body implies POST.** In curl, `-d` alone switches the request to `POST` — you don't need `-X POST`.
  fetch has no such default, so the converter sets `method: "POST"` for you.
- **Multiple `-d` flags join with `&`.** `curl -d name=ada -d age=36` sends `name=ada&age=36`; the same
  concatenation applies in the fetch `body`.
- **Form data gets a default Content-Type.** When you send `-d` without a `Content-Type` header, curl
  uses `application/x-www-form-urlencoded`. To send JSON, set `-H "Content-Type: application/json"`
  explicitly — otherwise your API may misread the body.
- **`-u` is base64 Basic auth.** `-u user:pass` becomes `Authorization: Basic <base64(user:pass)>`.
  Bearer tokens are just a normal header (`-H "Authorization: Bearer …"`) and carry through unchanged.

## What doesn't convert (on purpose)

Some curl features don't have a clean one-line `fetch()` equivalent:

- **`-F` multipart uploads** — these need a `FormData` object built field by field, which depends on
  where your files come from in the browser or Node.
- **Cookie jars** (`-c`/`-b` writing to files) — fetch manages cookies through the environment, not a file.
- **Client certificates** — configured at the agent/environment level, not in a `fetch()` call.

Leaving these out keeps the generated code honest rather than emitting something that looks right but
won't run.

## Why convert it in the browser

curl commands from real work carry real secrets — API keys, bearer tokens, basic-auth credentials.
A converter that sends the command to a server has just been handed those secrets. The
[curl to fetch converter](/dev/curl-to-code/) parses everything locally with a shell-aware tokenizer,
so the command — and anything sensitive in it — never leaves your browser, and it works offline.

## The bottom line

Converting curl to `fetch()` is a fixed mapping: `-X` → `method`, `-H` → `headers`, `-d` → `body`,
URL → first argument, with `POST` implied by a body. Know that and you can translate any everyday curl
command by hand — or paste it into the [converter](/dev/curl-to-code/) and copy the `fetch()` call
straight into your code.
