import type { CollectionEntry } from 'astro:content';
import type { UnifiedPost } from '../types/post';

export function normalizeMdxPost(entry: CollectionEntry<'posts'>): UnifiedPost {
  const { data, id, body } = entry;
  return {
    slug: data.slug ?? id,
    title: data.title,
    postContent: data.postContent,
    content: body ?? '',
    author: data.author,
    category: data.category,
    tags: data.tags ?? [],
    locale: data.locale ?? 'en',
    coverImage: data.coverImage,
    status: data.status ?? 'draft',
    featured: data.featured ?? false,
    draft: data.draft ?? false,
    version: data.version ?? 1,
    readingTime: data.readingTime ?? 1,
    wordCount: data.wordCount ?? 0,
    date: data.date,
    seo: data.seo,
    syncState: 'local-only',
    supabaseId: undefined,
  };
}

export function mergePosts(
  mdxPosts: UnifiedPost[],
  supabasePosts: UnifiedPost[],
): UnifiedPost[] {
  const mdxMap = new Map(mdxPosts.map(p => [p.slug, p]));
  const supabaseMap = new Map(supabasePosts.map(p => [p.slug, p]));
  const merged = new Map<string, UnifiedPost>();

  for (const [slug, post] of mdxMap) {
    if (!supabaseMap.has(slug)) {
      merged.set(slug, { ...post, syncState: 'local-only' });
    }
  }

  for (const [slug, post] of supabaseMap) {
    const syncState = mdxMap.has(slug) ? 'synced' : 'remote-only';
    merged.set(slug, { ...post, syncState });
  }

  return [...merged.values()].sort((a, b) => b.date.getTime() - a.date.getTime());
}
