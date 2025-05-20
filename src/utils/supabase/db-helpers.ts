
import { supabase } from "@/integrations/supabase/client"; 
import { Database } from "@/integrations/supabase/types/database.types";
import { ProfileStatus } from "@/utils/supabase/type-guards";
import { isQueryError } from "@/utils/supabase/typeSafeOperations";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostRow = Database['public']['Tables']['posts']['Row'];

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
      .eq('id' as keyof ProfileRow, userId as ProfileRow['id']);
      
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
      .eq('id' as keyof ProfileRow, userId as ProfileRow['id'])
      .maybeSingle();
      
    if (error || !data || isQueryError(data)) {
      console.error("Error fetching profile:", error || "Invalid data");
      return null;
    }
    
    return data as ProfileRow;
  } catch (error) {
    console.error("Exception fetching profile:", error);
    return null;
  }
}

/**
 * Create a new post with proper type checking and error handling
 * @param postData The post data to insert
 * @returns The created post data or null if failed
 */
export async function createPost(postData: PostInsert): Promise<PostRow | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
      
    if (error || !data || isQueryError(data)) {
      console.error("Error creating post:", error || "Invalid data");
      return null;
    }
    
    return data as PostRow;
  } catch (error) {
    console.error("Exception creating post:", error);
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
      
    if (error || !data || isQueryError(data)) {
      console.error(`Error fetching from ${table}:`, error || "Invalid data");
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Exception fetching from ${table}:`, error);
    return null;
  }
}

/**
 * Check if a table exists in the Supabase schema
 * @param tableName The table name to check
 * @returns True if the table exists, false otherwise
 */
export async function doesTableExist(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('check_table_exists', { table_name: tableName });
      
    if (error || data === null) {
      console.warn(`Could not verify if table "${tableName}" exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table "${tableName}" exists:`, error);
    return false;
  }
}

/**
 * Safe update for any table with proper error handling
 */
export async function safeUpdate<T>(
  table: string,
  id: string,
  updateData: Partial<T>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating ${table}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception updating ${table}:`, error);
    return false;
  }
}
