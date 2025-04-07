
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/auth-helpers-react";

export const toggleGhostModeState = async (
  session: Session,
  isSuperAdmin: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: any
) => {
  if (!session?.user?.id || !isSuperAdmin) {
    console.error('Cannot toggle ghost mode: Missing session or not super admin');
    return;
  }

  setIsLoading(true);
  
  try {
    // If turning off ghost mode and surveillance is active, stop it first
    if (isGhostMode && activeSurveillance?.isWatching) {
      await stopSurveillance();
    }
    
    // Update the admin_sessions table
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: !isGhostMode,
        activated_at: !isGhostMode ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating ghost mode state:', error);
      return;
    }

    // Create an audit log
    await supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: !isGhostMode ? 'ghost_mode_activate' : 'ghost_mode_deactivate',
      details: {
        timestamp: new Date().toISOString(),
        admin_email: session.user.email
      }
    });

    // Update local state
    setIsGhostMode(!isGhostMode);
    console.log(`Ghost mode ${!isGhostMode ? 'activated' : 'deactivated'}`);
  } catch (error) {
    console.error('Error toggling ghost mode:', error);
  } finally {
    setIsLoading(false);
  }
};

export const syncGhostModeState = async (
  userId: string,
  isSuperAdmin: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void
) => {
  if (!userId || !isSuperAdmin) {
    setIsGhostMode(false);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
  
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode, activated_at')
      .eq('admin_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching ghost mode state:', error);
    }

    // If we have data and ghost mode was activated, set it to true
    if (data && data.ghost_mode === true) {
      console.log('Ghost mode is active based on database state');
      setIsGhostMode(true);
      
      // Update the last active timestamp
      await supabase
        .from('admin_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('admin_id', userId);
    } else {
      console.log('Ghost mode is inactive based on database state');
      setIsGhostMode(false);
    }
  } catch (error) {
    console.error('Error syncing ghost mode state:', error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};
