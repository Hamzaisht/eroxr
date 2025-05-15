
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useSession } from "@supabase/auth-helpers-react";

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => void;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

interface GhostModeProviderProps {
  children: ReactNode;
}

export const GhostModeProvider: React.FC<GhostModeProviderProps> = ({ children }) => {
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const session = useSession();

  const toggleGhostMode = () => {
    setIsGhostMode(prev => !prev);
  };

  // Only provide ghost mode functionality if user is logged in
  return (
    <GhostModeContext.Provider value={{ isGhostMode, toggleGhostMode }}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = (): GhostModeContextType => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  return context;
};
