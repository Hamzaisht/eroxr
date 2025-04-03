
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

    // First, migrate any existing localStorage data
    await migrateGhostModeData(userId);

    // Then fetch current state from Supabase
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching ghost mode state:", error);
      setIsGhostMode(false);
    } else {
      setIsGhostMode(data?.ghost_mode || false);
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
  if (!session?.user?.id || !isSuperAdmin) return;

  try {
    setIsLoading(true);
    
    // If turning off ghost mode, stop any active surveillance
    if (currentGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }

    // Update ghost mode state in Supabase
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: !currentGhostMode,
        activated_at: !currentGhostMode ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString()
      }, {
        onConflict: 'admin_id'
      });

    if (error) {
      console.error("Error toggling ghost mode:", error);
      return;
    }

    // Log the action for audit purposes
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: !currentGhostMode ? 'ghost_mode_enabled' : 'ghost_mode_disabled',
      action_type: 'toggle_ghost_mode',
      target_type: 'admin',
      target_id: session.user.id,
      details: {
        timestamp: new Date().toISOString(),
        previous_state: currentGhostMode,
        new_state: !currentGhostMode
      }
    });

    // Update local state
    setIsGhostMode(!currentGhostMode);
  } catch (error) {
    console.error("Error toggling ghost mode:", error);
  } finally {
    setIsLoading(false);
  }
};
