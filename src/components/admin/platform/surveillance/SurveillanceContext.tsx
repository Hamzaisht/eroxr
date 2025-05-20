
import { createContext, useContext, useState, ReactNode } from "react";
import { LiveSession, SurveillanceTab } from "@/types/surveillance";

interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
  error: string | null;
  setError: (error: string | null) => void;
  liveSessions: LiveSession[];
  setLiveSessions: (sessions: LiveSession[]) => void;
  selectedSession: LiveSession | null;
  setSelectedSession: (session: LiveSession | null) => void;
  isMonitoring: boolean;
  setIsMonitoring: (isMonitoring: boolean) => void;
  monitoringSession: string | null;
  setMonitoringSession: (sessionId: string | null) => void;
  filterSessions: (type?: string) => LiveSession[];
  startMonitoring: (sessionId: string) => Promise<boolean>;
  stopMonitoring: () => void;
}

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

export function SurveillanceProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<SurveillanceTab>('streams');
  const [error, setError] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringSession, setMonitoringSession] = useState<string | null>(null);

  // Filter sessions based on type
  const filterSessions = (type?: string) => {
    if (!type) return liveSessions;
    return liveSessions.filter(session => session.type === type);
  };

  // Start monitoring a session
  const startMonitoring = async (sessionId: string): Promise<boolean> => {
    try {
      const session = liveSessions.find(s => s.id === sessionId);
      if (!session) {
        setError("Session not found");
        return false;
      }

      setSelectedSession(session);
      setIsMonitoring(true);
      setMonitoringSession(sessionId);
      return true;
    } catch (error) {
      console.error("Error starting monitoring:", error);
      setError("Failed to start monitoring");
      return false;
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    setMonitoringSession(null);
  };

  // Mock live sessions for development
  const mockSessions: LiveSession[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      username: "creator1",
      avatar_url: "https://i.pravatar.cc/150?u=1",
      user_id: "user-123",
      type: "stream",
      status: "active",
      room_id: "room-123",
      title: "Live Gaming Stream",
      description: "Playing the latest games",
      viewer_count: 125,
      started_at: new Date().toISOString(),
      thumbnail_url: "https://picsum.photos/seed/stream1/300/200",
      created_at: new Date().toISOString(),
      is_active: true,
      content: "Live gaming content",
      media_url: ["https://picsum.photos/seed/stream1/800/600"]
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      username: "creator2",
      avatar_url: "https://i.pravatar.cc/150?u=2",
      user_id: "user-456",
      type: "chat",
      status: "active",
      room_id: "room-456",
      title: "Private Chat Session",
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_active: true,
      content: "Private chat content",
      media_url: ["https://picsum.photos/seed/chat1/800/600"]
    }
  ];

  return (
    <SurveillanceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        error,
        setError,
        liveSessions: mockSessions, // Use mock data for development
        setLiveSessions,
        selectedSession,
        setSelectedSession,
        isMonitoring,
        setIsMonitoring,
        monitoringSession,
        setMonitoringSession,
        filterSessions,
        startMonitoring,
        stopMonitoring
      }}
    >
      {children}
    </SurveillanceContext.Provider>
  );
}

export const useSurveillance = () => {
  const context = useContext(SurveillanceContext);
  if (context === undefined) {
    throw new Error("useSurveillance must be used within a SurveillanceProvider");
  }
  return context;
};
