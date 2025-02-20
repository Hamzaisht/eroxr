
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Video } from "lucide-react";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();

  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, or MOV)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: "Video size must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!session?.user?.id || !selectedFile) return;

    try {
      setIsUploading(true);

      // Upload video file
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Create video record
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          creator_id: session.user.id,
          title,
          description,
          video_url: publicUrl,
          visibility: 'public',
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      onOpenChange(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="video">Video</Label>
            <input
              ref={fileInputRef}
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors"
              variant="outline"
              disabled={isUploading}
            >
              {selectedFile ? (
                <div className="flex items-center gap-2">
                  <Video className="h-6 w-6" />
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8" />
                  <span>Click to select video</span>
                  <span className="text-xs text-gray-400">
                    MP4, WebM, or MOV (max 100MB)
                  </span>
                </div>
              )}
            </Button>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent"
              placeholder="Add a title to your video"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent"
              placeholder="Describe your video"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
