
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";

export function useStreamsSurveillance() {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchStreams = async (): Promise<LiveSession[]> => {
    setIsLoading(true);
    
    try {
      // Get all active streams with creator profiles
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          id, 
          creator_id,
          title,
          description,
          status,
          started_at,
          viewer_count,
          is_private,
          profiles:creator_id(username, avatar_url)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });
      
      if (error) throw error;
      
      // Transform to LiveSession format
      return data.map(stream => ({
        id: stream.id,
        user_id: stream.creator_id,
        username: stream.profiles?.[0]?.username || 'Unknown streamer',
        avatar_url: stream.profiles?.[0]?.avatar_url || null,
        title: stream.title,
        description: stream.description || '',
        type: 'stream',
        status: stream.status,
        is_private: stream.is_private,
        viewer_count: stream.viewer_count,
        started_at: stream.started_at,
        created_at: stream.started_at,
        media_url: [],
        content_type: 'stream'
      }));
    } catch (error) {
      console.error("Error fetching live streams:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return { fetchStreams, isLoading };
}
