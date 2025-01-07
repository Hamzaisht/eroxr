import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileActions = ({
  isOwnProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: ProfileActionsProps) => {
  if (!isOwnProfile) return null;

  return (
    <div className="flex gap-2">
      {!isEditing ? (
        <Button
          variant="outline"
          className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20 group transition-all duration-300"
          onClick={onEdit}
        >
          <Settings className="h-4 w-4 group-hover:text-luxury-primary transition-colors duration-300" />
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
          >
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
};