import { SnapchatStoryUploader } from './SnapchatStoryUploader';

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryUploadModal = ({ open, onOpenChange }: StoryUploadModalProps) => {
  return (
    <SnapchatStoryUploader 
      open={open} 
      onClose={() => onOpenChange(false)} 
    />
  );
};