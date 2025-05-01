import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { LiveSession } from "@/types/surveillance";
import { LiveAlert } from "@/types/alerts";

// Active Surveillance State
export interface ActiveSurveillanceState {
  isWatching: boolean;
  session: any | null;
  startTime: string;
  userId?: string;
  active?: boolean;
  targetUserId?: string;
  startedAt?: Date;
  duration?: number;
  sessionId?: string;
  deviceId?: any;
}

export const useGhostMode = () => {
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  const [activeSurveillance, setActiveSurveillance] = useState<ActiveSurveillanceState>({
    isWatching: false,
    session: null,
    startTime: "",
    active: false,
    userId: undefined,
    targetUserId: undefined,
    startedAt: undefined,
    duration: undefined,
    sessionId: undefined,
    deviceId: undefined
  });
  
  const { toast } = useToast();
  const session = useSession();
  const auth = session;

  const toggleGhostMode = useCallback(() => {
    setIsGhostMode((prev) => !prev);
  }, []);

  const refreshAlerts = useCallback(async () => {
    setLoadingAlerts(true);
    try {
      const { data, error } = await supabase
        .from("live_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching alerts:", error);
        toast({
          title: "Error fetching alerts",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLiveAlerts(data || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching alerts:", error);
      toast({
        title: "Unexpected error",
        description: error.message || "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setLoadingAlerts(false);
    }
  }, [toast]);

  const startSurveillance = useCallback(async (session: LiveSession) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("active_surveillance").insert([
        {
          user_id: auth?.user?.id,
          session_id: session.id,
          target_user_id: session.user_id,
          start_time: new Date().toISOString(),
          active: true,
          device_id: session.device_id,
        },
      ]);
      
      if (error) {
        console.error("Error starting surveillance:", error);
        toast({
          title: "Error starting surveillance",
          description: error.message,
          variant: "destructive",
        });
        return false;
      } else {
        setActiveSurveillance({
          isWatching: true,
          session,
          startTime: new Date().toISOString(),
          active: true,
          userId: auth?.user?.id,
          targetUserId: session.user_id,
          startedAt: new Date(),
          sessionId: session.id
        });
        return true;
      }
    } catch (error: any) {
      console.error("Unexpected error starting surveillance:", error);
      toast({
        title: "Unexpected error",
        description: error.message || "Failed to start surveillance",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth?.user?.id, toast]);

  const stopSurveillance = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("active_surveillance")
        .update({ active: false })
        .eq("user_id", auth?.user?.id)
        .eq("active", true);
      
      if (error) {
        console.error("Error stopping surveillance:", error);
        toast({
          title: "Error stopping surveillance",
          description: error.message,
          variant: "destructive",
        });
        return false;
      } else {
        setActiveSurveillance({
          isWatching: false,
          session: null,
          startTime: "",
          active: false,
          userId: auth?.user?.id,
          targetUserId: undefined,
          startedAt: undefined,
          sessionId: undefined
        });
        return true;
      }
    } catch (error: any) {
      console.error("Unexpected error stopping surveillance:", error);
      toast({
        title: "Unexpected error",
        description: error.message || "Failed to stop surveillance",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth?.user?.id, toast]);

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const { data, error } = await supabase
          .from("active_surveillance")
          .select("*")
          .eq("user_id", auth?.user?.id)
          .eq("active", true)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching active surveillance:", error);
          toast({
            title: "Error fetching active surveillance",
            description: error.message,
            variant: "destructive",
          });
        } else if (data) {
          // Parse the start_time string into a Date object
          const startedAt = data.start_time ? new Date(data.start_time) : undefined;
          
          // Return parsed data from log
          const sessionData = {
            active: activeSurveillance.active,
            targetUserId: activeSurveillance.targetUserId,
            startedAt: activeSurveillance.startedAt,
            duration: activeSurveillance.duration,
            isWatching: activeSurveillance.isWatching,
            session: activeSurveillance.session,
            startTime: activeSurveillance.startTime,
            userId: activeSurveillance.userId,
            sessionId: activeSurveillance.sessionId,
            deviceId: activeSurveillance.deviceId
          };
          
          setActiveSurveillance({
            isWatching: true,
            session: data,
            startTime: data.start_time,
            active: data.active,
            userId: data.user_id,
            targetUserId: data.target_user_id,
            startedAt: startedAt,
            sessionId: data.session_id,
            deviceId: data.device_id
          });
        }
      } catch (error: any) {
        console.error("Unexpected error fetching active surveillance:", error);
        toast({
          title: "Unexpected error",
          description: error.message || "Failed to fetch active surveillance",
          variant: "destructive",
        });
      }
    };

    if (auth?.user) {
      fetchInitialState();
    }
  }, [auth?.user, toast]);

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  return {
    isGhostMode,
    toggleGhostMode,
    liveAlerts,
    refreshAlerts,
    startSurveillance,
    stopSurveillance,
    activeSurveillance,
    loading,
    loadingAlerts,
  };
};
