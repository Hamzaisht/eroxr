
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const StoryUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      setIsUploading(true);
      setUploadProgress(10); // Show initial progress
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', '');
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 90) + 10; // 10-100%
          setUploadProgress(percentComplete);
        }
      });
      
      // Use traditional upload method since we can't easily track progress with XHR
      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      // Determine if this is a video or image
      const isVideo = file.type.startsWith('video/');
      
      // Add a cache buster to ensure the URL is fresh
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
      
      const { error: storyError } = await supabase
        .from('stories')
        .insert([{
          creator_id: session.user.id,
          [isVideo ? 'video_url' : 'media_url']: cacheBustedUrl,
          duration: isVideo ? 30 : 10
        }]);

      if (storyError) throw storyError;

      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
      
      // Force a page refresh to show the new story
      window.location.reload();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [session?.user?.id, toast]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative w-24 h-36 group"
    >
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="story-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="story-upload"
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-luxury-primary/10 to-luxury-accent/10 border-2 border-dashed border-luxury-primary/30 group-hover:border-luxury-accent/50 transition-all duration-300"
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-luxury-primary/80 animate-spin" />
            <span className="text-xs text-white/60 mt-2">
              {uploadProgress > 0 ? `${uploadProgress}%` : "Uploading..."}
            </span>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
              <Plus className="w-8 h-8 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
              Add Story
            </span>
          </>
        )}
      </label>
    </motion.div>
  );
};
