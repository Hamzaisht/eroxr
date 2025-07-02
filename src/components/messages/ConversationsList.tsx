
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/avatar/UserAvatar";
import { Search, MessageCircle } from "lucide-react";

interface ConversationsListProps {
  onSelectUser: (userId: string) => void;
  onNewMessage: () => void;
  selectedUserId?: string | null;
}

const ConversationsList = ({ onSelectUser, onNewMessage, selectedUserId }: ConversationsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const session = useSession();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      // Get recent conversations
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          sender:profiles!direct_messages_sender_id_fkey(id, username),
          recipient:profiles!direct_messages_recipient_id_fkey(id, username)
        `)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      // Group by conversation partner and get latest message
      const conversationMap = new Map();
      
      data?.forEach(message => {
        const partnerId = message.sender_id === session.user.id 
          ? message.recipient_id 
          : message.sender_id;
        
        const partner = message.sender_id === session.user.id
          ? message.recipient
          : message.sender;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            partner,
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: 0
          });
        }
      });

      return Array.from(conversationMap.values());
    },
    enabled: !!session?.user?.id
  });

  const filteredConversations = conversations?.filter(conv =>
    conv.partner?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="h-full holographic-card relative overflow-hidden group">
      {/* Neural mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              Messages
            </h2>
            <button 
              onClick={onNewMessage}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 px-4 py-2 rounded-xl border-0 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <MessageCircle className="w-4 h-4 text-white relative z-10" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/[0.12] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin border-t-primary" />
                  <div className="absolute inset-2 border-2 border-purple-500/30 rounded-full animate-spin animate-reverse border-t-purple-500" />
                </div>
                <p className="text-white/60">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-gradient-to-r from-primary/40 to-purple-500/40 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white/60" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? "No conversations found" : "No messages yet"}
                </h3>
                <p className="text-white/50">Start a conversation to see it here</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {filteredConversations.map((conversation, index) => {
                  const isSelected = selectedUserId === conversation.partnerId;
                  return (
                    <div
                      key={conversation.partnerId}
                      onClick={() => onSelectUser(conversation.partnerId)}
                      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        isSelected 
                          ? 'bg-gradient-to-r from-primary/30 via-primary/20 to-purple-500/30 shadow-lg shadow-primary/20' 
                          : 'hover:bg-white/[0.08] hover:shadow-lg hover:shadow-white/10'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500" />
                      )}
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 flex items-center gap-4 p-4">
                        <div className="relative">
                          <UserAvatar
                            userId={conversation.partnerId}
                            username={conversation.partner?.username}
                            size="md"
                          />
                          {/* Online indicator */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black/50 animate-pulse" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold truncate transition-colors ${
                              isSelected ? 'text-white' : 'text-white/90'
                            }`}>
                              {conversation.partner?.username || 'Unknown User'}
                            </h4>
                            <span className="text-xs text-white/40 font-mono">
                              {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className={`text-sm truncate transition-colors ${
                            isSelected ? 'text-white/80' : 'text-white/60'
                          }`}>
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <div className="relative">
                            <div className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                              {conversation.unreadCount}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-ping opacity-20" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsList;
