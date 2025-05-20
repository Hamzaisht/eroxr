
import { CreatePostDialog } from "@/components/CreatePostDialog";

// Update the CreatePostDialog component to accept selectedFiles
interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const ProfileDialogs = ({
  open,
  onOpenChange,
  selectedFiles,
  onFileSelect
}: CreatePostDialogProps) => {
  return (
    <CreatePostDialog 
      open={open}
      onOpenChange={onOpenChange}
      selectedFiles={selectedFiles}
      onFileSelect={onFileSelect}
    />
  );
};

export default ProfileDialogs;
