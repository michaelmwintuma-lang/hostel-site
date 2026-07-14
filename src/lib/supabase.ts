import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isDummyConfig = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-project-id') ||
  supabaseUrl.includes('your-real-project-id') ||
  supabaseUrl.includes('your-') ||
  supabaseAnonKey.includes('your_') ||
  supabaseAnonKey.includes('dummy');

if (isDummyConfig) {
  console.warn(
    '⚠️ WARNING: Xtracity is configured with dummy/placeholder Supabase credentials.\n' +
    'Please replace the placeholders in your `.env.local` file with your actual Supabase Project URL, Anon Key, and Service Role Key.'
  );
}

// Client-side and server-side public client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side queries (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
