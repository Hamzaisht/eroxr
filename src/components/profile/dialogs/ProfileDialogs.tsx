
// Update the CreatePostDialog component to accept selectedFiles
interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList;
  onFileSelect: (files: FileList | null) => void;
}
