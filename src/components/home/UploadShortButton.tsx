
import { useState, useRef } from "react";
import { Plus, Loader2, Video, Upload } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateVideoThumbnails, getVideoDuration } from "@/utils/videoProcessing";
import { Progress } from "@/components/ui/progress";

export const UploadShortButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setSelectedFile(file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
    
    // Generate a default title from the filename
    const defaultTitle = file.name.split('.')[0].replace(/_/g, ' ');
    setTitle(defaultTitle);
    
    return () => URL.revokeObjectURL(objectUrl);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setTitle("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !session?.user) {
      toast({
        title: "Cannot upload",
        description: selectedFile ? "Please sign in to upload" : "Please select a video first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10); // Start progress indicator
      
      // Process file
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Get video duration
      const duration = await getVideoDuration(selectedFile);
      setUploadProgress(20);
      
      // Generate thumbnail
      let thumbnailUrl = null;
      try {
        const thumbnails = await generateVideoThumbnails(selectedFile, 1);
        setUploadProgress(40);
        
        if (thumbnails.length > 0) {
          // Convert data URL to Blob
          const response = await fetch(thumbnails[0]);
          const blob = await response.blob();
          
          // Upload thumbnail
          const thumbnailPath = `${session.user.id}/${fileName.split('.')[0]}.jpg`;
          const { error: thumbnailError } = await supabase.storage
            .from('shorts')
            .upload(thumbnailPath, blob, {
              contentType: 'image/jpeg'
            });
            
          if (!thumbnailError) {
            const { data: { publicUrl } } = supabase.storage
              .from('shorts')
              .getPublicUrl(thumbnailPath);
              
            thumbnailUrl = publicUrl;
          }
        }
      } catch (thumbnailError) {
        console.error('Thumbnail generation error:', thumbnailError);
        // Continue with upload even if thumbnail fails
      }
      
      setUploadProgress(60);

      // Upload video
      const { error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
          contentType: selectedFile.type
        });

      if (uploadError) throw uploadError;
      setUploadProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);

      // Create post record
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content: title || "New short video",
            video_urls: [publicUrl],
            duration: Math.round(duration) || 30,
            visibility: 'public',
            video_thumbnail_url: thumbnailUrl,
          },
        ]);

      if (postError) throw postError;
      setUploadProgress(100);

      // Invalidate and refetch query to update UI immediately
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Upload successful",
        description: "Your short has been uploaded successfully",
      });
      
      resetForm();
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
        id="upload-video-button" // ID referenced from ShortsFeed
      >
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg hover:shadow-luxury z-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Short
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload a Short</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            {!videoPreview ? (
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelection}
                  disabled={isUploading}
                  ref={fileInputRef}
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
            ) : (
              <div className="space-y-4">
                <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
                  <video 
                    src={videoPreview} 
                    className="w-full h-full object-contain" 
                    autoPlay 
                    muted 
                    loop
                    controls
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="video-title" className="text-sm font-medium">
                    Title (optional)
                  </label>
                  <input
                    id="video-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a title to your short"
                    className="w-full px-3 py-2 bg-luxury-darker border border-luxury-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-primary/40"
                    disabled={isUploading}
                  />
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      URL.revokeObjectURL(videoPreview);
                      setVideoPreview(null);
                      setSelectedFile(null);
                    }}
                    disabled={isUploading}
                  >
                    Change Video
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-luxury-primary hover:bg-luxury-primary/90"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
