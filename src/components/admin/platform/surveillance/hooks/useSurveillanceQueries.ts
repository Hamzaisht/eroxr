
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { LiveSession } from "@/types/surveillance";

export function useSurveillanceQueries() {
  const supabase = useSupabaseClient();

  const fetchStreams = async (): Promise<LiveSession[]> => {
    const { data, error } = await supabase
      .from("live_streams")
      .select("*, creator:creator_id(username, avatar_url)")
      .eq("status", "live")
      .limit(10);
      
    if (error) throw error;
    console.log(`Fetched ${data?.length || 0} streams for surveillance`);
    
    return data?.map(stream => ({
      id: stream.id,
      type: "stream",
      user_id: stream.creator_id,
      username: stream.creator?.username || "Unknown",
      created_at: stream.created_at,
      title: stream.title,
      description: stream.description,
      status: stream.status,
      media_url: stream.playback_url ? [stream.playback_url] : []
    })) || [];
  };
  
  const fetchMessages = async (): Promise<LiveSession[]> => {
    const { data, error } = await supabase
      .from("direct_messages")
      .select("*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(10);
      
    if (error) throw error;
    console.log(`Fetched ${data?.length || 0} chats for surveillance`);
    
    return data?.map(msg => ({
      id: msg.id,
      type: "chat",
      user_id: msg.sender_id,
      username: msg.sender?.username || "Unknown",
      recipient_username: msg.recipient?.username,
      created_at: msg.created_at,
      content: msg.content,
      status: "active", // Set a default status for chats
      media_url: msg.media_url ? (Array.isArray(msg.media_url) ? msg.media_url : [msg.media_url]) : []
    })) || [];
  };

  return {
    fetchStreams,
    fetchMessages,
  };
}
