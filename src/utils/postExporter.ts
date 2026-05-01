import { readingTime, wordCount } from './wordCount';

interface ExportData {
  title: string;
  slug: string;
  postContent: string;
  body: string;
  category: string;
  author: { name: string; bio?: string | undefined };
  coverImage: { src: string; alt: string; caption?: string | undefined };
  tags: string[];
  featured: boolean;
  draft: boolean;
  status: 'draft' | 'published' | 'archived';
  version: number;
  date?: string | undefined;
  seo?: {
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
    ogImage?: string | undefined;
    noIndex: boolean;
  } | undefined;
}

function yamlStr(value: string): string {
  return value.includes("'") ? `"${value.replace(/"/g, '\\"')}"` : `'${value}'`;
}

function buildFrontmatter(data: ExportData): string {
  const words = wordCount(data.body);
  const rt = readingTime(words);
  const date = data.date ?? new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    '---',
    `title: ${yamlStr(data.title)}`,
    `postContent: ${yamlStr(data.postContent)}`,
    `category: ${yamlStr(data.category)}`,
    'author:',
    `  name: ${yamlStr(data.author.name)}`,
  ];

  if (data.author.bio) lines.push(`  bio: ${yamlStr(data.author.bio)}`);

  lines.push(
    `date: '${date}'`,
    `status: ${data.status}`,
    `version: ${data.version}`,
    `readingTime: ${rt}`,
    `wordCount: ${words}`,
    'coverImage:',
    `  src: ${yamlStr(data.coverImage.src)}`,
    `  alt: ${yamlStr(data.coverImage.alt)}`,
  );

  if (data.coverImage.caption) {
    lines.push(`  caption: ${yamlStr(data.coverImage.caption)}`);
  }

  lines.push(
    `featured: ${data.featured}`,
    `draft: ${data.draft}`,
    `tags: [${data.tags.map(t => yamlStr(t)).join(', ')}]`,
  );

  if (data.seo) {
    lines.push('seo:');
    if (data.seo.metaTitle) lines.push(`  metaTitle: ${yamlStr(data.seo.metaTitle)}`);
    if (data.seo.metaDescription) lines.push(`  metaDescription: ${yamlStr(data.seo.metaDescription)}`);
    if (data.seo.keywords?.length) {
      lines.push(`  keywords: [${data.seo.keywords.map(k => yamlStr(k)).join(', ')}]`);
    }
    if (data.seo.ogImage) lines.push(`  ogImage: ${yamlStr(data.seo.ogImage)}`);
    lines.push(`  noIndex: ${data.seo.noIndex}`);
  }

  lines.push('---');
  return lines.join('\n');
}

export function exportToMarkdown(data: ExportData): void {
  const frontmatter = buildFrontmatter(data);
  const content = `${frontmatter}\n\n${data.body}\n`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
