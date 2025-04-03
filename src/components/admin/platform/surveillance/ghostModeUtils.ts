
import { Session } from "@supabase/auth-helpers-react";
import { LiveSession } from "./types";

// Toggle ghost mode state
export const toggleGhostModeState = async (
  session: Session,
  isSuperAdmin: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: { isWatching: boolean }
) => {
  if (!isSuperAdmin) {
    console.error('Only super admins can toggle ghost mode');
    return;
  }

  try {
    setIsLoading(true);
    
    // If currently watching a session, stop it first
    if (isGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }
    
    // Toggle ghost mode in database
    const supabase = await import('@/integrations/supabase/client').then(mod => mod.supabase);
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: !isGhostMode,
        activated_at: !isGhostMode ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString()
      }, { onConflict: 'admin_id' });
    
    if (error) {
      console.error('Error updating ghost mode state:', error);
      throw error;
    }
    
    // Log the admin action
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: !isGhostMode ? 'enable_ghost_mode' : 'disable_ghost_mode',
      action_type: 'system',
      details: { 
        previous_state: isGhostMode,
        new_state: !isGhostMode
      }
    });
    
    setIsGhostMode(!isGhostMode);
    console.log(`Ghost mode ${!isGhostMode ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error toggling ghost mode:', error);
  } finally {
    setIsLoading(false);
  }
};

// Sync ghost mode state with Supabase
export const syncGhostModeState = async (
  userId: string,
  isSuperAdmin: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void
) => {
  if (!isSuperAdmin) {
    setIsGhostMode(false);
    setIsLoading(false);
    return;
  }
  
  try {
    setIsLoading(true);
    
    const supabase = await import('@/integrations/supabase/client').then(mod => mod.supabase);
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching ghost mode state:', error);
      throw error;
    }
    
    // If there's data, update the ghost mode state
    if (data) {
      setIsGhostMode(data.ghost_mode || false);
    } else {
      // If no data, initialize a new admin session record
      await supabase.from('admin_sessions').insert({
        admin_id: userId,
        ghost_mode: false,
        last_active_at: new Date().toISOString()
      });
      setIsGhostMode(false);
    }
    
    console.log(`Ghost mode state synced: ${data?.ghost_mode || false}`);
  } catch (error) {
    console.error('Error synchronizing ghost mode state:', error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};
