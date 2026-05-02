import { logger } from './logger';

const SCOPE = 'env';

function get(key: string): string {
  const val = (import.meta.env as Record<string, string | undefined>)[key];
  if (!val) {
    logger.error(SCOPE, `Missing required env var: ${key}`, {
      hint: 'Check your .env.local and Vercel project environment variables',
    });
  }
  return val ?? '';
}

// Validated at module load — logs missing vars once at server startup.
export const env = {
  SUPABASE_URL:              get('SUPABASE_URL'),
  SUPABASE_ANON_KEY:         get('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: get('SUPABASE_SERVICE_ROLE_KEY'),
  CREATE_API_TOKEN:          get('CREATE_API_TOKEN'),
  DEV:                       import.meta.env.DEV,
};
