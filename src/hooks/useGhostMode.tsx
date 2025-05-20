
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GhostModeContextType {
  isGhostMode: boolean;
  setIsGhostMode: (value: boolean) => void;
  toggleGhostMode: () => void;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (!context) {
    throw new Error('useGhostMode must be used within a GhostModeProvider');
  }
  return context;
};

export const GhostModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);

  const toggleGhostMode = () => setIsGhostMode((prev) => !prev);

  return (
    <GhostModeContext.Provider
      value={{
        isGhostMode,
        setIsGhostMode,
        toggleGhostMode,
      }}
    >
      {children}
    </GhostModeContext.Provider>
  );
};
