
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { optimizeImage, createVideoThumbnail } from '@/utils/mediaUtils';

interface UseChatActionsProps {
  recipientId: string;
}

export function useChatActions({ recipientId }: UseChatActionsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Handle media selection
  const handleMediaSelect = useCallback(async (files: FileList) => {
    if (!files.length || !session?.user?.id || !recipientId) {
      return false;
    }

    setIsUploading(true);

    try {
      // Upload each file
      const uploadPromises = Array.from(files).map(async file => {
        // Optimize images before upload
        let fileToUpload: File | Blob = file;
        if (file.type.startsWith('image/')) {
          try {
            const optimizedBlob = await optimizeImage(file);
            fileToUpload = new File([optimizedBlob], file.name, { type: file.type });
          } catch (err) {
            console.warn('Failed to optimize image, uploading original:', err);
          }
        }

        // Create unique file path
        const fileExt = file.name.split('.').pop() || '';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from('messages')
          .upload(filePath, fileToUpload);

        if (error) {
          throw error;
        }

        const { data } = supabase.storage
          .from('messages')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      
      // Create message with the uploaded media
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: urls,
          message_type: 'media',
          created_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Media sent",
        description: `Successfully sent ${urls.length} file${urls.length === 1 ? '' : 's'}`
      });

      return true;
    } catch (error: any) {
      console.error("Error uploading media:", error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to send media",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast]);

  // Handle camera snap capture
  const handleSnapCapture = useCallback(async (dataURL: string) => {
    if (!session?.user?.id || !recipientId) return false;

    setIsUploading(true);

    try {
      // Convert data URL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload the file
      const filePath = `${session.user.id}/snaps/${uuidv4()}.jpg`;
      
      const { error } = await supabase.storage
        .from('messages')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);
        
      // Create message with the uploaded image
      await supabase.from('direct_messages').insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        media_url: [data.publicUrl],
        message_type: 'snap',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      
      toast({
        title: "Snap Sent",
        description: "Your snap has been sent"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending snap:", error);
      
      toast({
        title: "Snap Failed",
        description: error.message || "Failed to send snap",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, recipientId, toast]);

  return {
    isUploading,
    handleMediaSelect,
    handleSnapCapture
  };
}
