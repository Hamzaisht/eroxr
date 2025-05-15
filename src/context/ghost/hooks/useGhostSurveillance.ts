
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toDbValue } from '@/utils/supabase/helpers';
import { useIsMobile } from '@/hooks/use-mobile';

interface SurveillanceSession {
  id: string;
  user_id: string;
  session_type: string;
  started_at: string;
  status: string;
  data: any;
}

export function useGhostSurveillance() {
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<SurveillanceSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<SurveillanceSession | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const checkSurveillanceStatus = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('ghost_mode')
        .eq('admin_id', toDbValue(session.user.id))
        .single();
      
      if (error) {
        // If no record found, surveillance is not active
        setIsActive(false);
        return;
      }
      
      setIsActive(!!data?.ghost_mode);
    } catch (error) {
      console.error('Error checking surveillance status:', error);
      setIsActive(false);
    }
  };

  const toggleSurveillance = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    
    try {
      // Check if admin session exists
      const { data: existingSession, error: checkError } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('admin_id', toDbValue(session.user.id))
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Real error, not just "no rows found"
        throw checkError;
      }
      
      if (existingSession) {
        // Update existing session
        const { error: updateError } = await supabase
          .from('admin_sessions')
          .update({
            ghost_mode: !isActive,
            last_active_at: new Date().toISOString(),
          })
          .eq('admin_id', toDbValue(session.user.id));
          
        if (updateError) throw updateError;
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('admin_sessions')
          .insert({
            admin_id: session.user.id,
            ghost_mode: true,
            activated_at: new Date().toISOString(),
          });
          
        if (insertError) throw insertError;
      }
      
      setIsActive(!isActive);
      
      toast({
        title: !isActive ? 'Ghost Mode Activated' : 'Ghost Mode Deactivated',
        description: !isActive ? 'You are now invisible to users' : 'Users can now see your activity',
      });
    } catch (error) {
      console.error('Error toggling surveillance mode:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle ghost mode',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get available surveillance sessions
  const fetchSessions = async () => {
    if (!session?.user?.id || !isActive) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('surveillance_sessions')
        .select('*')
        .eq('status', toDbValue('active'))
        .order('started_at', { ascending: false });
        
      if (error) throw error;
      
      setSessions(data as SurveillanceSession[]);
    } catch (error) {
      console.error('Error fetching surveillance sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Join a surveillance session
  const joinSession = (sessionId: string) => {
    const selectedSession = sessions.find(s => s.id === sessionId);
    if (selectedSession) {
      setActiveSession(selectedSession);
      
      // Mobile warning
      if (isMobile) {
        toast({
          title: 'Mobile Warning',
          description: 'Surveillance mode is optimized for desktop. Some features may be limited on mobile.',
        });
      }
    }
  };

  // Leave the current surveillance session
  const leaveSession = () => {
    setActiveSession(null);
  };

  // Initialize
  useEffect(() => {
    if (session?.user?.id) {
      checkSurveillanceStatus();
    }
  }, [session?.user?.id]);

  // Fetch sessions when ghost mode is activated
  useEffect(() => {
    if (isActive) {
      fetchSessions();
    }
  }, [isActive]);

  return {
    isActive,
    loading,
    toggleSurveillance,
    sessions,
    activeSession,
    joinSession,
    leaveSession,
    refreshSessions: fetchSessions,
  };
}
