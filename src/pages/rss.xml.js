import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { createClient } from '@supabase/supabase-js';
import { normalizeMdxPost, mergePosts } from '@/lib/posts';
import { normalizeSupabasePost } from '@/lib/supabase';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';

export async function GET(context) {
	const supabase = createClient(
		import.meta.env.SUPABASE_URL,
		import.meta.env.SUPABASE_ANON_KEY,
	);

	const [mdxEntries, { data: supabaseRows }] = await Promise.all([
		getCollection('posts'),
		supabase.from('posts').select('slug,title,post_content,date').eq('status', 'published'),
	]);

	const allPosts = mergePosts(
		mdxEntries.map(normalizeMdxPost),
		(supabaseRows ?? []).map(normalizeSupabasePost),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allPosts.map((post) => ({
			title:       post.title,
			description: post.postContent,
			pubDate:     post.date,
			link:        `/blog/${post.slug}/`,
		})),
	});
}
