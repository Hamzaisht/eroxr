
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDM5NzMsImV4cCI6MjA1MTUxOTk3M30.Prjer9goZnkniotLSw4wQF3HXbfjm95jr4W7zvNK2PQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Add debug logging for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'User authenticated' : 'No session');
});
