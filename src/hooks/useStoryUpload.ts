
import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createFilePreview, revokeFilePreview, runFileDiagnostic } from "@/utils/upload/fileUtils";
import { useToast } from "./use-toast";

export function useStoryUpload() {
  const [uploading, setUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const supabase = useSupabaseClient();
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleVideoSelect = async (file: File) => {
    // Validate file
    const diagnostic = runFileDiagnostic(file, { maxSizeMB: 100, allowedTypes: ['video/*'] });
    if (!diagnostic.valid) {
      toast({
        title: "Invalid file",
        description: diagnostic.message || "Invalid video file",
        variant: "destructive",
      });
      return;
    }
    
    // Set video file
    setVideoFile(file);
    
    // Create preview
    const previewUrl = createFilePreview(file);
    setVideoPreview(previewUrl);
  };
  
  const clearVideo = () => {
    if (videoPreview) {
      revokeFilePreview(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
  };
  
  const uploadVideo = async () => {
    if (!videoFile || !session?.user) {
      toast({
        title: "Missing video or session",
        description: "Please select a video and ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const videoName = `${uuidv4()}-${videoFile.name}`;
      
      // Upload video to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('videos')
        .upload(videoName, videoFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        throw error;
      }
      
      // Fixed: Use proper access to data object
      const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/`;
      const videoUrl = `${storageUrl}${data.path}`;
      
      // Update user profile with video URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ video_url: videoUrl })
        .eq('id', session.user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Video uploaded",
        description: "Your video has been uploaded successfully.",
      });
      
      clearVideo();
      navigate('/profile');
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return {
    uploading,
    videoPreview,
    handleVideoSelect,
    clearVideo,
    uploadVideo,
  };
}
