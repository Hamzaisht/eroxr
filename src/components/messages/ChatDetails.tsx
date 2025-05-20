import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/integrations/supabase/types/messages";
import { ChatMediaGallery } from "@/components/messages/chat/ChatMediaGallery";
import { MessageBubble } from "@/components/messages/message-parts/MessageBubble";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { useMediaQuery } from "@/hooks/use-mobile";
import { BottomChatBar } from "@/components/messages/chat/BottomChatBar";

interface ChatDetailsProps {
  otherUserId: string;
}

export const ChatDetails = ({ otherUserId }: ChatDetailsProps) => {
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
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const session = useSession();
  const { toast } = useToast();
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
      } else {
        setOtherUser(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching other user:", error);
      toast({
        title: "Unexpected Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
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
    if (!files || files.length === 0) return;

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
      toast({
        title: "Media Uploaded",
        description: "All media files uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Media upload error:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload media files.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handle media URL removal
  const handleRemoveMedia = (indexToRemove: number) => {
    const newMediaUrls = mediaUrls.filter((_, index) => index !== indexToRemove);
    setMediaUrls(newMediaUrls);
  };

  // Handle image click (for media gallery)
  const handleMediaClick = (url: string) => {
    console.log("Media clicked:", url);
  };

  const onMediaSelect = (url: string) => {
    console.log("Selected media url", url)
  }

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
              onImageClick={handleMediaClick}
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
            userId={otherUser?.id}
            onMediaClick={onMediaSelect}
          />
        </div>
      )}

      {/* Bottom Chat Bar */}
      <BottomChatBar
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        uploadingFiles={uploadingFiles}
        mediaUrls={mediaUrls}
        handleRemoveMedia={handleRemoveMedia}
        handleMediaSelect={handleMediaSelect}
        isSending={isSending}
      />
    </div>
  );
};
