import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postSlug(post: BlogPost) {
  return post.id.replace(/\.md$/, '');
}

export function postPath(post: BlogPost) {
  return `/posts/${postSlug(post)}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getTags() {
  const posts = await getPosts();
  const bySlug = new Map<string, { slug: string; label: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const current = bySlug.get(slug);
      if (current) current.count += 1;
      else bySlug.set(slug, { slug, label: tag, count: 1 });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label));
}
