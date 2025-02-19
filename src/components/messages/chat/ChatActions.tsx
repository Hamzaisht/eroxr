
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatActionsProps {
  recipientId: string;
}

export const useChatActions = ({ recipientId }: ChatActionsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id) return;

    const optimisticMessage = {
      id: crypto.randomUUID(),
      sender_id: session.user.id,
      recipient_id: recipientId,
      content,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };

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

      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        (old || []).map((msg: any) => msg.id === optimisticMessage.id ? data : msg)
      );
    } catch (error) {
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

      queryClient.setQueryData(['chat', session.user.id, recipientId], (old: any) => 
        (old || []).map((msg: any) => msg.id === optimisticMessage.id ? messageData : msg)
      );
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

  return {
    isUploading,
    handleSendMessage,
    handleMediaSelect,
    handleSnapCapture
  };
};
