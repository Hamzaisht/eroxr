
import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LiveSession } from "@/types/surveillance";
import { useGhostMode } from "@/hooks/useGhostMode";

export function useLiveSurveillanceData() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = useSupabaseClient();
  const { isGhostMode } = useGhostMode();
  
  const fetchActiveSessions = useCallback(async () => {
    if (!isGhostMode) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching active surveillance sessions...");
      
      // Fetch direct messages with user profiles
      const { data: messages, error: messagesError } = await supabase
        .from('direct_messages')
        .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      } else {
        console.log("Fetched messages:", messages?.length || 0);
      }
      
      // Fetch posts with creator profiles
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*, creator:creator_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        console.log("Fetched posts:", posts?.length || 0);
      }
      
      // Fetch active streams
      const { data: streams, error: streamsError } = await supabase
        .from('live_streams')
        .select('*, creator:creator_id(username, avatar_url)')
        .eq('status', 'live')
        .order('started_at', { ascending: false })
        .limit(10);
        
      if (streamsError) {
        console.error("Error fetching streams:", streamsError);
      }
      
      // Transform messages into LiveSession format
      const messageSessions: LiveSession[] = (messages || []).map(msg => ({
        id: msg.id,
        type: "chat",
        user_id: msg.sender_id,
        created_at: msg.created_at,
        media_url: msg.media_url || [],
        username: msg.sender?.username || "Unknown",
        avatar_url: msg.sender?.avatar_url,
        content: msg.content || "",
        content_type: msg.message_type || "text",
        status: "active",
        message_type: msg.message_type || "text",
        recipient_id: msg.recipient_id,
        recipient_username: msg.recipient?.username,
        sender_username: msg.sender?.username,
      }));
      
      // Transform posts into LiveSession format
      const postSessions: LiveSession[] = (posts || []).map(post => ({
        id: post.id,
        type: "content",
        user_id: post.creator_id,
        created_at: post.created_at,
        media_url: post.media_url || [],
        username: post.creator?.username || "Unknown",
        avatar_url: post.creator?.avatar_url,
        content: post.content || "",
        content_type: "post",
        status: post.visibility || "public",
        title: `Post by ${post.creator?.username || "Unknown"}`,
        tags: post.tags,
      }));
      
      // Transform streams into LiveSession format
      const streamSessions: LiveSession[] = (streams || []).map(stream => ({
        id: stream.id,
        type: "stream",
        user_id: stream.creator_id,
        created_at: stream.started_at || stream.created_at,
        started_at: stream.started_at,
        media_url: stream.playback_url ? [stream.playback_url] : [],
        username: stream.creator?.username || "Unknown",
        avatar_url: stream.creator?.avatar_url,
        content_type: "stream",
        status: stream.status,
        title: stream.title,
        description: stream.description,
        viewer_count: stream.viewer_count,
      }));
      
      const allSessions = [...messageSessions, ...postSessions, ...streamSessions];
      
      setSessions(allSessions);
      console.log(`Total active sessions: ${allSessions.length}`);
    } catch (error) {
      console.error("Error in fetchActiveSessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, supabase]);
  
  // Setup realtime subscription
  useEffect(() => {
    if (!isGhostMode) return;
    
    console.log("Setting up realtime subscriptions for surveillance data");
    
    const messagesChannel = supabase
      .channel('surveillance-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
      }, () => {
        console.log('Message activity detected, refreshing data');
        fetchActiveSessions();
      })
      .subscribe();
      
    const postsChannel = supabase
      .channel('surveillance-posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, () => {
        console.log('Post activity detected, refreshing data');
        fetchActiveSessions();
      })
      .subscribe();
      
    const streamsChannel = supabase
      .channel('surveillance-streams')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_streams',
      }, () => {
        console.log('Stream activity detected, refreshing data');
        fetchActiveSessions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(streamsChannel);
    };
  }, [isGhostMode, supabase, fetchActiveSessions]);
  
  // Initial fetch
  useEffect(() => {
    if (isGhostMode) {
      fetchActiveSessions();
    }
  }, [isGhostMode, fetchActiveSessions]);
  
  return {
    sessions,
    isLoading,
    fetchActiveSessions
  };
}
