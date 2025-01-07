import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUploadModal = ({
  isOpen,
  onOpenChange,
  isUploading,
  onFileChange,
}: AvatarUploadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. For best results:
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>Use a square image</li>
              <li>Maximum file size: 5MB</li>
              <li>Supported formats: JPG, PNG, GIF</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
              disabled={isUploading}
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-luxury-primary/10 hover:bg-luxury-primary/20 text-luxury-primary px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>{isUploading ? "Uploading..." : "Choose File"}</span>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};