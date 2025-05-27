import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, Upload, Image, Video, Mic } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

interface MediaPreview {
  file: File;
  url: string;
  type: 'image' | 'video' | 'audio';
  id: string;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles,
  onFileSelect
}: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews: MediaPreview[] = files.map(file => {
      const url = URL.createObjectURL(file);
      let type: 'image' | 'video' | 'audio' = 'image';
      
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      
      return {
        file,
        url,
        type,
        id: Math.random().toString(36).substr(2, 9)
      };
    });

    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (id: string) => {
    setMediaPreviews(prev => {
      const updated = prev.filter(preview => preview.id !== id);
      // Clean up object URLs
      const removed = prev.find(p => p.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const uploadMediaAssets = async (files: File[]): Promise<string[]> => {
    const mediaAssetIds: string[] = [];
    
    for (const file of files) {
      try {
        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        console.log(`Uploading file to bucket 'media' with path: ${filePath}`);

        // Upload to Supabase Storage using the 'media' bucket
        const { data: storageData, error: storageError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (storageError) {
          console.error('Storage upload error:', storageError);
          throw storageError;
        }

        console.log('Storage upload successful:', storageData);

        // Determine media type
        let mediaType = 'image';
        if (file.type.startsWith('video/')) mediaType = 'video';
        else if (file.type.startsWith('audio/')) mediaType = 'audio';

        // Create media asset record
        const { data: assetData, error: assetError } = await supabase
          .from('media_assets')
          .insert({
            user_id: session?.user?.id,
            storage_path: storageData.path,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            media_type: mediaType,
            access_level: 'public',
            alt_text: file.name,
            metadata: { usage: 'post' }
          })
          .select()
          .single();

        if (assetError) {
          console.error('Asset creation error:', assetError);
          throw assetError;
        }

        console.log('Media asset created:', assetData);
        mediaAssetIds.push(assetData.id);
      } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
      }
    }

    return mediaAssetIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim() && mediaPreviews.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setIsUploading(true);
    
    try {
      // Upload media assets first
      let mediaAssetIds: string[] = [];
      if (mediaPreviews.length > 0) {
        console.log('Starting media upload for', mediaPreviews.length, 'files');
        mediaAssetIds = await uploadMediaAssets(mediaPreviews.map(p => p.file));
        console.log('Media upload completed. Asset IDs:', mediaAssetIds);
      }

      setIsUploading(false);

      // Create the post
      console.log('Creating post...');
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert({
          creator_id: session.user.id,
          content: content.trim(),
          visibility: 'public'
        })
        .select()
        .single();
        
      if (postError) {
        console.error('Post creation error:', postError);
        throw postError;
      }

      console.log('Post created:', postData);

      // Update media assets to reference this post
      if (mediaAssetIds.length > 0) {
        console.log('Linking media assets to post:', postData.id);
        const { error: updateError } = await supabase
          .from('media_assets')
          .update({
            metadata: { post_id: postData.id, usage: 'post' }
          })
          .in('id', mediaAssetIds);

        if (updateError) {
          console.error('Error linking media to post:', updateError);
        } else {
          console.log('Media assets linked to post successfully');
        }
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });
      
      // Invalidate queries to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
      
      // Reset form and close dialog
      setContent("");
      setMediaPreviews([]);
      // Clean up object URLs
      mediaPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const MediaPreviewComponent = ({ preview }: { preview: MediaPreview }) => {
    return (
      <div className="relative rounded-lg overflow-hidden bg-luxury-darker border border-luxury-neutral/20">
        {preview.type === 'image' && (
          <img 
            src={preview.url} 
            alt="Preview"
            className="w-full h-32 object-cover"
          />
        )}
        {preview.type === 'video' && (
          <video 
            src={preview.url}
            className="w-full h-32 object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {preview.type === 'audio' && (
          <div className="w-full h-32 flex items-center justify-center bg-luxury-neutral/10">
            <div className="text-center">
              <Mic className="h-8 w-8 mx-auto mb-2 text-luxury-primary" />
              <p className="text-sm text-luxury-neutral truncate px-2">
                {preview.file.name}
              </p>
            </div>
          </div>
        )}
        
        <button
          type="button"
          onClick={() => removeMedia(preview.id)}
          className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black/90 transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-luxury-darker border-luxury-neutral/20">
        <DialogHeader>
          <DialogTitle className="text-white">Create Post</DialogTitle>
          <DialogDescription className="text-luxury-neutral/60">
            Share something amazing with your audience
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea 
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none bg-luxury-neutral/5 border-luxury-neutral/20 text-white placeholder:text-luxury-neutral/60"
          />
          
          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Media Preview</h4>
              <div className="grid grid-cols-2 gap-3">
                {mediaPreviews.map((preview) => (
                  <MediaPreviewComponent key={preview.id} preview={preview} />
                ))}
              </div>
            </div>
          )}
          
          {/* Media Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-luxury-primary/10 hover:bg-luxury-primary/20 rounded-lg transition-colors border border-luxury-primary/30">
                  <Upload className="h-4 w-4 text-luxury-primary" />
                  <span className="text-luxury-primary text-sm font-medium">Add Media</span>
                </div>
              </label>
              
              <div className="flex items-center gap-2 text-luxury-neutral/60 text-xs">
                <Image className="h-3 w-3" />
                <Video className="h-3 w-3" />
                <Mic className="h-3 w-3" />
                <span>Images, Videos, Audio</span>
              </div>
            </div>
          </div>
          
          {/* Submit Section */}
          <div className="flex justify-between items-center pt-4 border-t border-luxury-neutral/20">
            <div className="text-xs text-luxury-neutral/60">
              {content.length}/2000 characters
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || (!content.trim() && mediaPreviews.length === 0)}
              className="bg-luxury-primary hover:bg-luxury-primary/80 text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Posting..."}
                </>
              ) : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
