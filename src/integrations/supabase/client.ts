
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDM5NzMsImV4cCI6MjA1MTUxOTk3M30.Prjer9goZnkniotLSw4wQF3HXbfjm95jr4W7zvNK2PQ';

// Configure with appropriate settings for robust authentication
const supabaseOptions = {
  auth: {
    // Use localStorage for storing session data
    persistSession: true,
    // Automatically refresh JWT tokens when they're about to expire
    autoRefreshToken: true,
    // Detect auth parameters in URL (e.g., after social logins)
    detectSessionInUrl: true,
    // Prevent multiple concurrent auth requests
    flowType: 'implicit'
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Add debug logging for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'User authenticated' : 'No session');
});

// Export a function to get session synchronously from localStorage
export const getLocalSession = () => {
  try {
    const sessionStr = localStorage.getItem('supabase.auth.token');
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error('Error retrieving local session:', error);
    return null;
  }
};
