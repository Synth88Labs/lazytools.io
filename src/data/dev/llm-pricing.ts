/**
 * LLM API pricing snapshot — used by the LLM token counter's cost panel.
 *
 * MAINTENANCE RULE (see docs/research/2026-07-07-ai-calculators.md): these numbers
 * MUST be re-verified against the official pricing pages at least monthly and on
 * every major model launch, and PRICES_VERIFIED updated. Known scheduled change:
 * Claude Sonnet 5 moves from $2/$10 to $3/$15 on 2026-09-01 (pre-announced).
 */

export const PRICES_VERIFIED = '2026-07-07';

export const PRICE_SOURCES = [
  { name: 'OpenAI pricing', url: 'https://developers.openai.com/api/docs/pricing' },
  { name: 'Anthropic pricing', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
  { name: 'Google Gemini pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' },
] as const;

/**
 * tokenizer:
 *  - 'o200k'      — exact count in-browser via gpt-tokenizer (OpenAI o200k_base)
 *  - 'claude-new' — estimate: chars/4 × 1.3 (Anthropic: newer tokenizer ≈30% more tokens;
 *                   applies to Opus 4.7+, Fable/Mythos 5, Sonnet 5)
 *  - 'claude'     — estimate: chars/4 (Anthropic heuristic: 1 token ≈ 4 chars; Sonnet 4.6
 *                   and earlier, Haiku 4.5 use the previous tokenizer)
 *  - 'gemini-est' — estimate: chars/4 heuristic
 */
export type TokenizerKind = 'o200k' | 'claude-new' | 'claude' | 'gemini-est';

export interface ModelPrice {
  id: string;
  name: string;
  vendor: 'OpenAI' | 'Anthropic' | 'Google';
  /** USD per 1M input tokens */
  input: number;
  /** USD per 1M output tokens */
  output: number;
  tokenizer: TokenizerKind;
  note?: string;
}

export const MODEL_PRICES: ModelPrice[] = [
  { id: 'gpt-5.5', name: 'GPT-5.5', vendor: 'OpenAI', input: 5, output: 30, tokenizer: 'o200k' },
  { id: 'gpt-5.4', name: 'GPT-5.4', vendor: 'OpenAI', input: 2.5, output: 15, tokenizer: 'o200k' },
  { id: 'gpt-5.4-mini', name: 'GPT-5.4 mini', vendor: 'OpenAI', input: 0.75, output: 4.5, tokenizer: 'o200k' },
  { id: 'gpt-5.4-nano', name: 'GPT-5.4 nano', vendor: 'OpenAI', input: 0.2, output: 1.25, tokenizer: 'o200k' },
  { id: 'claude-fable-5', name: 'Claude Fable 5', vendor: 'Anthropic', input: 10, output: 50, tokenizer: 'claude-new' },
  { id: 'claude-opus-4-8', name: 'Claude Opus 4.8', vendor: 'Anthropic', input: 5, output: 25, tokenizer: 'claude-new' },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', vendor: 'Anthropic', input: 2, output: 10, tokenizer: 'claude-new', note: 'intro pricing — $3 / $15 from 1 Sept 2026' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', vendor: 'Anthropic', input: 1, output: 5, tokenizer: 'claude' },
  { id: 'gemini-3-5-flash', name: 'Gemini 3.5 Flash', vendor: 'Google', input: 1.5, output: 9, tokenizer: 'gemini-est' },
  { id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', vendor: 'Google', input: 2, output: 12, tokenizer: 'gemini-est', note: 'prompts ≤200k tokens; higher above' },
  { id: 'gemini-2-5-flash-lite', name: 'Gemini 2.5 Flash-Lite', vendor: 'Google', input: 0.1, output: 0.4, tokenizer: 'gemini-est' },
];

/** Estimate token count for non-OpenAI models from character count. */
export function estimateTokens(chars: number, kind: TokenizerKind, exactO200k: number): number {
  if (kind === 'o200k') return exactO200k;
  const base = chars / 4; // Anthropic FAQ: 1 token ≈ 4 characters of English
  if (kind === 'claude-new') return Math.round(base * 1.3); // Anthropic: newer tokenizer ≈30% more tokens
  return Math.round(base);
}
