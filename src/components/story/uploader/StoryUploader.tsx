
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { useStoryUpload } from "./hooks/useStoryUpload";
import { UploadProgress } from "@/components/ui/UploadProgress";

export const StoryUploader = () => {
  const session = useSession();
  const { toast } = useToast();
  const { 
    isUploading, 
    progress, 
    error, 
    previewUrl, 
    handleFileSelect,
    uploadFile
  } = useStoryUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;
    
    const isValid = await handleFileSelect(file);
    if (isValid) {
      await uploadFile(file);
      
      // Trigger refresh of stories
      window.dispatchEvent(new CustomEvent('story-uploaded'));
    }
  }, [session?.user?.id, handleFileSelect, uploadFile]);

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
    
    const isValid = await handleFileSelect(file);
    if (isValid) {
      await uploadFile(file);
    }
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
        onChange={handleFileInputChange}
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
        {previewUrl ? (
          <div className="w-full h-full relative rounded-xl overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
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
      
      {(isUploading || error) && (
        <div className="absolute -bottom-16 left-0 right-0 w-24">
          <UploadProgress
            isUploading={isUploading}
            progress={progress}
            isComplete={progress === 100}
            isError={!!error}
            errorMessage={error}
            onRetry={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
};
