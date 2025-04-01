
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../../user-analytics/types";

export function useStreamsSurveillance() {
  const { toast } = useToast();
  const session = useSession();

  const fetchStreams = useCallback(async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data: streams, error: streamsError } = await supabase
        .from('live_streams')
        .select(`
          id,
          creator_id,
          title,
          description,
          status,
          started_at,
          viewer_count,
          profiles(username, avatar_url)
        `)
        .eq('status', 'live')
        .order('started_at', { ascending: false });
        
      if (streamsError) throw streamsError;
      
      return streams.map(stream => ({
        id: stream.id,
        type: 'stream',
        user_id: stream.creator_id,
        username: stream.profiles && stream.profiles[0] ? stream.profiles[0].username || 'Unknown' : 'Unknown',
        avatar_url: stream.profiles && stream.profiles[0] ? stream.profiles[0].avatar_url || null : null,
        started_at: stream.started_at,
        status: 'active',
        title: stream.title,
        description: stream.description,
        viewer_count: stream.viewer_count,
        content_type: 'video',
        created_at: stream.started_at,
      }));
    } catch (error) {
      console.error("Error fetching streams:", error);
      toast({
        title: "Error",
        description: "Could not load live streams",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchStreams };
}
