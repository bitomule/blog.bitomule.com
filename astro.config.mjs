import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.bitomule.com',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
