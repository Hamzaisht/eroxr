import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Video, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const maxFileSize = 200 * 1024 * 1024; // 200MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
      setUploadComplete(false);
      setValidationError(null);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setValidationError("Please upload a video file (MP4, WebM, or MOV)");
      return;
    }

    if (file.size > maxFileSize) {
      setValidationError("Video size must be less than 200MB");
      return;
    }

    setValidationError(null);
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const video = document.createElement('video');
    video.src = objectUrl;
    video.onloadedmetadata = () => {
      console.log("Video duration:", video.duration);
    };
  };

  const handleUpload = async () => {
    if (!session?.user?.id || !selectedFile) return;
    
    if (!title.trim()) {
      setValidationError("Please enter a title for your video");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const progressHandler = (progress: { loaded: number; total: number }) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percent);
      };

      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', progressHandler);
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
      });

      const { error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, selectedFile, {
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);

      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content: title,
            description: description,
            video_urls: [publicUrl],
            visibility: 'public',
            tags: ['eros', 'short']
          },
        ]);

      if (postError) throw postError;

      setUploadComplete(true);
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully",
      });
      
      setTimeout(() => {
        onOpenChange(false);
        navigate('/shorts');
      }, 2000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-luxury-primary" />
            Upload Eros Video
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="video">Upload Video</Label>
            
            {previewUrl ? (
              <div className="relative bg-luxury-darker rounded-lg overflow-hidden aspect-[9/16] max-h-[300px]">
                <video 
                  src={previewUrl} 
                  className="w-full h-full object-contain"
                  controls
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5"
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
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
                  className="w-full h-40 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
                  variant="outline"
                  disabled={isUploading}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-luxury-primary" />
                    <span>Click to select video</span>
                    <span className="text-xs text-luxury-neutral/60">
                      MP4, WebM, or MOV (max 200MB)
                    </span>
                  </div>
                </Button>
              </div>
            )}
            
            {validationError && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {validationError}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title" className="required">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent"
                placeholder="Add a title to your video"
                maxLength={100}
                required
              />
              <div className="text-xs text-right text-luxury-neutral/60">
                {title.length}/100
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent"
                placeholder="Describe your video"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-right text-luxury-neutral/60">
                {description.length}/500
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadComplete && (
            <div className="bg-green-950/30 text-green-400 p-3 rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Upload complete! Your video will be available soon.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isUploading || uploadComplete}
            className="bg-luxury-primary hover:bg-luxury-primary/80"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadComplete ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete
              </>
            ) : (
              'Post Eros'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
