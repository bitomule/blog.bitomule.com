import type { APIContext } from 'astro';
import { getPosts, getTags, postPath } from '@/lib/posts';

const site = 'https://blog.bitomule.com';

function url(path: string, lastmod?: Date) {
  return [
    '<url>',
    `<loc>${new URL(path, site).toString()}</loc>`,
    lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '',
    '</url>',
  ].join('');
}

export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const tags = await getTags();
  const urls = [
    url('/'),
    url('/posts/'),
    url('/tags/'),
    url('/about/'),
    ...posts.map((post) => url(postPath(post), post.data.date)),
    ...tags.map((tag) => url(`/tags/${tag.slug}/`)),
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
