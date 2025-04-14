
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { useStoryUpload } from "@/hooks/useStoryUpload";

export const StoryUploader = () => {
  const session = useSession();
  const { toast } = useToast();
  const { uploadStory, reset, state } = useStoryUpload();
  const { isUploading, progress, error } = state;
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;
    
    // Only allow images and videos
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image or video file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive"
      });
      return;
    }
    
    const result = await uploadStory(file);
    
    if (result.success) {
      // Trigger refresh of stories
      window.dispatchEvent(new CustomEvent('story-uploaded'));
    }
  }, [session?.user?.id, toast, uploadStory]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer?.files[0];
    if (!file || !session?.user?.id) return;
    
    // Only allow images and videos
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image or video file",
        variant: "destructive"
      });
      return;
    }
    
    await uploadStory(file);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-24 h-36"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        id="story-upload"
        disabled={isUploading}
        accept="image/*,video/*"
      />
      <label
        htmlFor="story-upload"
        className={`cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-xl ${
          isDragging
            ? "border-2 border-luxury-primary bg-luxury-primary/20"
            : "border-2 border-dashed border-luxury-primary/30 bg-gradient-to-br from-luxury-primary/10 to-luxury-accent/10"
        } transition-all duration-300`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-6 w-6 text-luxury-primary animate-spin" />
            <span className="text-xs mt-2 text-luxury-primary">{progress}%</span>
          </div>
        ) : (
          <>
            <div className="h-8 w-8 rounded-full bg-luxury-primary/20 flex items-center justify-center">
              <Plus className="h-5 w-5 text-luxury-primary" />
            </div>
            <span className="text-[10px] mt-2 text-luxury-primary">Your Story</span>
          </>
        )}
      </label>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-0 right-0 text-center"
        >
          <span className="text-xs text-red-500">Upload failed</span>
        </motion.div>
      )}
    </motion.div>
  );
};
