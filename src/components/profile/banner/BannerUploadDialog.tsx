import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageCropDialog } from "@/components/profile/ImageCropDialog";
import { useState } from "react";

interface BannerUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUploading: boolean;
  onFileChange: (file: File) => void;
}

export const BannerUploadDialog = ({
  isOpen,
  onOpenChange,
  isUploading,
  onFileChange,
}: BannerUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setCropPreviewUrl(URL.createObjectURL(file));
        setShowCropDialog(true);
      } else {
        // If it's not an image (e.g., video), pass it directly
        onFileChange(file);
      }
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], selectedFile?.name || 'banner.jpg', {
      type: 'image/jpeg'
    });
    onFileChange(file);
    setShowCropDialog(false);
    URL.revokeObjectURL(cropPreviewUrl);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Banner</DialogTitle>
            <DialogDescription>
              Upload a new banner image or video. For best results:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Minimum dimensions: 1500x500 pixels</li>
                <li>Maximum file size: 20MB</li>
                <li>Supported formats: JPG, PNG, GIF, MP4</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              type="file"
              id="banner-upload"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <label
              htmlFor="banner-upload"
              className="cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20 text-luxury-primary px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <span>{isUploading ? "Uploading..." : "Choose File"}</span>
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {showCropDialog && cropPreviewUrl && (
        <ImageCropDialog
          isOpen={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            URL.revokeObjectURL(cropPreviewUrl);
          }}
          imageUrl={cropPreviewUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={3}
          isCircular={false}
        />
      )}
    </>
  );
};