import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
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
