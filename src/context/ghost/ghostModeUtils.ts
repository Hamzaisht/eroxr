
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const syncGhostModeState = async (
  userId: string, 
  isSuperAdmin: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void
) => {
  if (!userId || !isSuperAdmin) return;

  try {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error fetching ghost mode state:", error);
      }
      // No existing session found, we'll create one with ghost mode disabled
      setIsGhostMode(false);
    } else if (data) {
      // Update state based on database value
      setIsGhostMode(data.ghost_mode);
      
      if (data.ghost_mode) {
        console.log("Ghost mode active state loaded from database");
      }
    }
  } catch (error) {
    console.error("Error syncing ghost mode from Supabase:", error);
  } finally {
    setIsLoading(false);
  }
};

export const toggleGhostModeState = async (
  session: Session | null,
  isSuperAdmin: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (state: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: { isWatching: boolean }
) => {
  const { toast } = useToast();
  
  if (!isSuperAdmin || !session?.user?.id) return;
  
  setIsLoading(true);
  
  try {
    const newGhostModeState = !isGhostMode;
    
    // Update database
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: newGhostModeState,
        activated_at: newGhostModeState ? new Date() : null,
        last_active_at: new Date()
      }, {
        onConflict: 'admin_id' 
      });
      
    if (error) {
      console.error("Error updating ghost mode in database:", error);
      toast({
        title: "Error",
        description: "Failed to update ghost mode status",
        variant: "destructive"
      });
      return;
    }
    
    // Log action to admin_logs
    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action: newGhostModeState ? 'ghost_mode_enabled' : 'ghost_mode_disabled',
      action_type: 'toggle_ghost_mode',
      target_type: 'admin',
      target_id: session.user.id,
      details: {
        timestamp: new Date().toISOString(),
        user_email: session.user.email,
        previous_state: isGhostMode,
        new_state: newGhostModeState
      }
    });
    
    // Also log to admin_audit_logs for redundancy and compatibility
    await supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
      details: {
        timestamp: new Date().toISOString(),
        user_email: session.user.email,
      }
    });
    
    if (isGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }
    
    setIsGhostMode(newGhostModeState);
    
    toast({
      title: isGhostMode ? "Ghost Mode Deactivated" : "Ghost Mode Activated",
      description: isGhostMode 
        ? "Your actions are now visible to users" 
        : "You are now browsing invisibly",
    });
  } catch (error) {
    console.error("Error toggling ghost mode:", error);
  } finally {
    setIsLoading(false);
  }
};
