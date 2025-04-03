
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate any existing ghost mode data from localStorage to Supabase
 * This function should be called once on application startup
 */
export const migrateGhostModeData = async (userId: string) => {
  try {
    // Check if we have local ghost mode data to migrate
    const ghostModeStr = localStorage.getItem('ghost_mode_status');
    
    if (ghostModeStr) {
      // Parse local data
      const ghostMode = JSON.parse(ghostModeStr);
      
      if (typeof ghostMode === 'boolean') {
        // Check if the user already has a session record
        const { data, error } = await supabase
          .from('admin_sessions')
          .select('id')
          .eq('admin_id', userId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking for existing admin session:", error);
          return;
        }
        
        // If no record exists, create one with the local data
        if (!data) {
          await supabase.from('admin_sessions').insert({
            admin_id: userId,
            ghost_mode: ghostMode,
            activated_at: ghostMode ? new Date() : null,
            last_active_at: new Date()
          });
          
          console.log("Migrated ghost mode data to database");
          
          // Clear local storage data after migration
          localStorage.removeItem('ghost_mode_status');
        }
      }
    }
  } catch (error) {
    console.error("Error migrating ghost mode data:", error);
  }
};
