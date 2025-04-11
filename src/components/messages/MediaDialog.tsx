
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFileToStorage } from "@/utils/mediaUtils";
import { Loader2 } from "lucide-react";

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaSelect: (files: FileList | string[]) => void;
}

export const MediaDialog = ({ isOpen, onClose, onMediaSelect }: MediaDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !session?.user?.id) return;
    
    const files = e.target.files;
    setIsUploading(true);
    
    try {
      // For immediate feedback, pass the FileList to the parent component
      onMediaSelect(files);
      
      // Upload files to Supabase storage and get URLs
      const contentCategory = 'message';
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadFileToStorage(
          file,
          contentCategory,
          session.user.id
        );
        
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload file");
        }
        
        return result.url;
      });
      
      const urls = await Promise.all(uploadPromises);
      
      // Now pass the actual storage URLs to the parent component
      onMediaSelect(urls);
      
      toast({
        title: "Media uploaded",
        description: "Your media files have been uploaded successfully",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Media upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="grid gap-4">
          <div className="flex flex-col items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaSelect}
              disabled={isUploading}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <>Choose Files</>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isUploading 
                ? "Uploading to storage..." 
                : "Select photos or videos to share"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
