
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  avatarPreview: string | null;
  onAvatarChange: (file: File | null) => void;
}

export const ProfileImageUpload = ({ avatarPreview, onAvatarChange }: ProfileImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Profile Image</Label>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-full" 
            />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => alert("Image upload coming soon")}
        >
          Choose Image
        </Button>
      </div>
    </div>
  );
};
