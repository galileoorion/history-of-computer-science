import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tech.attilakulik.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  devToolbar: { enabled: false },
});
