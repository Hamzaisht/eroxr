import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Eye, Download, AlertTriangle, Clock, DollarSign, Trash2 } from 'lucide-react';
import { FullscreenMediaViewer } from '@/components/media/FullscreenMediaViewer';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSession } from '@/contexts/AdminSessionContext';

interface MessageData {
  id: string;
  content: string;
  message_type: string;
  sender_id: string;
  recipient_id: string;
  duration?: number;
  expires_at?: string;
  is_expired: boolean;
  created_at: string;
  sender_profile?: {
    username: string;
    avatar_url?: string;
  };
  recipient_profile?: {
    username: string;
    avatar_url?: string;
  };
}

interface MessageStats {
  total_messages: number;
  today_messages: number;
  deleted_messages: number;
  image_messages: number;
  video_messages: number;
  audio_messages: number;
  text_messages: number;
  disappearing_active: number;
  disappearing_expired: number;
}

export const GodmodeMessages: React.FC = () => {
  const { isGhostMode, logGhostAction } = useAdminSession();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [stats, setStats] = useState<MessageStats>({
    total_messages: 0,
    today_messages: 0,
    deleted_messages: 0,
    image_messages: 0,
    video_messages: 0,
    audio_messages: 0,
    text_messages: 0,
    disappearing_active: 0,
    disappearing_expired: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    alt: string;
  } | null>(null);
  const [hoveredMedia, setHoveredMedia] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          content,
          message_type,
          sender_id,
          recipient_id,
          duration,
          expires_at,
          is_expired,
          created_at,
          sender_profile:profiles!direct_messages_sender_id_fkey(username, avatar_url),
          recipient_profile:profiles!direct_messages_recipient_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        ...msg,
        sender_profile: Array.isArray(msg.sender_profile) ? msg.sender_profile[0] : msg.sender_profile,
        recipient_profile: Array.isArray(msg.recipient_profile) ? msg.recipient_profile[0] : msg.recipient_profile
      })) || [];

      setMessages(formattedMessages);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const todayMessages = formattedMessages.filter(msg => 
        new Date(msg.created_at) >= today
      ).length;

      const messageTypeStats = formattedMessages.reduce((acc, msg) => {
        acc[msg.message_type] = (acc[msg.message_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const disappearingActive = formattedMessages.filter(msg => 
        msg.expires_at && !msg.is_expired && new Date(msg.expires_at) > now
      ).length;

      const disappearingExpired = formattedMessages.filter(msg => 
        msg.is_expired || (msg.expires_at && new Date(msg.expires_at) <= now)
      ).length;

      setStats({
        total_messages: formattedMessages.length,
        today_messages: todayMessages,
        deleted_messages: 0, // This would need a separate query for soft-deleted messages
        image_messages: messageTypeStats['image'] || 0,
        video_messages: messageTypeStats['video'] || 0,
        audio_messages: messageTypeStats['audio'] || 0,
        text_messages: messageTypeStats['text'] || 0,
        disappearing_active: disappearingActive,
        disappearing_expired: disappearingExpired
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          console.log('Message change detected:', payload);
          fetchMessages(); // Refetch all data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredMessages = messages.filter(msg => 
    msg.sender_profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.recipient_profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFullscreen = (url: string, type: 'image' | 'video') => {
    setFullscreenMedia({
      url,
      type,
      alt: 'Message content'
    });
  };

  const handleMessageAction = async (action: string, messageId: string) => {
    if (isGhostMode) {
      await logGhostAction(`message_${action}`, 'message', messageId, {
        timestamp: new Date().toISOString()
      });
    }
    console.log(`${action} message:`, messageId);
    // Add actual message action implementation here
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMediaUrl = (content: string, messageType: string): string | null => {
    if (messageType === 'image' || messageType === 'video') {
      // Check if content is a URL
      if (content && content.startsWith('http')) {
        return content;
      }
    }
    return null;
  };

  const MessageBadges = ({ message }: { message: MessageData }) => {
    const isExpiring = message.expires_at && !message.is_expired;
    const isExpired = message.is_expired || (message.expires_at && new Date(message.expires_at) <= new Date());

    return (
      <div className="flex gap-1 flex-wrap">
        {message.message_type !== 'text' && (
          <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
            {message.message_type.toUpperCase()}
          </span>
        )}
        {isExpiring && (
          <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded">
            <Clock className="w-3 h-3 inline mr-1" />
            Disappearing
          </span>
        )}
        {isExpired && (
          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/30 rounded">
            <Clock className="w-3 h-3 inline mr-1" />
            Expired
          </span>
        )}
      </div>
    );
  };

  const MediaPreview = ({ message }: { message: MessageData }) => {
    const mediaUrl = getMediaUrl(message.content, message.message_type);
    
    if (!mediaUrl || (message.message_type !== 'image' && message.message_type !== 'video')) {
      return null;
    }

    return (
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredMedia(message.id)}
        onMouseLeave={() => setHoveredMedia(null)}
        onClick={() => openFullscreen(mediaUrl, message.message_type as 'image' | 'video')}
      >
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
          {message.message_type === 'image' ? (
            <img
              src={mediaUrl}
              alt="Message media"
              className="w-full h-full object-cover"
            />
          ) : message.message_type === 'video' ? (
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <video 
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        
        {hoveredMedia === message.id && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button 
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageAction('view', message.id);
                }}
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button 
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageAction('download', message.id);
                }}
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const calculatePercentages = () => {
    const total = stats.total_messages;
    if (total === 0) return { images: 0, videos: 0, audio: 0, text: 0 };
    
    return {
      images: Math.round((stats.image_messages / total) * 100),
      videos: Math.round((stats.video_messages / total) * 100),
      audio: Math.round((stats.audio_messages / total) * 100),
      text: Math.round((stats.text_messages / total) * 100)
    };
  };

  const percentages = calculatePercentages();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Message Management</h1>
          <p className="text-gray-400">Loading messages...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isGhostMode && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-300">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Ghost Mode Active - Message monitoring enabled</span>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Message Management</h1>
        <p className="text-gray-400">Monitor and manage platform messaging including deleted, PPV, and disappearing content</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages, users, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Message Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Messages</span>
              <span className="text-white font-semibold">{stats.total_messages.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Today</span>
              <span className="text-green-400 font-semibold">{stats.today_messages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Deleted</span>
              <span className="text-red-400 font-semibold">{stats.deleted_messages}</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Media Content</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Images: {percentages.images}% ({stats.image_messages})</div>
            <div className="text-sm text-gray-300">Videos: {percentages.videos}% ({stats.video_messages})</div>
            <div className="text-sm text-gray-300">Audio: {percentages.audio}% ({stats.audio_messages})</div>
            <div className="text-sm text-gray-300">Text: {percentages.text}% ({stats.text_messages})</div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Message Types</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Text Messages</span>
              <span className="text-blue-400 font-semibold">{stats.text_messages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Media Messages</span>
              <span className="text-purple-400 font-semibold">{stats.image_messages + stats.video_messages + stats.audio_messages}</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Disappearing</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Active</span>
              <span className="text-orange-400 font-semibold">{stats.disappearing_active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expired</span>
              <span className="text-gray-400 font-semibold">{stats.disappearing_expired}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">Recent Messages</h3>
          <p className="text-gray-400 text-sm">Real-time message feed with media content and disappearing messages</p>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {searchQuery ? 'No messages found matching your search.' : 'No messages yet.'}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex gap-4">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="text-white font-medium">
                            {message.sender_profile?.username || `User ${message.sender_id.slice(0, 8)}`}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-300">
                            {message.recipient_profile?.username || `User ${message.recipient_id.slice(0, 8)}`}
                          </span>
                          <span className="text-gray-500 text-sm">{formatTimestamp(message.created_at)}</span>
                        </div>
                        <MessageBadges message={message} />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          {message.content || '[Media content]'}
                        </p>
                      </div>
                      
                      <MediaPreview message={message} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fullscreen Media Viewer */}
      {fullscreenMedia && (
        <FullscreenMediaViewer
          isOpen={!!fullscreenMedia}
          onClose={() => setFullscreenMedia(null)}
          mediaUrl={fullscreenMedia.url}
          mediaType={fullscreenMedia.type}
          alt={fullscreenMedia.alt}
        />
      )}
    </div>
  );
};