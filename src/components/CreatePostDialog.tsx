
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";

export interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect?: (files: FileList | null) => void;
  onPostCreated?: () => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  selectedFiles,
  onFileSelect,
  onPostCreated
}: CreatePostDialogProps) {
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { toast } = useToast();
  const session = useSession();
  const { upload, uploadState } = useMediaUpload();

  const handleFileSelect = (files: FileList | null) => {
    if (onFileSelect) {
      onFileSelect(files);
    } else {
      setSelectedFiles(files);
    }
  };

  // Use either the prop or local state
  const [localSelectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const effectiveFiles = selectedFiles || localSelectedFiles;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!caption && (!effectiveFiles || effectiveFiles.length === 0)) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    let mediaUrls: string[] = [];

    try {
      // Upload all selected files
      if (effectiveFiles && effectiveFiles.length > 0) {
        const uploadPromises = Array.from(effectiveFiles).map(async (file) => {
          const mediaType = file.type.startsWith('image/') 
            ? 'image' 
            : file.type.startsWith('video/') 
              ? 'video' 
              : 'document';
              
          const url = await upload({ 
            file, 
            mediaType,
            onProgress: (progress) => {
              console.log(`Upload progress for ${file.name}: ${progress}%`);
            }
          });
          
          return url;
        });

        const results = await Promise.all(uploadPromises);
        mediaUrls = results.filter(url => url !== null) as string[];
        setUploadedUrls(mediaUrls);
      }

      // Create the post with the uploaded media URLs
      // You would typically save this to your database
      console.log("Creating post with:", {
        caption,
        mediaUrls
      });

      toast({
        title: "Post created",
        description: "Your post has been published"
      });

      // Reset form fields
      setCaption("");
      setSelectedFiles(null);
      if (onFileSelect) {
        onFileSelect(null);
      }
      setUploadedUrls([]);
      onOpenChange(false);
      
      if (onPostCreated) {
        onPostCreated();
      }
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="caption" className="text-sm font-medium">
              Caption
            </label>
            <Textarea
              id="caption"
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Media</label>
            <input
              type="file"
              accept="image/*,video/*"
              className="w-full"
              onChange={(e) => handleFileSelect(e.target.files)}
              multiple
            />
            
            {/* Display selected file info */}
            {effectiveFiles && effectiveFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm">
                  {Array.from(effectiveFiles).map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || uploadState.isUploading}
            >
              {isSubmitting || uploadState.isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadState.isUploading 
                    ? `Uploading (${uploadState.progress}%)` 
                    : "Creating..."}
                </>
              ) : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
