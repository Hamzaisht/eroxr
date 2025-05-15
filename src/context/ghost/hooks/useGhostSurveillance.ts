
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useGhostMode } from '@/hooks/useGhostMode';
import { toDbValue } from '@/utils/supabase/helpers';

export interface SurveillanceTarget {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  surveillance_reason: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
}

export const useGhostSurveillance = () => {
  const [activeSurveillance, setActiveSurveillance] = useState<SurveillanceTarget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { isGhostMode } = useGhostMode();

  // Fetch active surveillance targets
  const fetchActiveSurveillance = async () => {
    if (!session?.user?.id || !isGhostMode) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('surveillance_targets')
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .eq('is_active', toDbValue(true))
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      
      // Format the data to include profile info
      const formattedData = data.map(target => ({
        ...target,
        username: target.profiles?.username,
        avatar_url: target.profiles?.avatar_url
      }));
      
      setActiveSurveillance(formattedData);
    } catch (error) {
      console.error('Error fetching surveillance targets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start surveillance on a user
  const startSurveillance = async (userId: string, reason: string) => {
    if (!session?.user?.id || !isGhostMode) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('surveillance_targets')
        .insert({
          user_id: userId,
          admin_id: session.user.id,
          surveillance_reason: reason,
          start_time: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Fetch user profile for display
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', toDbValue(userId))
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      // Add the new surveillance target to the state
      setActiveSurveillance(prev => [{
        ...data,
        username: profileData?.username,
        avatar_url: profileData?.avatar_url
      }, ...prev]);
      
      return data.id;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // End surveillance
  const endSurveillance = async (surveillanceId: string) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('surveillance_targets')
        .update({
          is_active: false,
          end_time: new Date().toISOString()
        })
        .eq('id', toDbValue(surveillanceId));
        
      if (error) throw error;
      
      // Remove the target from active surveillance
      setActiveSurveillance(prev => 
        prev.filter(target => target.id !== surveillanceId)
      );
      
      return true;
    } catch (error) {
      console.error('Error ending surveillance:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (isGhostMode) {
      fetchActiveSurveillance();
    }
  }, [isGhostMode, session?.user?.id]);

  // Subscribe to surveillance updates
  useEffect(() => {
    if (!isGhostMode || !session?.user?.id) return;
    
    const channel = supabase
      .channel('ghost-surveillance')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'surveillance_targets'
      }, () => {
        // Refetch on any changes
        fetchActiveSurveillance();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isGhostMode, session?.user?.id]);

  return {
    activeSurveillance,
    isLoading,
    startSurveillance,
    endSurveillance,
    refresh: fetchActiveSurveillance
  };
};
