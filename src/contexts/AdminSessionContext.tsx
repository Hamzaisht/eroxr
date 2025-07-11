import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth, AdminUser } from '@/hooks/useAdminAuth';
import { useGhostMode } from '@/hooks/useGhostMode';
import { supabase } from '@/integrations/supabase/client';

interface AdminSessionContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  logGhostAction: (action: string, targetType?: string, targetId?: string, details?: any) => Promise<void>;
  canUseGhostMode: boolean;
  liveAlerts: any[];
  refreshAlerts: () => Promise<boolean>;
  startSurveillance: (session: any) => Promise<boolean>;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export const AdminSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAdmin, adminUser, isLoading: authLoading } = useAdminAuth();
  const { 
    isGhostMode, 
    isLoading: ghostLoading, 
    toggleGhostMode, 
    canUseGhostMode,
    liveAlerts,
    refreshAlerts,
    startSurveillance
  } = useGhostMode();
  
  const logGhostAction = async (action: string, targetType?: string, targetId?: string, details?: any) => {
    if (!adminUser?.id) return;
    
    try {
      await supabase.from('admin_action_logs').insert({
        admin_id: adminUser.id,
        action,
        action_type: 'ghost_mode',
        target_type: targetType,
        target_id: targetId,
        details: details || {},
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log ghost action:', error);
    }
  };

  const contextValue: AdminSessionContextType = {
    isAdmin,
    adminUser,
    isLoading: authLoading || ghostLoading,
    isGhostMode,
    toggleGhostMode,
    logGhostAction,
    canUseGhostMode,
    liveAlerts,
    refreshAlerts,
    startSurveillance
  };

  return (
    <AdminSessionContext.Provider value={contextValue}>
      {children}
    </AdminSessionContext.Provider>
  );
};

export const useAdminSession = () => {
  const context = useContext(AdminSessionContext);
  if (context === undefined) {
    throw new Error('useAdminSession must be used within an AdminSessionProvider');
  }
  return context;
};