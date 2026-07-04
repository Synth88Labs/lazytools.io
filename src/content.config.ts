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
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
