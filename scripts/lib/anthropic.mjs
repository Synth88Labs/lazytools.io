/**
 * Shared Claude helper for the LLM-powered agents (Researcher, Core Developer,
 * senior Fixer). Raw HTTPS to the Messages API (Node 22 global fetch) — keeps
 * the agents dependency-light. Every call's token usage is logged into the
 * ledger so the Manager can monitor spend and enforce a daily budget.
 *
 * The key comes from the ANTHROPIC_API_KEY env var (a GitHub repo secret in CI).
 * Never hard-code or commit the key.
 */
const today = () => new Date().toISOString().slice(0, 10);

export function haveKey() { return !!process.env.ANTHROPIC_API_KEY; }

export async function callClaude({ system, user, model = 'claude-sonnet-5', maxTokens = 1400, apiKey = process.env.ANTHROPIC_API_KEY }) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const text = (j.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  const u = j.usage || {};
  return { text, usage: { input: u.input_tokens || 0, output: u.output_tokens || 0 }, model };
}

/** Extract a JSON value from a model reply that may be fenced or chatty. */
export function parseJson(text) {
  let t = String(text || '').trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const s = t.indexOf('{'), sb = t.indexOf('[');
  const start = sb >= 0 && (sb < s || s < 0) ? sb : s;
  if (start > 0) t = t.slice(start);
  return JSON.parse(t);
}

/** Log token usage into ledger.tokens (daily + total + per-agent). */
export function logTokens(ledger, agent, usage) {
  ledger.tokens ||= { daily: [], total: { input: 0, output: 0, calls: 0 } };
  const d0 = today();
  let d = ledger.tokens.daily.find((x) => x.date === d0);
  if (!d) { d = { date: d0, input: 0, output: 0, calls: 0, byAgent: {} }; ledger.tokens.daily.push(d); }
  d.input += usage.input; d.output += usage.output; d.calls += 1;
  d.byAgent[agent] = (d.byAgent[agent] || 0) + usage.input + usage.output;
  ledger.tokens.total.input += usage.input; ledger.tokens.total.output += usage.output; ledger.tokens.total.calls += 1;
  ledger.tokens.daily = ledger.tokens.daily.slice(-120);
}

/** Manager's daily token cap. Agents check this before spending. */
export function budgetStatus(ledger, dailyCap = Number(process.env.TOKEN_DAILY_CAP || 400000)) {
  const d = (ledger.tokens?.daily || []).find((x) => x.date === today());
  const used = d ? d.input + d.output : 0;
  return { ok: used < dailyCap, used, cap: dailyCap, remaining: Math.max(0, dailyCap - used) };
}
