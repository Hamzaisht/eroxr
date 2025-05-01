
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createUniqueFilePath, uploadFileToStorage } from "@/utils/media/mediaUtils";

interface ChatActionsProps {
  recipientId: string;
}

export const useChatActions = ({ recipientId }: ChatActionsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !session?.user?.id || !recipientId) return;
    
    try {
      // Create message object without delivery_status if it's not supported
      const messageData: any = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content.trim(),
        message_type: 'text',
        created_at: new Date().toISOString(),
      };
      
      // Only add delivery_status if needed
      try {
        await supabase.from('direct_messages').insert(messageData);
      } catch (error: any) {
        // If the first attempt failed, it might be due to missing delivery_status column
        // Try again without it
        if (error.message?.includes('delivery_status')) {
          delete messageData.delivery_status;
          await supabase.from('direct_messages').insert(messageData);
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [session?.user?.id, recipientId, toast]);

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
      
      // Create the message data object without delivery_status initially
      const messageData: any = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        message_type: isVideo && urls.length === 1 ? 'video' : 'media',
        created_at: new Date().toISOString(),
      };
      
      // Set the appropriate media field
      if (isVideo && urls.length === 1) {
        messageData.video_url = urls[0];
      } else {
        messageData.media_url = urls;
      }
      
      // Try to create the message
      await supabase.from('direct_messages').insert(messageData);
      
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
      
      // Create the snap message without delivery_status initially
      const messageData: any = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        media_url: [result.url],
        message_type: 'snap',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };
      
      // Try to create the message
      await supabase.from('direct_messages').insert(messageData);
      
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

  return {
    isUploading,
    handleSendMessage,
    handleMediaSelect,
    handleSnapCapture
  };
};
