
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
    <Card className="h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="text-lg font-light">Messages</span>
          <Button 
            onClick={onNewMessage}
            size="sm"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 border-0 shadow-lg shadow-primary/20"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-white/60">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-white/60">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-white/30" />
              <p className="text-lg">{searchTerm ? "No conversations found" : "No messages yet"}</p>
              <p className="text-sm text-white/40 mt-1">Start a conversation to see it here</p>
            </div>
          ) : (
            filteredConversations.map((conversation, index) => {
              const isSelected = selectedUserId === conversation.partnerId;
              return (
                <div
                  key={conversation.partnerId}
                  onClick={() => onSelectUser(conversation.partnerId)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected 
                      ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 border-l-2 border-primary' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <UserAvatar
                    userId={conversation.partnerId}
                    username={conversation.partner?.username}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium truncate transition-colors ${
                        isSelected ? 'text-white' : 'text-white/90'
                      }`}>
                        {conversation.partner?.username || 'Unknown'}
                      </p>
                      <span className="text-xs text-white/40">
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm truncate transition-colors ${
                      isSelected ? 'text-white/80' : 'text-white/60'
                    }`}>
                      {conversation.lastMessage || 'No messages'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
