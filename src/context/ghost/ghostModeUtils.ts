
import { Session } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Toggle ghost mode state
 */
export const toggleGhostModeState = async (
  session: Session | null,
  canUseGhostMode: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: any
) => {
  if (!session?.user || !canUseGhostMode) return;
  
  setIsLoading(true);
  
  try {
    // If surveillance is active, stop it first
    if (isGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }
    
    // Toggle ghost mode in database
    const newGhostModeState = !isGhostMode;
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ 
        user_id: session.user.id,
        settings_type: 'ghost_mode',
        value: newGhostModeState 
      });
    
    if (error) {
      console.error("Error updating ghost mode:", error);
      return;
    }
    
    // Log the action for audit purposes
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: newGhostModeState ? 'enabled_ghost_mode' : 'disabled_ghost_mode',
      action_type: 'admin_settings',
      details: { timestamp: new Date().toISOString() }
    });
    
    setIsGhostMode(newGhostModeState);
  } catch (err) {
    console.error("Error toggling ghost mode:", err);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Sync ghost mode state from database
 */
export const syncGhostModeState = async (
  userId: string,
  canUseGhostMode: boolean,
  setIsGhostMode: (value: boolean) => void,
  setIsLoading: (value: boolean) => void
) => {
  if (!canUseGhostMode) {
    setIsGhostMode(false);
    return;
  }
  
  setIsLoading(true);
  
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('user_id', userId)
      .eq('settings_type', 'ghost_mode')
      .single();
    
    if (!error && data) {
      setIsGhostMode(!!data.value);
    } else {
      setIsGhostMode(false);
    }
  } catch (err) {
    console.error("Error syncing ghost mode state:", err);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};
