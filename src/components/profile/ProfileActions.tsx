import { Button } from "@/components/ui/button";
import { Edit, Save, X, Video, PenSquare } from "lucide-react";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCreatePost?: () => void;
  onGoLive?: () => void;
}

export const ProfileActions = ({
  isOwnProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCreatePost,
  onGoLive,
}: ProfileActionsProps) => {
  if (!isOwnProfile) return null;

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {onCreatePost && (
        <Button variant="outline" size="sm" onClick={onCreatePost}>
          <PenSquare className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      )}
      {onGoLive && (
        <Button variant="outline" size="sm" onClick={onGoLive}>
          <Video className="h-4 w-4 mr-2" />
          Go Live
        </Button>
      )}
      <Button size="sm" onClick={onEdit}>
        <Edit className="h-4 w-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};