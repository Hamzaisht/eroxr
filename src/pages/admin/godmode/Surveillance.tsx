
import { SurveillanceTabs } from "@/components/admin/platform/surveillance/SurveillanceTabs";
import { useGhostMode } from "@/hooks/useGhostMode";
import { GhostModeToggle } from "@/components/admin/platform/GhostModeToggle";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { SurveillanceProvider } from "@/components/admin/platform/surveillance/SurveillanceContext";
import { LiveSession } from "@/types/surveillance";
import { GhostModePrompt } from "@/components/admin/platform/surveillance/GhostModePrompt";
import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSurveillanceData } from "@/components/admin/platform/surveillance/hooks/useSurveillanceData";
import { LiveAlert } from "@/types/alerts";

export default function Surveillance() {
  const { isGhostMode, liveAlerts, refreshAlerts, startSurveillance, canUseGhostMode } = useGhostMode();
  const supabase = useSupabaseClient();
  const { liveSessions, isLoading, error } = useSurveillanceData();
  
  useEffect(() => {
    if (isGhostMode) {
      refreshAlerts();
      
      const setupRealtimeChannels = () => {
        console.log("Setting up realtime channels for surveillance data");
        
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
      
      return () => {
        supabase.removeChannel(channels.messagesChannel);
        supabase.removeChannel(channels.postsChannel);
      };
    }
  }, [isGhostMode, refreshAlerts, supabase]);
  
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
  
  const typedAlerts = liveAlerts as LiveAlert[] || [];

  return (
    <div className="space-y-4">
      <AdminHeader 
        title="Ghost Mode Surveillance" 
        section="Surveillance" 
        actionButton={<GhostModeToggle />}
      />
      
      <SurveillanceProvider
        liveAlerts={typedAlerts}
        refreshAlerts={refreshAlerts}
        startSurveillance={startSurveillance}
      >
        <SurveillanceTabs 
          liveAlerts={typedAlerts} 
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
