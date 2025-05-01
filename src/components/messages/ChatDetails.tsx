
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Ban, Loader2, X, Calendar, Gift } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatMediaGallery } from "./chat/ChatMediaGallery";
import { ChatBookingsOverview } from "./chat/ChatBookingsOverview";
import { ChatTippingControls } from "./chat/ChatTippingControls";
import { BookingDialog } from "./booking/BookingDialog";

interface ChatDetailsProps {
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  onClose: () => void;
}

export const ChatDetails = ({ 
  recipient,
  onClose 
}: ChatDetailsProps) => {
  const [messageText, setMessageText] = useState("");
  const { id: currentUserId } = useSession()?.user || {};
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'chat' | 'video' | 'voice'>('video');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const recipientId = recipient?.id;

  // Fetch direct messages for the media gallery
  const { data: directMessages = [] } = useQuery({
    queryKey: ["chat", currentUserId, recipientId],
    queryFn: async () => {
      if (!recipientId || !currentUserId) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data;
    },
    enabled: !!recipientId && !!currentUserId
  });

  // Handle opening media
  const handleMediaSelect = (url: string) => {
    window.open(url, '_blank');
  };

  // Open booking modal
  const handleBookCall = () => {
    setShowBookingModal(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", recipientId],
    queryFn: async () => {
      if (!recipientId || !currentUserId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          recipient_id,
          sender_username:sender_id(username),
          sender_avatar_url:sender_id(avatar_url)
        `)
        .or(`and(sender_id.eq.${currentUserId}, recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId}, recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      // Safely extract username and avatar_url from nested objects
      return data?.map(msg => ({
        ...msg,
        sender_username: msg.sender_username ? 
          (msg.sender_username as unknown as Record<string, any>)?.username || "Unknown" : 
          "Unknown",
        sender_avatar_url: msg.sender_avatar_url ? 
          (msg.sender_avatar_url as unknown as Record<string, any>)?.avatar_url : 
          null
      }));
    },
    enabled: !!recipientId && !!currentUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!messageText.trim() || !recipientId || !currentUserId) return;

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: messageText,
            sender_id: currentUserId,
            recipient_id: recipientId,
            sender_username: useSession()?.user?.user_metadata?.username as string,
            sender_avatar_url: useSession()?.user?.user_metadata?.avatar_url as string
          }
        ]);

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      setMessageText("");
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", recipientId] });
    },
    onError: (error) => {
      console.error("Error in sendMessageMutation:", error);
    }
  });

  const blockMutation = useMutation({
    mutationFn: async () => {
      if (!recipientId || !currentUserId) return;

      const { error } = await supabase
        .from('blocked_users')
        .insert([
          {
            blocker_id: currentUserId,
            blocked_id: recipientId
          }
        ]);

      if (error) {
        console.error("Error blocking user:", error);
        throw error;
      }

      setIsBlocked(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", recipientId] });
    },
    onError: (error) => {
      console.error("Error in blockMutation:", error);
    }
  });

  const isBlocking = blockMutation.isLoading;
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    sendMessageMutation.mutate();
  };

  // Fix the username and avatar_url error
  const recipientUsername = recipient?.username || "User";
  const recipientAvatar = recipient?.avatar_url || null;
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-luxury-neutral/20">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={recipientAvatar || ""} alt={recipientUsername || "User"} />
            <AvatarFallback>{recipientUsername?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{recipientUsername || "User"}</h2>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 flex-1 overflow-hidden">
        <Tabs defaultValue="media">
          <TabsList className="grid grid-cols-3 bg-luxury-darker mb-4">
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="media" className="mt-0 h-[calc(100vh-260px)]">
            <ChatMediaGallery 
              messages={directMessages} 
              onMediaSelect={handleMediaSelect} 
            />
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-0 h-[calc(100vh-260px)]">
            <ChatBookingsOverview 
              recipientId={recipientId} 
              onBookCall={handleBookCall} 
            />
          </TabsContent>
          
          <TabsContent value="tips" className="mt-0 h-[calc(100vh-260px)]">
            <ChatTippingControls recipientId={recipientId} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t border-luxury-neutral/20 mt-auto">
        <Button
          onClick={() => blockMutation.mutate()}
          variant="destructive"
          disabled={isBlocking}
          className="w-full"
        >
          {isBlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
          Block User
        </Button>
      </div>
      
      <BookingDialog
        creatorId={recipientId}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        bookingType={bookingType}
      />
    </div>
  );
}

export default ChatDetails;
