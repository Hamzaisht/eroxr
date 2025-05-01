
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOptimisticMessaging, createOptimisticMessage } from "@/utils/messaging/optimisticUpdates";
import { v4 as uuidv4 } from "uuid";
import { DirectMessage } from "@/integrations/supabase/types/message";

interface ChatActionsProps {
  recipientId: string;
}

export const useChatActionsV2 = ({ recipientId }: ChatActionsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { addOptimisticMessage } = useOptimisticMessaging();
  
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !session?.user?.id || !recipientId) return;
    
    try {
      // Create optimistic message
      const optimisticMessage = createOptimisticMessage(
        session.user.id,
        recipientId,
        content
      );
      
      // Add optimistic message to UI
      const { onSuccess, onError } = addOptimisticMessage(
        session.user.id,
        recipientId,
        optimisticMessage
      );
      
      // Create message object
      const messageData = {
        id: optimisticMessage.id.replace('optimistic-', ''),
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content.trim(),
        message_type: 'text',
        delivery_status: 'sent',
        created_at: new Date().toISOString(),
      };
      
      // Send message to database
      const { data, error } = await supabase
        .from('direct_messages')
        .insert(messageData)
        .select('*')
        .single();
      
      if (error) {
        // Fallback without the id
        const { error: secondError, data: fallbackData } = await supabase
          .from('direct_messages')
          .insert({
            sender_id: session.user.id,
            recipient_id: recipientId,
            content: content.trim(),
            message_type: 'text',
            delivery_status: 'sent',
            created_at: new Date().toISOString(),
          })
          .select('*')
          .single();
        
        if (secondError) {
          console.error('Error sending message:', secondError);
          onError();
          throw secondError;
        }
        
        onSuccess(fallbackData as DirectMessage);
        return { success: true, message: fallbackData };
      }
      
      onSuccess(data as DirectMessage);
      return { success: true, message: data };
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Failed to send message" };
    }
  }, [session?.user?.id, recipientId, toast, addOptimisticMessage]);

  const handleMediaSelect = useCallback(async (files: FileList) => {
    if (!files.length || !session?.user?.id || !recipientId) return { success: false };
    
    setIsUploading(true);
    
    try {
      const filesArray = Array.from(files);
      
      // Create placeholder message
      const optimisticMessage = createOptimisticMessage(
        session.user.id,
        recipientId,
        "Sending media...",
        [],
        filesArray[0].type.startsWith('video/') ? 'video' : 'media'
      );
      
      // Add optimistic message to UI
      const { onSuccess, onError } = addOptimisticMessage(
        session.user.id,
        recipientId,
        optimisticMessage
      );
      
      // Upload each file
      const uploadPromises = filesArray.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('messages')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(filePath);
          
        return publicUrl;
      });
      
      const urls = await Promise.all(uploadPromises);
      
      // Determine if the media is a video or image
      const isVideo = filesArray.some(file => file.type.startsWith('video/'));
      const isAudio = filesArray.some(file => file.type.startsWith('audio/'));
      const isDocument = filesArray.some(file => 
        file.type.includes('pdf') || 
        file.type.includes('doc') || 
        file.type.includes('xls') || 
        file.type.includes('ppt'));
      
      // Create the message data object
      const messageData: any = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        message_type: isVideo && urls.length === 1 ? 'video' : 
                     isAudio && urls.length === 1 ? 'audio' :
                     isDocument && urls.length === 1 ? 'document' : 'media',
        created_at: new Date().toISOString(),
        delivery_status: 'sent',
      };
      
      // Set the appropriate media field
      if (isVideo && urls.length === 1) {
        messageData.video_url = urls[0];
        messageData.media_url = [urls[0].replace(/\.(mp4|webm|mov)$/i, '.jpg')];
      } else {
        messageData.media_url = urls;
      }
      
      // Try to create the message
      const { error, data } = await supabase
        .from('direct_messages')
        .insert(messageData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating message after upload:', error);
        onError();
        throw error;
      }
      
      onSuccess(data as DirectMessage);
      
      toast({
        title: "Media sent",
        description: `Successfully sent ${urls.length} ${urls.length === 1 ? 'file' : 'files'}`
      });
      
      return { success: true, urls, messageData: data };
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast({
        title: "Failed to send media",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast, addOptimisticMessage]);

  const handleSnapCapture = useCallback(async (dataURL: string) => {
    if (!session?.user?.id || !recipientId) return { success: false };
    
    setIsUploading(true);
    
    try {
      // Create optimistic message
      const optimisticMessage = createOptimisticMessage(
        session.user.id,
        recipientId,
        "Sending snap...",
        [],
        'snap'
      );
      
      // Add optimistic message to UI
      const { onSuccess, onError } = addOptimisticMessage(
        session.user.id,
        recipientId,
        optimisticMessage
      );
      
      // Convert data URL to blob
      const res = await fetch(dataURL);
      const blob = await res.blob();
      
      // Create a file from the blob
      const file = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload the file
      const fileName = `snap_${uuidv4()}.jpg`;
      const filePath = `snaps/${session.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, file);
      
      if (uploadError) {
        onError();
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);
      
      // Set expiration time to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create the snap message
      const messageData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        media_url: [publicUrl],
        message_type: 'snap',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        delivery_status: 'sent'
      };
      
      // Try to create the message
      const { error, data } = await supabase
        .from('direct_messages')
        .insert(messageData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating snap message:', error);
        onError();
        throw error;
      }
      
      onSuccess(data as DirectMessage);
      
      toast({
        title: "Snap sent",
        description: "Your snap will disappear after viewing"
      });
      
      return { success: true, url: publicUrl, messageData: data };
    } catch (error: any) {
      console.error('Error sending snap:', error);
      toast({
        title: "Failed to send snap",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast, addOptimisticMessage]);

  return {
    isUploading,
    handleSendMessage,
    handleMediaSelect,
    handleSnapCapture,
    resendMessage: async (message: DirectMessage) => {
      if (message.media_url && message.media_url.length > 0) {
        if (message.message_type === 'snap') {
          // For simplicity, just create a new snap
          toast({
            title: "Cannot resend snap",
            description: "Please create a new snap instead",
            variant: "destructive"
          });
          return { success: false };
        }
        
        // Re-use existing media URLs
        try {
          const { error } = await supabase
            .from('direct_messages')
            .insert({
              sender_id: session?.user?.id,
              recipient_id: recipientId,
              media_url: message.media_url,
              video_url: message.video_url,
              message_type: message.message_type,
              created_at: new Date().toISOString(),
              delivery_status: 'sent'
            });
          
          if (error) throw error;
          
          toast({
            title: "Message resent",
            description: "Media message was resent successfully"
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error resending media message:', error);
          toast({
            title: "Failed to resend",
            description: "Please try again",
            variant: "destructive"
          });
          return { success: false };
        }
      } else if (message.content) {
        // Simple text message resend
        return handleSendMessage(message.content);
      }
      
      return { success: false };
    }
  };
};
