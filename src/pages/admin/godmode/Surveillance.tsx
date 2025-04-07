
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "@/components/admin/platform/GhostModeToggle";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { LiveSession } from "@/types/surveillance";
import { GhostModePrompt } from "@/components/admin/platform/surveillance/GhostModePrompt";
import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSurveillanceData } from "@/components/admin/platform/surveillance/useSurveillanceData";

export default function Surveillance() {
  const { isGhostMode, liveAlerts, refreshAlerts, startSurveillance, canUseGhostMode } = useGhostMode();
  const supabase = useSupabaseClient();
  const { liveSessions, isLoading, error } = useSurveillanceData();
  
  // Fetch alerts and surveillance data when component mounts or ghost mode changes
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
      
      // Set up realtime subscriptions for new messages and content
      const setupRealtimeChannels = () => {
        console.log("Setting up realtime channels for surveillance data");
        
        // Messages channel
        const messagesChannel = supabase
          .channel('direct-messages-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'direct_messages',
          }, (payload) => {
            console.log('New message activity:', payload);
            refreshAlerts();
          })
          .subscribe();
          
        // Posts channel  
        const postsChannel = supabase
          .channel('posts-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'posts',
          }, (payload) => {
            console.log('New post activity:', payload);
            refreshAlerts();
          })
          .subscribe();
        
        return { messagesChannel, postsChannel };
      };
      
      const channels = setupRealtimeChannels();
      
      // Clean up subscriptions
      return () => {
        supabase.removeChannel(channels.messagesChannel);
        supabase.removeChannel(channels.postsChannel);
      };
    }
  }, [isGhostMode, refreshAlerts, supabase]);
  
  // If ghost mode is not enabled, show the prompt
  if (!isGhostMode && canUseGhostMode) {
    return (
      <div className="space-y-4">
        <AdminHeader 
          title="Ghost Mode Surveillance" 
          section="Surveillance" 
          actionButton={<GhostModeToggle />}
        />
        <GhostModePrompt />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Ghost Mode Surveillance" 
        section="Surveillance" 
        actionButton={<GhostModeToggle />}
      />
      
      <SurveillanceProvider
        liveAlerts={liveAlerts || []}
        refreshAlerts={refreshAlerts}
        startSurveillance={startSurveillance}
      >
        <SurveillanceTabs 
          liveAlerts={liveAlerts || []} 
          onSelectAlert={(alert) => {
            if (alert?.session) {
              startSurveillance(alert.session);
            }
          }}
        />
      </SurveillanceProvider>
    </div>
  );
}
