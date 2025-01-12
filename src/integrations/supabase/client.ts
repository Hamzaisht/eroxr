import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5MjA5NzAsImV4cCI6MjAyMDQ5Njk3MH0.SbUXk3ow-7iv_R_NdSszQUGQNIzmN0T7o_nFJL92QoM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage // Explicitly set storage to ensure persistence
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});

// Add error logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Add request error logging
supabase.handleRequestError((error) => {
  console.error('Supabase request error:', error);
});