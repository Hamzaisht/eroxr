
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Use React Router instead of Next
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Create simplified interfaces for now
interface Message {
  id: string;
  sender_id: string;
  text?: string | null;
  image_urls?: string[] | null;
  video_urls?: string[] | null;
  created_at: string;
}

export function ChatDetails({ otherUserId }: { otherUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ id: string; username: string; avatar_url: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get('chatId');
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages and other user details on mount
  useEffect(() => {
    if (!chatId) return;
    fetchMessages(chatId);
    fetchOtherUser(otherUserId);
  }, [chatId, otherUserId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages from Supabase
  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch other user details from Supabase
  const fetchOtherUser = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', otherUserId)
        .single();

      if (error) {
        console.error("Error fetching other user:", error);
      } else {
        setOtherUser(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching other user:", error);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && mediaUrls.length === 0) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: session?.user?.id,
            text: newMessage.trim() || null,
            image_urls: mediaUrls.length > 0 ? mediaUrls : null,
          },
        ]);

      if (error) {
        console.error("Error sending message:", error);
      }

      setNewMessage("");
      setMediaUrls([]);
      setSelectedFiles(null);
    } finally {
      setIsSending(false);
    }
  };

  // Handle media selection
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setMediaUrls([]); // Clear existing URLs
    uploadMedia(files);
  };

  // Upload media files to Supabase storage
  const uploadMedia = async (files: FileList | null) => {
    if (!files || files.length === 0 || !session?.user?.id) return;

    setUploadingFiles(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          const filePath = `${session?.user?.id}/${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

          const url = supabase.storage.from('chat-media').getPublicUrl(filePath).data.publicUrl;
          return url;
        })
      );

      setMediaUrls(urls);
    } catch (error: any) {
      console.error("Media upload error:", error);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handle media URL removal
  const handleRemoveMedia = (indexToRemove: number) => {
    const newMediaUrls = mediaUrls.filter((_, index) => index !== indexToRemove);
    setMediaUrls(newMediaUrls);
  };

  // Simplified message bubble component
  const MessageBubble = ({ message, isCurrentUser }: { message: Message, isCurrentUser: boolean }) => (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`rounded-lg px-4 py-2 max-w-[75%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        <p>{message.text}</p>
        {message.image_urls?.map((url, idx) => (
          <img 
            key={idx} 
            src={url} 
            alt="Message attachment" 
            className="mt-2 rounded-lg max-h-48 w-auto" 
          />
        ))}
      </div>
    </div>
  );

  // Simplified bottom chat bar
  const BottomChatBar = () => (
    <div className="flex items-center gap-2 border-t p-3">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadingFiles}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <Input
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSendMessage}
        disabled={isSending || (!newMessage.trim() && mediaUrls.length === 0)}
      >
        <Send className="h-5 w-5" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleMediaSelect}
        disabled={uploadingFiles}
      />
    </div>
  );

  // Simplified media gallery
  const ChatMediaGallery = ({ 
    images = [], 
    videos = [],
    onMediaClick = () => {}
  }: { 
    images?: string[], 
    videos?: string[],
    onMediaClick?: (url: string) => void
  }) => (
    <div className="space-y-2">
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {images.map((url, idx) => (
              <img 
                key={idx}
                src={url}
                alt={`Gallery image ${idx}`}
                className="w-full h-24 object-cover rounded cursor-pointer"
                onClick={() => onMediaClick(url)}
              />
            ))}
          </div>
        </div>
      )}
      {videos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Videos</h3>
          <div className="grid grid-cols-3 gap-2">
            {videos.map((url, idx) => (
              <video
                key={idx}
                src={url}
                className="w-full h-24 object-cover rounded cursor-pointer"
                onClick={() => onMediaClick(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  const handleMediaClick = (url: string) => {
    console.log("Media clicked:", url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b bg-secondary px-4 py-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={otherUser?.avatar_url || ""} />
            <AvatarFallback>{otherUser?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold">{otherUser?.username}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === session?.user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Media Gallery */}
      {showMediaGallery && (
        <div className="p-4 border-t">
          <ChatMediaGallery 
            images={messages
              .filter(msg => msg.image_urls && msg.image_urls.length > 0)
              .flatMap(msg => msg.image_urls || [])}
            videos={messages
              .filter(msg => msg.video_urls && msg.video_urls.length > 0)
              .flatMap(msg => msg.video_urls || [])}
            onMediaClick={handleMediaClick}
          />
        </div>
      )}

      {/* Bottom Chat Bar */}
      <BottomChatBar />
    </div>
  );
}

// Export the component
export default ChatDetails;
