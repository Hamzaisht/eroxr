import { useState } from "react";
import { Plus, Loader2, Video } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UploadShortButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload shorts",
        variant: "destructive",
      });
      return;
    }

    // Check file type and size
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB limit
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);

      // Get video duration
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          resolve(Math.round(video.duration));
        };
      });

      // Create post record
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content: "New short video",
            video_urls: [publicUrl],
            duration,
            visibility: 'public'
          },
        ]);

      if (postError) throw postError;

      toast({
        title: "Upload successful",
        description: "Your short has been uploaded successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg hover:shadow-luxury z-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Short
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload a Short</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={isUploading}
              />
              <Button
                onClick={() => document.getElementById('video-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Video className="h-8 w-8" />
                    <span>Click to select video</span>
                    <span className="text-sm text-luxury-neutral/60">
                      Maximum size: 100MB
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};