
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDM5NzMsImV4cCI6MjA1MTUxOTk3M30.Prjer9goZnkniotLSw4wQF3HXbfjm95jr4W7zvNK2PQ';

// Get the current domain for CORS configuration
const currentDomain = window.location.origin;

// Configure with additional security settings and CORS
const supabaseOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Info': 'supabase-js/2.0.0'
    }
  },
  realtime: {
    // Enhanced params for improved realtime security
    params: {
      eventsPerSecond: 10
    }
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Add debug logging for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'User authenticated' : 'No session');
});

// Log domain for debugging CORS issues
console.log('Current domain for CORS configuration:', currentDomain);
