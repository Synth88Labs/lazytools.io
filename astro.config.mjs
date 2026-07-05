import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lazytools.io',
  trailingSlash: 'always',
  integrations: [
    preact(),
    sitemap({
      // Keep placeholder/coming-soon stub pages out of the sitemap
      filter: (page) => !page.includes('/coming-soon'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
