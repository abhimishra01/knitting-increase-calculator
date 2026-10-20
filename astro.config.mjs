import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import site from './src/site.config.ts';

// Contact and Terms are thin pages with noindex, so they stay out of the sitemap.
const noindexFilter = (page) => !/\/(contact|terms)\/$/.test(page);

export default defineConfig({
  // GitHub Pages builds set PAGES_BASE=/<slug>/ and PAGES_SITE; normal builds use the real domain at the root.
  site: site.bingemind ? 'https://bingemind.com' : (process.env.PAGES_SITE || 'https://bingemind.com'),
  base: site.bingemind ? '/knitting-increase-calculator/' : (process.env.PAGES_BASE || '/'),
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap({ filter: noindexFilter })],
  vite: { plugins: [tailwindcss()] },
});
