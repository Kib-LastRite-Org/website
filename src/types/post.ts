/**
 * Tracks where a post lives relative to both content sources.
 *
 *  local-only  — MDX file exists, no matching slug in Supabase
 *  remote-only — Row exists in Supabase, no matching MDX file
 *  synced      — Same slug in BOTH sources (Supabase content wins at build time)
 */
export type PostSyncState = 'local-only' | 'remote-only' | 'synced';

export interface UnifiedPost {
  slug: string;
  title: string;
  postContent: string;
  content: string;
  author: {
    name: string;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
  };
  category: string;
  tags: string[];
  locale: string;
  coverImage: {
    src: string;
    alt: string;
    caption?: string | undefined;
  };
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  draft: boolean;
  version: number;
  readingTime: number;
  wordCount: number;
  date: Date;
  seo?: {
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
    ogImage?: string | undefined;
    noIndex?: boolean | undefined;
  } | undefined;
  syncState: PostSyncState;
  supabaseId?: string | undefined;
}
