import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** content-engine archetype: how-to | listicle | versus | explainer | pillar | data | glossary */
    archetype: z.string(),
    /** tool URLs this post promotes, e.g. /units/kg-to-lbs/ */
    tools: z.array(z.string()),
    /** primary first, then secondaries — the coverage checklist and BlogPosting keywords */
    keywords: z.array(z.string()).default([]),
    /** 1200×630 branded feature image (also og:image), e.g. /blog/kg-to-lbs-guide.png */
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    /** single source of truth: rendered on-page AND emitted as FAQPage JSON-LD */
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
