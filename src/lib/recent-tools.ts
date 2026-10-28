/**
 * Auto-generated "Recently added" list for the homepage.
 *
 * Instead of a hand-maintained array, this derives the newest tools from the
 * registries. Each source gives its category's launch date; a tool may override
 * it with its own optional `added` ISO date. The homepage shows the newest N,
 * interleaved across categories so a same-day batch shows variety.
 *
 * When you ship a new category or tranche, add one line to SOURCES (with the
 * date). That is the only maintenance, the list then updates itself on build.
 */
import { CSS_TOOLS } from '../data/css/index';
import { SOCIAL_TOOLS } from '../data/social/index';
import { GAMING_TOOLS } from '../data/gaming/index';
import { TEST_TOOLS } from '../data/tests/index';
import { LINK_TOOLS } from '../data/links/index';

export interface RecentTool {
  icon: string;
  name: string;
  tag: string;
  url: string;
  added: string;
}

interface ToolLike {
  slug: string;
  name: string;
  icon: string;
  added?: string;
}

interface Source {
  tools: ToolLike[];
  prefix: string;
  tag: string;
  /** Category launch date (ISO), used when a tool has no own `added`. */
  added: string;
}

/** Newest categories/tranches first. Add a line when you ship new tools. */
const SOURCES: Source[] = [
  { tools: CSS_TOOLS, prefix: 'css', tag: 'CSS & Design', added: '2026-10-28' },
  { tools: SOCIAL_TOOLS, prefix: 'social', tag: 'Social & Creator', added: '2026-10-28' },
  { tools: GAMING_TOOLS, prefix: 'gaming', tag: 'Gaming', added: '2026-10-28' },
  { tools: TEST_TOOLS, prefix: 'tests', tag: 'Typing & Reflex Tests', added: '2026-10-25' },
  { tools: LINK_TOOLS, prefix: 'links', tag: 'Links & Sharing', added: '2026-10-07' },
];

export function recentTools(limit = 10): RecentTool[] {
  const lists = SOURCES.map((s) =>
    s.tools.map(
      (t): RecentTool => ({ icon: t.icon, name: t.name, tag: s.tag, url: `/${s.prefix}/${t.slug}/`, added: t.added ?? s.added }),
    ),
  );
  // Round-robin interleave so a same-date batch shows a mix of categories…
  const interleaved: RecentTool[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (l[i]) interleaved.push(l[i]);
  // …then a stable sort by date puts genuinely newer tools first.
  return interleaved.sort((a, b) => b.added.localeCompare(a.added)).slice(0, limit);
}
