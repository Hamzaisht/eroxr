
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { SnapCamera } from "./chat/SnapCamera";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [recipientProfile, setRecipientProfile] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

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

    const { error } = await supabase
      .from('direct_messages')
      .insert([{
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        message_type: 'text'
      }]);

    if (error) {
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

        const { error: uploadError, data } = await supabase.storage
          .from('messages')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName);

        const { error: messageError } = await supabase
          .from('direct_messages')
          .insert([{
            sender_id: session.user.id,
            recipient_id: recipientId,
            media_url: [publicUrl],
            message_type: file.type.startsWith('image/') ? 'image' : 'video'
          }]);

        if (messageError) throw messageError;
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
      
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      const { error: messageError } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: [publicUrl],
          message_type: blob.type.includes('video') ? 'video' : 'image',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }]);

      if (messageError) throw messageError;
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

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (!error && data) {
        setRecipientProfile(data);
      }
    };

    fetchRecipientProfile();
  }, [recipientId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session?.user?.id})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    if (session?.user?.id && recipientId) {
      fetchMessages();

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat:${session.user.id}-${recipientId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'direct_messages',
            filter: `or(and(sender_id.eq.${session.user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session.user.id}))`
          },
          (payload) => {
            console.log('New message received:', payload);
            setMessages(prev => [...prev, payload.new as DirectMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id, recipientId]);

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
