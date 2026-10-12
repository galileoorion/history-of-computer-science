import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://attilakulik.com',
  base: process.env.NODE_ENV === 'production' ? '/history-of-computer-science' : '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  devToolbar: { enabled: false },
});
