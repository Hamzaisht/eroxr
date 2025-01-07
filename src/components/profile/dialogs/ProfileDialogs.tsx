import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";

interface ProfileDialogsProps {
  isPostDialogOpen: boolean;
  isLiveDialogOpen: boolean;
  setIsPostDialogOpen: (open: boolean) => void;
  setIsLiveDialogOpen: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const ProfileDialogs = ({
  isPostDialogOpen,
  isLiveDialogOpen,
  setIsPostDialogOpen,
  setIsLiveDialogOpen,
  selectedFiles,
  onFileSelect,
}: ProfileDialogsProps) => {
  return (
    <>
      <CreatePostDialog
        open={isPostDialogOpen}
        onOpenChange={setIsPostDialogOpen}
        selectedFiles={selectedFiles}
        onFileSelect={onFileSelect}
      />

      <GoLiveDialog
        open={isLiveDialogOpen}
        onOpenChange={setIsLiveDialogOpen}
      />
    </>
  );
};