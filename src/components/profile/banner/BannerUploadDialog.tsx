import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BannerUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BannerUploadDialog = ({
  isOpen,
  onOpenChange,
  isUploading,
  onFileChange,
}: BannerUploadDialogProps) => {
  return (
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
            onChange={onFileChange}
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
  );
};