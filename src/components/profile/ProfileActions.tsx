import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";

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
    <div className="flex gap-2 absolute top-0 right-0">
      {!isEditing ? (
        <Button
          variant="outline"
          className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
          onClick={onEdit}
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
};