import { openDB, type IDBPDatabase } from 'idb';

export interface DraftRecord {
  id: string;
  title: string;
  slug: string;
  postContent: string;
  body: string;
  category: string;
  author: { name: string; avatarUrl?: string | undefined; bio?: string | undefined };
  coverImage: { src: string; alt: string; caption?: string | undefined };
  tags: string[];
  featured: boolean;
  draft: boolean;
  status: 'draft' | 'published' | 'archived';
  version: number;
  seo?: {
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    keywords?: string[] | undefined;
    ogImage?: string | undefined;
    noIndex: boolean;
  } | undefined;
  supabaseId?: string | undefined;
  createdAt: number;
  updatedAt: number;
}

export interface AuditRecord {
  id: string;
  event: 'draft_created' | 'draft_saved' | 'draft_exported' | 'draft_deleted' | 'draft_published';
  draftId: string;
  draftTitle: string;
  timestamp: number;
}

const DB_NAME = 'lr_posts_db';
const DB_VERSION = 1;

function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('audit_log')) {
        db.createObjectStore('audit_log', { keyPath: 'id' });
      }
    },
  });
}

export async function saveDraft(draft: DraftRecord): Promise<void> {
  const db = await getDb();
  await db.put('drafts', { ...draft, updatedAt: Date.now() });
}

export async function getDraft(id: string): Promise<DraftRecord | undefined> {
  const db = await getDb();
  return db.get('drafts', id);
}

export async function listDrafts(): Promise<DraftRecord[]> {
  const db = await getDb();
  const all = await db.getAll('drafts');
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('drafts', id);
}

export async function appendAuditEvent(record: AuditRecord): Promise<void> {
  const db = await getDb();
  await db.put('audit_log', record);
}

export async function listAuditEvents(limit = 20): Promise<AuditRecord[]> {
  const db = await getDb();
  const all = await db.getAll('audit_log');
  return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}
