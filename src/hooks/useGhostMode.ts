
import { useGhostMode as useGhostModeContext } from "@/context/GhostModeContext";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGhostMode = () => {
  const { 
    isGhostMode, 
    toggleGhostMode, 
    isLoading, 
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  } = useGhostModeContext();
  const { isSuperAdmin, isLoading: isAdminCheckLoading } = useSuperAdminCheck();
  const session = useSession();
  const { toast } = useToast();
  const [hasFetchedLiveAlerts, setHasFetchedLiveAlerts] = useState(false);
  
  // Add real-time debugging and verification
  useEffect(() => {
    const checkAndVerify = async () => {
      if (!session?.user?.id) return;
      
      // Debug info for god mode user
      if (session?.user?.email === "hamzaishtiaq242@gmail.com") {
        console.log("God mode user detected in useGhostMode");
        console.log("isSuperAdmin status:", isSuperAdmin);
        console.log("Ghost mode active:", isGhostMode);
        console.log("Live alerts count:", liveAlerts.length);
        
        // Add additional debugging for profiles data
        if (liveAlerts.length > 0) {
          console.log("Sample alert username:", liveAlerts[0].username);
          console.log("Sample alert avatar_url:", liveAlerts[0].avatar_url);
        }
        
        if (activeSurveillance.isWatching && activeSurveillance.session) {
          console.log("Active surveillance:", activeSurveillance.session.type, activeSurveillance.session.username);
        }
        
        // Verify admin status if needed
        if (!isSuperAdmin && !isAdminCheckLoading) {
          console.warn("God mode user does not have super_admin role, attempting to verify...");
          try {
            const { data, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
              
            if (error) {
              console.error("Error checking admin role:", error);
            } else if (!data || data.role !== 'super_admin') {
              console.warn("User does not have super_admin role in database.");
              
              // Alert the user
              toast({
                title: "Admin Access Required",
                description: "You need super admin access to use ghost mode.",
                variant: "destructive"
              });
            }
          } catch (error) {
            console.error("Error verifying admin status:", error);
          }
        }
      }
    };
    
    checkAndVerify();
  }, [session, isSuperAdmin, isGhostMode, liveAlerts, activeSurveillance, isAdminCheckLoading, toast]);
  
  // Try to fetch alerts if we're an admin and haven't fetched them yet
  useEffect(() => {
    const fetchAlerts = async () => {
      if (isSuperAdmin && !hasFetchedLiveAlerts) {
        try {
          console.log("Attempting to fetch live alerts...");
          await refreshAlerts();
          setHasFetchedLiveAlerts(true);
        } catch (error) {
          console.error("Error fetching alerts:", error);
          // Don't show a toast here as this is handled by the context
        }
      }
    };
    
    fetchAlerts();
  }, [isSuperAdmin, hasFetchedLiveAlerts, refreshAlerts]);
  
  // Set up real-time subscription for alerts
  useEffect(() => {
    if (!isSuperAdmin || !session?.user?.id) return;
    
    const channel = supabase
      .channel('admin_alerts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'admin_alerts'
      }, () => {
        refreshAlerts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSuperAdmin, session?.user?.id, refreshAlerts]);
  
  return {
    isGhostMode: isSuperAdmin ? isGhostMode : false,
    toggleGhostMode,
    isLoading,
    canUseGhostMode: isSuperAdmin,
    activeSurveillance,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };
};
