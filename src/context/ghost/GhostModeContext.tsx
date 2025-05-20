import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface GhostModeContextProps {
  isGhostModeEnabled: boolean;
  toggleGhostMode: () => void;
  ghostedProfile: any | null;
  setGhostedProfile: (profile: any | null) => void;
  refreshAlerts: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextProps | undefined>(
  undefined
);

export const GhostModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isGhostModeEnabled, setIsGhostModeEnabled] = useState(false);
  const [ghostedProfile, setGhostedProfile] = useState<any | null>(null);
  const session = useSession();

  const toggleGhostMode = () => {
    setIsGhostModeEnabled((prev) => !prev);
  };

  const refreshAlerts = useCallback(async () => {
    if (!session?.user) {
      console.warn('No user session found, cannot refresh alerts.');
      return;
    }

    try {
      const userId = session?.user?.id || '';
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (!user) {
        console.warn('No user profile found for the current session.');
        return;
      }

      // Fetch alerts for the user
      const { data: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false });

      if (alertsError) {
        console.error('Error fetching alerts:', alertsError);
        return;
      }

      console.log('Fetched alerts:', alerts);
    } catch (err) {
      console.error('Unexpected error refreshing alerts:', err);
    }
  }, [session?.user]);

  useEffect(() => {
    // Fetch initial ghosted profile on mount if ghost mode is enabled
    if (isGhostModeEnabled && session?.user) {
      const userId = session?.user?.id || '';
      const username = session?.user?.id ? user?.username || 'Anonymous' : 'Anonymous';

      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching ghosted profile:', error);
          } else {
            setGhostedProfile(data);
          }
        });
    } else {
      setGhostedProfile(null);
    }
  }, [isGhostModeEnabled, session?.user]);

  const value: GhostModeContextProps = {
    isGhostModeEnabled,
    toggleGhostMode,
    ghostedProfile,
    setGhostedProfile,
    refreshAlerts,
  };

  return (
    <GhostModeContext.Provider value={value}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = (): GhostModeContextProps => {
  const context = useContext(GhostModeContext);
  if (!context) {
    throw new Error('useGhostMode must be used within a GhostModeProvider');
  }
  return context;
};
