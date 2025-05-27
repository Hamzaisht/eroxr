
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaUploadSection } from "@/components/post/MediaUploadSection";
import { Progress } from "@/components/ui/progress";
import { X, Image, Video, Upload } from "lucide-react";
import { MediaAccessLevel } from "@/utils/media/types";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ open, onOpenChange, selectedFiles, onFileSelect }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "subscribers_only">("public");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
  const [uploadedAssetIds, setUploadedAssetIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const session = useSession();
  const { toast } = useToast();

  const characterLimit = 2000;
  const charactersUsed = content.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      
      // Create preview URLs for selected files
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          previews.push(url);
        }
      });
      setPreviewUrls(previews);
    }
  };

  const removePreview = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    
    // Update selected files
    if (selectedFiles) {
      const dt = new DataTransfer();
      Array.from(selectedFiles).forEach((file, i) => {
        if (i !== index) {
          dt.items.add(file);
        }
      });
      onFileSelect(dt.files);
    }
  };

  const handleMediaUploadComplete = (urls: string[], assetIds: string[]) => {
    console.log("Media upload complete:", { urls, assetIds });
    setUploadedMediaUrls(urls);
    setUploadedAssetIds(assetIds);
    setUploadProgress(100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && uploadedMediaUrls.length === 0) {
      toast({
        title: "Error",
        description: "Post must have content or media",
        variant: "destructive",
      });
      return;
    }

    if (content.length > characterLimit) {
      toast({
        title: "Error",
        description: `Post content cannot exceed ${characterLimit} characters`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Creating post with data:", {
        content: content.trim(),
        creator_id: session.user.id,
        visibility,
      });

      // Simple post creation - no trending content operations at all
      const postData = {
        content: content.trim(),
        creator_id: session.user.id,
        visibility: visibility,
        likes_count: 0,
        comments_count: 0,
        view_count: 0,
        share_count: 0,
        engagement_score: 0.0,
        is_ppv: false,
        is_featured: false
      };

      console.log("Inserting post data:", postData);

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error('Post creation error:', postError);
        throw new Error(`Failed to create post: ${postError.message}`);
      }

      console.log("Post created successfully:", post);

      // Update media assets with post_id if we have any
      if (uploadedAssetIds.length > 0 && post.id) {
        console.log("Updating media assets with post_id:", post.id);
        
        const { error: mediaError } = await supabase
          .from('media_assets')
          .update({ 
            metadata: { post_id: post.id, usage: 'post' }
          })
          .in('id', uploadedAssetIds);

        if (mediaError) {
          console.error('Media assets update error:', mediaError);
          // Don't fail the post creation for this
        }
      }

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      // Reset form
      setContent("");
      setVisibility("public");
      setUploadedMediaUrls([]);
      setUploadedAssetIds([]);
      setUploadProgress(0);
      setPreviewUrls([]);
      onFileSelect(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div>
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or exclusive content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={characterLimit}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${charactersUsed > characterLimit * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                {charactersUsed}/{characterLimit}
              </span>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4">
            <Label>Media Upload</Label>
            
            {/* File Selection */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  Images, videos up to 100MB each
                </p>
              </label>
            </div>

            {/* Media Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {selectedFiles && selectedFiles[index]?.type.startsWith('image/') ? (
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          controls={false}
                          muted
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePreview(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {selectedFiles && selectedFiles[index]?.type.startsWith('image/') ? (
                        <Image className="h-3 w-3" />
                      ) : (
                        <Video className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Advanced Media Upload Component */}
            {selectedFiles && selectedFiles.length > 0 && (
              <MediaUploadSection
                onUploadComplete={handleMediaUploadComplete}
                defaultAccessLevel={MediaAccessLevel.PUBLIC}
              />
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">
                  Uploading media... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Visibility Settings */}
          <div>
            <Label htmlFor="visibility">Post Visibility</Label>
            <Select value={visibility} onValueChange={(value: "public" | "subscribers_only") => setVisibility(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see</SelectItem>
                <SelectItem value="subscribers_only">Subscribers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (charactersUsed === 0 && uploadedMediaUrls.length === 0)}
              className="min-w-[100px]"
            >
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
