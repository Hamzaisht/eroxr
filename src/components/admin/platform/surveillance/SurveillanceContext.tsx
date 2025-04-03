
import React, { createContext, useContext, useState, useCallback } from "react";
import { useSurveillanceData } from "./hooks/useSurveillanceData";
import { LiveAlert, SurveillanceTab, LiveSession } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SurveillanceContextType {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
  liveSessions: LiveSession[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  handleStartSurveillance: (session: LiveSession) => Promise<boolean>;
  handleRefresh: () => Promise<void>;
  fetchLiveSessions: () => Promise<void>;
}

interface SurveillanceProviderProps {
  children: React.ReactNode;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
}

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

export const SurveillanceProvider = ({ 
  children,
  liveAlerts,
  refreshAlerts,
  startSurveillance
}: SurveillanceProviderProps) => {
  const { 
    activeTab,
    setActiveTab,
    liveSessions,
    isLoading,
    isRefreshing,
    setIsRefreshing,
    error,
    setError,
    fetchLiveSessions
  } = useSurveillanceData();
  
  const { toast } = useToast();
  
  // Handle refreshing the content
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Refresh alerts
      await refreshAlerts();
      
      // Refresh the live sessions for the current tab
      await fetchLiveSessions();
      
      toast({
        title: "Refreshed",
        description: "Surveillance data has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh surveillance data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshAlerts, fetchLiveSessions, setIsRefreshing, toast]);
  
  // Set up surveillance session
  const handleStartSurveillance = useCallback(async (session: LiveSession) => {
    try {
      // Log to admin_logs that admin started monitoring this session
      await supabase.from('admin_logs').insert({
        admin_id: supabase.auth.getUser().then(res => res.data.user?.id) || 'unknown',
        action: 'start_surveillance',
        action_type: 'monitoring',
        target_type: session.type,
        target_id: session.id,
        details: {
          session_type: session.type,
          username: session.username,
          started_at: new Date().toISOString()
        }
      });
      
      return await startSurveillance(session);
    } catch (error) {
      console.error("Error starting surveillance:", error);
      toast({
        title: "Error",
        description: "Could not start surveillance session",
        variant: "destructive"
      });
      return false;
    }
  }, [startSurveillance, toast]);
  
  // Subscribe to realtime updates for relevant tables based on active tab
  React.useEffect(() => {
    // Skip if not on a live content tab
    if (!['streams', 'calls', 'chats', 'bodycontact'].includes(activeTab)) {
      return;
    }
    
    // Determine which table to subscribe to based on active tab
    let table = '';
    switch (activeTab) {
      case 'streams': table = 'live_streams'; break;
      case 'calls': table = 'calls'; break;
      case 'chats': table = 'direct_messages'; break;
      case 'bodycontact': table = 'dating_ads'; break;
      default: return;
    }
    
    const channel = supabase
      .channel(`surveillance-${activeTab}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table
      }, () => {
        // Refresh data when changes occur
        console.log(`Detected change in ${table}, refreshing data`);
        fetchLiveSessions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, fetchLiveSessions]);
  
  const value: SurveillanceContextType = {
    activeTab,
    setActiveTab,
    liveSessions,
    isLoading,
    isRefreshing,
    error,
    handleStartSurveillance,
    handleRefresh,
    fetchLiveSessions
  };
  
  return (
    <SurveillanceContext.Provider value={value}>
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => {
  const context = useContext(SurveillanceContext);
  if (context === undefined) {
    throw new Error("useSurveillance must be used within a SurveillanceProvider");
  }
  return context;
};
