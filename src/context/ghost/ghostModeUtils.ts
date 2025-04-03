
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { migrateGhostModeData } from "@/migrations/migrate_ghost_mode_data";

export const syncGhostModeState = async (
  userId: string,
  isSuperAdmin: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (loading: boolean) => void
) => {
  if (!isSuperAdmin) {
    setIsGhostMode(false);
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true);
    console.log('Syncing ghost mode state for user:', userId);

    // First, migrate any existing localStorage data
    await migrateGhostModeData(userId);

    // Then fetch current state from Supabase
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .maybeSingle();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error code
        console.error("Error fetching ghost mode state:", error);
      }
      setIsGhostMode(false);
    } else {
      const ghostModeEnabled = data?.ghost_mode || false;
      console.log('Ghost mode state retrieved from Supabase:', ghostModeEnabled);
      setIsGhostMode(ghostModeEnabled);
    }
  } catch (error) {
    console.error("Error syncing ghost mode state:", error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};

export const toggleGhostModeState = async (
  session: Session | null,
  isSuperAdmin: boolean,
  currentGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (loading: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: { isWatching: boolean }
) => {
  if (!session?.user?.id || !isSuperAdmin) {
    console.log('Cannot toggle ghost mode: No session or not super admin');
    return;
  }

  try {
    setIsLoading(true);
    
    // If turning off ghost mode, stop any active surveillance
    if (currentGhostMode && activeSurveillance.isWatching) {
      console.log('Stopping active surveillance before toggling ghost mode');
      await stopSurveillance();
    }

    const newGhostModeState = !currentGhostMode;
    console.log(`Toggling ghost mode from ${currentGhostMode} to ${newGhostModeState}`);

    // Update ghost mode state in Supabase
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: newGhostModeState,
        activated_at: newGhostModeState ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString()
      }, {
        onConflict: 'admin_id'
      });

    if (error) {
      console.error("Error toggling ghost mode in Supabase:", error);
      return;
    }

    console.log('Ghost mode state successfully updated in Supabase');

    // Log the action for audit purposes
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: newGhostModeState ? 'ghost_mode_enabled' : 'ghost_mode_disabled',
      action_type: 'toggle_ghost_mode',
      target_type: 'admin',
      target_id: session.user.id,
      details: {
        timestamp: new Date().toISOString(),
        previous_state: currentGhostMode,
        new_state: newGhostModeState
      }
    });

    // Update local state
    setIsGhostMode(newGhostModeState);
  } catch (error) {
    console.error("Error toggling ghost mode:", error);
  } finally {
    setIsLoading(false);
  }
};
