
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseChatActionsProps {
  recipientId: string | undefined;
}

export function useChatActions({ recipientId }: UseChatActionsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const currentUserId = session?.user?.id;
  
  /**
   * Handles sending a text message
   */
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !recipientId || !currentUserId) {
      return;
    }
    
    try {
      const { data, error } = await supabase.from('direct_messages').insert({
        content,
        sender_id: currentUserId,
        recipient_id: recipientId,
        created_at: new Date().toISOString(),
        message_type: 'text',
        delivery_status: 'sent'
      }).select();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      } else {
        // Refetch messages to update UI
        queryClient.invalidateQueries({ queryKey: ['chat', currentUserId, recipientId] });
        queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  /**
   * Handles uploading and sending media files
   */
  const handleMediaSelect = async (files: FileList) => {
    if (!files || files.length === 0 || !recipientId || !currentUserId) return;
    
    setIsUploading(true);
    
    try {
      const mediaUrls: string[] = [];
      
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('messages')
          .upload(fileName, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName);
          
        mediaUrls.push(publicUrl);
      }
      
      // Determine message type
      let messageType = 'media';
      const firstFile = files[0];
      if (firstFile.type.startsWith('video/')) {
        messageType = 'video';
      } else if (firstFile.type.startsWith('audio/')) {
        messageType = 'audio';
      } else if (firstFile.type.includes('pdf') || 
                firstFile.type.includes('doc') || 
                firstFile.type.includes('xls')) {
        messageType = 'document';
      }
      
      // Insert message with media URLs
      const { error: messageError } = await supabase.from('direct_messages').insert({
        sender_id: currentUserId,
        recipient_id: recipientId,
        media_url: mediaUrls,
        message_type: messageType,
        created_at: new Date().toISOString(),
        delivery_status: 'sent'
      });
      
      if (messageError) {
        throw messageError;
      }
      
      // Refetch messages to update UI
      queryClient.invalidateQueries({ queryKey: ['chat', currentUserId, recipientId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
      
      toast({
        description: "Media sent successfully"
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Handles sending a snap (disappearing image)
   */
  const handleSnapCapture = async (dataUrl: string) => {
    if (!dataUrl || !recipientId || !currentUserId) return;
    
    setIsUploading(true);
    
    try {
      // Convert data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      // Upload to Supabase storage
      const fileName = `snap_${crypto.randomUUID()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, blob);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);
      
      // Set expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Insert message
      const { error: messageError } = await supabase.from('direct_messages').insert({
        sender_id: currentUserId,
        recipient_id: recipientId,
        media_url: [publicUrl],
        message_type: 'snap',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        delivery_status: 'sent'
      });
      
      if (messageError) {
        throw messageError;
      }
      
      // Refetch messages to update UI
      queryClient.invalidateQueries({ queryKey: ['chat', currentUserId, recipientId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', currentUserId] });
      
      toast({
        description: "Snap sent successfully"
      });
    } catch (error) {
      console.error("Error sending snap:", error);
      toast({
        title: "Error",
        description: "Failed to send snap",
        variant: "destructive"
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
}
