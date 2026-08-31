---
title: "LLM Tokens Explained: What Your Prompts Actually Cost, and Why Claude & Gemini Counts Are Estimates"
seoTitle: 'LLM Tokens Explained: What Prompts Cost'
description: "API bills are counted in tokens, not words. How tokenization works, the cost formula, why output tokens dominate, and why only OpenAI counts are exact."
pubDate: 2026-07-07
updatedDate: 2026-07-28
archetype: explainer
tools: ["/dev/llm-token-counter/"]
keywords:
  - llm tokens explained
  - token counter
  - llm api cost
  - gpt token count
  - claude token count
  - how much does the openai api cost
  - tokens vs words
  - llm cost calculator
heroImage: /blog/llm-tokens-cost-guide.png
heroAlt: "LLM tokens explained, what prompts cost and why Claude and Gemini counts are estimates"
faqs:
  - q: "What is a token?"
    a: "The unit LLMs actually process: a sub-word chunk of text produced by the model's tokenizer. In English, one token is roughly 4 characters or about three-quarters of a word, 'unbelievable' might split into un / believ / able. API usage and pricing are measured in tokens, not words."
  - q: "How do I convert words to tokens?"
    a: "As a rule of thumb, multiply words by 1.33 (or characters by 0.25) for English. But it's only a heuristic, code, non-English languages and unusual formatting tokenize very differently, which is why counting with a real tokenizer beats estimating."
  - q: "Why are output tokens so much more expensive than input?"
    a: "Generating tokens is more computationally expensive than reading them, and vendors price accordingly, output rates run 5-6× input rates across OpenAI, Anthropic and Google. Practically: long replies, not long prompts, dominate most bills."
  - q: "Can a website count Claude or Gemini tokens exactly?"
    a: "No. Anthropic and Google don't publish browser-runnable tokenizers; exact counts come only from their APIs (e.g. Anthropic's count_tokens endpoint). Any site showing 'exact' Claude/Gemini counts without an API call is estimating, honest tools label those numbers as estimates."
  - q: "Why do Anthropic's newer models produce more tokens?"
    a: "Anthropic's pricing documentation states that Opus 4.7 and later, Fable/Mythos 5 and Sonnet 5 use a newer tokenizer that 'produces approximately 30% more tokens for the same text' than the previous one (used by Sonnet 4.6 and earlier). When comparing per-token prices across model generations, that difference is part of the real cost."
  - q: "Is it safe to paste confidential text into online token counters?"
    a: "Only if the counting happens in your browser. What people paste into token counters is precisely their production prompts and internal documents, use a counter that runs the tokenizer client-side and transmits nothing, and be wary of any that upload your text to 'process' it."
draft: false
---

**LLM APIs don't bill you for words, requests or characters. They bill for tokens, and misjudging
the conversion is the most common way AI budgets go wrong.** A token is roughly 4 characters of
English (¾ of a word); every model prices input and output tokens separately, with output typically
5-6× dearer. Count yours with the [LLM token counter](/dev/llm-token-counter/), exact for OpenAI
models, honestly-labelled estimates for the rest, computed entirely in your browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>1 token ≈ 4 characters ≈ ¾ of an English word</strong>, but real counts need a real tokenizer</li>
<li><strong>Cost = input tokens × input rate + output tokens × output rate</strong> (per million tokens)</li>
<li><strong>Output is 5-6× the price of input</strong>, long replies drive bills, not long prompts</li>
<li><strong>Only OpenAI counts can be exact in a browser</strong> (published tokenizer); Claude/Gemini counts are estimates</li>
<li><strong>Anthropic's newer models tokenize ~30% heavier</strong>, compare costs, not just per-token prices</li>
<li><strong>Prices move</strong>, Sonnet 5 rises to $3/$15 on 1 Sept 2026; always check the verified date</li>
</ul>
</aside>

## What a token actually is

Before a model sees your prompt, a **tokenizer** splits the text into sub-word chunks from a fixed
vocabulary, common words become single tokens, rarer ones split into pieces
(*unbelievable* → `un` + `believ` + `able`). This is why vendors quote the same rule of thumb:
[Anthropic's pricing FAQ](https://platform.claude.com/docs/en/about-claude/pricing) puts it at
"approximately 4 characters or 0.75 words in English." Code, JSON, non-English text and whitespace
all tokenize differently, sometimes dramatically so, which is why estimating from word counts is
fine for napkin math and dangerous for budgets.

The tokenizer is not a word splitter. It is trained on a corpus and learns a vocabulary of the most
statistically frequent byte sequences, so a common word like `the` is a single token, while a
domain term, a rare surname, an emoji or a run of digits fractures into several. Two texts of
identical length can therefore carry very different token counts, and the model is billed for tokens,
not for anything a human would count by eye.

### Words, characters, tokens: a working reference

For rough English prose, these conversions hold well enough for a first estimate. Treat every figure
as a heuristic, not a guarantee, the further your text drifts from ordinary English, the more it
under- or over-counts.

| You have | Rough token estimate (English) | Notes |
|---|---|---|
| 1 word | ~1.33 tokens | ¾ of a word per token |
| 100 words | ~133 tokens | a short paragraph |
| 1,000 words | ~1,300-1,400 tokens | a long blog section |
| 1 character | ~0.25 tokens | 4 chars per token |
| 1 page (~500 words) | ~650-700 tokens | double-spaced prose |
| This whole article | a few thousand tokens | still well under any modern context window |

Content type shifts these numbers noticeably. Source code and JSON tend to tokenize *heavier* per
character than prose, brackets, indentation, operators and camelCase identifiers all break into
extra pieces. Text in non-Latin scripts (Chinese, Japanese, Arabic, Hindi) and heavily accented
languages usually costs more tokens per equivalent meaning than English, because those characters
are under-represented in the vocabulary. Long numbers and hashes are among the worst offenders. When
any of that dominates your prompt, stop estimating and count with a real tokenizer.

<figure>
<img src="/blog/infographic-llm-tokens.svg" alt="Infographic: text splits into sub-word tokens at roughly 4 characters per token; API cost equals input tokens times input rate plus output tokens times output rate; OpenAI counts can be exact in the browser because the o200k tokenizer is published, while Claude and Gemini counts are estimates, and Anthropic's newer models produce approximately 30% more tokens for the same text" width="1200" height="640" loading="lazy" />
<figcaption>The mechanics on top; the honesty question at the bottom.</figcaption>
</figure>

## The cost formula, with verified prices

Every mainstream API prices the two directions separately, per million tokens (MTok):

> **cost per request = (input tokens ÷ 1M × input rate) + (output tokens ÷ 1M × output rate)**

Current list prices, **verified 28 July 2026** against the official pricing pages:

| Model | Input $/MTok | Output $/MTok |
|---|---|---|
| GPT-5.6 Sol | $5.00 | $30.00 |
| GPT-5.6 Terra | $2.50 | $15.00 |
| GPT-5.6 Luna | $1.00 | $6.00 |
| GPT-5.4 nano | $0.20 | $1.25 |
| Claude Fable 5 | $10.00 | $50.00 |
| Claude Opus 5 | $5.00 | $25.00 |
| Claude Opus 4.8 | $5.00 | $25.00 |
| Claude Sonnet 5 | $2.00 → **$3.00 from 1 Sept 2026** | $10.00 → **$15.00** |
| Claude Haiku 4.5 | $1.00 | $5.00 |
| Gemini 3.6 Flash | $1.50 | $7.50 |
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Gemini 3.1 Pro (≤200k) | $2.00 | $12.00 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 |

*(Sources: [OpenAI](https://developers.openai.com/api/docs/pricing) ·
[Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) ·
[Google](https://ai.google.dev/gemini-api/docs/pricing). Standard rates, batch APIs are typically
50% off, and prompt-caching reads can be 90% off input.)*

Worked example: a support bot on Claude Haiku 4.5 handling a 3,000-token context and replying with
500 tokens costs (3,000 ÷ 1M × $1) + (500 ÷ 1M × $5) = **$0.0055 per conversation**, about $16.50
a month at 100 conversations a day. The same traffic on Fable 5 is $0.055 per conversation, $165 a
month: model choice is a 10× lever before any prompt engineering happens.

Notice the output column: **5-6× the input rate everywhere**. Trimming a verbose system prompt
saves pennies; capping reply length (`max_tokens`) saves real money.

### Why output is the expensive half

The asymmetry is not arbitrary. Reading your prompt is a single forward pass over the input, the
model ingests all those tokens roughly in parallel. Generating a reply is *sequential*: the model
produces one token, appends it, and runs the whole computation again to produce the next, hundreds
or thousands of times over. Every provider prices that extra work into the output rate, which is why
it lands at several times the input rate across OpenAI, Anthropic and Google alike.

The practical lesson is counter-intuitive. Teams often obsess over shrinking prompts while letting
the model ramble. But a 4,000-token prompt that yields a 200-token answer is cheap; a 400-token
prompt that yields a 2,000-token answer costs far more. Before micro-optimising your instructions,
set a sensible `max_tokens`, ask for terse output, and, where the API supports it, reuse cached
context so repeated input isn't billed at full price.

### Two levers that beat prompt-trimming

Most vendors expose two discounts that move bills more than wording ever will:

- **Batch processing.** Non-urgent jobs submitted through a batch API are commonly billed at around
  half the standard rate. If a workload can tolerate minutes of latency instead of seconds, that is
  a large saving for zero quality loss.
- **Prompt caching.** When a long, stable prefix (a big system prompt, a document, a few-shot block)
  is reused across many requests, cached input reads are billed at a steep discount, a large
  fraction off the normal input rate. The exact figures vary by provider and tier, so confirm them
  on the official pricing page before you model a budget around them.

## The honesty problem: exact vs. estimated counts

Here's what most token counters won't tell you. **OpenAI publishes its tokenizers** (the current
encoding family is `o200k`), so a browser can run the genuine article and produce *exact* counts, no API call, no upload. **Anthropic and Google don't**, exact Claude and Gemini counts exist only
behind their APIs (Anthropic offers a
[count_tokens endpoint](https://platform.claude.com/docs/en/api/messages-count-tokens)). Any
website showing "exact" Claude counts without calling that API is guessing with extra confidence.

It gets sharper with model generations. Anthropic's
[pricing docs](https://platform.claude.com/docs/en/about-claude/pricing) state that Opus 4.7 and
later, Fable/Mythos 5 and Sonnet 5 "use a newer tokenizer… \[that] produces approximately 30% more
tokens for the same text" than the tokenizer in Sonnet 4.6 and earlier. Two consequences:

1. **Old heuristics undercount** on new Claude models, a "200K-token" document by 2025 rules may
   not be one anymore.
2. **Per-token price comparisons mislead across generations**, a model that's 33% cheaper per
   token but tokenizes 30% heavier is barely cheaper per document.

The [token counter](/dev/llm-token-counter/) handles this the only defensible way: OpenAI counts
carry an **EXACT** badge (real tokenizer, run locally), Claude and Gemini counts carry an
**ESTIMATE** badge with the heuristic disclosed (chars ÷ 4, × 1.3 for Anthropic's newer models),
and the pricing table shows its verification date with links to the sources.

## The part nobody mentions: what you paste

Think about what goes into a token counter: your production system prompt. The contract you're
about to summarize. A transcript with customer names in it. Token counters attract exactly the
text that shouldn't touch a stranger's server, and plenty of hosted counters process pasted text
server-side or quietly log it. The fix is architectural, not policy: run the tokenizer in the
browser, transmit nothing. That's how the [LazyTools counter](/dev/llm-token-counter/) works. It
even keeps counting with the network unplugged.

## Quick summary

Tokens are sub-word chunks (≈4 characters in English) and the billing unit of every LLM API. Cost
is a two-term formula in which output tokens, at 5-6× the input rate, usually dominate, and model
choice moves bills by 10× or more. Only OpenAI token counts can be computed exactly outside the
vendor's API, because only OpenAI publishes its tokenizer; treat every browser-side Claude or
Gemini count as an estimate, and remember Anthropic's newer models tokenize ~30% heavier than their
predecessors. Count, compare and budget with the
[LLM token counter & cost calculator](/dev/llm-token-counter/), exact where exactness is possible,
labelled estimates where it isn't, and nothing you paste ever leaves your machine.

*Sources: [Anthropic pricing documentation](https://platform.claude.com/docs/en/about-claude/pricing)
(model prices, tokenizer note, 4-chars heuristic, Sonnet 5 schedule) ·
[OpenAI API pricing](https://developers.openai.com/api/docs/pricing) ·
[Google Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) ·
[gpt-tokenizer library](https://github.com/niieani/gpt-tokenizer). Prices verified 28 July 2026.*
