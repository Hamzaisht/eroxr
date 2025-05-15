
import { Session } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export async function toggleGhostModeState(
  session: Session,
  isSuperAdmin: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  stopSurveillance?: () => Promise<boolean>,
  activeSurveillance?: any
) {
  if (!isSuperAdmin) {
    console.error("Only super admins can use ghost mode");
    return;
  }

  setIsLoading(true);

  try {
    // If currently in ghost mode and watching someone, stop watching
    if (isGhostMode && activeSurveillance?.isWatching && stopSurveillance) {
      await stopSurveillance();
    }

    // Toggle ghost mode in admin_sessions
    const newGhostModeState = !isGhostMode;

    // Check if session already exists
    const { data: existingSessions } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('admin_id', session.user.id)
      .limit(1);

    if (existingSessions && existingSessions.length > 0) {
      // Update existing session
      await supabase
        .from('admin_sessions')
        .update({ 
          ghost_mode: newGhostModeState,
          last_active_at: new Date().toISOString()
        })
        .eq('admin_id', session.user.id);
    } else {
      // Create new session
      await supabase
        .from('admin_sessions')
        .insert({
          admin_id: session.user.id,
          ghost_mode: newGhostModeState,
          activated_at: new Date().toISOString()
        });
    }

    // Log the ghost mode state change
    await supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: newGhostModeState ? 'ghost_mode_activated' : 'ghost_mode_deactivated',
      details: {
        timestamp: new Date().toISOString(),
        user_email: session.user.email
      }
    });

    // Update state
    setIsGhostMode(newGhostModeState);
  } catch (error) {
    console.error("Error toggling ghost mode:", error);
  } finally {
    setIsLoading(false);
  }
}

export async function syncGhostModeState(
  userId: string,
  isSuperAdmin: boolean,
  setIsGhostMode: (value: boolean) => void,
  setIsLoading: (value: boolean) => void
) {
  if (!isSuperAdmin) {
    setIsGhostMode(false);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  try {
    // Check current ghost mode state
    const { data } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .limit(1)
      .single();

    if (data) {
      setIsGhostMode(data.ghost_mode || false);
    } else {
      setIsGhostMode(false);
    }
  } catch (error) {
    console.error("Error syncing ghost mode state:", error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
}
