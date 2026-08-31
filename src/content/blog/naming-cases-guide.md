---
title: "camelCase vs snake_case vs kebab-case: Which Naming Case Goes Where"
seoTitle: 'camelCase vs snake_case vs kebab-case'
description: "camelCase for JavaScript, snake_case for Python, kebab-case for URLs and CSS, PascalCase for classes, the full naming-case map and converter."
pubDate: 2026-07-05
updatedDate: 2026-08-23
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
heroAlt: "Naming case conventions, camelCase for JavaScript, snake_case for Python, kebab-case for URLs"
faqs:
  - q: "What is the difference between camelCase and PascalCase?"
    a: "Only the first letter: camelCase starts lowercase (userName), PascalCase starts uppercase (UserName). Convention assigns camelCase to variables and functions, PascalCase to classes, types and React components."
  - q: "Which case does Python use?"
    a: "snake_case for variables, functions and module names, PascalCase for classes, and CONSTANT_CASE for constants, all specified in PEP 8, Python's official style guide."
  - q: "Should URLs use hyphens or underscores?"
    a: "Hyphens (kebab-case). Google's documentation recommends hyphens because it treats them as word separators, while underscores can join words, my-blue-widget is parsed as three words, my_blue_widget may not be."
  - q: "Why can't CSS classes and HTML attributes use camelCase reliably?"
    a: "HTML is case-insensitive, so camelCase distinctions can be lost, which is why HTML attributes, CSS properties and classes standardized on kebab-case (font-size, aria-label)."
  - q: "What is CONSTANT_CASE (SCREAMING_SNAKE_CASE) for?"
    a: "Values that never change: constants in most languages (MAX_RETRIES) and environment variables (DATABASE_URL). The visual shout signals 'do not reassign'."
  - q: "How do I convert a whole list of identifiers between cases?"
    a: "Paste them into the case converter one per line and pick the target case. It splits on spaces, hyphens, underscores and existing capital boundaries, so camelCase input converts to snake_case correctly."
draft: false
---

**The convention map is short: camelCase for JavaScript/Java variables, snake_case for Python and SQL,
kebab-case for URLs and CSS, PascalCase for classes, CONSTANT_CASE for constants.** Follow it and your
code reads like everyone else's, cross it and every code review starts with the same comment. Convert
anything between cases in one click with the [case converter](/text/case-converter/).

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>camelCase</strong>, JS/Java variables & functions · <strong>PascalCase</strong>, classes, types, React components</li>
<li><strong>snake_case</strong>, Python (PEP 8), Ruby, SQL columns · <strong>CONSTANT_CASE</strong>, constants, env vars</li>
<li><strong>kebab-case</strong>, URLs, CSS classes, file names (HTML is case-insensitive)</li>
<li><strong>URLs: hyphens, not underscores</strong>, Google parses hyphens as word separators</li>
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
<img src="/blog/infographic-naming-cases.svg" alt="Infographic: the phrase 'user login count' written five ways, userLoginCount (camelCase, JavaScript), user_login_count (snake_case, Python/SQL), user-login-count (kebab-case, URLs and CSS), UserLoginCount (PascalCase, classes), USER_LOGIN_COUNT (constants), with the note that Google treats hyphens as word separators" width="1200" height="620" loading="lazy" />
<figcaption>One identifier, five outfits, the outfit tells readers what kind of thing it is.</figcaption>
</figure>

## Why each ecosystem picked its case

These aren't arbitrary tastes, each convention solves a local problem:

- **JavaScript/Java (camelCase):** inherited from Smalltalk-era style; the lowercase start visually
  separates variables from PascalCase classes at a glance.
- **Python (snake_case):** [PEP 8](https://peps.python.org/pep-0008/), Python's official style guide,
  chose underscores for readability, `user_login_count` parses faster for humans than
  `userLoginCount`, and Python's culture prizes readability above brevity.
- **CSS/HTML (kebab-case):** HTML is case-insensitive, so `fontSize` and `fontsize` collide, hyphens
  sidestep the problem entirely, which is why CSS properties (`font-size`) and ARIA attributes
  (`aria-label`) are hyphenated.
- **SQL (snake_case):** many databases fold unquoted identifiers to one case, destroying camelCase
  distinctions; underscores survive.
- **Constants (CONSTANT_CASE):** the all-caps shout is a warning label, "this value never changes."

The one **hard rule with SEO consequences** sits in URLs:
[Google's URL-structure documentation](https://developers.google.com/search/docs/crawling-indexing/url-structure)
recommends hyphens over underscores because hyphens are treated as word separators while underscores
can join words. `/my-blue-widget/` reads as three words; `/my_blue_widget/` may read as one. That's why the
[slug generator](/text/slug-generator/) defaults to hyphens.

## A language-by-language cheat sheet

Most of the confusion comes from switching languages mid-project. Each language's style guide fixes a
default for each *role*, a variable is cased differently from a class, which is cased differently from a
constant. This table collapses the guidance from the major style guides into one place:

| Language | Variables / functions | Types / classes | Constants |
|---|---|---|---|
| JavaScript / TypeScript | `camelCase` | `PascalCase` | `CONSTANT_CASE` |
| Python (PEP 8) | `snake_case` | `PascalCase` | `CONSTANT_CASE` |
| Java | `camelCase` | `PascalCase` | `CONSTANT_CASE` |
| C# | `PascalCase` (methods, properties) | `PascalCase` | `PascalCase` |
| Go | `camelCase` (unexported), `PascalCase` (exported) | `PascalCase` | `PascalCase` |
| Rust | `snake_case` | `PascalCase` | `CONSTANT_CASE` |
| Ruby | `snake_case` | `PascalCase` | `CONSTANT_CASE` |
| SQL (common) | `snake_case` |, |, |
| CSS / HTML | `kebab-case` |, |, |

A few rows surprise people. In **C#**, even public methods and properties are PascalCase, there's no
camelCase for members, which trips up developers arriving from Java. In **Go**, casing is not cosmetic: a
leading capital letter is what *exports* an identifier from its package, so `PascalCase` versus `camelCase`
changes visibility, not just style. And Go leans on `MixedCaps` rather than underscores throughout, even
for what other languages would write as `CONSTANT_CASE`.

## Handling acronyms and numbers

The single messiest corner of casing is acronyms. Is it `parseJSON`, `parseJson`, `ParseHTMLDocument`, or
`ParseHtmlDocument`? There is no universal answer, but there is a dominant modern practice: **treat an
acronym as an ordinary word** and case only its first letter. So `Html`, `Url`, `Id`, and `Json`, giving
`parseHtmlDocument`, `userId`, `apiUrl`. Microsoft's .NET guidelines codify exactly this: acronyms of three
or more letters use only an initial capital.

The reason is mechanical, not aesthetic. Runs of capitals break automatic case conversion. A splitter that
turns `HTMLParser` into words has to guess where `HTML` ends and `Parser` begins, and most guess wrong at
least some of the time, `HTMLParser` can split as `HTML Parser` or `HTM LParser` depending on the rule.
Writing `HtmlParser` removes the ambiguity: every capital is a clean word boundary. Numbers are easier, keep them attached to the word they modify (`utf8Decode`, `oauth2Token`) and let the converter treat the
digit run as part of the preceding token.

## Converting between cases (without retyping)

The [case converter](/text/case-converter/) splits input on spaces, hyphens, underscores **and existing
capital-letter boundaries**, so conversions work in every direction:

1. Paste `userLoginCount` → pick snake_case → `user_login_count` (moving JS logic to Python).
2. Paste `Blog Post Title Here` → pick kebab-case → `blog-post-title-here` (or use the dedicated
   [slug generator](/text/slug-generator/), which also strips accents and symbols).
3. Paste a whole column of identifiers, one per line, each converts independently.

**Worked example**, migrating a JS config to environment variables: `apiBaseUrl` → CONSTANT_CASE →
`API_BASE_URL`. One paste, one click, no typos.

The trick that makes round-trips reliable is the split step. Every conversion is really two phases: *break
the identifier into words*, then *re-join them in the target style*. Breaking is where casing tools earn
their keep, because the input can arrive in any of the five styles:

| Input | Detected boundaries | Words |
|---|---|---|
| `userLoginCount` | capital-letter transitions | user · login · count |
| `user_login_count` | underscores | user · login · count |
| `user-login-count` | hyphens | user · login · count |
| `USER_LOGIN_COUNT` | underscores | user · login · count |
| `Blog Post Title` | spaces | blog · post · title |

Because all five reduce to the same word list, any input case converts cleanly to any output case, the
target style just decides the joiner (nothing, `_`, `-`, or a space) and which letters get capitalised.
That is why you can round-trip `userLoginCount → user_login_count → user-login-count → USER_LOGIN_COUNT`
and land back where you started without losing a word boundary.

## Common naming-case mistakes

1. **Mixing cases in one codebase**, `getUser()` next to `fetch_user()` costs every future reader a
   double-take. Match whatever the file already does.
2. **Underscored URLs**, `/blog_post_title/` hurts both consistency and how search engines parse the
   words. Hyphens, always.
3. **camelCase CSS classes**. They work until someone's tooling lowercases them. Kebab-case is the
   ecosystem norm.
4. **Renaming halfway**, converting `user_id` to `userId` in some files but not the query layer
   creates the classic "works locally" bug. Convert systematically (the
   [find & replace tool](/text/find-and-replace/) with match-case on helps audit).
5. **Acronym ambiguity**, `parseHTMLString` vs `parseHtmlString`: pick one treatment of acronyms and
   stick to it; most modern style guides prefer `Html`.

## Quick summary

Match the ecosystem: **camelCase** in JavaScript, **snake_case** in Python and SQL, **kebab-case** in
URLs and CSS, **PascalCase** for classes, **CONSTANT_CASE** for constants, and hyphens in URLs are an
SEO-grade rule, not a preference. For any conversion, the
[case converter](/text/case-converter/) handles all five (plus a few joke ones), and the
[slug generator](/text/slug-generator/) covers the URL case end-to-end.

*Related: [character counter](/text/character-counter/) for length limits on the names ·
[find & replace](/text/find-and-replace/) for codebase-wide renames.*
