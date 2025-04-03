
import { createContext, useContext, useState, ReactNode } from "react"

type GhostModeContextType = {
  isGhostMode: boolean
  setIsGhostMode: (value: boolean) => void
}

export const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined)

export function useGhostModeContext() {
  const context = useContext(GhostModeContext)
  if (!context) throw new Error("useGhostModeContext must be used within GhostModeProvider")
  return context
}

export function GhostModeProvider({ children }: { children: ReactNode }) {
  const [isGhostMode, setIsGhostMode] = useState(false)

  return (
    <GhostModeContext.Provider value={{ isGhostMode, setIsGhostMode }}>
      {children}
    </GhostModeContext.Provider>
  )
}
