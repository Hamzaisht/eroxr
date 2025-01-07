import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileActions = ({
  isOwnProfile,
  onEdit,
}: ProfileActionsProps) => {
  if (!isOwnProfile) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onEdit}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-luxury-primary/10"
      >
        <Settings className="h-5 w-5 text-luxury-neutral" />
      </Button>
    </div>
  );
};