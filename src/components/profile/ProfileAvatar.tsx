
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  avatarUrl?: string;
  username: string;
  isEditable?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  username, 
  isEditable = false,
  size = "md" 
}: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16", 
    lg: "h-24 w-24"
  };

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Avatar upload functionality will be available soon"
    });
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {isEditable && (
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={handleUpload}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
