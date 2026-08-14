// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://annwebdev.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  integrations: [
    sitemap({
      // Сторінку подяки і 404 у мапу не пускаємо
      filter: (page) =>
        !page.includes('/dyakuyu') && !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
