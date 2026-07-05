---
title: "camelCase vs snake_case vs kebab-case: Which Naming Case Goes Where"
description: "JavaScript uses camelCase, Python snake_case, URLs and CSS kebab-case, classes PascalCase, constants CONSTANT_CASE. The full convention map, why URLs prefer hyphens, and how to convert between them."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/text/case-converter/", "/text/slug-generator/"]
keywords:
  - camelcase vs snake case
  - kebab case
  - naming conventions programming
  - pascalcase
  - case converter
  - url slug hyphens or underscores
  - variable naming conventions
  - constant case
heroImage: /blog/naming-cases-guide.png
heroAlt: "Naming case conventions — camelCase for JavaScript, snake_case for Python, kebab-case for URLs"
faqs:
  - q: "What is the difference between camelCase and PascalCase?"
    a: "Only the first letter: camelCase starts lowercase (userName), PascalCase starts uppercase (UserName). Convention assigns camelCase to variables and functions, PascalCase to classes, types and React components."
  - q: "Which case does Python use?"
    a: "snake_case for variables, functions and module names, PascalCase for classes, and CONSTANT_CASE for constants — all specified in PEP 8, Python's official style guide."
  - q: "Should URLs use hyphens or underscores?"
    a: "Hyphens (kebab-case). Google's documentation recommends hyphens because it treats them as word separators, while underscores can join words — my-blue-widget is parsed as three words, my_blue_widget may not be."
  - q: "Why can't CSS classes and HTML attributes use camelCase reliably?"
    a: "HTML is case-insensitive, so camelCase distinctions can be lost — which is why HTML attributes, CSS properties and classes standardized on kebab-case (font-size, aria-label)."
  - q: "What is CONSTANT_CASE (SCREAMING_SNAKE_CASE) for?"
    a: "Values that never change: constants in most languages (MAX_RETRIES) and environment variables (DATABASE_URL). The visual shout signals 'do not reassign'."
  - q: "How do I convert a whole list of identifiers between cases?"
    a: "Paste them into the case converter one per line and pick the target case — it splits on spaces, hyphens, underscores and existing capital boundaries, so camelCase input converts to snake_case correctly."
draft: false
---

**The convention map is short: camelCase for JavaScript/Java variables, snake_case for Python and SQL,
kebab-case for URLs and CSS, PascalCase for classes, CONSTANT_CASE for constants.** Follow it and your
code reads like everyone else's — cross it and every code review starts with the same comment. Convert
anything between cases in one click with the [case converter](/text/case-converter/).

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>camelCase</strong> — JS/Java variables & functions · <strong>PascalCase</strong> — classes, types, React components</li>
<li><strong>snake_case</strong> — Python (PEP 8), Ruby, SQL columns · <strong>CONSTANT_CASE</strong> — constants, env vars</li>
<li><strong>kebab-case</strong> — URLs, CSS classes, file names (HTML is case-insensitive)</li>
<li><strong>URLs: hyphens, not underscores</strong> — Google parses hyphens as word separators</li>
<li>Consistency within a codebase beats any individual convention</li>
</ul>
</aside>

## The five cases, defined

A **naming case** is a rule for writing multi-word identifiers where spaces aren't allowed:

| Case | Example | Home turf |
|---|---|---|
| camelCase | `userLoginCount` | JavaScript, Java, Swift variables & functions |
| PascalCase | `UserLoginCount` | Classes, types, C# methods, React components |
| snake_case | `user_login_count` | Python, Ruby, Rust, SQL columns |
| kebab-case | `user-login-count` | URLs, CSS classes, HTML attributes, file names |
| CONSTANT_CASE | `USER_LOGIN_COUNT` | Constants, environment variables |

<figure>
<img src="/blog/infographic-naming-cases.svg" alt="Infographic: the phrase 'user login count' written five ways — userLoginCount (camelCase, JavaScript), user_login_count (snake_case, Python/SQL), user-login-count (kebab-case, URLs and CSS), UserLoginCount (PascalCase, classes), USER_LOGIN_COUNT (constants) — with the note that Google treats hyphens as word separators" width="1200" height="620" loading="lazy" />
<figcaption>One identifier, five outfits — the outfit tells readers what kind of thing it is.</figcaption>
</figure>

## Why each ecosystem picked its case

These aren't arbitrary tastes — each convention solves a local problem:

- **JavaScript/Java (camelCase):** inherited from Smalltalk-era style; the lowercase start visually
  separates variables from PascalCase classes at a glance.
- **Python (snake_case):** PEP 8 chose underscores for readability — `user_login_count` parses faster
  for humans than `userLoginCount`, and Python's culture prizes readability above brevity.
- **CSS/HTML (kebab-case):** HTML is case-insensitive, so `fontSize` and `fontsize` collide — hyphens
  sidestep the problem entirely, which is why CSS properties (`font-size`) and ARIA attributes
  (`aria-label`) are hyphenated.
- **SQL (snake_case):** many databases fold unquoted identifiers to one case, destroying camelCase
  distinctions; underscores survive.
- **Constants (CONSTANT_CASE):** the all-caps shout is a warning label — "this value never changes."

The one **hard rule with SEO consequences** sits in URLs: Google's documentation has long recommended
hyphens over underscores in URLs because hyphens are treated as word separators while underscores can
join words. `/my-blue-widget/` reads as three words; `/my_blue_widget/` may read as one. That's why the
[slug generator](/text/slug-generator/) defaults to hyphens.

## Converting between cases (without retyping)

The [case converter](/text/case-converter/) splits input on spaces, hyphens, underscores **and existing
capital-letter boundaries** — so conversions work in every direction:

1. Paste `userLoginCount` → pick snake_case → `user_login_count` (moving JS logic to Python).
2. Paste `Blog Post Title Here` → pick kebab-case → `blog-post-title-here` (or use the dedicated
   [slug generator](/text/slug-generator/), which also strips accents and symbols).
3. Paste a whole column of identifiers, one per line — each converts independently.

**Worked example** — migrating a JS config to environment variables: `apiBaseUrl` → CONSTANT_CASE →
`API_BASE_URL`. One paste, one click, no typos.

## Common naming-case mistakes

1. **Mixing cases in one codebase** — `getUser()` next to `fetch_user()` costs every future reader a
   double-take. Match whatever the file already does.
2. **Underscored URLs** — `/blog_post_title/` hurts both consistency and how search engines parse the
   words. Hyphens, always.
3. **camelCase CSS classes** — they work until someone's tooling lowercases them. Kebab-case is the
   ecosystem norm.
4. **Renaming halfway** — converting `user_id` to `userId` in some files but not the query layer
   creates the classic "works locally" bug. Convert systematically (the
   [find & replace tool](/text/find-and-replace/) with match-case on helps audit).
5. **Acronym ambiguity** — `parseHTMLString` vs `parseHtmlString`: pick one treatment of acronyms and
   stick to it; most modern style guides prefer `Html`.

## Quick summary

Match the ecosystem: **camelCase** in JavaScript, **snake_case** in Python and SQL, **kebab-case** in
URLs and CSS, **PascalCase** for classes, **CONSTANT_CASE** for constants — and hyphens in URLs are an
SEO-grade rule, not a preference. For any conversion, the
[case converter](/text/case-converter/) handles all five (plus a few joke ones), and the
[slug generator](/text/slug-generator/) covers the URL case end-to-end.

*Related: [character counter](/text/character-counter/) for length limits on the names ·
[find & replace](/text/find-and-replace/) for codebase-wide renames.*
