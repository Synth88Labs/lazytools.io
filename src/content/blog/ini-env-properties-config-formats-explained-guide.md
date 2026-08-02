---
title: "INI vs .env vs .properties: Three Config Formats Explained (and How to Convert Them to JSON)"
description: "INI, .env and Java .properties all store key=value config, but their rules differ in ways that trip up parsers. Here's how each one works, where they're used, and how to convert any of them to JSON in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/ini-env-properties-config-formats-explained-guide.png
heroAlt: "Side-by-side of INI sections, .env KEY=value pairs and Java .properties, each converting to the same JSON object"
tools: ["/file/ini-to-json/", "/file/env-to-json/", "/file/properties-to-json/"]
keywords:
  - ini vs env vs properties
  - config file formats
  - ini to json
  - env to json
  - java properties to json
  - what is a .env file
faqs:
  - q: "What's the difference between INI, .env and .properties files?"
    a: "All three store key=value configuration as plain text, but they differ in structure and rules. INI groups keys under [section] headers. A .env (dotenv) file is a flat list of KEY=value environment variables, often with an 'export' prefix and quoted values. Java .properties is also flat but allows ':' or whitespace as the separator, line continuations with a trailing backslash, and \\uXXXX Unicode escapes. Those differences matter when you parse them."
  - q: "How do I convert an INI or .env file to JSON?"
    a: "Paste the file into the matching converter (INI to JSON, .env to JSON, or .properties to JSON). Each reads the format's specific rules — sections, quotes, comments, escapes — and outputs an equivalent JSON object you can copy or download. Because it's all client-side, the file never leaves your browser."
  - q: "Why is a .env value like DEBUG=true a string, not a boolean, in the JSON?"
    a: "Because environment variables and INI/properties values are untyped text on disk — there's no boolean or number type in the format. Faithful converters keep every value as a string (\"true\", \"8080\") so the conversion is lossless and reversible. Cast to a real boolean or number in your own code after loading."
  - q: "Do dotted keys like server.port become nested objects?"
    a: "Not automatically. In .properties and INI, a dot is just a character in the key name, with no standardized meaning of nesting. Keeping 'server.port' as a single flat key is unambiguous and lets you convert back to an identical file. If you want a nested tree, expand the dotted keys in your application code."
  - q: "Are .env and config files safe to paste into an online converter?"
    a: "Only if the tool is genuinely client-side. Config files — especially .env — routinely hold secrets like API keys and database passwords. The LazyTools converters run entirely in your browser and never upload the file, but you should still avoid pasting production secrets into any tool where you can't verify that, and treat the output as equally sensitive."
  - q: "Which config format should I use?"
    a: "Use whatever your framework expects: .env for Docker, Node, Python and 12-factor apps; .properties for Java and Spring Boot; INI for PHP, many Python apps and desktop tools. They're roughly equivalent in power for flat configuration — the choice is mostly ecosystem convention, not capability."
draft: false
---

**INI, `.env` and Java `.properties` files all do the same basic job — store `key = value`
configuration as plain text — but their parsing rules differ in small ways that quietly break
naïve conversions.** Here's what separates them, and how to turn any of the three into JSON with the
[INI to JSON](/file/ini-to-json/), [.env to JSON](/file/env-to-json/) and
[.properties to JSON](/file/properties-to-json/) converters.

## The same idea, three dialects

Every one of these formats is a list of names paired with values. What differs is **structure**
(flat vs. grouped), the **separator**, and the **escaping rules**. Get those wrong and you'll read a
port number into the wrong key or lose a backslash in a Windows path.

| | INI | .env (dotenv) | Java .properties |
|---|---|---|---|
| **Used by** | php.ini, desktop.ini, Python/PHP apps | Docker, Node, Python, 12-factor apps | Spring Boot, Java, resource bundles |
| **Structure** | `[section]` groups | Flat | Flat |
| **Separator** | `=` | `=` | `=`, `:` or whitespace |
| **Comments** | `;` or `#` | `#` | `#` or `!` |
| **Quoting** | Optional `"`/`'` | `"`…`"` (escapes) / `'`…`'` (literal) | None (uses escapes) |
| **Line continuation** | No | No | Yes — trailing `\` |
| **Unicode escapes** | No | `\n` `\t` in `"` | `\uXXXX`, `\t`, `\n`, … |

## INI: sections make a shallow tree

INI is the format with `[section]` headers. Keys written before any header sit at the top level; each
`[section]` starts a group:

```ini
title = LazyTools
[server]
host = localhost
port = 8080
```

Converted to JSON, sections become nested objects:

```json
{ "title": "LazyTools", "server": { "host": "localhost", "port": "8080" } }
```

INI's model is deliberately **one level deep** — there's no universal syntax for nested sections. Note
`port` comes out as the string `"8080"`: INI is untyped, so a faithful converter never guesses types.

## .env: a flat list of secrets

A `.env` file is what dotenv loaders (Node, Python, Docker Compose) read into environment variables.
It's flat, and it has a few quirks worth knowing:

```bash
export DB_HOST=localhost
GREETING="hello world"
LITERAL='no $expansion'
# a comment
```

- A leading **`export `** is ignored (it's there so the file also works when `source`d in a shell).
- **Double quotes** allow spaces and expand `\n`, `\t`; **single quotes** are taken literally.
- An unquoted value's trailing `# comment` is trimmed.

> **Security note:** `.env` files are where API keys and database passwords live. That's exactly why the
> [.env to JSON](/file/env-to-json/) converter is 100% in-browser — the file is never uploaded — and
> why you should be wary of any config tool that isn't.

## .properties: the fiddly one

Java `.properties` (Spring Boot's `application.properties`, i18n bundles) looks simple but has the most
rules. The separator can be `=`, `:`, **or whitespace**; a line ending in a backslash **continues** onto
the next; and `\uXXXX` escapes decode to Unicode:

```properties
server.host = localhost
server.port : 8080
greeting = Hello, \
           World
message = café
```

becomes:

```json
{ "server.host": "localhost", "server.port": "8080",
  "greeting": "Hello, World", "message": "café" }
```

Two things trip people up. First, the **continuation** joins `Hello,` and `World` into one value.
Second, `server.host` stays a **flat key** — the dot is just part of the name. Turning it into
`{ server: { host } }` would be a guess that breaks the round-trip back to a `.properties` file, so the
converter keeps it literal. Expand dotted keys in your own code if you want a tree.

## Why convert to JSON at all?

JSON is the lingua franca of tooling: once your INI, `.env` or `.properties` is a JSON object you can
diff two environments, feed a script that expects JSON, validate against a schema, or just read it more
easily. Each LazyTools converter has a matching reverse tool
([JSON to INI](/file/json-to-ini/), [JSON to .env](/file/json-to-env/),
[JSON to .properties](/file/json-to-properties/)) so you can round-trip in either direction.

All six run entirely in your browser — nothing is uploaded, and they work offline — which matters
because config files so often carry the keys to everything else.
