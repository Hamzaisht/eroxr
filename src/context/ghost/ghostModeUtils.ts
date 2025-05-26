
import { supabase } from '@/integrations/supabase/client';

export const toggleGhostModeState = async (
  session: any,
  canUseGhostMode: boolean,
  isGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (loading: boolean) => void,
  stopSurveillance: () => Promise<boolean>,
  activeSurveillance: any
) => {
  if (!session?.user || !canUseGhostMode) return;
  
  setIsLoading(true);
  try {
    const newGhostMode = !isGhostMode;
    
    if (!newGhostMode && activeSurveillance.isWatching) {
      await stopSurveillance();
    }
    
    const { error } = await supabase
      .from('admin_sessions')
      .upsert({
        admin_id: session.user.id,
        ghost_mode: newGhostMode,
        last_active_at: new Date().toISOString()
      });

    if (error) throw error;
    
    setIsGhostMode(newGhostMode);
  } catch (error) {
    console.error('Error toggling ghost mode:', error);
  } finally {
    setIsLoading(false);
  }
};

export const syncGhostModeState = async (
  userId: string,
  canUseGhostMode: boolean,
  setIsGhostMode: (state: boolean) => void,
  setIsLoading: (loading: boolean) => void
) => {
  if (!canUseGhostMode) return;
  
  setIsLoading(true);
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('ghost_mode')
      .eq('admin_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    setIsGhostMode(data?.ghost_mode || false);
  } catch (error) {
    console.error('Error syncing ghost mode:', error);
    setIsGhostMode(false);
  } finally {
    setIsLoading(false);
  }
};
