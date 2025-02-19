
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { SnapCamera } from "./chat/SnapCamera";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Add real-time subscription for the current chat
  useRealtimeMessages(recipientId);

  const { data: messages = [] } = useQuery({
    queryKey: ['chat', session?.user?.id, recipientId],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session?.user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && !!recipientId,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: recipientProfile } = useQuery({
    queryKey: ['profile', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!recipientId,
  });

  const handleVoiceCall = () => {
    toast({
      title: "Starting voice call...",
      description: "This feature is coming soon!",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Starting video call...",
      description: "This feature is coming soon!",
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id) return;

    // Optimistic update
    const optimisticMessage = {
      id: crypto.randomUUID(),
      sender_id: session.user.id,
      recipient_id: recipientId,
      content,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };

    // Immediately update the UI
    queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
      [...(old || []), optimisticMessage]
    );

    try {
      const { error, data } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: session.user.id,
          recipient_id: recipientId,
          content,
          message_type: 'text'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update with the real data
      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        (old || []).map((msg: any) => msg.id === optimisticMessage.id ? data : msg)
      );
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        (old || []).filter((msg: any) => msg.id !== optimisticMessage.id)
      );

      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleMediaSelect = async (files: FileList) => {
    if (!session?.user?.id) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        // Optimistic update for media
        const optimisticMessage = {
          id: crypto.randomUUID(),
          sender_id: session.user.id,
          recipient_id: recipientId,
          message_type: file.type.startsWith('image/') ? 'image' : 'video',
          media_url: [`uploading-${fileName}`],
          created_at: new Date().toISOString(),
        };

        queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
          [...(old || []), optimisticMessage]
        );

        const { error: uploadError, data } = await supabase.storage
          .from('messages')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName);

        const { error: messageError, data: messageData } = await supabase
          .from('direct_messages')
          .insert([{
            sender_id: session.user.id,
            recipient_id: recipientId,
            media_url: [publicUrl],
            message_type: file.type.startsWith('image/') ? 'image' : 'video'
          }])
          .select()
          .single();

        if (messageError) throw messageError;

        // Update with real data
        queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
          (old || []).map((msg: any) => msg.id === optimisticMessage.id ? messageData : msg)
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSnapCapture = async (blob: Blob) => {
    if (!session?.user?.id) return;
    setIsUploading(true);

    try {
      const fileName = `${crypto.randomUUID()}.${blob.type.includes('video') ? 'webm' : 'jpg'}`;
      
      // Optimistic update for snap
      const optimisticMessage = {
        id: crypto.randomUUID(),
        sender_id: session.user.id,
        recipient_id: recipientId,
        message_type: blob.type.includes('video') ? 'video' : 'image',
        media_url: [`uploading-${fileName}`],
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        [...(old || []), optimisticMessage]
      );

      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      const { error: messageError, data: messageData } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: [publicUrl],
          message_type: blob.type.includes('video') ? 'video' : 'image',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      // Update with real data
      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        (old || []).map((msg: any) => msg.id === optimisticMessage.id ? messageData : msg)
      );

      setShowCamera(false);
    } catch (error) {
      console.error('Error uploading snap:', error);
      toast({
        title: "Error",
        description: "Failed to send snap",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-luxury-dark">
      <ChatHeader
        recipientProfile={recipientProfile}
        recipientId={recipientId}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onToggleDetails={onToggleDetails}
      />
      
      <MessageList
        messages={messages}
        currentUserId={session?.user?.id}
        recipientProfile={recipientProfile}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        onMediaSelect={handleMediaSelect}
        onSnapStart={() => setShowCamera(true)}
        isLoading={isUploading}
      />

      {showCamera && (
        <SnapCamera
          onCapture={handleSnapCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};
