
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
  
  // Set user ID in session for RLS optimization when a user logs in
  if (session?.user?.id) {
    setUserIdForRls(session.user.id);
  }
});

// Function to set user ID for RLS policies
export const setUserIdForRls = async (userId: string) => {
  try {
    const { error } = await supabase.rpc('set_request_user_id');
    if (error) {
      console.error('Error setting user ID for RLS:', error);
    } else {
      console.log('User ID set for RLS optimization');
    }
  } catch (error) {
    console.error('Exception setting user ID for RLS:', error);
  }
};

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
