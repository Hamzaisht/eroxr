
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "./types";

/**
 * Toggle ghost mode state in Supabase and update local state
 */
export const toggleGhostModeState = async (
  session: Session,
  isSuperAdmin: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  }
) => {
  if (!session?.user?.id) {
    console.error('Cannot toggle ghost mode: No user session available');
    return;
  }

  if (!isSuperAdmin) {
    console.error('Cannot toggle ghost mode: User is not a super admin');
    return;
  }

  setIsLoading(true);

  try {
    // If surveillance is active, stop it first
    if (isGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }

    // Toggle ghost mode in admin_sessions table
    const newGhostModeState = !isGhostMode;
    const { data, error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: newGhostModeState,
        activated_at: newGhostModeState ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error toggling ghost mode:', error);
      throw error;
    }

    // Log the admin action
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: newGhostModeState ? 'enabled_ghost_mode' : 'disabled_ghost_mode',
      action_type: 'security',
      details: { timestamp: new Date().toISOString() }
    });

    console.log(`Ghost mode ${newGhostModeState ? 'enabled' : 'disabled'}`);
    setIsGhostMode(newGhostModeState);
  } catch (error) {
    console.error('Error in toggleGhostModeState:', error);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Sync ghost mode state from Supabase
 */
export const syncGhostModeState = async (
  userId: string,
  isSuperAdmin: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void
) => {
  if (!userId) {
    console.error('Cannot sync ghost mode: No user ID available');
    return;
  }

  if (!isSuperAdmin) {
    console.error('Cannot sync ghost mode: User is not a super admin');
    setIsGhostMode(false);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  try {
    // Get the latest admin session record
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('admin_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error syncing ghost mode:', error);
      setIsGhostMode(false);
    } else if (data) {
      // Update last active timestamp
      await supabase
        .from('admin_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', data.id);
      
      console.log(`Ghost mode state synced: ${data.ghost_mode}`);
      setIsGhostMode(data.ghost_mode || false);
    } else {
      // No existing session, create one with ghost mode disabled
      await supabase
        .from('admin_sessions')
        .insert({
          admin_id: userId,
          ghost_mode: false,
          last_active_at: new Date().toISOString()
        });
      
      setIsGhostMode(false);
    }
  } catch (error) {
    console.error('Error in syncGhostModeState:', error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};
