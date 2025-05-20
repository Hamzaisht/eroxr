
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";
import { 
  ProfileStatus, 
  safeProfileUpdate 
} from "@/utils/supabase/type-guards";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileKey = keyof ProfileRow;

/**
 * Update a user's profile status
 * @param userId The ID of the user to update
 * @param status The new status value
 */
export async function updateProfileStatus(userId: string, status: ProfileStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(safeProfileUpdate({ status }))
      .eq('id' as ProfileKey, userId as any);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Failed to update profile status: ${error}`);
    throw error;
  }
}

/**
 * Fetch a user profile by ID
 * @param userId The ID of the user to fetch
 * @returns The user profile or null if not found
 */
export async function fetchUserProfile(userId: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id' as ProfileKey, userId as any)
      .maybeSingle();
      
    if (error || !data) {
      console.error(`Error fetching user profile: ${error || 'No data returned'}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Exception fetching user profile: ${error}`);
    return null;
  }
}
