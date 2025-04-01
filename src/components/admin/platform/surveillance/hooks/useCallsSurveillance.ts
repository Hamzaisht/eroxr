
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types"; // Updated import path

export function useCallsSurveillance() {
  const { toast } = useToast();
  const session = useSession();

  const fetchCalls = useCallback(async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data: calls, error: callsError } = await supabase
        .rpc('get_active_calls');
        
      if (callsError) {
        console.error("Error fetching calls:", callsError);
        return [];
      }
      
      return (calls || []).map((call: any) => ({
        id: call.id,
        type: 'call' as const,
        user_id: call.initiator_id,
        username: call.username || 'Unknown',
        avatar_url: call.avatar_url || '',
        started_at: call.started_at,
        participants: call.participant_count,
        status: 'active',
        content_type: call.call_type,
        created_at: call.started_at,
        recipient_id: call.recipient_id,
        recipient_username: call.recipient_username || 'Unknown',
        recipient_avatar: call.recipient_avatar || '',
        media_url: [], // Add empty media_url array to match the LiveSession type
      }));
    } catch (error) {
      console.error("Error fetching calls:", error);
      toast({
        title: "Error",
        description: "Could not load active calls",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchCalls };
}
