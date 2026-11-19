import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabase } from '../config/env.js';
import { logger } from '../utils/logger.js';

let supabaseClient: SupabaseClient | null = null;

if (hasSupabase) {
  try {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    logger.info('✅ Supabase client initialized with Service Role');
  } catch (err) {
    logger.error({ err }, 'Failed to initialize Supabase client');
  }
} else {
  logger.warn('⚠️ Supabase credentials not configured in .env. Operating with local repository fallback.');
}

export const supabase = supabaseClient;
