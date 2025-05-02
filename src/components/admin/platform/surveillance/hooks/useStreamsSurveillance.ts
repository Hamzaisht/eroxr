
import { useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LiveSession } from "@/types/surveillance";

export function useStreamsSurveillance() {
  const supabase = useSupabaseClient();
  
  const fetchStreams = useCallback(async (): Promise<LiveSession[]> => {
    try {
      const { data, error } = await supabase
        .from("live_streams")
        .select(`
          *,
          creator:creator_id(id, username, avatar_url)
        `)
        .eq("status", "live")
        .order("started_at", { ascending: false })
        .limit(50);
        
      if (error) {
        throw new Error(`Error fetching streams: ${error.message}`);
      }
      
      return data.map(stream => ({
        id: stream.id,
        user_id: stream.creator_id,
        username: stream.creator?.username || "Unknown User",
        avatar_url: stream.creator?.avatar_url,
        title: stream.title,
        description: stream.description,
        type: "stream",
        status: stream.status,
        is_active: stream.status === "live",
        is_private: stream.is_private,
        viewer_count: stream.viewer_count || 0,
        started_at: stream.started_at || stream.created_at,
        created_at: stream.created_at,
        media_url: stream.playback_url ? [stream.playback_url] : [],
        content_type: "stream"
      }));
    } catch (error) {
      console.error("Error in fetchStreams:", error);
      return [];
    }
  }, [supabase]);

  return { fetchStreams };
}
