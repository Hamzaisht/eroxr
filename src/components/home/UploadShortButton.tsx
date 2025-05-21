
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export const UploadShortButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { upload, uploadState } = useMediaUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid file",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload shorts",
        variant: "destructive"
      });
      return;
    }

    if (!file) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload video using our centralized upload hook
      const videoUrl = await upload({ 
        file, 
        mediaType: 'video', 
        contentCategory: 'shorts',
        onProgress: (progress) => {
          console.log(`Short upload progress: ${progress}%`);
        }
      });
      
      if (!videoUrl) {
        throw new Error("Failed to upload video");
      }

      // Create post with video
      const { error: postError } = await supabase
        .from("posts")
        .insert({
          content: caption,
          creator_id: session.user.id,
          video_urls: [videoUrl],
          visibility: "public",
          tags: caption
            .split(" ")
            .filter(word => word.startsWith("#"))
            .map(tag => tag.replace("#", "")),
        });

      if (postError) {
        throw postError;
      }

      toast({
        title: "Upload successful",
        description: "Your short has been uploaded"
      });
      
      // Reset form
      setCaption("");
      removeFile();
      setIsOpen(false);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload short",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="rounded-full flex items-center gap-2"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Upload Short</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Upload Short Video
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!file ? (
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/10"
                onClick={() => document.getElementById("short-upload")?.click()}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">
                  Click to select a video
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, WebM, MOV (max 100MB)
                </p>
                <Input
                  id="short-upload"
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video 
                  src={previewUrl || undefined}
                  className="w-full aspect-[9/16] object-contain"
                  controls
                  muted
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={removeFile}
                >
                  <X size={16} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white text-xs">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              </div>
            )}

            <Textarea
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none"
            />

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting || uploadState.isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!file || isSubmitting || uploadState.isUploading}
              >
                {isSubmitting || uploadState.isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadState.isUploading 
                      ? `Uploading (${uploadState.progress}%)` 
                      : "Posting..."}
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
