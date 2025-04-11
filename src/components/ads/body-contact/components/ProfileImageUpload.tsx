import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFileToStorage, UploadOptions } from "@/utils/mediaUtils";

interface ProfileImageUploadProps {
  avatarPreview: string;
  onAvatarChange: (file: File | null, preview: string) => void;
}

export const ProfileImageUpload = ({ avatarPreview, onAvatarChange }: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // First create a local preview for immediate feedback
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        onAvatarChange(file, preview);
      };
      reader.readAsDataURL(file);
      
      // Then upload to Supabase storage
      const uploadOptions: UploadOptions = {
        contentCategory: 'profile'
      };
      
      const result = await uploadFileToStorage(
        file,
        session.user.id,
        uploadOptions
      );
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }
      
      // Update with the storage URL
      if (result.url) {
        onAvatarChange(file, result.url);
      }
      
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback>
            {isUploading ? 
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : 
              <Upload className="h-8 w-8 text-muted-foreground" />
            }
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
          id="avatar-upload"
          disabled={isUploading}
        />
        <Label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 ${
            isUploading ? 'bg-primary/70' : 'bg-primary'
          } text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90`}
        >
          {isUploading ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <Upload className="h-4 w-4" />
          }
        </Label>
      </div>
    </div>
  );
};
