import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const StoryUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      const isVideo = file.type.startsWith('video/');
      const { error: storyError } = await supabase
        .from('stories')
        .insert([{
          creator_id: session.user.id,
          [isVideo ? 'video_url' : 'media_url']: publicUrl,
          duration: isVideo ? 30 : null
        }]);

      if (storyError) throw storyError;

      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
          <Plus className="w-8 h-8 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <span className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
          {isUploading ? "Uploading..." : "Add Story"}
        </span>
      </label>
    </motion.div>
  );
};