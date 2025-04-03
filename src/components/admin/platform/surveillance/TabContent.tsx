
import { useState, useEffect } from "react";
import { LiveSession } from "./types";
import { useSurveillance } from "./SurveillanceContext";
import { SessionList } from "./SessionList";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface TabContentProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  activeTab?: string;
}

export const TabContent = ({ 
  sessions: initialSessions, 
  isLoading: initialLoading, 
  error: initialError,
  activeTab 
}: TabContentProps) => {
  const { handleStartSurveillance } = useSurveillance();
  const [filteredSessions, setFilteredSessions] = useState<LiveSession[]>(initialSessions);
  const [sessions, setSessions] = useState<LiveSession[]>(initialSessions);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(initialError || null);
  const supabase = useSupabaseClient();
  
  // Fetch data based on active tab
  useEffect(() => {
    const fetchTabData = async () => {
      if (!activeTab) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching data for tab: ${activeTab}`);
        let data: LiveSession[] = [];
        
        switch (activeTab) {
          case 'chats': {
            const { data: messages, error: messagesError } = await supabase
              .from('direct_messages')
              .select('*, sender:sender_id(username, avatar_url), recipient:recipient_id(username, avatar_url)')
              .order('created_at', { ascending: false })
              .limit(50);
              
            if (messagesError) {
              console.error("Error fetching messages:", messagesError);
              setError("Failed to load direct messages");
            } else if (messages) {
              data = messages.map(msg => ({
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
              console.log(`Loaded ${data.length} direct messages`);
            }
            break;
          }
          
          case 'content': {
            const { data: posts, error: postsError } = await supabase
              .from('posts')
              .select('*, creator:creator_id(username, avatar_url)')
              .order('created_at', { ascending: false })
              .limit(50);
              
            if (postsError) {
              console.error("Error fetching posts:", postsError);
              setError("Failed to load content");
            } else if (posts) {
              data = posts.map(post => ({
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
              console.log(`Loaded ${data.length} posts`);
            }
            break;
          }
          
          default:
            // For other tabs, use the data passed from parent
            data = initialSessions;
        }
        
        setSessions(data);
        setFilteredSessions(data);
      } catch (err) {
        console.error(`Error fetching data for tab ${activeTab}:`, err);
        setError(`Failed to load ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTabData();
  }, [activeTab, supabase, initialSessions]);
  
  // Define type options based on the active tab
  const getTypeOptions = () => {
    switch (activeTab) {
      case 'streams':
        return [
          { value: 'all', label: 'All Streams' },
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'gaming', label: 'Gaming' },
          { value: 'performance', label: 'Performance' }
        ];
      case 'calls':
        return [
          { value: 'all', label: 'All Calls' },
          { value: 'video', label: 'Video Call' },
          { value: 'voice', label: 'Voice Call' },
          { value: 'group', label: 'Group Call' }
        ];
      case 'chats':
        return [
          { value: 'all', label: 'All Messages' },
          { value: 'text', label: 'Text' },
          { value: 'media', label: 'Media' },
          { value: 'video', label: 'Video' }
        ];
      case 'bodycontact':
        return [
          { value: 'all', label: 'All Ads' },
          { value: 'dating', label: 'Dating' },
          { value: 'casual', label: 'Casual' },
          { value: 'friendship', label: 'Friendship' }
        ];
      case 'content':
        return [
          { value: 'all', label: 'All Content' },
          { value: 'post', label: 'Posts' },
          { value: 'video', label: 'Videos' },
          { value: 'photo', label: 'Photos' }
        ];
      default:
        return [{ value: 'all', label: 'All Types' }];
    }
  };
  
  // Get status options based on active tab
  const getStatusOptions = () => {
    const commonOptions = [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ];
    
    if (activeTab === 'bodycontact') {
      return [
        ...commonOptions,
        { value: 'pending', label: 'Pending Review' },
        { value: 'flagged', label: 'Flagged' },
      ];
    }
    
    if (activeTab === 'content') {
      return [
        ...commonOptions,
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'deleted', label: 'Deleted' },
      ];
    }
    
    return commonOptions;
  };
  
  const handleSearch = (filters: SearchFilter) => {
    // Filter sessions based on the search criteria
    const filtered = sessions.filter(session => {
      // Filter by username/ID
      if (filters.username && !session.username?.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      if (filters.userId && session.user_id !== filters.userId) {
        return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'all' && session.status !== filters.status) {
        return false;
      }
      
      // Filter by content type
      if (filters.type && filters.type !== 'all' && session.content_type !== filters.type) {
        return false;
      }
      
      return true;
    });
    
    setFilteredSessions(filtered);
  };
  
  return (
    <div className="space-y-4">
      <SearchFilterBar 
        onSearch={handleSearch}
        placeholder={`Search ${activeTab}...`}
        availableTypes={getTypeOptions()}
        availableStatuses={getStatusOptions()}
      />
      
      <SessionList
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleStartSurveillance}
        activeTab={activeTab}
      />
    </div>
  );
};
