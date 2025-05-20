
import { supabase } from "@/integrations/supabase/client";
import { ensureUserIdSet } from "./typeSafeOperations";

/**
 * Wrapper for Supabase API calls that ensures the user ID is set
 * for RLS optimization before making authenticated requests
 */
export async function supabaseApi<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  // Set user ID for RLS optimization
  await ensureUserIdSet();
  
  // Execute the original API call
  return apiCall();
}

/**
 * Helper to get a query builder with user ID set for RLS optimization
 * Usage: const { data, error } = await withRls(() => supabase.from('table').select())
 */
export const withRls = async <T>(fn: () => Promise<T>): Promise<T> => {
  await ensureUserIdSet();
  return fn();
};
