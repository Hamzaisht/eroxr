
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "./UserAvatar";
import { useSession } from "@supabase/auth-helpers-react";

interface AvatarUploadProps {
  onSuccess?: () => void;
  showProgress?: boolean;
  variant?: 'button' | 'overlay';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarUpload = ({ 
  onSuccess, 
  showProgress = true,
  variant = 'overlay',
  size = 'lg'
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isUploading, progress, error } = useAvatarUpload();
  const session = useSession();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file).then((result) => {
        if (result.success && onSuccess) {
          onSuccess();
        }
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (variant === 'button') {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Upload Avatar
            </>
          )}
        </Button>
        
        {showProgress && isUploading && (
          <div className="space-y-1">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {progress}%
            </p>
          </div>
        )}
        
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      <UserAvatar 
        userId={session?.user?.id}
        username={session?.user?.user_metadata?.username}
        email={session?.user?.email}
        size={size}
        className="cursor-pointer transition-opacity group-hover:opacity-75"
      />
      
      <div 
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <Camera className="w-6 h-6 text-white" />
      </div>

      {showProgress && isUploading && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full">
          <Progress value={progress} className="w-full h-1" />
        </div>
      )}

      {error && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-destructive whitespace-nowrap">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};
