import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// Use the actual Supabase project URL and anon key
const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDM5NzMsImV4cCI6MjA1MTUxOTk3M30.Prjer9goZnkniotLSw4wQF3HXbfjm95jr4W7zvNK2PQ';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

/**
 * Helper function for checking current user ID
 * @returns The user ID from the JWT or null if not available
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Optional helper to set the user ID in the session for improved RLS performance
 * Note: In most cases this is not required as Supabase automatically sets auth.uid()
 * @param userId - The user ID to set
 */
export async function setUserIdForRls(userId: string): Promise<void> {
  if (!userId) return;
  
  try {
    // This is a no-op since Supabase handles auth.uid() automatically
    // We keep this function for backward compatibility 
    console.log("User ID is already available via auth.uid():", userId);
  } catch (error) {
    console.error("Error in setUserIdForRls:", error);
  }
}

/**
 * Wrap Supabase calls to include common error handling and monitoring
 * @param callback - The function containing Supabase queries to execute
 */
export async function withRls<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    console.error("Error in Supabase query:", error);
    throw error;
  }
}

/**
 * Get current auth session
 * @returns Current session or null
 */
export async function getSession() {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
