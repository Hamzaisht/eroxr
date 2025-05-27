
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
}

const ConversationsList = ({ onSelectUser, onNewMessage }: ConversationsListProps) => {
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
    <Card className="h-full bg-luxury-darker border-luxury-neutral/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Messages</span>
          <Button 
            onClick={onNewMessage}
            size="sm"
            className="bg-luxury-primary hover:bg-luxury-primary/80"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-luxury-neutral/5 border-luxury-neutral/20"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? "No conversations found" : "No messages yet"}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.partnerId}
                onClick={() => onSelectUser(conversation.partnerId)}
                className="flex items-center gap-3 p-3 hover:bg-luxury-neutral/5 cursor-pointer transition-colors"
              >
                <UserAvatar
                  userId={conversation.partnerId}
                  username={conversation.partner?.username}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium truncate">
                      {conversation.partner?.username || 'Unknown'}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(conversation.lastMessageTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage || 'No messages'}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="bg-luxury-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
