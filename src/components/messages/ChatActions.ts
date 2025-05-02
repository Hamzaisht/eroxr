
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createUniqueFilePath, optimizeImage, createVideoThumbnail } from '@/utils/media/mediaUtils';
import { isImageFile, isVideoFile } from '@/utils/upload/validators';

interface UseChatActionsParams {
  recipientId: string;
}

export function useChatActions({ recipientId }: UseChatActionsParams) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();

  // Handle media file selection
  const handleMediaSelect = useCallback(async (files: FileList | File[]) => {
    if (!session?.user) return;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const mediaUrls: string[] = [];
      const totalFiles = files.length;
      
      // Process each file
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const currentProgress = Math.round((i / totalFiles) * 100);
        setUploadProgress(currentProgress);
        
        // Process based on file type
        if (isImageFile(file) && file.size > 1024 * 1024) { // Optimize if over 1MB
          const optimizedFile = await optimizeImage(file);
          const url = await uploadFile(optimizedFile);
          if (url) mediaUrls.push(url);
        } else if (isVideoFile(file)) {
          // Generate thumbnail for video
          const thumbnail = await createVideoThumbnail(file);
          
          // Upload video
          const videoUrl = await uploadFile(file);
          
          // Upload thumbnail if available
          let thumbnailUrl = '';
          if (thumbnail) {
            thumbnailUrl = await uploadFile(thumbnail, 'thumbnails');
          }
          
          if (videoUrl) {
            // Store video with thumbnail reference
            await supabase.from('direct_messages').insert({
              sender_id: session.user.id,
              recipient_id: recipientId,
              video_url: videoUrl,
              media_url: thumbnailUrl ? [thumbnailUrl] : null,
              message_type: 'video',
              created_at: new Date().toISOString(),
            });
          }
        } else {
          // Standard upload for other files
          const url = await uploadFile(file);
          if (url) mediaUrls.push(url);
        }
      }
      
      // Only insert message if we have media URLs and not just processed videos
      if (mediaUrls.length > 0) {
        await supabase.from('direct_messages').insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: mediaUrls,
          message_type: 'media',
          created_at: new Date().toISOString(),
        });
      }
      
      toast({
        title: "Media sent",
        description: "Your media has been sent successfully"
      });
      
      setUploadProgress(100);
      
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [session, recipientId, toast]);
  
  // Handle snap capture
  const handleSnapCapture = useCallback(async (dataUrl: string) => {
    if (!session?.user) return;
    
    setIsUploading(true);
    
    try {
      // Convert data URL to file
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload the file
      const url = await uploadFile(file);
      
      if (url) {
        // Create a snap message that expires
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration
        
        await supabase.from('direct_messages').insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: [url],
          message_type: 'snap',
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
        });
        
        toast({
          title: "Snap sent",
          description: "Your snap will disappear after being viewed"
        });
      }
    } catch (error) {
      console.error("Error sending snap:", error);
      toast({
        title: "Snap failed",
        description: "Failed to send snap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [session, recipientId, toast]);
  
  // Helper function to upload a file
  const uploadFile = useCallback(async (file: File, folder: string = 'messages'): Promise<string | null> => {
    if (!session?.user) return null;
    
    try {
      const filePath = createUniqueFilePath(session.user.id, file);
      
      // Upload file to storage
      const { error, data } = await supabase.storage
        .from(folder)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(folder)
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }, [session]);
  
  return {
    isUploading,
    uploadProgress,
    handleMediaSelect,
    handleSnapCapture
  };
}

