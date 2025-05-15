
import { useState, useEffect, createContext, useContext } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { safeDataAccess } from '@/utils/supabase/helpers';

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  isLoading: boolean;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: async () => {},
  isLoading: false,
});

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  // Check if the user is an admin
  const { data: userRole } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });
  
  // Make sure user role is safe to access
  const safeUserRole = safeDataAccess(userRole, { role: 'user' });
  const isAdmin = safeUserRole?.role === 'admin' || safeUserRole?.role === 'superadmin';

  // Check if ghost mode is active
  const { data: adminSession, refetch } = useQuery({
    queryKey: ['admin-session', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !isAdmin) return null;
      
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('ghost_mode')
        .eq('admin_id', session.user.id)
        .is('ghost_mode', true)
        .single();
        
      if (error && error.code !== 'PGRST116') { // No rows returned error code
        console.error('Error fetching ghost mode status:', error);
      }
      
      return data;
    },
    enabled: !!session?.user?.id && isAdmin,
  });
  
  useEffect(() => {
    if (adminSession?.ghost_mode) {
      setIsGhostMode(true);
    } else {
      setIsGhostMode(false);
    }
  }, [adminSession]);

  const toggleGhostMode = async () => {
    if (!session?.user?.id || !isAdmin) return;
    
    setIsLoading(true);
    
    try {
      if (isGhostMode) {
        // Disable ghost mode
        const { error } = await supabase
          .from('admin_sessions')
          .update({ ghost_mode: false })
          .eq('admin_id', session.user.id);
          
        if (error) throw error;
      } else {
        // Enable ghost mode
        // First check if an admin session exists
        const { data: existingSession, error: checkError } = await supabase
          .from('admin_sessions')
          .select('id')
          .eq('admin_id', session.user.id)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') throw checkError; 
        
        if (existingSession) {
          // Update existing session
          const { error } = await supabase
            .from('admin_sessions')
            .update({ ghost_mode: true })
            .eq('admin_id', session.user.id);
            
          if (error) throw error;
        } else {
          // Create new session
          const { error } = await supabase
            .from('admin_sessions')
            .insert({
              admin_id: session.user.id,
              ghost_mode: true,
              activated_at: new Date().toISOString(),
            });
            
          if (error) throw error;
        }
      }
      
      // Refetch to update state
      await refetch();
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <GhostModeContext.Provider value={{ isGhostMode, toggleGhostMode, isLoading }}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);
