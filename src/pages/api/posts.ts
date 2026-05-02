export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const SCOPE = 'api/posts';

// ── Schemas ───────────────────────────────────────────────────────────────────

const GetQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  slug:   z.string().min(1).optional(),
  limit:  z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const PostBodySchema = z.object({
  slug:        z.string().min(1),
  title:       z.string().min(1),
  postContent: z.string().optional(),
  body:        z.string().optional(),
  author: z.object({
    name:      z.string().min(1),
    bio:       z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
  category:    z.string().min(1),
  tags:        z.array(z.string()).default([]),
  locale:      z.string().default('en'),
  coverImage:  z.object({
    src:     z.string().min(1),
    alt:     z.string().min(1),
    caption: z.string().optional(),
  }).optional(),
  status:      z.enum(['draft', 'published', 'archived']),
  featured:    z.boolean().default(false),
  version:     z.number().int().positive().default(1),
  readingTime: z.number().optional(),
  wordCount:   z.number().optional(),
  date:        z.string().min(1),
  seo: z.object({
    metaTitle:       z.string().optional(),
    metaDescription: z.string().optional(),
    keywords:        z.array(z.string()).optional(),
    ogImage:         z.string().optional(),
    noIndex:         z.boolean().optional(),
  }).optional(),
});

type PostBody = z.infer<typeof PostBodySchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// Published results can be cached; drafts/archived must never be cached.
function cacheHeader(status?: string | null, singleSlug = false): string {
  if (status !== 'published') return 'no-store';
  return singleSlug
    ? 'public, max-age=300, stale-while-revalidate=600'
    : 'public, max-age=60, stale-while-revalidate=300';
}

function isAuthorized(token: string | null): boolean {
  return !!env.CREATE_API_TOKEN && token === env.CREATE_API_TOKEN;
}

// ── GET ───────────────────────────────────────────────────────────────────────

export const GET: APIRoute = async ({ url, request }) => {
  logger.debug(SCOPE, 'GET request received', {
    url:     url.toString(),
    params:  Object.fromEntries(url.searchParams),
  });

  const parsed = GetQuerySchema.safeParse({
    status: url.searchParams.get('status') ?? undefined,
    slug:   url.searchParams.get('slug') ?? undefined,
    limit:  url.searchParams.get('limit') ?? undefined,
    offset: url.searchParams.get('offset') ?? undefined,
  });

  if (!parsed.success) {
    logger.warn(SCOPE, 'Invalid GET query params', { issues: parsed.error.issues });
    return jsonResponse(
      { error: env.DEV ? parsed.error.message : 'Invalid query parameters' },
      400,
    );
  }

  const { status, slug, limit, offset } = parsed.data;
  const wantsDrafts = status === 'draft' || status === 'archived';

  logger.debug(SCOPE, 'GET query params resolved', { status, slug, limit, offset, wantsDrafts });

  if (wantsDrafts) {
    const token = request.headers.get('x-create-token');
    if (!isAuthorized(token)) {
      logger.warn(SCOPE, 'Unauthorized GET for protected status', {
        status,
        ip: request.headers.get('x-forwarded-for') ?? 'unknown',
      });
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    logger.debug(SCOPE, 'Auth passed for draft/archived fetch');
  }

  const key = wantsDrafts ? env.SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_ANON_KEY;
  const supabase = createClient(env.SUPABASE_URL, key);

  let query = supabase
    .from('posts')
    .select('id, slug, title, status, featured, date, updated_at', { count: 'exact' })
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (slug)   query = query.eq('slug', slug);

  logger.debug(SCOPE, 'Executing Supabase GET query', { status, slug, limit, offset, range: `${offset}-${offset + limit - 1}` });

  const { data, error, count } = await query;

  if (error) {
    logger.error(SCOPE, 'GET query failed', {
      code:    error.code,
      message: error.message,
      hint:    error.hint,
      status,
      slug,
    });
    return jsonResponse(
      { error: env.DEV ? error.message : 'Failed to fetch posts' },
      500,
    );
  }

  logger.debug(SCOPE, 'Supabase GET response', {
    returned: data?.length,
    total:    count,
    firstSlug: data?.[0]?.slug ?? null,
    lastSlug:  data?.[data.length - 1]?.slug ?? null,
  });
  logger.info(SCOPE, 'GET success', { status, slug, limit, offset, returned: data?.length, total: count });

  return jsonResponse(
    { posts: data, total: count ?? 0 },
    200,
    { 'Cache-Control': cacheHeader(status, !!slug) },
  );
};

// ── POST ──────────────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  logger.debug(SCOPE, 'POST request received', {
    contentType: request.headers.get('content-type'),
  });

  const token = request.headers.get('x-create-token');
  if (!isAuthorized(token)) {
    logger.warn(SCOPE, 'Unauthorized POST attempt', {
      ip: request.headers.get('x-forwarded-for') ?? 'unknown',
    });
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  logger.debug(SCOPE, 'Auth passed for POST');

  let rawBody: unknown;
  try {
    rawBody = await request.json();
    logger.debug(SCOPE, 'JSON body parsed', {
      keys: rawBody && typeof rawBody === 'object' ? Object.keys(rawBody as object) : typeof rawBody,
    });
  } catch {
    logger.warn(SCOPE, 'Failed to parse JSON body');
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = PostBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    logger.warn(SCOPE, 'POST body validation failed', { issues: parsed.error.issues });
    return jsonResponse(
      { error: env.DEV ? parsed.error.message : 'Invalid request body' },
      400,
    );
  }

  const body: PostBody = parsed.data;

  logger.debug(SCOPE, 'POST body validated', {
    slug:        body.slug,
    title:       body.title,
    status:      body.status,
    featured:    body.featured,
    category:    body.category,
    tagsCount:   body.tags.length,
    hasSeo:      !!body.seo,
    hasCover:    !!body.coverImage,
    wordCount:   body.wordCount,
    readingTime: body.readingTime,
  });

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const upsertPayload = {
    slug:                body.slug,
    title:               body.title,
    post_content:        body.postContent,
    content:             body.body,
    author_name:         body.author.name,
    author_bio:          body.author.bio ?? null,
    author_avatar_url:   body.author.avatarUrl ?? null,
    category:            body.category,
    tags:                body.tags,
    locale:              body.locale,
    cover_image_src:     body.coverImage?.src,
    cover_image_alt:     body.coverImage?.alt,
    cover_image_caption: body.coverImage?.caption ?? null,
    status:              body.status,
    featured:            body.featured,
    version:             body.version,
    reading_time:        body.readingTime ?? null,
    word_count:          body.wordCount ?? null,
    date:                body.date,
    seo:                 body.seo ?? null,
    published_at:        body.status === 'published' ? new Date().toISOString() : null,
  };

  logger.debug(SCOPE, 'Executing Supabase upsert', {
    slug:        upsertPayload.slug,
    status:      upsertPayload.status,
    published_at: upsertPayload.published_at,
    version:     upsertPayload.version,
  });

  const { data, error } = await supabase
    .from('posts')
    .upsert(upsertPayload, { onConflict: 'slug' })
    .select('id');

  if (error) {
    logger.error(SCOPE, 'POST upsert failed', {
      slug:    body.slug,
      code:    error.code,
      message: error.message,
      hint:    error.hint,
    });
    return jsonResponse(
      { error: env.DEV ? error.message : 'Failed to save post' },
      500,
    );
  }

  const id = data?.[0]?.id ?? null;

  logger.debug(SCOPE, 'Supabase upsert response', { id, rowsReturned: data?.length });
  logger.info(SCOPE, 'POST upsert success', { slug: body.slug, status: body.status, id });

  return jsonResponse({ success: true, id }, 200);
};
