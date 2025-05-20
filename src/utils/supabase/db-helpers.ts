
import { supabase } from "@/integrations/supabase/client"; 
import { Database } from "@/integrations/supabase/types/database.types";
import { ProfileStatus } from "@/utils/supabase/type-guards";
import { isQueryError } from "@/utils/supabase/typeSafeOperations";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Update a user's profile status safely
 * @param userId The user ID to update
 * @param status The new status to set
 * @returns True if update was successful, false otherwise
 */
export async function updateProfileStatus(userId: string, status: ProfileStatus): Promise<boolean> {
  try {
    const updateData: ProfileUpdate = {
      status: status
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id' as keyof ProfileRow, userId);
      
    if (error) {
      console.error("Error updating profile status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating profile status:", error);
    return false;
  }
}

/**
 * Get a user profile by ID with proper type checking
 * @param userId The user ID to fetch
 * @returns The profile data or null
 */
export async function getProfileById(userId: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id' as keyof ProfileRow, userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    // Check if data exists and isn't an error
    if (!data || isQueryError(data)) {
      return null;
    }
    
    return data as ProfileRow;
  } catch (error) {
    console.error("Exception fetching profile:", error);
    return null;
  }
}

/**
 * Safe fetch for any table with proper error handling
 * @param table The table name to fetch from
 * @param columns The columns to select
 * @param filterColumn The column to filter on
 * @param filterValue The value to filter for
 * @returns The data or null
 */
export async function safeFetch<T>(
  table: string, 
  columns: string, 
  filterColumn: string, 
  filterValue: any
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq(filterColumn, filterValue)
      .maybeSingle();
      
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return null;
    }
    
    // Check if data exists and isn't an error
    if (!data || isQueryError(data)) {
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Exception fetching from ${table}:`, error);
    return null;
  }
}
