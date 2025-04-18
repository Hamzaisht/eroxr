import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessagesSquare, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Profile } from "@/integrations/supabase/types/profile";
import { DirectMessage } from "@/integrations/supabase/types/message";

// Define a properly structured Message type
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string | null;
  media_url: string[] | null;
  video_url: string | null;
  created_at: string;
  sender: Profile;
  recipient: Profile;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Fetch conversations
  const fetchConversations = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      // Get all conversations where the user is either sender or recipient
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id, 
          sender_id, 
          recipient_id,
          content,
          media_url,
          video_url,
          created_at,
          sender:profiles!direct_messages_sender_id_fkey (id, username, avatar_url, status),
          recipient:profiles!direct_messages_recipient_id_fkey (id, username, avatar_url, status)
        `)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load messages",
        description: "Please try again later",
        variant: "destructive"
      });
    } else {
      // Group by conversation partner
      const conversationsMap = new Map<string, Message>();
      
      if (data) {
        data.forEach(msg => {
          // Correctly handle the sender and recipient as Profile objects
          const sender: Profile = {
            id: msg.sender.id,
            username: msg.sender.username,
            avatar_url: msg.sender.avatar_url,
            status: msg.sender.status,
            created_at: '', // These fields are required but not used in this context
            updated_at: ''
          };
          
          const recipient: Profile = {
            id: msg.recipient.id,
            username: msg.recipient.username,
            avatar_url: msg.recipient.avatar_url,
            status: msg.recipient.status,
            created_at: '', // These fields are required but not used in this context
            updated_at: ''
          };
          
          // Convert the raw data to properly typed Message
          const message: Message = {
            id: msg.id,
            sender_id: msg.sender_id,
            recipient_id: msg.recipient_id,
            content: msg.content,
            media_url: msg.media_url,
            video_url: msg.video_url,
            created_at: msg.created_at,
            sender,
            recipient
          };
          
          const otherUserId = message.sender_id === session.user.id ? message.recipient_id : message.sender_id;
          if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, message);
          }
        });
        
        setConversations(Array.from(conversationsMap.values()));
      }
    }
  } catch (err) {
    console.error('Error in conversation fetch:', err);
  } finally {
    setLoading(false);
  }
};
    
    fetchConversations();
    
    // Set up realtime subscription for new messages
    const subscription = supabase
      .channel('message_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id === session?.user?.id || newMsg.recipient_id === session?.user?.id) {
          // Refresh conversations
          fetchConversations();
          
          // If we're currently viewing this conversation, update the messages
          if (selectedUserId === newMsg.sender_id || selectedUserId === newMsg.recipient_id) {
            fetchMessages(selectedUserId);
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [session, toast]);
  
  // Fetch messages when a conversation is selected
  const fetchMessages = async (userId: string | null) => {
    if (!userId || !session?.user?.id) return;
    
    setLoadingMessages(true);
    
    try {
      // Get all messages between current user and selected user
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          media_url,
          video_url,
          created_at,
          sender:profiles!direct_messages_sender_id_fkey (id, username, avatar_url, status),
          recipient:profiles!direct_messages_recipient_id_fkey (id, username, avatar_url, status)
        `)
        .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load conversation",
        description: "Please try again later", 
        variant: "destructive"
      });
    } else {
      if (data) {
        // Convert the raw data to properly typed Message array
        const typedMessages: Message[] = data.map(msg => {
          const sender: Profile = {
            id: msg.sender.id,
            username: msg.sender.username,
            avatar_url: msg.sender.avatar_url,
            status: msg.sender.status,
            created_at: '', // These fields are required but not used in this context
            updated_at: ''
          };
          
          const recipient: Profile = {
            id: msg.recipient.id,
            username: msg.recipient.username,
            avatar_url: msg.recipient.avatar_url,
            status: msg.recipient.status,
            created_at: '', // These fields are required but not used in this context
            updated_at: ''
          };
          
          return {
            id: msg.id,
            sender_id: msg.sender_id,
            recipient_id: msg.recipient_id,
            content: msg.content,
            media_url: msg.media_url,
            video_url: msg.video_url,
            created_at: msg.created_at,
            sender,
            recipient
          };
        });
        
        setMessages(typedMessages);
        
        // Mark messages as viewed
        await supabase
          .from('direct_messages')
          .update({ viewed_at: new Date().toISOString() })
          .eq('recipient_id', session.user.id)
          .eq('sender_id', userId)
          .is('viewed_at', null);
      }
    }
  } catch (err) {
    console.error('Error in message fetch:', err);
  } finally {
    setLoadingMessages(false);
  }
};
  
  // Select a conversation
  const selectConversation = (userId: string) => {
    setSelectedUserId(userId);
    fetchMessages(userId);
  };
  
  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: session.user.id,
          recipient_id: selectedUserId,
          content: newMessage.trim(),
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Failed to send message",
          description: "Please try again",
          variant: "destructive"
        });
      } else {
        setNewMessage('');
        fetchMessages(selectedUserId);
      }
    } catch (err) {
      console.error('Error in message send:', err);
    }
  };
  
  // Open new conversation dialog
  const openNewConversation = async () => {
    setNewConversationOpen(true);
    
    // Fetch available users
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status, created_at, updated_at')
        .neq('id', session?.user?.id || '');
      
    if (error) {
      console.error('Error fetching available users:', error);
    } else {
      setAvailableUsers(data || []);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};
  
  // Start a new conversation
  const startConversation = (userId: string) => {
    setNewConversationOpen(false);
    setSelectedUserId(userId);
    fetchMessages(userId);
  };
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => {
    const otherUser = convo.sender_id === session?.user?.id ? convo.recipient : convo.sender;
    return otherUser.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="min-h-screen bg-luxury-dark">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-20"
      >
        <div className="container mx-auto px-4 h-[80vh]">
          <h1 className="text-4xl font-bold text-luxury-neutral mb-8">
            Messages
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full bg-luxury-darker/40 rounded-lg shadow-lg overflow-hidden">
            {/* Conversations List */}
            <div className="border-r border-white/10 h-full flex flex-col">
              <div className="p-4 border-b border-white/10">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-10 bg-luxury-darker/50 border-white/10"
                  />
                </div>
                <Button 
                  onClick={openNewConversation}
                  variant="outline"
                  className="w-full border-white/10 text-luxury-neutral"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </div>
              
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-luxury-primary" />
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="space-y-1">
                    {filteredConversations.map(convo => {
                      const otherUser = convo.sender_id === session?.user?.id ? convo.recipient : convo.sender;
                      return (
                        <div
                          key={otherUser.id}
                          onClick={() => selectConversation(otherUser.id)}
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-luxury-primary/10 transition-colors ${
                            selectedUserId === otherUser.id ? 'bg-luxury-primary/20' : ''
                          }`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser.avatar_url || undefined} />
                            <AvatarFallback>{otherUser.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-luxury-neutral font-medium truncate">{otherUser.username}</p>
                              <span className="text-xs text-luxury-neutral/50">
                                {new Date(convo.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-luxury-neutral/70 truncate">
                              {convo.content || 'Media message'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <MessagesSquare className="h-12 w-12 text-luxury-neutral/30 mb-4" />
                    <p className="text-luxury-neutral/50 text-center">No conversations yet</p>
                    <Button
                      onClick={openNewConversation}
                      variant="link"
                      className="mt-2 text-luxury-primary"
                    >
                      Start a conversation
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Chat Area */}
            <div className="col-span-2 flex flex-col h-full">
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  {filteredConversations.map(convo => {
                    const otherUser = convo.sender_id === session?.user?.id ? convo.recipient : convo.sender;
                    if (otherUser.id === selectedUserId) {
                      return (
                        <div key={otherUser.id} className="p-4 border-b border-white/10 flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser.avatar_url || undefined} />
                            <AvatarFallback>{otherUser.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-luxury-neutral font-medium">{otherUser.username}</p>
                            <p className="text-xs text-luxury-neutral/50">
                              {otherUser.status === 'online' ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-luxury-primary" />
                      </div>
                    ) : messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender_id === session?.user?.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                msg.sender_id === session?.user?.id
                                  ? 'bg-luxury-primary text-white'
                                  : 'bg-luxury-darker text-luxury-neutral'
                              }`}
                            >
                              {msg.content}
                              {msg.media_url && msg.media_url.length > 0 && (
                                <div className="mt-2">
                                  <img
                                    src={msg.media_url[0]}
                                    alt="Message attachment"
                                    className="rounded-lg max-h-60 object-contain"
                                  />
                                </div>
                              )}
                              {msg.video_url && (
                                <div className="mt-2">
                                  <video
                                    src={msg.video_url}
                                    controls
                                    className="rounded-lg max-h-60 w-full"
                                  />
                                </div>
                              )}
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40">
                        <MessagesSquare className="h-12 w-12 text-luxury-neutral/30 mb-4" />
                        <p className="text-luxury-neutral/50 text-center">No messages yet</p>
                        <p className="text-luxury-neutral/50 text-center text-sm">Start the conversation!</p>
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-luxury-darker/50 border-white/10"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage}>Send</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessagesSquare className="h-20 w-20 text-luxury-neutral/20 mb-6" />
                  <h2 className="text-xl font-semibold text-luxury-neutral mb-2">Select a conversation</h2>
                  <p className="text-luxury-neutral/50 text-center max-w-md">
                    Choose a conversation from the list or start a new one to begin messaging
                  </p>
                  <Button
                    onClick={openNewConversation}
                    className="mt-6"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* New Conversation Dialog */}
          <Dialog open={newConversationOpen} onOpenChange={setNewConversationOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Search users..."
                  className="bg-luxury-darker/50 border-white/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {availableUsers
                      .filter(user => user.username?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(user => (
                        <div
                          key={user.id}
                          onClick={() => startConversation(user.id)}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-luxury-primary/10 rounded-lg transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-luxury-neutral font-medium">{user.username}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Messages;
