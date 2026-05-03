import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postPath } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Bitomule's learning shack",
    description: 'My thoughts about iOS, technology or any other thing that comes to my mind.',
    site: context.site ?? new URL('https://blog.bitomule.com'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: postPath(post),
    })),
  });
}
