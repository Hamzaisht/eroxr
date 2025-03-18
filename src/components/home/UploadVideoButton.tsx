
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Image, X, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { validateVideoFormat, getVideoDuration, generateVideoThumbnails } from "@/utils/videoProcessing";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export const UploadVideoButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handler for file selection via input
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      await processSelectedFile(file);
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        variant: "destructive",
        title: "Invalid video",
        description: error.message || "Please select a valid video file.",
      });
    }
  };

  // Handler for drag and drop
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const items = event.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) {
            try {
              await processSelectedFile(file);
              break; // Only process the first valid file
            } catch (error: any) {
              console.error("Error processing file:", error);
              toast({
                variant: "destructive",
                title: "Invalid video",
                description: error.message || "Please select a valid video file.",
              });
            }
          }
        }
      }
    }
  };

  // Process and validate the selected file
  const processSelectedFile = async (file: File) => {
    // Check file type
    if (!file.type.startsWith('video/')) {
      throw new Error('Please select a video file.');
    }
    
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('Video size must be less than 50MB.');
    }
    
    // Validate the video format
    const isValid = await validateVideoFormat(file);
    if (!isValid) {
      throw new Error('The selected file is not a valid video format.');
    }
    
    // Check duration
    const duration = await getVideoDuration(file);
    if (duration > 60) {
      throw new Error('Video duration must be less than 60 seconds.');
    }
    
    // Generate thumbnail
    setIsGeneratingThumbnail(true);
    try {
      const thumbnails = await generateVideoThumbnails(file, 1);
      if (thumbnails.length > 0) {
        setThumbnailUrl(thumbnails[0]);
      }
    } catch (error) {
      console.error("Error generating thumbnails:", error);
    } finally {
      setIsGeneratingThumbnail(false);
    }
    
    setSelectedFile(file);
  };

  // Upload the video
  const handleUpload = async () => {
    if (!selectedFile || !session?.user?.id) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Upload the video to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          },
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the video
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      // Upload thumbnail if available
      let thumbnailPublicUrl = null;
      if (thumbnailUrl) {
        const thumbnailFileName = `${Math.random()}.jpg`;
        const thumbnailPath = `${session.user.id}/${thumbnailFileName}`;
        
        // Convert data URL to Blob
        const response = await fetch(thumbnailUrl);
        const blob = await response.blob();
        
        const { error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailPath, blob, { upsert: true });
          
        if (thumbnailError) {
          console.error("Error uploading thumbnail:", thumbnailError);
        } else {
          const { data: { publicUrl: thumbUrl } } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailPath);
            
          thumbnailPublicUrl = thumbUrl;
        }
      }
      
      // Create a post entry with the video
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content: description || title || "New video",
            video_urls: [publicUrl],
            video_thumbnail_url: thumbnailPublicUrl,
            tags: [],
            visibility: 'public'
          }
        ]);
      
      if (postError) {
        throw postError;
      }
      
      // Show success animation and reset form
      setIsSuccess(true);
      
      // Invalidate queries to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Close the dialog after success animation
      setTimeout(() => {
        resetForm();
        setIsDialogOpen(false);
        setIsSuccess(false);
      }, 1500);
      
      toast({
        title: "Video uploaded!",
        description: "Your video has been uploaded successfully.",
      });
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setThumbnailUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed right-6 bottom-6 z-50"
        id="upload-video-button"
      >
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-luxury-primary hover:bg-luxury-primary/90"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-luxury-darker text-white border-luxury-primary/20 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Upload Video</DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Video Uploaded!</h3>
                <p className="text-luxury-neutral text-center">Your video has been uploaded successfully and is ready to view.</p>
              </motion.div>
            ) : (
              <div className="grid gap-4 py-4">
                {!selectedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isDragging ? 'border-luxury-primary bg-luxury-primary/10' : 'border-luxury-neutral/30'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                      <div className="w-16 h-16 rounded-full bg-luxury-primary/20 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-luxury-primary" />
                      </div>
                      <p className="text-luxury-neutral">
                        Drag and drop your video here, or{" "}
                        <span
                          className="text-luxury-primary cursor-pointer hover:underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </span>
                      </p>
                      <p className="text-luxury-neutral/60 text-sm">
                        Max file size: 50MB • Max duration: 60 seconds
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                      {isGeneratingThumbnail ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
                        </div>
                      ) : (
                        <>
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt="Video thumbnail"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-12 w-12 text-luxury-neutral/30" />
                            </div>
                          )}
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="absolute bottom-2 left-2 text-sm text-white/80 bg-black/60 px-2 py-1 rounded">
                        {selectedFile.name}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title (optional)</Label>
                        <Input
                          id="title"
                          placeholder="Add a title to your video"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-luxury-dark/50 border-luxury-neutral/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your video"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="bg-luxury-dark/50 border-luxury-neutral/30 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>

          <DialogFooter>
            {!isSuccess && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-luxury-primary hover:bg-luxury-primary/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
