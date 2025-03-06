
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ProfileImageUploadProps {
  avatarPreview: string;
  onAvatarChange: (file: File | null, preview: string) => void;
}

export const ProfileImageUpload = ({ avatarPreview, onAvatarChange }: ProfileImageUploadProps) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        console.error("File too large");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback>
            <Upload className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
          id="avatar-upload"
        />
        <Label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
        </Label>
      </div>
    </div>
  );
};
