import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, Upload, Video, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useShortPostSubmit } from "./hooks/useShortPostSubmit";
import { Switch } from "@/components/ui/switch";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const { submitShortPost, isSubmitting, uploadProgress, isUploading } = useShortPostSubmit();

  // Constants
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  // Reset form on open/close
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setUploadComplete(false);
      setValidationError(null);
    }
  }, [open]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setValidationError("Please upload a video file (MP4, WebM, or MOV)");
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setValidationError("Video size must be less than 100MB");
      return;
    }

    setValidationError(null);
    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!session?.user?.id || !selectedFile) return;
    
    if (!title.trim()) {
      setValidationError("Please enter a title for your video");
      return;
    }

    try {
      const success = await submitShortPost({
        title,
        description: description.trim() || undefined,
        videoFile: selectedFile,
        isPremium
      });

      if (success) {
        setUploadComplete(true);
        
        // Navigate to shorts feed after successful upload
        setTimeout(() => {
          onOpenChange(false);
          navigate('/shorts');
        }, 1500);
      }
    } catch (error) {
      console.error("Upload error:", error);
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
                  disabled={isSubmitting}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-luxury-primary" />
                    <span>Click to select video</span>
                    <span className="text-xs text-luxury-neutral/60">
                      MP4, WebM, or MOV (max 100MB)
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

            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="premium-toggle"
                checked={isPremium}
                onCheckedChange={setIsPremium}
              />
              <Label htmlFor="premium-toggle">
                Make this Eros video Premium (59 SEK/month subscribers only)
              </Label>
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isSubmitting || uploadComplete}
            className="bg-luxury-primary hover:bg-luxury-primary/80"
          >
            {isSubmitting ? (
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
