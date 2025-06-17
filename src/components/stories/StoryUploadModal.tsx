import { useState, useCallback } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileInput } from "@/components/ui/file-input"
import { useToast } from "@/hooks/use-toast";
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { CheckCircle, XCircle } from 'lucide-react';

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryUploadModal = ({ open, onOpenChange }: StoryUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setUploadError(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!file || !session?.user || uploading) return;

    setUploading(true);
    setUploadError(null);

    try {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('Invalid file type. Only images and videos are allowed.');
      }

      const result = await uploadMediaToSupabase(
        file,
        'stories',
        {
          maxSizeMB: 50,
          folder: 'stories'
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      const contentType = file.type.startsWith('image/') ? 'image' : 'video';
      const { error } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_url: result.url,
          content_type: contentType,
          is_public: true
        });

      if (error) throw error;

      toast({
        title: "Story uploaded",
        description: "Your story has been published successfully",
      });

      // Emit event for real-time updates
      window.dispatchEvent(new CustomEvent('story-uploaded'));
      
      onOpenChange(false);
      setFile(null);
      setPreviewUrl('');
    } catch (error: any) {
      console.error('Error uploading story:', error);
      setUploadError(error.message || 'Failed to upload story');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Story</DialogTitle>
          <DialogDescription>
            Share your moments with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Media
            </Label>
            <div className="col-span-3">
              <FileInput
                id="picture"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {previewUrl && (
                <div className="mt-2">
                  {file?.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="Story preview"
                      className="w-full aspect-video object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      className="w-full aspect-video object-cover rounded-md"
                      controls
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {uploadError && (
          <div className="flex items-center text-sm text-red-500 space-x-2">
            <XCircle className="w-4 h-4" />
            <p>{uploadError}</p>
          </div>
        )}
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload Story'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
