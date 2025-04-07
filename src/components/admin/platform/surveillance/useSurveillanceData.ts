
import { useState, useEffect, useCallback } from "react";
import { useGhostMode } from "@/hooks/useGhostMode";
import { useSurveillance } from "./SurveillanceContext";
import { LiveSession } from "@/types/surveillance";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export function useSurveillanceData() {
  const { isGhostMode, liveAlerts, refreshAlerts } = useGhostMode();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = useSupabaseClient();
  
  const fetchSurveillanceData = useCallback(async () => {
    if (!isGhostMode) {
      setLiveSessions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching surveillance data...");
      
      // Fetch live streams
      const { data: streams, error: streamsError } = await supabase
        .from('live_streams')
        .select('*, creator:creator_id(username, avatar_url)')
        .eq('status', 'live')
        .order('started_at', { ascending: false })
        .limit(10);
        
      if (streamsError) {
        console.error("Error fetching streams:", streamsError);
      }
      
      // Fetch active calls
      const { data: calls, error: callsError } = await supabase
        .from('calls')
        .select('*, caller:caller_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(10);
        
      if (callsError) {
        console.error("Error fetching calls:", callsError);
      }
      
      // Fetch direct messages
      const { data: messages, error: messagesError } = await supabase
        .from('direct_messages')
        .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
      }
      
      // Fetch posts for content tab
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*, creator:creator_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (postsError) {
        console.error("Error fetching posts:", postsError);
      }
      
      // Transform data into LiveSession format
      const streamSessions: LiveSession[] = (streams || []).map(stream => ({
        id: stream.id,
        type: 'stream',
        user_id: stream.creator_id,
        creator_id: stream.creator_id,
        username: stream.creator?.username || 'Unknown',
        avatar_url: stream.creator?.avatar_url,
        created_at: stream.started_at,
        started_at: stream.started_at,
        title: stream.title,
        description: stream.description,
        thumbnail_url: stream.thumbnail_url,
        status: stream.status,
        viewer_count: stream.viewer_count,
        is_paused: false,
        media_url: stream.stream_url ? [stream.stream_url] : [],
        content_type: 'stream'
      }));
      
      const callSessions: LiveSession[] = (calls || []).map(call => ({
        id: call.id,
        type: 'call',
        user_id: call.caller_id,
        creator_id: call.caller_id,
        username: call.caller?.username || 'Unknown',
        avatar_url: call.caller?.avatar_url,
        created_at: call.started_at,
        started_at: call.started_at,
        recipient_id: call.recipient_id,
        recipient_username: call.recipient?.username,
        title: `Call with ${call.recipient?.username || 'User'}`,
        status: call.status,
        is_paused: false,
        media_url: [],
        content_type: 'call'
      }));
      
      const messageSessions: LiveSession[] = (messages || []).map(msg => ({
        id: msg.id,
        type: 'chat',
        user_id: msg.sender_id,
        creator_id: msg.sender_id,
        username: msg.sender?.username || 'Unknown',
        avatar_url: msg.sender?.avatar_url,
        created_at: msg.created_at,
        recipient_id: msg.recipient_id,
        recipient_username: msg.recipient?.username,
        content: msg.content,
        message_type: msg.message_type || 'text',
        status: 'active',
        is_paused: false,
        media_url: msg.media_url ? Array.isArray(msg.media_url) ? msg.media_url : [msg.media_url] : [],
        content_type: 'message'
      }));
      
      // Transform posts into LiveSession format for content
      const postSessions: LiveSession[] = (posts || []).map(post => ({
        id: post.id,
        type: 'content',
        user_id: post.creator_id,
        creator_id: post.creator_id,
        username: post.creator?.username || 'Unknown',
        avatar_url: post.creator?.avatar_url,
        created_at: post.created_at,
        title: post.content.substring(0, 30) + (post.content.length > 30 ? '...' : ''),
        content: post.content,
        status: post.visibility || 'public',
        is_paused: false,
        media_url: Array.isArray(post.media_url) ? post.media_url : post.media_url ? [post.media_url] : [],
        content_type: 'post'
      }));
      
      const allSessions = [
        ...streamSessions,
        ...callSessions,
        ...messageSessions,
        ...postSessions
      ];
      
      console.log(`Loaded ${allSessions.length} surveillance sessions`);
      setLiveSessions(allSessions);
      
      // Also refresh alerts
      if (refreshAlerts) {
        await refreshAlerts();
      }
      
    } catch (error) {
      console.error("Error fetching surveillance data:", error);
      setError("Failed to load surveillance data");
    } finally {
      setIsLoading(false);
    }
  }, [isGhostMode, supabase, refreshAlerts]);
  
  // Initial data fetch
  useEffect(() => {
    fetchSurveillanceData();
  }, [fetchSurveillanceData]);
  
  // Set up realtime subscriptions
  useEffect(() => {
    if (!isGhostMode) return;
    
    console.log("Setting up realtime subscriptions for surveillance");
    
    const streamsChannel = supabase
      .channel('ghost-streams-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_streams',
      }, () => {
        console.log('Streams updated, refreshing data');
        fetchSurveillanceData();
      })
      .subscribe();
      
    const postsChannel = supabase
      .channel('ghost-posts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, () => {
        console.log('Posts updated, refreshing data');
        fetchSurveillanceData();
      })
      .subscribe();
      
    const messagesChannel = supabase
      .channel('ghost-messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
      }, () => {
        console.log('Messages updated, refreshing data');
        fetchSurveillanceData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(streamsChannel);
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [isGhostMode, supabase, fetchSurveillanceData]);
  
  // Connect to the surveillance context
  const surveillanceContext = useSurveillance();
  
  // Return merged data
  return {
    isLoading: isLoading,
    liveSessions: liveSessions,
    liveAlerts: liveAlerts || [],
    error,
    refreshData: fetchSurveillanceData,
    // Also include data from context for backward compatibility
    ...surveillanceContext
  };
}
