import { createClient } from '@supabase/supabase-js';
import type { UnifiedPost } from '../types/post';

export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
);

export interface SupabasePost {
  id: string;
  slug: string;
  title: string;
  post_content: string;
  content: string;
  author_name: string;
  author_bio: string | null;
  author_avatar_url: string | null;
  category: string;
  tags: string[];
  locale: string;
  cover_image_src: string;
  cover_image_alt: string;
  cover_image_caption: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  version: number;
  reading_time: number | null;
  word_count: number | null;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
  } | null;
  date: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// syncState defaults to 'remote-only'; mergePosts() upgrades to 'synced' when an MDX slug matches.
export function normalizeSupabasePost(p: SupabasePost): UnifiedPost {
  return {
    slug: p.slug,
    title: p.title,
    postContent: p.post_content,
    content: p.content,
    author: {
      name: p.author_name,
      bio: p.author_bio ?? undefined,
      avatarUrl: p.author_avatar_url ?? undefined,
    },
    category: p.category,
    tags: p.tags,
    locale: p.locale,
    coverImage: {
      src: p.cover_image_src,
      alt: p.cover_image_alt,
      caption: p.cover_image_caption ?? undefined,
    },
    status: p.status,
    featured: p.featured,
    draft: false,
    version: p.version,
    readingTime: p.reading_time ?? 1,
    wordCount: p.word_count ?? 0,
    date: new Date(p.date),
    seo: p.seo ?? undefined,
    syncState: 'remote-only',
    supabaseId: p.id,
  };
}
