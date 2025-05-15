import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useOptimisticMessaging, createOptimisticMessage } from "@/utils/messaging/optimisticUpdates";
import { v4 as uuidv4 } from "uuid";
import { createUniqueFilePath } from '@/utils/upload/fileUtils';
import { uploadFileToStorage } from '@/utils/upload/storageService';

interface ChatActionsProps {
  recipientId: string;
}

// Export both function names to support existing imports
export const useChatActions = ({ recipientId }: ChatActionsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { addOptimisticMessage } = useOptimisticMessaging();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !session?.user?.id || !recipientId) {
      console.log('Cannot send message: missing content or user/recipient ID');
      return { success: false, error: 'Message cannot be empty' };
    }
    
    console.log('Sending message to:', recipientId);
    
    try {
      // Create optimistic message for immediate UI feedback
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
      
      // Create message object without delivery_status if it's not supported
      const messageData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content.trim(),
        message_type: 'text',
        delivery_status: 'sent',
        created_at: new Date().toISOString(),
      };
      
      const { error, data } = await supabase
        .from('direct_messages')
        .insert(messageData)
        .select();
      
      if (error) {
        console.error('Error sending message:', error);
        
        // If there's an error, check if it's due to delivery_status column not existing
        if (error.message?.includes('delivery_status')) {
          console.log('Retrying without delivery_status field');
          delete messageData.delivery_status;
          const { error: secondError, data: fallbackData } = await supabase
            .from('direct_messages')
            .insert(messageData)
            .select();
          
          if (secondError) {
            console.error('Second attempt failed:', secondError);
            onError();
            throw secondError;
          }
          
          console.log('Message sent successfully (fallback)');
          onSuccess(fallbackData[0] as DirectMessage);
          return { success: true, message: fallbackData[0] };
        } else {
          onError();
          throw error;
        }
      }
      
      console.log('Message sent successfully');
      onSuccess(data[0] as DirectMessage);
      return { success: true, message: data[0] };
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
    if (!files.length || !session?.user?.id || !recipientId) return;
    
    setIsUploading(true);
    
    try {
      const filesArray = Array.from(files);
      const uploadPromises = filesArray.map(async (file) => {
        const path = createUniqueFilePath(session.user.id, file);
        const result = await uploadFileToStorage('messages', path, file);
        
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload file");
        }
        
        return result.url;
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
      } else {
        messageData.media_url = urls;
      }
      
      // Try to create the message
      const { error } = await supabase
        .from('direct_messages')
        .insert(messageData);
      
      if (error) {
        // If there's an error, check if it's due to delivery_status column not existing
        if (error.message?.includes('delivery_status')) {
          delete messageData.delivery_status;
          const { error: secondError } = await supabase
            .from('direct_messages')
            .insert(messageData);
          
          if (secondError) throw secondError;
        } else {
          throw error;
        }
      }
      
      toast({
        title: "Media sent",
        description: `Successfully sent ${urls.length} media files`
      });
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast({
        title: "Failed to send media",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast]);

  const handleSnapCapture = useCallback(async (dataURL: string) => {
    if (!session?.user?.id || !recipientId) return;
    
    setIsUploading(true);
    
    try {
      // Convert data URL to blob
      const res = await fetch(dataURL);
      const blob = await res.blob();
      
      // Create a file from the blob
      const file = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload the file
      const path = createUniqueFilePath(session.user.id, file);
      const result = await uploadFileToStorage('snaps', path, file);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to upload snap");
      }
      
      // Set expiration time to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create the snap message
      const messageData: any = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        media_url: [result.url],
        message_type: 'snap',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        delivery_status: 'sent'
      };
      
      // Try to create the message
      const { error } = await supabase
        .from('direct_messages')
        .insert(messageData);
      
      if (error) {
        // If there's an error, check if it's due to delivery_status column not existing
        if (error.message?.includes('delivery_status')) {
          delete messageData.delivery_status;
          const { error: secondError } = await supabase
            .from('direct_messages')
            .insert(messageData);
          
          if (secondError) throw secondError;
        } else {
          throw error;
        }
      }
      
      toast({
        title: "Snap sent",
        description: "Your snap will disappear after viewing"
      });
    } catch (error: any) {
      console.error('Error sending snap:', error);
      toast({
        title: "Failed to send snap",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast]);

  const resendMessage = async (message: DirectMessage) => {
    if (!session?.user?.id || !recipientId) {
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      console.log('Resending message:', message.id);
      
      if (message.media_url && message.media_url.length > 0) {
        if (message.message_type === 'snap') {
          toast({
            title: "Cannot resend snap",
            description: "Please create a new snap instead",
            variant: "destructive"
          });
          return { success: false, error: "Cannot resend snaps" };
        }
        
        // Re-use existing media URLs
        const { error } = await supabase
          .from('direct_messages')
          .insert({
            sender_id: session.user.id,
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
      } else if (message.content) {
        // Simple text message resend
        return handleSendMessage(message.content);
      }
      
      return { success: false, error: "Invalid message to resend" };
    } catch (error: any) {
      console.error('Error resending message:', error);
      toast({
        title: "Failed to resend message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Failed to resend message" };
    }
  };

  return {
    isUploading,
    handleSendMessage,
    handleMediaSelect,
    handleSnapCapture,
    resendMessage
  };
};

// Add this alias to support existing code that imports useChatActionsV2
export const useChatActionsV2 = useChatActions;
