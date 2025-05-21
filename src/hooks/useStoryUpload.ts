
import { useState, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { uploadMediaToSupabase } from "@/utils/media/uploadUtils";
import { MediaAccessLevel } from "@/utils/media/types";
import { supabase } from "@/integrations/supabase/client";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const useStoryUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    isComplete: false
  });
  
  const fileRef = useRef<File | null>(null);
  const session = useSession();
  const { toast } = useToast();
  
  const uploadStory = async (file: File): Promise<string | null> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload stories",
        variant: "destructive"
      });
      return null;
    }
    
    // Save to ref
    fileRef.current = file;
    
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      isComplete: false
    });
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 300);
      
      // Use centralized upload function
      const result = await uploadMediaToSupabase(
        file,
        'stories',
        {
          maxSizeMB: 50,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to upload story");
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        isComplete: true
      });
      
      return result.url || null;
    } catch (error: any) {
      console.error("Story upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || "Upload failed",
        isComplete: false
      });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload story",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  const publishStory = async (mediaUrl: string): Promise<boolean> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to publish stories",
        variant: "destructive"
      });
      return false;
    }
    
    const contentType = fileRef.current?.type.startsWith("image/") ? "image" : "video";
    
    try {
      const { error } = await supabase
        .from("stories")
        .insert({
          creator_id: session.user.id,
          media_url: mediaUrl,
          content_type: contentType,
          is_public: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });
      
      if (error) throw error;
      
      toast({
        title: "Story Published",
        description: "Your story has been published successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Story publishing error:", error);
      
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish story",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return {
    uploadState,
    uploadStory,
    publishStory
  };
};
