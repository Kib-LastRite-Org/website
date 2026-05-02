export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ url, request }) => {
  const status = url.searchParams.get('status');
  const slug   = url.searchParams.get('slug');
  const limit  = parseInt(url.searchParams.get('limit') ?? '50', 10);

  const wantsDrafts = status === 'draft' || status === 'archived';

  if (wantsDrafts) {
    const auth = request.headers.get('x-create-token');
    if (auth !== import.meta.env.CREATE_API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const key = wantsDrafts
    ? import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    : import.meta.env.SUPABASE_ANON_KEY;

  const supabase = createClient(import.meta.env.SUPABASE_URL, key);

  let query = supabase
    .from('posts')
    .select('id, slug, title, status, featured, date, updated_at')
    .order('date', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (slug)   query = query.eq('slug', slug);

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ posts: data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get('x-create-token');
  if (auth !== import.meta.env.CREATE_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = await request.json() as Record<string, any>;

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase
    .from('posts')
    .upsert({
      slug:                body.slug,
      title:               body.title,
      post_content:        body.postContent,
      content:             body.body,
      author_name:         body.author?.name,
      author_bio:          body.author?.bio ?? null,
      author_avatar_url:   body.author?.avatarUrl ?? null,
      category:            body.category,
      tags:                body.tags ?? [],
      locale:              body.locale ?? 'en',
      cover_image_src:     body.coverImage?.src,
      cover_image_alt:     body.coverImage?.alt,
      cover_image_caption: body.coverImage?.caption ?? null,
      status:              body.status,
      featured:            body.featured ?? false,
      version:             body.version ?? 1,
      reading_time:        body.readingTime ?? null,
      word_count:          body.wordCount ?? null,
      date:                body.date,
      seo:                 body.seo ?? null,
      published_at:        body.status === 'published' ? new Date().toISOString() : null,
    }, { onConflict: 'slug' })
    .select('id');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, id: data?.[0]?.id ?? null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
