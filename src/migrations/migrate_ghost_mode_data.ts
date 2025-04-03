
import { supabase } from "@/integrations/supabase/client";

export const migrateGhostModeData = async (userId: string): Promise<void> => {
  try {
    // Check if we already have an admin_sessions entry
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('admin_id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking admin sessions:", error);
      return;
    }
    
    // If we already have data in Supabase, no need to migrate
    if (data) return;
    
    // Check if we have localStorage data to migrate
    const localGhostModeState = localStorage.getItem('ghostMode');
    if (localGhostModeState) {
      try {
        const parsedState = JSON.parse(localGhostModeState);
        const isGhostMode = !!parsedState?.enabled;
        
        // Create admin session in Supabase
        await supabase.from('admin_sessions').insert({
          admin_id: userId,
          ghost_mode: isGhostMode,
          activated_at: isGhostMode ? new Date().toISOString() : null
        });
        
        // Log the migration
        await supabase.from('admin_logs').insert({
          admin_id: userId,
          action: 'migrate_ghost_mode',
          action_type: 'migration',
          target_type: 'admin_session',
          target_id: userId,
          details: {
            migrated_from: 'localStorage',
            original_state: parsedState,
            timestamp: new Date().toISOString()
          }
        });
        
        // Clear localStorage since we've migrated the data
        localStorage.removeItem('ghostMode');
        console.log("Successfully migrated ghost mode data to Supabase");
      } catch (parseError) {
        console.error("Error parsing localStorage ghost mode data:", parseError);
      }
    }
  } catch (error) {
    console.error("Error migrating ghost mode data:", error);
  }
};
