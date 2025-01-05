import { useRef } from "react";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const StoryUploader = () => {
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStoryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create stories",
        variant: "destructive",
      });
      return;
    }

    try {
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

      const { error: storyError } = await supabase
        .from('stories')
        .insert([
          {
            creator_id: session.user.id,
            media_url: publicUrl,
          },
        ]);

      if (storyError) throw storyError;

      toast({
        title: "Story created",
        description: "Your story has been published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload story. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-shrink-0"
    >
      <div 
        className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300 group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleStoryUpload}
        />
        <div className="relative mb-2">
          <div className="aspect-[3/4] rounded-lg bg-luxury-primary/10 flex items-center justify-center group-hover:bg-luxury-primary/20 transition-colors">
            <Plus className="h-8 w-8 text-luxury-neutral/60 group-hover:text-luxury-primary transition-colors" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-luxury-neutral/60 group-hover:text-luxury-primary transition-colors">Add Story</p>
        </div>
      </div>
    </motion.div>
  );
};