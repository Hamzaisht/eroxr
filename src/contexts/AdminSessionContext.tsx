import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth, AdminUser } from '@/hooks/useAdminAuth';
import { useGhostMode } from '@/hooks/useGhostMode';

interface AdminSessionContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  logGhostAction: (action: string, targetType?: string, targetId?: string, details?: any) => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export const AdminSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAdmin, adminUser, isLoading: authLoading } = useAdminAuth();
  const ghostMode = useGhostMode();
  
  // Temporary logGhostAction until full implementation
  const logGhostAction = async (action: string, targetType?: string, targetId?: string, details?: any) => {
    console.log('Ghost action:', { action, targetType, targetId, details });
  };

  const contextValue: AdminSessionContextType = {
    isAdmin,
    adminUser,
    isLoading: authLoading,
    isGhostMode: false, // Temporary
    toggleGhostMode: async () => {}, // Temporary
    logGhostAction
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